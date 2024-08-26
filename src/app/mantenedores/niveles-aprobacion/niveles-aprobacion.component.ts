import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TableComponentData } from "src/app/component/table/table.data";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { NivelAprobacionPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { CrearNivelesAprobacionService } from "../crear-niveles-aprobacion/crear-niveles-aprobacion.service";
import { NivelesAprobacionData, NivelesAprobacionData2 } from "./niveles-aprobacion.data";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";

@Component({
	selector: "app-niveles-aprobacion",
	templateUrl: "./niveles-aprobacion.component.html",
	styleUrls: ["./niveles-aprobacion.component.scss"],
})
export class NivelesAprobacionComponent implements OnInit {
	private pageCode: string = PageCodes.NivelesAprobacion;
	public activeRecords: boolean = true;
	public pageControlPermission: typeof NivelAprobacionPageControlPermission = NivelAprobacionPageControlPermission;

	public rowsPerPageTable: number = TableComponentData.defaultRowPerPage;
	public pageNumberTable: number = 1;

	tipoMotivoDeshablitado: boolean = false;

	public restrictionsIds: any[] = ["RG", "CF", "AP"];
	private isRequisicionPersonal: boolean =true;

	public controlsPermissions: PageControlPermiso = {
		[NivelAprobacionPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.FiltroTipoMotivo]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.FiltroNivelDireccion]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.ButtonBuscar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.ButtonEditar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[NivelAprobacionPageControlPermission.ButtonDuplicar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public columnsTable: IColumnsTable = NivelesAprobacionData.columns;
	public columnsTable2: IColumnsTable = NivelesAprobacionData2.columns;
	public dataTable: any[] = [];

	// public rutasTableHeader: any[] = [];

	public idNivelesAprobacionRuta: {
		tipoRuta: string;
		tipoSolicitud: string;
		[key: string]: string;
	} = {
			tipoRuta: "",
			tipoSolicitud: ""
		};

	private nivelesAprobacion: any[] = [];
	public dataTableActive: any[] = [];
	public dataTableInactive: any[] = [];
	// public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
	// public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
	public IdRowToClone: string = null;
	// public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
	public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
	public hasFiltered: boolean = true;
	public dataFilterNivelesAprobacion = {
		tipoMotivo: null,
		tipoSolicitud: null,
		nivelDireccion: null,
		tipoRuta: null,
		accion: null
	};
	private noIdTipoMotivo: string = "";
	public dataTipoMotivo: any[] = [];
	public dataTipoRuta: any[] = [];
	public dataAccion: any[] = [];
	public dataRuta: any[] = [];
	public dataTipoSolicitudes: any[] = [];
	public dataNivelDireccion: any[] = [];

	constructor(
		private nivelesAprobacionService: NivelesAprobacionService,
		private tableService: TableService,
		private validationsService: ValidationsService,
		private utilService: UtilService,
		private mantenimientoService: MantenimientoService,
		private router: Router,
		private permissionService: PermisoService,
		private serviceNivelesAprobacion: CrearNivelesAprobacionService
	) {
		this.getPermissions();
	}

	ngOnInit(): void {
		localStorage.removeItem(LocalStorageKeys.Reloaded);
		this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
			if (action.id === "editOnTable") {
				action.showed = this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonEditar].visualizar
			} else if (action.id === "cloneOnTable") {
				action.showed = this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonDuplicar].visualizar
			}
		});

		this.ObtenerServicioTipoSolicitud();
		this.ObtenerServicioNivelDireccion();
		this.ObtenerServicioTipoMotivo();
		this.ObtenerServicioTipoRuta();
		this.ObtenerServicioAccion();
		this.ObtenerServicioRuta();
		// this.getDataToTable();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroTipoMotivo] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroNivelDireccion] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonBuscar] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "06") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "07") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonEditar] = controlPermission;
			} else if (controlPermission.codigo_Control === "08") {
				this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonDuplicar] = controlPermission;
			}
		});
	}

	getDataToTableFilter() {
		if (this.dataFilterNivelesAprobacion.tipoSolicitud === null || this.dataFilterNivelesAprobacion.nivelDireccion === null) {
			Swal.fire({
				text: "Seleccione al menos un tipo de solicitud y un nivel de dirección",
				icon: "info",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok"
			});

			return;
		}

		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.nivelesAprobacionService.filterNivelesAprobaciones(this.dataFilterNivelesAprobacion.tipoSolicitud, this.dataFilterNivelesAprobacion.tipoMotivo, this.dataFilterNivelesAprobacion.nivelDireccion, this.dataFilterNivelesAprobacion.tipoRuta, this.dataFilterNivelesAprobacion.accion).subscribe({
			next: (response) => {
				if (response.totalRegistros === 0) {
					this.dataTable = [];

					this.utilService.closeLoadingSpinner();

					this.utilService.modalResponse("No existen registros para esta búsqueda", "error");

					return;
				}

				if(this.isRequisicionPersonal){
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						// .sort((a, b) => a.idNivelAprobacion - b.idNivelAprobacion)
						.reduce((acc, obj) => {
						//	const grupo = acc.find(g => g[0].idTipoMotivo === obj.idTipoMotivo || g[0].idTipoSolicitud === obj.idTipoSolicitud || g[0].nivelDireccion === obj.nivelDireccion || g[0].idAccion === obj.idAccion);
							const grupo = acc.find(g => g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idTipoRuta === obj.idTipoRuta);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);
				} else {
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						// .sort((a, b) => a.idNivelAprobacion - b.idNivelAprobacion)
						.reduce((acc, obj) => {
						//	const grupo = acc.find(g => g[0].idTipoMotivo === obj.idTipoMotivo || g[0].idTipoSolicitud === obj.idTipoSolicitud || g[0].nivelDireccion === obj.nivelDireccion || g[0].idAccion === obj.idAccion);
							const grupo = acc.find(g => g[0].idTipoRuta === obj.idTipoRuta);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);
				}

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.closeLoadingSpinner();

				this.dataTable = [];

				this.utilService.modalResponse("No existen registros para esta búsqueda", "error");
			},
		});
	}

	public showData(data: any[], ruta: any) {
		const found = data.find(d => d.ruta === ruta.descripcion);

		return found !== undefined ? found.nivelAprobacionRuta : "-";
	}

	//LLenar combo Tipo Solicitud
	ObtenerServicioTipoSolicitud() {
		return this.mantenimientoService.getTipoSolicitud().subscribe({
			next: (response: any) => {
				this.dataTipoSolicitudes = response.tipoSolicitudType
					.filter(({ estado }) => estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoSolicitud,
						codigoTipoSolicitud: r.codigoTipoSolicitud
					}));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioNivelDireccion() {
		return this.mantenimientoService.getNivelesPorTipo("ND").subscribe({
			next: (response) => {
				this.dataNivelDireccion = [...new Set(response.evType.map(({ nivelDir }) => nivelDir))];
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoMotivo() {
		return this.mantenimientoService.getTipoMotivo().subscribe({
			next: (response) => {
				this.dataTipoMotivo = response
					.filter(({ estado }) => estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoMotivo,
					}));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoRuta() {
		return this.mantenimientoService.getTipoRuta().subscribe({
			next: (response) => {
				this.dataTipoRuta = response.tipoRutaType
					.filter(({ estado }) => estado === "A")
					.filter(({ tipoRuta }) => !tipoRuta.toUpperCase().includes("FIJ"))
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoRuta,
					}));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioAccion() {
		return this.mantenimientoService.getAccion().subscribe({
			next: (response) => {
				this.dataAccion = response
					.filter(({ estado }) => estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.accion,
					}));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioRuta() {
		return this.mantenimientoService.getRuta().subscribe({
			next: (response) => {
				this.dataRuta = response
					.filter(({ estado }) => estado === "A")
					.map(data => ({
						id: data.id,
						descripcion: data.ruta,
						idTipoRuta: data.idTipoRuta
					}))
					.reduce((acc, current) => {
						const existe = acc.find(item => item.descripcion === current.descripcion);

						if (!existe) {
							acc.push(current);
						}

						return acc;
					}, []);

				console.log(this.dataRuta);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	onChangeTipoSolicitud() {
		const tipoSolicitud = this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud.toString());

		if (tipoSolicitud === undefined) {
			return;
		}

		if (this.restrictionsIds.includes(tipoSolicitud.codigoTipoSolicitud)) {
			// this.dataFilterNivelesAprobacion.tipoMotivo = null;
			this.noIdTipoMotivo = "10000";
			this.tipoMotivoDeshablitado = true;
			this.isRequisicionPersonal = false;
		} else {
			this.isRequisicionPersonal = true;
			this.noIdTipoMotivo = "";
			this.dataFilterNivelesAprobacion.tipoMotivo = null;

			this.tipoMotivoDeshablitado = false;
		}
	}

	pageCrear() {
		this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
	}

	onRowActionClicked(index: number) {
		const idParam = this.dataTable[index]
			.map(data => data.idNivelAprobacion)
			.join("_");

		this.router.navigate(["/mantenedores/editar-niveles-aprobacion"], {
			queryParams: {
				id_edit: idParam
			}
		});
	}

	mostrarTipoSolicitud() {
		return this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud.toString()).descripcion;
	}

	mostrarTipoMotivo(idTipoMotivo: number) {
		const tipoMotivo = this.dataTipoMotivo.find(data => data.id === idTipoMotivo);

		return tipoMotivo === undefined ? "-" : tipoMotivo.descripcion;
	}
}
