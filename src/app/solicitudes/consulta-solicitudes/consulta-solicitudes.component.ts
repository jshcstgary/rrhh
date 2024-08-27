import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	TemplateRef,
	ViewChild
} from "@angular/core";

import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {
	NgbCalendar,
	NgbDateStruct,
	NgbModal,
	NgbNavChangeEvent
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectConfig } from "@ng-select/ng-select";
import { forkJoin, map } from "rxjs";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import Swal from "sweetalert2";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { ConsultaSolicitudesData } from "./consulta-solicitudes.data";
import {
	IConsultaSolicitudesTable
} from "./consulta-solicitudes.interface";

import { DatePipe } from "@angular/common";
import { NgSelectComponent } from "@ng-select/ng-select";
import { TableComponentData } from "src/app/component/table/table.data";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { ConsultaSolicitudPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { DataFilterSolicitudes } from "src/app/eschemas/DataFilterSolicitudes";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { StarterService } from "src/app/starter/starter.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control, Permiso } from "src/app/types/permiso.type";
import { ConsultaGraficosData } from "./consulta-grafico.data";
import { ConsultaSolicitudesService } from "./consulta-solicitudes.service";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";

//import { single} from './chartData';
declare var require: any;
const data: any = require("./company.json");
@Component({
	selector: "app-data-table",
	templateUrl: "./consulta-solicitudes.component.html",
	styleUrls: ["./consulta-solicitudes.component.scss"],
})
export class ConsultaSolicitudesComponent implements AfterViewInit, OnInit {
	private pageCode: string = PageCodes.ConsultaSolicitudes;
	public pageControlPermission: typeof ConsultaSolicitudPageControlPermission = ConsultaSolicitudPageControlPermission;

	public controlsPermissions: PageControlPermiso = {
		[ConsultaSolicitudPageControlPermission.FiltroEmpresa]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.FiltroUnidadNegocio]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.FiltroFechaDesde]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.FiltroFechaHasta]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.FiltroEstado]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.ButtonBuscar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.ButtonReasignar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[ConsultaSolicitudPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public dataTable: IConsultaSolicitudesTable = [];
	public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
	public hasFiltered: boolean = true;
	public submitted: boolean = false;
	public errorMessage: string;
	public typeSolicitudSelected: any;
	public tipoSolicitudSeleccionada: any;
	public codigoTipoSolicitud: string;
	public processDefinitionKey: string;

	public columnsTableGraphic: IColumnsTable = ConsultaGraficosData.columns

	// public dataTiposMotivosPorTipoSolicitud : any[] = [];

	public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
		{};

	public dataTiposAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } =
		{};

	/*
	  Cuando es Acción Personal, Reingreso Personal y Contratación de Familiares
	  se oculta el Tipo de Motivo, mostrar sólo Tipo de Acción
	*/
	// public idsOcultarTipoMotivo: any[] = ["3", "5", "6", 3, 5, 6];
	public idsOcultarTipoMotivo: any[] = ["RG", "CF", "AP"];

	// No mostrar = false
	public desactivarTipoMotivo = false;

	/*
	  Cuando es Requisión de personal se oculta Tipo de Acción, muestra sólo Tipo de Motivo
	*/
	// public idsOcultarTipoAccion: any[] = ["1", 1];
	public idsOcultarTipoAccion: any[] = ["RP"];

	// No mostrar = false
	public desactivarTipoAccion = false;

	modelo: DatosProcesoInicio = new DatosProcesoInicio();
	private instanceCreated: DatosInstanciaProceso;
	consultaSolicitudesSelect!: string;
	isLoading = false;
	model: NgbDateStruct;
	disabled = true;
	today = this.calendar.getToday();

	public dataTipoSolicitudes: any[] = [];
	public dataTipoSolicitudesModal: any[] = [];
	public dataTipoMotivo: any[] = [];
	public dataTipoAccion: any[] = [];
	public data_estado: any[] = [];
	public rowsPerPageTable: number = TableComponentData.defaultRowPerPage;

	@ViewChild("myModalSolicitudes", { static: false })
	myModalSolicitudes: TemplateRef<any>;

	//  basic navs
	active = 1;

	// vertical
	active2 = "top";

	// selecting navs
	active3: any;

	// public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
	// public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
	public IdRowToClone: string = null;
	// public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
	public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
	public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
	public dataNivelDireccion: any[] = [];

	/*data_estado = [
	  { id: 1, name: 'Aprobado' },
	  { id: 2, name: 'En espera' },
	  { id: 3, name: 'Creado' },
	  { id: 4, name: 'Enviado' },
	  { id: 5, name: 'Cancelado' },
	];*/

	editing: any = {};
	rows: any = new Array();
	temp = [...data];

	loadingIndicator = true;
	reorderable = true;

	columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];

	@ViewChild(ConsultaSolicitudesComponent) table:
		| ConsultaSolicitudesComponent
		| any;

	public solicitud = new Solicitud();
	public detalleSolicitud = new DetalleSolicitud();

	selected_empresa: number;
	selected_producto: number;
	selected_tipo_solicitud: number;
	selected_estado: number;
	public fechaHastaFinal: Date;
	public dataFilterSolicitudes = new DataFilterSolicitudes();
	public searchInputFilter: string = "";
	data_empresas = [{ idEmpresa: "01", name: "Reybanpac" }];

	dataUnidadesNegocio: string[] = [];
	dataEmpresa: string[] = [];

	data_tipo_solicitud = [
		{ id: 1, name: "Requisición de personal" },
		{ id: 2, name: "Contratación de familiares" },
		{ id: 3, name: "Reingreso de personal" },
		{ id: 4, name: "Acción de personal" },
	];

	colorScheme6: any = {
		domain: ["#2962ff", "#3699ff", "#ee9d01", "#dee2e6"],
	};

	solicitudesCompletadas: any[] = [];
	solicitudesPendientes: any[] = [];
	solicitudesTipo: any[] = [];

	gradient6: boolean = true;

	constructor(
		private config: NgSelectConfig,
		public consultaSolicitudesService: ConsultaSolicitudesService,

		private tableService: TableService,
		private route: ActivatedRoute,
		private validationsService: ValidationsService,
		private solicitudes: SolicitudesService,
		private utilService: UtilService,
		private mantenimientoService: MantenimientoService,
		private router: Router,
		private calendar: NgbCalendar,
		private camundaRestService: CamundaRestService,
		private modalService: NgbModal,
		private starterService: StarterService,
		private permissionService: PermisoService
	) {
		this.getPermissions();

		this.model = calendar.getToday();
		// Object.assign(this, { single });
		// Object.assign(this, { multi });

		this.camundaRestService = camundaRestService;
		this.route = route;
		this.router = router;
		this.errorMessage = null;
		this.model = calendar.getToday();

		this.config.notFoundText = "Custom not found";
		this.config.appendTo = "body";
		this.config.bindValue = "value";
		this.solicitud = this.solicitudes.modelSolicitud;
		this.rows = data;
		this.temp = [...data];
		setTimeout(() => {
			this.loadingIndicator = false;
		}, 1500);
	}

	ngOnDestroy(): void {
		this.modalService.dismissAll();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroEmpresa] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroUnidadNegocio] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroFechaDesde] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroFechaHasta] = controlPermission;
			} else if (controlPermission.codigo_Control === "06") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "07") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.FiltroEstado] = controlPermission;
			} else if (controlPermission.codigo_Control === "08") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.ButtonBuscar] = controlPermission;
			} else if (controlPermission.codigo_Control === "09") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "10") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.ButtonReasignar] = controlPermission;
			} else if (controlPermission.codigo_Control === "11") {
				this.controlsPermissions[ConsultaSolicitudPageControlPermission.ButtonExportar] = controlPermission;
			}
		});
	}

	updateFilter(event: any) {
		const val = event.target.value.toLowerCase();

		// filter our data
		const temp = this.temp.filter(function (d) {
			return d.name.toLowerCase().indexOf(val) !== -1 || !val;
		});

		// update the rows
		this.rows = temp;
		// Whenever the filter changes, always go back to the first page
		this.table = data;
	}
	updateValue(event: any, cell: any, rowIndex: number) {
		this.editing[rowIndex + "-" + cell] = false;
		this.rows[rowIndex][cell] = event.target.value;
		this.rows = [...this.rows];
	}

	ngDoCheck(): void {
		this.typeSolicitudSelected = this.dataTipoSolicitudes.filter(
			(data) => data.descripcion == "Acción de Personal"
		)[0]?.id;

		/*id: r.id,
			  descripcion: r.tipoSolicitud*/

		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
	}

	ngOnInit() {
		this.getDataToTable();
		this.ObtenerServicioTipoSolicitud();
		this.obtenerEmpresaYUnidadNegocio();
	}

	PageCrear() {
		this.router.navigate(["/solicitudes/crear-tipo-solicitud"]);
	}

	public mostrarBotonResignar(): boolean {
		const permisos: Permiso[] = JSON.parse(localStorage.getItem(LocalStorageKeys.Permisos)!);

		return permisos.some(({ codigo }) => codigo === PageCodes.Mantenedores);
	}

	fillData(res: any) {
		this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
		this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = 100000;
		this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.solicitud.idTipoSolicitud.toString();
		this.solicitudes.modelDetalleAprobaciones.id_Accion = 100000;
		this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.solicitud.idTipoMotivo;
		this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = 100000;
		this.solicitudes.modelDetalleAprobaciones.id_Ruta = 100000;
		this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.solicitud.tipoSolicitud;
		this.solicitudes.modelDetalleAprobaciones.motivo = "RegistrarSolicitud";
		this.solicitudes.modelDetalleAprobaciones.tipoRuta = "RegistrarSolicitud";
		this.solicitudes.modelDetalleAprobaciones.ruta = "Registrar Solicitud";
		this.solicitudes.modelDetalleAprobaciones.accion = "RegistrarSolicitud";
		this.solicitudes.modelDetalleAprobaciones.nivelDirecion = res.evType[0].nivelDir;
		this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = "RegistrarSolicitud";
		this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = res.evType[0].nombreCompleto;
		this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = res.evType[0].codigoPosicion;
		this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = res.evType[0].descrPosicion;
		this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = res.evType[0].subledger;
		this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = res.evType[0].nivelDir;
		this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = res.evType[0].codigoPosicionReportaA;
		this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "Creado";
		this.solicitudes.modelDetalleAprobaciones.estado = "A";
		this.solicitudes.modelDetalleAprobaciones.correo = res.evType[0].correo;
		this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = res.evType[0].nombreCompleto;
		this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = res.evType[0].nombreCompleto;
		this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date();
		this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date();

		convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaCreacion);
		convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaModificacion);
	}

	//Crear Solicitud
	async CrearInstanciaSolicitud() {
		const { isConfirmed } = await Swal.fire({
			text: "¿Desea crear la Solicitud?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "rgb(227, 199, 22)",
			cancelButtonColor: "#77797a",
			confirmButtonText: "Sí",
			cancelButtonText: "No",
		});

		if (!isConfirmed) {
			return;
		}

		this.codigoTipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.solicitud.idTipoSolicitud)[0]?.codigoTipoSolicitud;

		this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.solicitud.idTipoSolicitud)[0]?.descripcion;

		this.solicitud.tipoMotivo = this.dataTiposMotivosPorTipoSolicitud[this.solicitud.idTipoSolicitud].filter((data) => data.id == this.solicitud.idTipoMotivo)[0]?.tipoMotivo;

		this.solicitud.tipoAccion = this.dataTiposAccionesPorTipoSolicitud[this.solicitud.idTipoSolicitud].filter((data) => data.id == this.solicitud.idTipoAccion)[0]?.tipoAccion;

		// if (result.isConfirmed) {
		this.utilService.openLoadingSpinner("Creando solicitud, espere por favor.");

		this.route.params.subscribe({
			next: () => {
				this.processDefinitionKey = "RequisicionPersonal";

				if (this.codigoTipoSolicitud === "AP") {
					this.processDefinitionKey = "AccionPersonal";
				}

				const variables = this.generatedVariablesFromFormFields();

				this.camundaRestService.postProcessInstance(this.processDefinitionKey, variables).subscribe({
					next: (instanceOutput) => {
						this.instanceCreated = new DatosInstanciaProceso(instanceOutput.businessKey, instanceOutput.definitionId, instanceOutput.id, instanceOutput.tenantId);

						this.lookForError(instanceOutput);
						this.utilService.closeLoadingSpinner();

						this.solicitud.idInstancia = instanceOutput.id;
						this.solicitud.estado = "Creado"; //tveas TODO improve [Activo]
						this.solicitud.estadoSolicitud = "3"; // tveas TODO improve [Creado]
						if (this.solicitud.idInstancia !== undefined) {
							this.starterService.getUser(localStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
								next: (res) => {
									this.solicitud.usuarioCreacion = res.evType[0].nombreCompleto;
									this.solicitud.usuarioActualizacion = res.evType[0].nombreCompleto;
									this.solicitud.fechaActualizacion = new Date();
									this.solicitud.fechaCreacion = new Date();

									convertTimeZonedDate(this.solicitud.fechaActualizacion);
									convertTimeZonedDate(this.solicitud.fechaCreacion);

									this.solicitudes.guardarSolicitud(this.solicitud).subscribe({
										next: (responseSolicitud) => {
											this.solicitud.idSolicitud = responseSolicitud.idSolicitud;
											this.solicitud.fechaActualizacion = responseSolicitud.fechaActualizacion;
											this.solicitud.fechaCreacion = responseSolicitud.fechaCreacion;
											this.submitted = true;
											this.detalleSolicitud.idSolicitud = responseSolicitud.idSolicitud;
											this.detalleSolicitud.estado = "A";

											this.fillData(res);

											this.solicitudes.guardarDetalleSolicitud(this.detalleSolicitud).subscribe({
												next: () => {
													this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
														next: () => {
															setTimeout(() => {
																this.router.navigate([
																	this.codigoTipoSolicitud === "AP" ? "/solicitudes/accion-personal/registrar-solicitud" : "/solicitudes/registrar-solicitud",
																	this.solicitud.idInstancia,
																	this.solicitud.idSolicitud,
																]);
															}, 1800);//comentado mmunoz
														},
														error: (err) => {
															console.error(err);
														}
													});
												},
												error: (error) => {
													console.error(error);
												}
											});
										},
										error: (error) => {
											console.error(error);
										}
									});
								},
								error: (error) => {
									console.error(error);
								}
							});
						} else {
							this.submitted = true;
						}
					},
					error: (error) => {
						console.error(error);
					}
				});
			},
			error: (error) => {
				console.error(error);
			}
		});

		if (this.submitted) {
		}
	}

	rutaPorIdTipoSolicitudIndexada = {
		1: {
			path: "/solicitudes/registrar-solicitud",
			key: "RequisicionPersonal",
		},
		3: {
			path: "/solicitudes/accion-personal/registrar-solicitud",
			key: "AccionPersonal",
		},
		// 5: {
		//   path: "/solicitudes/registrar-solicitud",
		//   key: "ReingresoPersonal",
		// },
		// 6: {
		//   path: "/solicitudes/registrar-familiares",
		//   key: "ContratacionFamiliares",
		// },
	};

	getCreatedId(): string {
		if (
			this.instanceCreated &&
			this.instanceCreated.id != null &&
			this.instanceCreated.id != ""
		) {
			//return this.instanceCreated.id;
			return this.solicitud.idSolicitud;
		}

		return "No se ha creado Id de Proceso";
	}

	obtenerEmpresaYUnidadNegocio() {
		return this.mantenimientoService.getNiveles().subscribe({
			next: (response) => {
				this.dataUnidadesNegocio = [
					...new Set(
						response.evType.map((item) => {
							return item.unidadNegocio;
						})
					),
				];
				this.dataEmpresa = [
					...new Set(
						response.evType.map((item) => {
							return item.compania;
						})
					),
				];
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	generatedVariablesFromFormFields() {
		let requestData: any;
		let variables: any = {};

		variables.tipoSolicitud = { value: this.solicitud.tipoSolicitud };

		if (this.solicitud.idTipoSolicitud == this.typeSolicitudSelected) {
			if (this.solicitud.tipoAccion.toUpperCase().includes("TEMPORAL")) {
				variables.tipoAccion = { value: "asignacionTemporal" };
			} else {
				variables.tipoAccion = { value: this.solicitud.tipoAccion };
			}
		} else {
			variables.tipoMotivo = { value: this.solicitud.tipoMotivo };
		}

		requestData = {
			businessKey: "",
			variables,
			withVariablesInReturn: true,
		};

		//return { variables };
		return { requestData };
	}

	// tipoSolicitud
	onChangeTipo(id: number, type: string, data: any[]) {
		let descripcion = data.filter((item) => item.id == id)[0]?.descripcion;
		switch (type) {
			case "tipoSolicitud":
				this.solicitud.tipoSolicitud = descripcion;
				break;
			case "tipoMotivo":
				this.solicitud.tipoMotivo = descripcion;
				break;
			case "tipoAccion":
				this.solicitud.tipoAccion = descripcion;
				break;
		}
	}

	onChangeTipoSolicitud(idTipoSolicitud: number) {
		this.codigoTipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.solicitud.idTipoSolicitud)[0]?.codigoTipoSolicitud;

		this.tipoSolicitudSeleccionada = idTipoSolicitud;
		this.desactivarTipoMotivo = !this.idsOcultarTipoMotivo.includes(this.codigoTipoSolicitud);

		this.desactivarTipoAccion = !this.idsOcultarTipoAccion.includes(this.codigoTipoSolicitud);


		if (!this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud]) {
			this.mantenimientoService
				.getTiposMotivosPorTipoSolicitud(idTipoSolicitud)
				.subscribe({
					next: (response) => {
						this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = response;
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse(error.error, "error");
					},
				});
		}

		if (!this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud]) {
			this.mantenimientoService
				.getTiposAccionesPorTipoSolicitud(idTipoSolicitud)
				.subscribe({
					next: (response) => {
						this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud] = response;
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse(error.error, "error");
					},
				});
		}

		this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter(
			(data) => data.id == idTipoSolicitud
		)[0]?.descripcion;
	}

	onChangeTipoMotivo(idTipoMotivo: number) {
		this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
			(data) => data.id == idTipoMotivo
		)[0]?.descripcion;
	}

	onChangeTipoAccion(idTipoAccion: number) {
		this.solicitud.tipoAccion = this.dataTipoAccion.filter(
			(data) => data.id == idTipoAccion
		)[0]?.descripcion;
	}

	//LLenar combo Tipo Solicitud
	ObtenerServicioTipoSolicitud() {
		return this.mantenimientoService.getTipoSolicitud().subscribe({
			next: (response: any) => {
				this.dataTipoSolicitudes = response.tipoSolicitudType
					.filter((r) => r.estado === "A" && (r.codigoTipoSolicitud === "RP" || r.codigoTipoSolicitud === "AP" || r.codigoTipoSolicitud === "RG" || r.codigoTipoSolicitud === "CF" || r.codigoTipoSolicitud === "DP"))
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoSolicitud,
						codigoTipoSolicitud: r.codigoTipoSolicitud,
						estado: r.estado
					}));
				this.dataTipoSolicitudesModal = response.tipoSolicitudType
					.filter((r) => r.estado === "A" && (r.codigoTipoSolicitud === "RP" || r.codigoTipoSolicitud === "AP" || r.codigoTipoSolicitud === "DP"))
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoSolicitud,
						codigoTipoSolicitud: r.codigoTipoSolicitud,
						estado: r.estado
					}));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	mostrarModalCrearSolicitudes() {
		this.submitted = false;

		this.solicitud.idTipoAccion = 0;
		this.solicitud.idTipoMotivo = 0;
		this.solicitud.idTipoSolicitud = null;

		this.desactivarTipoMotivo = false;
		this.desactivarTipoAccion = false;

		this.modalService.open(this.myModalSolicitudes, {
			centered: true,
			size: <any>"lg",

			scrollable: true,
			beforeDismiss: () => {
				return true;
			},
		});
		this.isLoading = false;
	}

	lookForError(result: any): void {
		if (result.error !== undefined && result.error !== null) {
			this.errorMessage = result.message
				? result.name + " " + result.message
				: result.error.message;
			console.log("routin to app error page", this.errorMessage);
			this.utilService.modalResponse(this.errorMessage, "error");
		}
	}

	clearStartDate() {
		this.dataFilterSolicitudes.fechaDesde = null;
	}

	clearEndDate() {
		this.dataFilterSolicitudes.fechaHasta = null;
	}

	filterDataTable() {

		if ((this.searchInputFilter === undefined || this.searchInputFilter === null || this.searchInputFilter === '')
			&& (this.dataFilterSolicitudes.idTipoSolicitud === undefined || this.dataFilterSolicitudes.idTipoSolicitud === null)) {
			Swal.fire({
				text: "Mínimo debe seleccionar un Tipo de Solicitud o Ingresar el Nº de Solicitud",
				icon: "warning",
				confirmButtonColor: "#0056B3",
				confirmButtonText: "Sí",
			});

			return;
		}

		const data = structuredClone(this.dataFilterSolicitudes);

		if (this.dataFilterSolicitudes.fechaDesde !== undefined && this.dataFilterSolicitudes.fechaDesde !== null) {
			data.fechaDesde = this.formatFecha(this.dataFilterSolicitudes, "fechaDesde");
		}

		if (this.dataFilterSolicitudes.fechaHasta !== undefined && this.dataFilterSolicitudes.fechaHasta !== null) {
			data.fechaHasta = this.formatFecha(this.dataFilterSolicitudes, "fechaHasta");
		}

		if (this.dataFilterSolicitudes.fechaDesde !== undefined && this.dataFilterSolicitudes.fechaDesde !== null && this.dataFilterSolicitudes.fechaHasta !== undefined && this.dataFilterSolicitudes.fechaHasta !== null && data.fechaDesde === data.fechaHasta) {
			this.dataFilterSolicitudes.fechaHasta.day = this.dataFilterSolicitudes.fechaHasta.day + 1;
			data.fechaHasta = this.formatFecha(this.dataFilterSolicitudes, "fechaHasta");
		}

		this.getDataToTableFilter(data);
	}

	clearFechaDesde(fechaProp: string) {
		// data[]
	}

	formatFecha(data: any, fechaProp: string) {
		return (
			data[fechaProp].year +
			"-" +
			data[fechaProp].month +
			"-" +
			data[fechaProp].day
		);
	}

	formatFechaISO(date: any, fechaProp: string) {
		return new Date(
			date[fechaProp].year,
			date[fechaProp].month - 1,
			date[fechaProp].day
		).toISOString();
	}

	// keep content
	active4 = 1;

	// dynamic tabs
	tabs = [1, 2, 3, 4, 5];
	counter = this.tabs.length + 1;
	active5: any;

	close(event: MouseEvent, toRemove: number) {
		this.tabs = this.tabs.filter((id) => id !== toRemove);
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	add(event: MouseEvent) {
		this.tabs.push(this.counter++);
		event.preventDefault();
	}

	//metodos de prueba

	/* Hacer foco sobrehacienda cuando se renderiza la pantalla */
	@ViewChild("inputSelectHacienda") inputSelectHacienda!: NgSelectComponent;
	ngAfterViewInit() {
		//this.inputSelectHacienda.focus();
	}
	/* Funcion para hacer focus al select de producto */
	@ViewChild("inputSelectProducto") inputSelectProducto!: NgSelectComponent;
	public onChangeHacienda() {
		//this.inputSelectProducto.focus();
	}
	/* Funcion para hacer focus al input de fecha */
	@ViewChild("inputDateFecha") inputDateFecha!: ElementRef;
	public onChangeProducto() {
		//this.inputDateFecha.nativeElement.focus();
	}
	/* Funcion para hacer focus al select de Labor */
	@ViewChild("inputSelectLabor") inputSelectLabor!: NgSelectComponent;
	public onChangeFecha() {
		//this.inputSelectLabor.focus();
	}
	/* Funcion para hacer focus al select de trabajador */
	@ViewChild("inputSelectTrabajador") inputSelectTrabajador!: NgSelectComponent;
	public onChangeTipoLabor() {
		//this.inputSelectTrabajador.focus();
	}
	/* Funcion para hacer focus al input de fecha */
	@ViewChild("buttonSearch") buttonSearch!: ElementRef;
	public onChangeTrabajador() {
		//this.buttonSearch.nativeElement.focus();
	}

	getDataToTableFilter(data: any) {
		const currentDate: string = new Date().toISOString().split("T")[0];

		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		const combinedData$ = forkJoin(
			[
				this.consultaSolicitudesService.filterSolicitudes(data.empresa === null || data.empresa === undefined ? null : data.empresa, this.searchInputFilter !== null && this.searchInputFilter !== '' ? this.searchInputFilter : data.unidadNegocio === null || data.unidadNegocio === undefined ? null : data.unidadNegocio, this.searchInputFilter !== null && this.searchInputFilter !== '' ? 900000 : data.idTipoSolicitud === null || data.idTipoSolicitud === undefined ? null : data.idTipoSolicitud, data.estado === null || data.estado === undefined ? null : data.estado, data.fechaDesde === null || data.fechaDesde === undefined ? currentDate : data.fechaDesde, data.fechaHasta === null || data.fechaHasta === undefined ? currentDate : data.fechaHasta),
				//this.solicitudes.getDetalleSolicitud()
			]
		).pipe(
			map(([solicitudes]) => {
				// Combinar las solicitudes y los detalles de la solicitud
				const data = solicitudes.solicitudType.map((solicitud) => {
					const detalles = solicitudes.detalleSolicitudType.find((detalle) => detalle.idSolicitud === solicitud.idSolicitud);

					detalles.estado = solicitud.estado;
					solicitud.fechaCreacion = new DatePipe('en-CO').transform(solicitud.fechaCreacion, 'dd/MM/yyyy');;
					return {
						...solicitud,
						...detalles
					};

				});

				// Ordenar la data por fechaCreacion de forma descendente
				return data.sort((a, b) => {
					return b.idDetalleSolicitud - a.idDetalleSolicitud;
				});
			})
		);

		combinedData$.subscribe({
			next: (response) => {
				this.dataTable = response;

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

		/*return this.solicitudes.getSolicitudes().subscribe({
		  next: (response) => {
			this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse=>({
			  ...nivelAprobacionResponse,
			  estado: nivelAprobacionResponse.estado === "A",
			})));
		  },
		  error: (error: HttpErrorResponse) => {
			this.utilService.modalResponse(error.error, "error");
		  },
		});*/
	}

	ObtenerServicioEstado() {
		return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
			next: (response) => {
				this.data_estado = response.itemCatalogoTypes.map((r) => ({
					id: r.id,
					codigo: r.codigo,
					descripcion: r.valor,
				})); //verificar la estructura mmunoz
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	private getDataToTable() {
		localStorage.removeItem(LocalStorageKeys.Reloaded);
		//this.ObtenerServicioEstado();

		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.mantenimientoService.getCatalogo("RBPEST").subscribe({
			next: (response) => {
				this.data_estado = response.itemCatalogoTypes.map((r) => ({
					id: r.id,
					codigo: r.codigo,
					descripcion: r.valor,
				})); //verificar la estructura mmunoz

				forkJoin([this.solicitudes.getSolicitudes(), this.solicitudes.getDetalleSolicitud(), this.solicitudes.getConteo()])
					.pipe(
						map(([solicitudes, detallesSolicitud, conteo]) => {
							this.solicitudesCompletadas = conteo.totalesCompletadasType;
							this.solicitudesPendientes = conteo.totalesPendientesType;

							this.solicitudesTipo = conteo.listadoSolicitudes.map(data => ({
								...data,
								idSolicitud: data.id_solicitud
							}));

							// Combinar las solicitudes y los detalles de la solicitud
							const data = solicitudes.solicitudType.map((solicitud) => {
								const detalles = detallesSolicitud.detalleSolicitudType.find((detalle) => detalle.idSolicitud === solicitud.idSolicitud);
								solicitud.fechaCreacion = new DatePipe('en-CO').transform(solicitud.fechaCreacion, 'dd/MM/yyyy HH:mm:ss');

								return {
									...solicitud,
									...detalles
								};
							});

							return data.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
						})
					)
					.subscribe((data) => {
						this.dataTable = data.map((itemSolicitud) => {
							const descripcionEstado = this.data_estado.find((itemEstado) => itemEstado.codigo == itemSolicitud.estadoSolicitud);

							return {
								...itemSolicitud,
								estado: descripcionEstado !== undefined ? descripcionEstado.descripcion : "N/A",
							};
						});

						this.utilService.closeLoadingSpinner();
					});
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	onRowActionGraphics(id: string, key: string, tooltip: string, id_edit) {
		this.active = 2;

		this.dataFilterSolicitudes.idTipoSolicitud = parseInt(id_edit);

		this.filterDataTable();
	}

	onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
		if (tooltip === "Info") {
			this.router.navigate(["/solicitudes/detalle-solicitud", id_edit]);
		} else {
			this.router.navigate(["/solicitudes/trazabilidad", id_edit]);
		}
	}

	mostrarModalCrearInstanciaSolicitud() {
		this.submitted = false;
		this.modalService.open(this.myModalSolicitudes, {
			centered: true,
			size: <any>"lg",

			scrollable: true,
			beforeDismiss: () => {
				return true;
			},
		});
		this.isLoading = false;
	}

	ObtenerServicioTipoAccion() {
		return this.mantenimientoService.getTipoAccion().subscribe({
			next: (response) => {
				this.dataTipoAccion = response.map((r) => ({
					id: r.id,
					descripcion: r.tipoAccion,
				})); //verificar la estructura mmunoz
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioNivelDireccion() {
		return this.mantenimientoService.getCatalogo("RBPND").subscribe({
			next: (response) => {
				this.dataNivelDireccion = response.itemCatalogoTypes.map((r) => ({
					...r,
					id: r.id,
					descripcion: r.valor,
				})); //verificar la estructura mmunoz
			},

			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}
	//dataTipoMotivo

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

	Eliminar() {
		Swal.fire({
			text: "¿Estás seguro de realizar esta acción?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#0056B3",
			cancelButtonColor: "#77797a",
			confirmButtonText: "Sí",
			cancelButtonText: "No",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					text: "Registro Eliminado.",
					icon: "success",
					confirmButtonColor: "#0056B3",
				});
			}
		});
	}

	@HostListener("window:keydown", ["$event"])
	handleKeyUp(event: KeyboardEvent): void {
		// Verifica las teclas específicas que deseas activar
		if (event.altKey && event.key === "c") {
			// Ejecuta la acción que deseas realizar
			this.activarOpcion(event.key);
			this.PageCrear();
		}
	}

	activarOpcion(letra): void {
		//const elemento = this.el.nativeElement.querySelector('#1');
		//if (elemento) {
		//  this.renderer.selectRootElement(elemento).click();
		//}
		// Lógica para activar la opción deseada

		console.log("Opción activada con Alt + " + letra);
	}

	onNavChange(changeEvent: NgbNavChangeEvent) {
		console.log("onNavChange");
		if (changeEvent.nextId === 3) {
			changeEvent.preventDefault();
		}
	}

	toggleDisabled() {
		this.disabled = !this.disabled;
		if (this.disabled) {
			this.active = 1;
		}
	}

	pageCrear() {
		this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
	}

	// 6
	onSelect6(data: any): void {
		console.log("Item clicked", JSON.parse(JSON.stringify(data)));
	}

	onActivate6(data: any): void {
		console.log("Activate", JSON.parse(JSON.stringify(data)));
	}

	onDeactivate6(data: any): void {
		console.log("Deactivate", JSON.parse(JSON.stringify(data)));
	}

	// public exportar(): void {
	// 	if (this.solicitud.idSolicitud.toUpperCase().includes("RP")) {
	// 		this.exportarRequisicionPersonal();
	// 	} else if (this.solicitud.idSolicitud.toUpperCase().includes("CF")) {
	// 		this.exportarContratacionFamiliar();
	// 	} else if (this.solicitud.idSolicitud.toUpperCase().includes("RG")) {
	// 		this.exportarReingresoPersonal();
	// 	} else if (this.solicitud.idSolicitud.toUpperCase().includes("AP")) {
	// 		this.exportarAccionPersonal();
	// 	}
	// }

	// private exportarRequisicionPersonal(): void {
	// 	const backgroundCellColor: [number, number, number] = [218, 238, 243];
	// 	const textColor: [number, number, number] = [56, 95, 147];
	// 	const lineColor: [number, number, number] = [149, 179, 215];

	// 	const doc = new jsPDF();

	// 	// Esquina de la hoja
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: `RR.HH.: ${this.solicitud.idSolicitud}`,
	// 					styles: {
	// 						halign: "right",
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Títutlo
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: "REQUERIMIENTO DE PERSONAL",
	// 					styles: {
	// 						halign: "center",
	// 						fontSize: 20,
	// 						fontStyle: "bold",
	// 						textColor
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Encabezado de la solicitud
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		body: [
	// 			["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"), "Solicitud No:", this.solicitud.idSolicitud],
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			4: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			}
	// 		}
	// 	});

	// 	// Información de la posición
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "INFORMACIÓN DE LA POSICIÓN",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Unidad:", this.model.unidadNegocio, "Motivo", this.solicitud.tipoMotivo],
	// 			["Ciudad/Localidad:", this.model.localidad, "Empleado a reemplazar", this.model.nombreCompleto],
	// 			["Cargo solicitado:", this.model.nombreCargo, "Sueldo", this.model.sueldo],
	// 			["Área/Dpto:", this.model.departamento, "Variable máxima:", this.model.sueldoMensual],
	// 			["Centro de Costos", this.model.nomCCosto, "Total", parseInt(this.model.sueldo) + parseInt(this.model.sueldoMensual)],
	// 			[
	// 				"Justificación:",
	// 				{
	// 					content: this.model.justificacionCargo,
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			},
	// 			1: {
	// 				cellWidth: 60
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			},
	// 			3: {
	// 				cellWidth: 60
	// 			}
	// 		}
	// 	});

	// 	// Funciones y responsabilidades
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "FUNCIONES Y RESPONSABILIDADES",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Reporta a:", this.model.reportaA, "Supervisa a:", this.model.supervisaA],
	// 			[
	// 				"Misión del cargo:",
	// 				{
	// 					content: this.model.misionCargo,
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			},
	// 			1: {
	// 				cellWidth: 60
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			},
	// 			3: {
	// 				cellWidth: 60
	// 			}
	// 		}
	// 	});

	// 	// Sección de candidato
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "SELECCIÓN DE CANDIDATO",
	// 					colSpan: 2
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "TAREA:",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "FECHA:",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			["Actualización del perfil:", this.fechas.actualizacionPerfil],
	// 			["Búsqueda del candidato:", this.fechas.busquedaCandidatos],
	// 			["Entrevistas:", this.fechas.entrevista],
	// 			["Pruebas:", this.fechas.pruebas],
	// 			["Referencias:", this.fechas.referencias],
	// 			["Elaboración del Informe:", this.fechas.elaboracionInforme],
	// 			["Entrega al Jefe Solicitante el informe de selección:", this.fechas.entregaJefe],
	// 			["Entrevistas por parte de fejaturas:", this.fechas.entrevistaJefatura],
	// 			["Toma de decisiones por parte de fejaturas:", this.fechas.tomaDecisiones],
	// 			["Candidato seleccionado:", this.fechas.candidatoSeleccionado],
	// 			["Proceso de Contratación:", this.fechas.procesoContratacion],
	// 			["Fin del Proceso de Selección y Proceso de Contratación:", this.fechas.finProcesoContratacion],
	// 			[
	// 				{
	// 					content: "",
	// 					colSpan: 2,
	// 					styles: {
	// 						fillColor: backgroundCellColor,
	// 						cellPadding: "2px"
	// 					}
	// 				}
	// 			],
	// 			["Nombre del candidato escogido:", this.nombreCandidato],
	// 			["Fecha de ingreso:", this.fechas.reingreso === "" ? this.fechas.contratacionFamiliares : this.fechas.reingreso]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 110
	// 			},
	// 			1: {
	// 				cellWidth: 70,
	// 				halign: "center"
	// 			}
	// 		}
	// 	});

	// 	// Log del flujo
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "Log delflujo",
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Fecha",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Acción",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Responsble",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			...this.dataAprobacionesPorPosicion[this.keySelected].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				cellWidth: 30,
	// 				halign: "center"
	// 			},
	// 			1: {
	// 				cellWidth: 75
	// 			},
	// 			2: {
	// 				cellWidth: 75
	// 			}
	// 		}
	// 	});

	// 	doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	// }

	// private exportarContratacionFamiliar(): void {
	// 	const backgroundCellColor: [number, number, number] = [218, 238, 243];
	// 	const textColor: [number, number, number] = [56, 95, 147];
	// 	const lineColor: [number, number, number] = [149, 179, 215];

	// 	const doc = new jsPDF();

	// 	// Esquina de la hoja
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: `RR.HH.: ${this.solicitud.idSolicitud}`,
	// 					styles: {
	// 						halign: "right",
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Títutlo
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: "CONTRATACIÓN DE FAMILIAR",
	// 					styles: {
	// 						halign: "center",
	// 						fontSize: 20,
	// 						fontStyle: "bold",
	// 						textColor
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Encabezado de la solicitud
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		body: [
	// 			[
	// 				{
	// 					content: "Creado por:",
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: this.solicitud.usuarioCreacion,
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: "Fecha:",
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"),
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				"Solicitud No:",
	// 				this.solicitud.idSolicitud
	// 			],
	// 			["Requisición de Personal No:", this.idSolicitudRP]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			4: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			}
	// 		}
	// 	});

	// 	// Información de la persona a contratar
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "INFORMACIÓN DE LA PERSONA A CONTRATAR",
	// 					colSpan: 2
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Apellidos y nombres:", this.nombreCompletoCandidato],
	// 			["Unidad:", this.model.unidadNegocio],
	// 			["Departamento:", this.model.departamento],
	// 			["Cargo:", this.model.nombreCargo],
	// 			["Localidad:", this.model.localidad],
	// 			["Jefe Solicitante:", this.solicitud.usuarioCreacion],
	// 			["Responsable de RR.HH.:", this.solicitud.usuarioCreacion],
	// 			["Justificación:", this.model.justificacionCargo]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 50
	// 			},
	// 			1: {
	// 				cellWidth: 130
	// 			}
	// 		}
	// 	});

	// 	// Datos de familiares que ya laboran en la empresa
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "DATOS DE FAMILIARES QUE YA LABORAN EN LA EMPRESA",
	// 					colSpan: 7
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Nombre",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Fecha de ingreso",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Cargo",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Unidad",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Departamento",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Localidad",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "Parentezco",
	// 					styles: {
	// 						fontStyle: "bold",
	// 						halign: "center"
	// 					}
	// 				}
	// 			],
	// 			...this.dataTableDatosFamiliares.map(datoFamiliar => ([datoFamiliar.nombreEmpleado, datoFamiliar.fechaCreacion as string, datoFamiliar.cargo, datoFamiliar.unidad, datoFamiliar.departamento, datoFamiliar.localidad, datoFamiliar.parentesco]))
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				cellWidth: 25
	// 			},
	// 			1: {
	// 				cellWidth: 25
	// 			},
	// 			2: {
	// 				cellWidth: 25
	// 			},
	// 			3: {
	// 				cellWidth: 25
	// 			},
	// 			4: {
	// 				cellWidth: 30
	// 			},
	// 			5: {
	// 				cellWidth: 25
	// 			},
	// 			6: {
	// 				cellWidth: 25
	// 			}
	// 		}
	// 	});

	// 	// Log del flujo
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "Log delflujo",
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Fecha",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Acción",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Responsble",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			...this.dataAprobacionesPorPosicion[this.keySelected].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				cellWidth: 30,
	// 				halign: "center"
	// 			},
	// 			1: {
	// 				cellWidth: 75
	// 			},
	// 			2: {
	// 				cellWidth: 75
	// 			}
	// 		}
	// 	});

	// 	doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	// }

	// private exportarReingresoPersonal(): void {
	// 	const backgroundCellColor: [number, number, number] = [218, 238, 243];
	// 	const textColor: [number, number, number] = [56, 95, 147];
	// 	const lineColor: [number, number, number] = [149, 179, 215];

	// 	const variableMaxima = Math.max(...[parseInt(this.model.sueldoAnual), parseInt(this.model.sueldoMensual), parseInt(this.model.sueldoSemestral), parseInt(this.model.sueldoTrimestral)]);
	// 	const variableMaximaRG = Math.max(...[parseInt(this.modelRG.sueldoAnual), parseInt(this.modelRG.sueldoMensual), parseInt(this.modelRG.sueldoSemestral), parseInt(this.modelRG.sueldoTrimestral)]);

	// 	const doc = new jsPDF();

	// 	// Esquina de la hoja
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: `RR.HH.: ${this.solicitud.idSolicitud}`,
	// 					styles: {
	// 						halign: "right",
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Títutlo
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: "REINGRESO DE PERSONAL",
	// 					styles: {
	// 						halign: "center",
	// 						fontSize: 20,
	// 						fontStyle: "bold",
	// 						textColor
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Encabezado de la solicitud
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		body: [
	// 			[
	// 				{
	// 					content: "Creado por:",
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: this.solicitud.usuarioCreacion,
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: "Fecha:",
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				{
	// 					content: format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"),
	// 					rowSpan: 2,
	// 					styles: {
	// 						valign: "middle"
	// 					}
	// 				},
	// 				"Solicitud No:",
	// 				this.solicitud.idSolicitud
	// 			],
	// 			["Requisición de Personal No:", this.idSolicitudRP]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			4: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			}
	// 		}
	// 	});

	// 	// Información de la persona a contratar
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "INFORMACIÓN DE LA PERSONA A CONTRATAR",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Apellidos y nombres:", this.nombreCompletoCandidato, "Fecha de ingreso:", "dd/MM/yyyy"]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 40
	// 			},
	// 			1: {
	// 				cellWidth: 75
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 35
	// 			},
	// 			3: {
	// 				cellWidth: 30
	// 			}
	// 		}
	// 	});

	// 	// Datos de contratación
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "DATOS DE CONTRTACIÓN",
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Descripción",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Contratación anterior",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Contratación actual",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			["Compañía:", this.model.compania, this.modelRG.compania],
	// 			["Sueldo:", this.model.sueldo, this.modelRG.sueldo],
	// 			["Variable Máxima:", variableMaxima, variableMaximaRG],
	// 			["Remuneración Total:", "", ""],
	// 			["Cargo:", this.model.descrPosicion, this.modelRG.descrPosicion],
	// 			["Departamento:", this.model.departamento, this.modelRG.departamento],
	// 			["Fecha de Ingreso:", format(new Date(this.model.fechaIngreso), "dd/MM/yyyy"), format(new Date(this.modelRG.fechaIngreso), "dd/MM/yyyy")],
	// 			["Fecha de Salida:", format(new Date(this.detalleSolicitudRG.fechaSalida), "dd/MM/yyyy"), format(new Date(this.detalleSolicitud.fechaSalida), "dd/MM/yyyy")],
	// 			["Jefe Inmediato Superior:", this.detalleSolicitudRG.jefeInmediatoSuperior, this.detalleSolicitud.jefeInmediatoSuperior],
	// 			["Cargo Jefe Inemdiato Superior:", this.detalleSolicitudRG.puestoJefeInmediato, this.detalleSolicitud.puestoJefeInmediato],
	// 			["Responsable de RR.HH.:", this.detalleSolicitudRG.responsableRRHH, this.detalleSolicitud.responsableRRHH]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 60
	// 			},
	// 			1: {
	// 				cellWidth: 60
	// 			},
	// 			2: {
	// 				cellWidth: 60
	// 			}
	// 		}
	// 	});

	// 	// Referencia de recursos humanos
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "REFERENCIA DE RECURSOS HUMANOS",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				"Forma de salida:",
	// 				{
	// 					content: this.comentariosRRHH.comentario,
	// 					colSpan: 3
	// 				}
	// 			],
	// 			[
	// 				"Causa real de salida:",
	// 				{
	// 					content: this.causaSalida,
	// 					colSpan: 3
	// 				}
	// 			],
	// 			[
	// 				"Justificación", "", "Fecha:", format(this.currentDate, "dd/MM/yyyy")
	// 			]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 40
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 25
	// 			},
	// 			3: {
	// 				cellWidth: 35
	// 			}
	// 		}
	// 	});

	// 	// Referencia del último jefe
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "REFERENCIA DEL ÚLTIMO JEFE",
	// 					colSpan: 2
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["¿Cómo fue el desempeño en el área?:", this.comentariosJefeInmediato.comentario],
	// 			["Fecha:", format(this.currentDate, "dd/MM/yyyy")]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 70
	// 			}
	// 		}
	// 	});

	// 	// Jefe solicitante
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor: textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "JEFE SOLICITANTE",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Nombre del jefe solicitante:", this.detalleSolicitudRG.jefeSolicitante, "Cargo:", this.detalleSolicitudRG.puesto],
	// 			["Justificación:", this.Comentario_Jefe_Solicitante.comentario, "Fecha:", format(this.currentDate, "dd/MM/yyyy")]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 60
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 25
	// 			},
	// 			3: {
	// 				cellWidth: 25
	// 			}
	// 		}
	// 	});

	// 	// Log del flujo
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "Log delflujo",
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Fecha",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Acción",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Responsble",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			...this.dataAprobacionesPorPosicion[this.keySelected].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				cellWidth: 30,
	// 				halign: "center"
	// 			},
	// 			1: {
	// 				cellWidth: 75
	// 			},
	// 			2: {
	// 				cellWidth: 75
	// 			}
	// 		}
	// 	});

	// 	doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	// }

	// private exportarAccionPersonal(): void {
	// 	const backgroundCellColor: [number, number, number] = [218, 238, 243];
	// 	const textColor: [number, number, number] = [56, 95, 147];
	// 	const lineColor: [number, number, number] = [149, 179, 215];

	// 	const variableMaxima = Math.max(...[parseInt(this.model.sueldoAnual), parseInt(this.model.sueldoMensual), parseInt(this.model.sueldoSemestral), parseInt(this.model.sueldoTrimestral)]);
	// 	const variableMaximaPropuestos = Math.max(...[parseInt(this.modelPropuestos.sueldoAnual), parseInt(this.modelPropuestos.sueldoMensual), parseInt(this.modelPropuestos.sueldoSemestral), parseInt(this.modelPropuestos.sueldoTrimestral)]);

	// 	const doc = new jsPDF();

	// 	// Esquina de la hoja
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: `RR.HH.: ${this.solicitud.idSolicitud}`,
	// 					styles: {
	// 						halign: "right",
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Títutlo
	// 	autoTable(doc, {
	// 		theme: "plain",
	// 		body: [
	// 			[
	// 				{
	// 					content: "ACCIÓN DE PERSONAL",
	// 					styles: {
	// 						halign: "center",
	// 						fontSize: 20,
	// 						fontStyle: "bold",
	// 						textColor
	// 					}
	// 				}
	// 			],
	// 		]
	// 	});

	// 	// Encabezado de la solicitud
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		body: [
	// 			["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"), "Solicitud No:", this.solicitud.idSolicitud],
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			},
	// 			4: {
	// 				fontStyle: "bold",
	// 				halign: "right"
	// 			}
	// 		}
	// 	});

	// 	// Información
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "INFORMACIÓN",
	// 					colSpan: 4
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Nombre empleado"
	// 				},
	// 				{
	// 					content: this.model.nombreCompleto,
	// 					colSpan: 3
	// 				}
	// 			],
	// 			[
	// 				{
	// 					content: "ORIGEN",
	// 					colSpan: 2,
	// 					styles: {
	// 						textColor,
	// 						halign: "center"
	// 					}
	// 				},
	// 				{
	// 					content: "DESTINO",
	// 					colSpan: 2,
	// 					styles: {
	// 						textColor,
	// 						halign: "center"
	// 					}
	// 				}
	// 			],
	// 			["Fecha de ingreso:", format(new Date(this.model.fechaIngreso), "dd/MM/yyyy"), "Fecha de cambio:", format(new Date(this.model.fechaIngreso), "dd/MM/yyyy")],
	// 			["Cargo:", this.model.nombreCargo, "Cargo:", this.modelPropuestos.nombreCompleto],
	// 			["Unidad:", this.model.unidadNegocio, "Unidad:", this.modelPropuestos.unidadNegocio],
	// 			["Área/Departamento:", this.model.departamento, "Área/Departamento::", this.modelPropuestos.departamento],
	// 			["Localidad:", this.model.localidad, "Localidad:", this.modelPropuestos.localidad],
	// 			["Sueldo:", `$ ${parseInt(this.model.sueldo).toFixed(2)}`, "Sueldo:", `$ ${parseInt(this.modelPropuestos.sueldo).toFixed(2)}`],
	// 			["Variable máxima:", `$ ${variableMaxima.toFixed(2)}`, "Variable máxima:", `$ ${variableMaximaPropuestos.toFixed(2)}`],
	// 			["Movilizavión:", this.detalleSolicitudPropuestos.movilizacion !== "" ? `$ ${parseInt(this.detalleSolicitudPropuestos.movilizacion).toFixed(2)}` : "$ 0.00", "Movilización:", this.detalleSolicitudPropuestos.movilizacion !== "" ? `$ ${parseInt(this.detalleSolicitudPropuestos.movilizacion).toFixed(2)}` : "$ 0.00"],
	// 			["Alimentación:", this.detalleSolicitudPropuestos.alimentacion !== "" ? `$ ${parseInt(this.detalleSolicitudPropuestos.alimentacion).toFixed(2)}` : "$ 0.00", "Alimentación:", this.detalleSolicitudPropuestos.alimentacion !== "" ? `$ ${parseInt(this.detalleSolicitudPropuestos.alimentacion).toFixed(2)}` : "$ 0.00"],
	// 			["Centro de Costos:", this.model.nomCCosto, "Centro de Costos:", this.modelPropuestos.nomCCosto],
	// 			["Grupo de pago:", this.model.grupoPago, "Grupo de pago:", this.modelPropuestos.grupoPago],
	// 			["Sucursal (Nómina):", this.model.sucursal, "Scursal (Nómina):", this.modelPropuestos.sucursal],
	// 			["Distribución contable:", this.model.subledger, "Distribución Contable:", this.modelPropuestos.subledger]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 40
	// 			},
	// 			1: {
	// 				cellWidth: 50
	// 			},
	// 			2: {
	// 				fontStyle: "bold",
	// 				cellWidth: 40
	// 			},
	// 			3: {
	// 				cellWidth: 50
	// 			}
	// 		}
	// 	});

	// 	// Descripción
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "DESCRIPCIÓN",
	// 					colSpan: 2
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Tipo de Acción:", this.solicitud.tipoAccion],
	// 			["Justificación:", this.model.justificacionCargo]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			}
	// 		}
	// 	});

	// 	// Sección para recursos humanos
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			halign: "center",
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "SECCIÓN PARA RECURSOS HUMANOS",
	// 					colSpan: 2
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			["Observaciones:", ""],
	// 			[
	// 				{
	// 					content: "",
	// 					colSpan: 2,
	// 					styles: {
	// 						minCellHeight: 20
	// 					}
	// 				}
	// 			],
	// 			[
	// 				{
	// 					content: "ACEPTACIÓN DEL EMPLEADO",
	// 					colSpan: 2,
	// 					styles: {
	// 						halign: "center"
	// 					}
	// 				}
	// 			]
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				fontStyle: "bold",
	// 				cellWidth: 30
	// 			}
	// 		}
	// 	});


	// 	// Log del flujo
	// 	autoTable(doc, {
	// 		theme: "grid",
	// 		headStyles: {
	// 			fillColor: backgroundCellColor,
	// 			textColor,
	// 			lineColor
	// 		},
	// 		bodyStyles: {
	// 			lineColor
	// 		},
	// 		head: [
	// 			[
	// 				{
	// 					content: "Log delflujo",
	// 					colSpan: 3
	// 				}
	// 			]
	// 		],
	// 		body: [
	// 			[
	// 				{
	// 					content: "Fecha",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Acción",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				},
	// 				{
	// 					content: "Responsble",
	// 					styles: {
	// 						halign: "center",
	// 						textColor,
	// 						fontStyle: "bold"
	// 					}
	// 				}
	// 			],
	// 			...this.dataAprobacionesPorPosicion[this.keySelected].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
	// 		],
	// 		columnStyles: {
	// 			0: {
	// 				cellWidth: 30,
	// 				halign: "center"
	// 			},
	// 			1: {
	// 				cellWidth: 75
	// 			},
	// 			2: {
	// 				cellWidth: 75
	// 			}
	// 		}
	// 	});

	// 	doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	// }
}
