import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { ConsultaTareasPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { RegistrarCandidatoService } from "src/app/solicitudes/registrar-candidato/registrar-candidato.service";
import { StarterService } from "src/app/starter/starter.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { ConsultaTareasData } from "./consulta-tareas.data";
import { ConsultaTareasService } from "./consulta-tareas.service";

@Component({
	selector: "app-consulta-tareas",
	templateUrl: "./consulta-tareas.component.html",
	styleUrls: ["./consulta-tareas.component.scss"],
})
export class ConsultaTareasComponent implements OnInit {
	private pageCode: string = PageCodes.ConsultaTareas;
	public pageControlPermission: typeof ConsultaTareasPageControlPermission = ConsultaTareasPageControlPermission;

	public controlsPermissions: PageControlPermiso = {
		[ConsultaTareasPageControlPermission.FiltroSolicitudTarea]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaTareasPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaTareasPageControlPermission.ButtonInfo]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public columnsTable: IColumnsTable = ConsultaTareasData.columns;
	fecha = new Date();
	fechaFormateada = this.fecha.toLocaleDateString("es-MX", {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	});
	//

	public isTarea = true;

	public dataTable: any[] = [];

	// public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
	public colsToFilterByTextIdSolicitud: string[] = ConsultaTareasData.colsToFilterByTextIdSolicitud;
	public colsToFilterByTextName: string[] = ConsultaTareasData.colsToFilterByTextName;
	public isFilterByIdSolicitud: boolean = true;
	public IdRowToClone: string = null;
	// public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
	public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
	public hasFiltered: boolean = true;
	public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
	public dataTipoMotivo: any[] = [];
	public dataTipoSolicitudes: any[] = [];
	public dataNivelDireccion: any[] = [];
	public tareasPorCompletar: any;

	constructor(
		private consultaTareasService: ConsultaTareasService,
		private tableService: TableService,
		private validationsService: ValidationsService,
		private utilService: UtilService,
		private mantenimientoService: MantenimientoService,
		private router: Router,
		private seleccionCandidatoService: RegistrarCandidatoService,
		private starterService: StarterService,
		private _route: ActivatedRoute,
		private permissionService: PermisoService
	) {
		this.getPermissions();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[ConsultaTareasPageControlPermission.FiltroSolicitudTarea] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[ConsultaTareasPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[ConsultaTareasPageControlPermission.ButtonInfo] = controlPermission;
			}
		});
	}

	async ngOnInit(): Promise<void> {
		this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
			if (action.id === "editOnTable") {
				action.showed = this.controlsPermissions[ConsultaTareasPageControlPermission.ButtonInfo].visualizar
			}
		});

		const idUsuario = await this._route.snapshot.queryParamMap.get("idUsuario");

		if (idUsuario !== null && idUsuario !== undefined) {
			sessionStorage.setItem(LocalStorageKeys.IdUsuario, idUsuario);
		}

		this.getDataToTable();
	}

	ngAfterViewInit() {
	}

	filterDataTable() {
		switch (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
			case "case1":
				this.getDataToTable();
				break;
			case "case2":
				this.getDataToTable();
				break;
			case "case3":
				this.utilService.modalResponse(
					"Por favor complete los campos del filtro",
					"info"
				);
				break;
			case "case4":
				this.getDataToTableFilter();
				break;
		}
	}

	getDataToTableFilter() {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.consultaTareasService
			.filterNivelesAprobaciones(
				this.dataFilterNivelesAprobacion.tipoSolicitud,
				this.dataFilterNivelesAprobacion.tipoMotivo,
				this.dataFilterNivelesAprobacion.nivelDireccion
			)
			.subscribe({
				next: (response) => {
					this.dataTable = response.nivelAprobacionType.map(
						(nivelAprobacionResponse) => ({
							...nivelAprobacionResponse,
							// estado: nivelAprobacionResponse.estado === "A",
						})
					);
					this.utilService.closeLoadingSpinner();
				},
				error: (error: HttpErrorResponse) => {
					this.dataTable = [];
					this.utilService.modalResponse(
						"No existen registros para esta búsqueda",
						"error"
					);
				},
			});
	}

	private getDataToTable() {
		this.utilService.openLoadingSpinner("Cargando información. Espere por favor...");

		this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
			next: (res) => {
				return this.consultaTareasService.getTareasUsuario(res.evType[0].subledger).subscribe({
					next: (response) => {
						this.dataTable = response.solicitudes.map((item) => ({
							// idSolicitud: item.idSolicitud + "," + item.rootProcInstId,
							idSolicitud: item.idSolicitud,
							startTime: item.startTime.toString().split(" ")[0],
							name: item.name,
							tipoSolicitud: item.tipoSolicitud,
						}));

						this.utilService.closeLoadingSpinner();
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse(error.error, "error");
					},
				});
			}
		});
	}

	//LLenar combo Tipo Solicitud
	ObtenerServicioTipoSolicitud() {
		return this.mantenimientoService.getTipoSolicitud().subscribe({
			next: (response: any) => {
				this.dataTipoSolicitudes = response.tipoSolicitudType.map((r) => ({
					id: r.id,
					descripcion: r.tipoSolicitud,
				})); //verificar la estructura mmunoz
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioNivelDireccion() {
		return this.mantenimientoService.getNiveles().subscribe({
			next: (response) => {
				this.dataNivelDireccion = [
					...new Set(
						response.evType.map((item) => {
							return item.nivelDir;
						})
					),
				];
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoMotivo() {
		return this.mantenimientoService.getTipoMotivo().subscribe({
			next: (response) => {
				this.dataTipoMotivo = response.map((r) => ({
					id: r.id,
					descripcion: r.tipoMotivo,
				})); //verificar la estructura mmunoz
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	pageCrear() {
		this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
	}

	onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
		if (this.isTarea) {
			let ids = id_edit.split(",");

			this.consultaTareasService.getTareaIdParam(ids[0]).subscribe((tarea) => {
				let taeraopcion = tarea.solicitudes[0].tasK_DEF_KEY;
				let registrar = environment.taskType_RRHH;

				switch (tarea.solicitudes[0].tasK_DEF_KEY) {
					case environment.taskType_Registrar:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("ACCION")
							|| tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("ACCIÓN")) {
							this.router.navigate([
								`/solicitudes/accion-personal/registrar-solicitud`,
								ids[1],
								ids[0]
							]);
						} else {
							this.router.navigate([
								"/solicitudes/registrar-solicitud",
								ids[1],
								ids[0],
							]);
						}
						break;

					case environment.taskType_Revisar:

						this.router.navigate([
							"/solicitudes/revisar-solicitud",
							ids[1],
							ids[0],
						]);

						break;
					case environment.taskType_RRHH:

						this.router.navigate([
							"/solicitudes/revisar-solicitud",
							ids[1],
							ids[0],
						]);

						break;

					case environment.taskType_CREM:

						this.router.navigate([
							"/solicitudes/revisar-solicitud",
							ids[1],
							ids[0],
						]);

						break;

					case environment.taskType_RegistrarCandidato:

						this.router.navigate([
							"/solicitudes/registrar-candidato",
							ids[1],
							ids[0],
						]);

						break;

					case environment.taskType_CompletarRequisicion:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REQUISI")) {
							this.router.navigate([
								"/solicitudes/completa-solicitud",
								ids[1],
								ids[0],
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD} de Requisición de Personal`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_CF:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("FAMILIA")) {
							this.router.navigate([
								"/solicitudes/registrar-familiares",
								ids[1],
								ids[0],
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Contratación de Familiares`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_RG:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								"/solicitudes/reingreso-personal",
								ids[1],
								ids[0],
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Reingreso de Personal`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_RGC_RRHH:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								`/solicitudes/reingreso-personal/registro-comentarios`,
								ids[1],
								ids[0],
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Reingreso de Personal`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_RGC_ULTIMO_JEFE:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								`/solicitudes/reingreso-personal/registro-comentarios`,
								ids[1],
								ids[0]
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Reingreso de Personal`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_RG_Jefe_Solicitante:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								`/solicitudes/reingreso-personal/registro-comentarios`,
								ids[1],
								ids[0]
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Reingreso de Personal`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_RG_RRHH:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_RG_Remuneraciones:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("REINGRESO")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_CF_Remuneraciones:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("FAMILIA")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Contratación de Familiares`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_CF_RRHH:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("FAMILIA")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						} else {
							this.seleccionCandidatoService.getCandidatoById(ids[0]).subscribe({
								next: ({ seleccionCandidatoType }) => {
									const { iD_SOLICITUD_PROCESO } = seleccionCandidatoType[0];

									Swal.fire({
										text: `Completa la solicitud ${iD_SOLICITUD_PROCESO} de Contratación de Familiares`,
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
									});
								},
								error: (err) => {
									console.error(err);
								}
							});
						}

						break;

					case environment.taskType_AP_Completar:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/accion-personal/registrar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_AP_Registrar:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/accion-personal/registrar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_AP_Remuneraciones:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_AP_RV:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_AP_Remuneraciones:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					case environment.taskType_AP_RRHH:
						if (tarea.solicitudes[0].tipoSolicitud.toUpperCase().includes("PERSONAL")) {
							this.router.navigate([
								`/solicitudes/revisar-solicitud`,
								ids[1],
								ids[0]
							]);
						}

						break;

					default:
				}
			});
		}
	}
}
