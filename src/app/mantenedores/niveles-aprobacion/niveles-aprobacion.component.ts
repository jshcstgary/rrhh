import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import { TableComponentData } from "src/app/component/table/table.data";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { NivelAprobacionPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { FormatoUtilReporte, reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { CrearNivelesAprobacionService } from "../crear-niveles-aprobacion/crear-niveles-aprobacion.service";
import { NivelesAprobacionData } from "./niveles-aprobacion.data";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";

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

	public finalData: any[] = [];

	public restrictionsIds: any[] = ["RG", "CF", "AP"];
	private isRequisicionPersonal: boolean = true;

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

	// public dropdownOptionsExport: IDropdownOptions = PlantillaAData.dropdownOptionsExport;
	public dropdownOptionsExport: IDropdownOptions = [
		{
			id: "EXCEL",
			name: "EXCEL",
			icon: "fas fa-file-excel",
		},
		{
			id: "CSV",
			name: "CSV",
			icon: "fas fa-file-alt",
		},
	];

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
		sessionStorage.removeItem(LocalStorageKeys.Reloaded);

		this.ObtenerServicioTipoSolicitud();
		this.ObtenerServicioNivelDireccion();
		this.ObtenerServicioTipoMotivo();
		this.ObtenerServicioTipoRuta();
		this.ObtenerServicioAccion();
		this.ObtenerServicioRuta();
		// this.getDataToTableFilterInit();
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

	getDataToTableFilterInit() {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.nivelesAprobacionService.obtenerNiveleAprobaciones().subscribe({
			next: (response) => {
				// if (response.totalRegistros === 0) {
				// 	this.dataTable = [];

				// 	this.utilService.closeLoadingSpinner();

				// 	return;
				// }

				// this.dataTable = response.nivelAprobacionType
				// 	.filter(data => data.estado === "A")
				// 	.reduce((acc, obj) => {
				// 		const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

				// 		if (grupo) {
				// 			grupo.push(obj);
				// 		} else {
				// 			acc.push([obj]);
				// 		}

				// 		return acc;
				// 	}, [] as any[][]);

				// this.dataTable = response.nivelAprobacionType
				// 	.filter(data => data.estado === "A")
				// 	.reduce((acc, obj) => {
				// 		const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

				// 		if (grupo) {
				// 			grupo.push(obj);
				// 		} else {
				// 			acc.push([obj]);
				// 		}

				// 		return acc;
				// 	}, [] as any[][]);

				// this.mostrarNiveles();

				// this.utilService.closeLoadingSpinner();

				if (response.totalRegistros === 0) {
					this.dataTable = [];

					this.utilService.closeLoadingSpinner();

					this.utilService.modalResponse("No existen registros para esta búsqueda", "error");

					return;
				}

				if (this.isRequisicionPersonal) {
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						.reduce((acc, obj) => {
							const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);

					this.mostrarNiveles();
				} else {
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						.reduce((acc, obj) => {
							const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);

					this.mostrarNiveles();
				}

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.closeLoadingSpinner();

				this.dataTable = [];
			},
		});
	}

	getDataToTableFilter() {
		if (this.dataFilterNivelesAprobacion.nivelDireccion === null) {
			Swal.fire({
				text: "Seleccione al menos un Nivel de Dirección.",
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

				if (this.isRequisicionPersonal) {
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						.reduce((acc, obj) => {
							const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);

					this.mostrarNiveles();
				} else {
					this.dataTable = response.nivelAprobacionType
						.filter(data => data.estado === "A")
						.reduce((acc, obj) => {
							const grupo = acc.find(g => g[0].idTipoSolicitud === obj.idTipoSolicitud && g[0].idTipoRuta === obj.idTipoRuta && g[0].idTipoMotivo === obj.idTipoMotivo && g[0].idAccion === obj.idAccion && g[0].nivelDireccion === obj.nivelDireccion);

							if (grupo) {
								grupo.push(obj);
							} else {
								acc.push([obj]);
							}

							return acc;
						}, [] as any[][]);

					this.mostrarNiveles();
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

		return found !== undefined ? {
			id: found.idNivelAprobacion,
			nivelAprobacion: found.nivelAprobacionRuta
		} : {
			id: 0,
			nivelAprobacion: "-"
		};
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
		if (this.dataFilterNivelesAprobacion.tipoSolicitud === null) {
			return;
		}

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
		console.log(this.finalData[index].rutas);
		const idParam = this.finalData[index].rutas
			.filter(data => data.id !== 0)
			.map(data => data.id)
			.join("_");
		console.log(idParam);

		this.router.navigate(["/mantenedores/editar-niveles-aprobacion"], {
			queryParams: {
				id_edit: idParam
			}
		});
	}

	mostrarTipoSolicitud() {
		if (this.dataFilterNivelesAprobacion === null) {
			return this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud.toString()).descripcion;
		}

		return "SOLICITUD";
	}

	mostrarTipoMotivo(idTipoMotivo: number) {
		const tipoMotivo = this.dataTipoMotivo.find(data => data.id === idTipoMotivo);

		return tipoMotivo === undefined ? "-" : tipoMotivo.descripcion;
	}

	private isAnyRowCheckedInTable(formato: FormatoUtilReporte) {
		const headerTitles = [
			...this.columnsTable.map(({ title }) => title),
			...this.dataRuta.map(({ descripcion }) => descripcion)
		];

		// const bodyReport = this.dataTable.map(data => {
		const bodyReport = this.finalData.map(data => {
			return [
				data[0].tipoSolicitud,
				data[0].tipoRuta,
				this.mostrarTipoMotivo(data[0].idTipoMotivo),
				data[0].accion,
				data[0].nivelDireccion,
				...this.dataRuta.map((ruta) => this.showData(data, ruta))
			]
		});

		this.utilService.generateReport(formato, reportCodeEnum.MANTENIMIENTO_NIVELES_APROBACION, "NIVELES DE APROBACIÓN", headerTitles, bodyReport);
	}

	private mostrarNiveles() {
		const newData = this.dataTable
			.map((data) => ({
				tipoSolicitud: data[0].tipoSolicitud,
				tipoRuta: data[0].tipoRuta,
				tipoMotivo: this.mostrarTipoMotivo(data[0].idTipoMotivo),
				accion: data[0].accion,
				nivelDireccion: data[0].nivelDireccion,
				rutas: this.dataRuta.map(ruta => this.showData(data, ruta))
			}))
			.sort((a, b) => a.tipoSolicitud.toUpperCase().localeCompare(b.tipoSolicitud.toUpperCase()))
			.reduce((acc, item) => {
				if (!acc[item.tipoSolicitud]) {
					acc[item.tipoSolicitud] = [];
				}

				acc[item.tipoSolicitud].push(item);

				return acc;
			}, {});

		Object.keys(newData).forEach(key => {
			newData[key].sort((a, b) => a.tipoRuta.toUpperCase().localeCompare(b.tipoRuta.toUpperCase()));
		});

		this.finalData = Object.values(newData).flat();
	}
}
