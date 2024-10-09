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
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { FamiliaresCandidatos, MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { FormatoUtilReporte, reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { ConsultaSolicitudesData } from "./reporte-solicitudes.data";
import {
	IConsultaSolicitudesTable
} from "./reporte-solicitudes.interface";

import { DatePipe } from "@angular/common";
import { NgSelectComponent } from "@ng-select/ng-select";
import { differenceInDays, format, parse } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TableComponentData } from "src/app/component/table/table.data";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { ConsultaSolicitudPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { DataFilterSolicitudes } from "src/app/eschemas/DataFilterSolicitudes";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";
import { StarterService } from "src/app/starter/starter.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control, Permiso } from "src/app/types/permiso.type";
import { codigosSolicitudReporte, portalWorkFlow } from "src/environments/environment";
import { ComentarioSalidaJefeService } from "../detalle-solicitud/comentario-salida-jefe.service";
import { RegistrarCandidatoService } from "../registrar-candidato/registrar-candidato.service";
import { ConsultaSolicitudesService } from "./consulta-solicitudes.service";

//import { single} from './chartData';
declare var require: any;
const data: any = require("./company.json");
@Component({
	selector: "app-data-table",
	templateUrl: "./reporte-solicitudes.component.html",
	styleUrls: ["./reporte-solicitudes.component.scss"],
})
export class ReporteSolicitudesComponent implements AfterViewInit, OnInit {
	private pageCode: string = PageCodes.ConsultaSolicitudes;
	public pageControlPermission: typeof ConsultaSolicitudPageControlPermission = ConsultaSolicitudPageControlPermission;

	public showButtons: boolean = true;
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

	editing: any = {};
	rows: any = new Array();
	temp = [...data];

	loadingIndicator = true;
	reorderable = true;

	columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];

	@ViewChild(ReporteSolicitudesComponent) table:
		| ReporteSolicitudesComponent
		| any;

	// PROPS FOR PRINTING
	public solicitud = new Solicitud();
	public detalleSolicitud = new DetalleSolicitud();
	public muestraRemuneracion: boolean = false;
	private modelPrint: RegistrarData = new RegistrarData();
	private modelPrintPropuestos: RegistrarData = new RegistrarData();
	private modelPrintRG: RegistrarData = new RegistrarData();
	private modelPrintRemuneracion: number = 0;
	public viewInputs: boolean = false;
	private detalleSolicitudPrint = new DetalleSolicitud();
	private detalleSolicitudPrintPropuestos = new DetalleSolicitud();
	private detalleSolicitudPrintRG = new DetalleSolicitud();
	private causaSalidaPrint: string = "";
	private remuneracionPrint: number = 0;
	private keySelectedPrint: string = "";
	private mostrarTipoJustificacionYMisionPrint: boolean = false;
	private mostrarSubledgerPrint: boolean = false;
	private restrictionsIdsPrint: any[] = ["1", "2", 1, 2];
	private restrictionsSubledgerIdsPrint: any[] = ["4", 4];
	private dataAprobacionesPorPosicionPrint: { [key: string]: any[] } = {};
	private selectedOptionPrint: string = "";
	private optionPrint: { codigo: string; valor: string } = {
		codigo: "",
		valor: ""
	};
	private comentariosJefeInmediatoPrint: any = {};
	private comentariosPrint: string = "";
	private comentariosRRHHPrint: any = {};
	private Comentario_Jefe_SolicitantePrint: any = {};
	private dataComentariosAprobacionesPrint: any[] = [];
	private dataComentariosAprobacionesPrintPorPosicion: any[] = [];
	private dataComentariosAprobacionesPrintRRHH: any[] = [];
	private dataComentariosAprobacionesPrintCREM: any[] = [];
	private nombreCompletoCandidatoPrint: string = "";
	private isCheckedPrint: boolean = false;
	private idSolicitudRPPrint: string = "";
	private nombreCandidatoPrint: string = "";
	private fechasPrint: any = {
		actualizacionPerfil: "",
		busquedaCandidatos: "",
		entrevista: "",
		pruebas: "",
		referencias: "",
		elaboracionInforme: "",
		entregaJefe: "",
		entrevistaJefatura: "",
		tomaDecisiones: "",
		candidatoSeleccionado: "",
		procesoContratacion: "",
		finProcesoContratacion: "",
		reingreso: "",
		finProceso: "",
		contratacionFamiliares: "",
		finProcesoFamiliares: ""
	};
	private dataTableDatosFamiliaresPrint: FamiliaresCandidatos[] = [];
	private currentDatePrint: Date = new Date();

	public dropdownOptionsExport = [
		{
			id: "EXCEL",
			name: "EXCEL",
			icon: "fas fa-file-excel",
		},
		{
			id: "CSV",
			name: "CSV",
			icon: "fas fa-file-alt",
		}
	]

	selected_empresa: number;
	selected_producto: number;
	selected_tipo_solicitud: number;
	selected_estado: number;
	public fechaHastaFinal: Date;
	public dataFilterSolicitudes = new DataFilterSolicitudes();
	public searchInputFilter: string = "";
	emailVariables = {
		de: "",
		para: "",
		alias: "",
		asunto: "",
		cuerpo: "",
		password: ""
	};
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

	constructor(private config: NgSelectConfig, public consultaSolicitudesService: ConsultaSolicitudesService, private seleccionCandidatoService: RegistrarCandidatoService, private route: ActivatedRoute, private solicitudes: SolicitudesService, private utilService: UtilService, private mantenimientoService: MantenimientoService, private router: Router, private calendar: NgbCalendar, private camundaRestService: CamundaRestService, private modalService: NgbModal, private starterService: StarterService, private permissionService: PermisoService, private comentarioSalidaJefeService: ComentarioSalidaJefeService, private solicitudesService: SolicitudesService) {
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
		this.typeSolicitudSelected = this.dataTipoSolicitudes.filter((data) => data.descripcion == "Acción de Personal")[0]?.id;
	}

	ngOnInit() {
		this.getDataToTable();
		this.ObtenerServicioTipoSolicitud();
		this.obtenerEmpresaYUnidadNegocio();
	}

	PageCrear() {
		this.router.navigate(["/solicitudes/crear-tipo-solicitud"]);
	}

	public mostrarBotonesAdmin(): boolean {
		const permisos: Permiso[] = JSON.parse(sessionStorage.getItem(LocalStorageKeys.Permisos)!);

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

		this.showButtons = false;

		this.codigoTipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.solicitud.idTipoSolicitud)[0]?.codigoTipoSolicitud;

		this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.solicitud.idTipoSolicitud)[0]?.descripcion;

		this.solicitud.tipoMotivo = this.dataTiposMotivosPorTipoSolicitud[this.solicitud.idTipoSolicitud].filter((data) => data.id == this.solicitud.idTipoMotivo)[0]?.tipoMotivo;

		this.solicitud.tipoAccion = this.dataTiposAccionesPorTipoSolicitud[this.solicitud.idTipoSolicitud].filter((data) => data.id == this.solicitud.idTipoAccion)[0]?.tipoAccion;

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
							this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
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
																this.solicitudes.getDetalleAprobadoresSolicitudesById(this.solicitud.idSolicitud).subscribe({
																	next: (resJefe) => {
																		resJefe.detalleAprobadorSolicitud.forEach((item) => {
																			if (item.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD")) {
																				const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

																				const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", item.usuarioAprobador).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

																				this.emailVariables = {
																					de: "emisor",
																					para: item.correo,
																					// alias: this.solicitudes.modelDetalleAprobaciones.correo,
																					alias: "Notificación 1",
																					asunto: `Creación de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
																					cuerpo: modifiedHtmlString,
																					password: "password"
																				};

																				this.solicitudes.sendEmail(this.emailVariables).subscribe({
																					next: () => {
																					},
																					error: (error) => {
																						console.error(error);
																					}
																				});
																			}
																		});
																	}
																});

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
			this.mantenimientoService.getTiposMotivosPorTipoSolicitud(idTipoSolicitud).subscribe({
				next: (response) => {
					this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = response.sort((a, b) => a.tipoMotivo.toUpperCase().localeCompare(b.tipoMotivo.toUpperCase()));
				},
				error: (error: HttpErrorResponse) => {
					this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = [];

					this.utilService.modalResponse(error.error, "error");
				},
			});
		}

		if (!this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud]) {
			this.mantenimientoService.getTiposAccionesPorTipoSolicitud(idTipoSolicitud).subscribe({
				next: (response) => {
					this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud] = response.sort((a, b) => a.tipoAccion.toUpperCase().localeCompare(b.tipoAccion.toUpperCase()));
				},
				error: (error: HttpErrorResponse) => {
					this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud] = [];

					this.utilService.modalResponse(error.error, "error");
				},
			});
		}

		this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == idTipoSolicitud)[0]?.descripcion;
	}

	onChangeTipoMotivo(idTipoMotivo: number) {
		this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
			(data) => data.id == idTipoMotivo
		)[0]?.descripcion;
	}

	onChangeTipoAccion(idTipoAccion: number) {
		this.solicitud.tipoAccion = this.dataTipoAccion.filter((data) => data.id == idTipoAccion)[0]?.descripcion;
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
					}))
					.sort((a, b) => a.descripcion.toUpperCase().localeCompare(b.descripcion.toUpperCase()));

				this.dataTipoSolicitudesModal = response.tipoSolicitudType
					.filter((r) => r.estado === "A" && (r.codigoTipoSolicitud === "RP" || r.codigoTipoSolicitud === "AP" || r.codigoTipoSolicitud === "DP"))
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoSolicitud,
						codigoTipoSolicitud: r.codigoTipoSolicitud,
						estado: r.estado
					}))
					.sort((a, b) => a.descripcion.toUpperCase().localeCompare(b.descripcion.toUpperCase()));
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
				text: "Mínimo debe seleccionar un Tipo de Solicitud",
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

		if (this.dataFilterSolicitudes.fechaDesde !== undefined && this.dataFilterSolicitudes.fechaDesde !== null && (this.dataFilterSolicitudes.fechaHasta === undefined || this.dataFilterSolicitudes.fechaHasta === null)) {
			const currentDate: string = new Date().toISOString().split("T")[0];

			if (data.fechaDesde === currentDate.substring(0, 5).concat(currentDate.substring(6).replaceAll("0", ""))) {
				this.dataFilterSolicitudes.fechaHasta = this.dataFilterSolicitudes.fechaDesde;
				this.dataFilterSolicitudes.fechaHasta.day = this.dataFilterSolicitudes.fechaHasta.day + 1;
				data.fechaHasta = this.formatFecha(this.dataFilterSolicitudes, "fechaHasta");
				this.dataFilterSolicitudes.fechaHasta = null;
			}
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
		return `${data[fechaProp].year}-${data[fechaProp].month}-${data[fechaProp].day}`;
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
					solicitud.fechaCreacion = new DatePipe('en-CO').transform(solicitud.fechaCreacion, 'dd/MM/yyyy HH:mm:ss');
					solicitud.fechaActualizacion = new DatePipe('en-CO').transform(solicitud.fechaActualizacion, 'dd/MM/yyyy HH:mm:ss');

					return {
						...solicitud,
						...detalles
					};

				});

				return data.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
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
	}

	ObtenerServicioEstado() {
		return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
			next: (response) => {
				this.data_estado = response.itemCatalogoTypes
					.map((r) => ({
						id: r.id,
						codigo: r.codigo,
						descripcion: r.valor,
					}))
					.sort((a, b) => a.descripcion.toUpperCase().localeCompare(b.descripcion.toUpperCase()));
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	private getDataToTable() {
		sessionStorage.removeItem(LocalStorageKeys.Reloaded);
		//this.ObtenerServicioEstado();

		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.mantenimientoService.getCatalogo("RBPEST").subscribe({
			next: (response) => {
				this.data_estado = response.itemCatalogoTypes
					.map((r) => ({
						id: r.id,
						codigo: r.codigo,
						descripcion: r.valor,
					}))
					.sort((a, b) => a.descripcion.toUpperCase().localeCompare(b.descripcion.toUpperCase()));

				// forkJoin([this.solicitudes.getSolicitudes(), this.solicitudes.getDetalleSolicitud(), this.solicitudes.getConteo()])
				// 	.pipe(
				// 		map(([solicitudes, detallesSolicitud, conteo]) => {
				// 			this.solicitudesCompletadas = conteo.totalesCompletadasType;
				// 			this.solicitudesPendientes = conteo.totalesPendientesType;

				// 			this.solicitudesTipo = conteo.listadoSolicitudes.map(data => ({
				// 				...data,
				// 				idSolicitud: data.id_solicitud
				// 			}));

				// 			// Combinar las solicitudes y los detalles de la solicitud
				// 			return solicitudes.solicitudType
				// 				.map((solicitud) => {
				// 					const detalles = detallesSolicitud.detalleSolicitudType.find((detalle) => detalle.idSolicitud === solicitud.idSolicitud);
				// 					solicitud.fechaCreacion = new DatePipe('en-CO').transform(solicitud.fechaCreacion, 'dd/MM/yyyy HH:mm:ss');
				// 					solicitud.fechaActualizacion = new DatePipe('en-CO').transform(solicitud.fechaActualizacion, 'dd/MM/yyyy HH:mm:ss');

				// 					return {
				// 						...solicitud,
				// 						...detalles
				// 					};
				// 				})
				// 				.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
				// 		})
				// 	)
				// 	.subscribe((data) => {
				// 		this.dataTable = data.map((itemSolicitud) => {
				// 			const descripcionEstado = this.data_estado.find((itemEstado) => itemEstado.codigo == itemSolicitud.estadoSolicitud);

				// 			return {
				// 				...itemSolicitud,
				// 				estado: descripcionEstado !== undefined ? descripcionEstado.descripcion : "N/A",
				// 			};
				// 		});

				// 		this.utilService.closeLoadingSpinner();
				// 	});

				this.utilService.closeLoadingSpinner();
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

	private getComentarios() {
		this.comentarioSalidaJefeService.obtenerComentarios(this.detalleSolicitudPrintRG.idSolicitud).subscribe({
			next: ({ comentarios }) => {
				comentarios.forEach(comentario => {
					if (comentario.tipo_Solicitud === "Comentario_Salida_Jefe") {
						this.comentariosJefeInmediatoPrint = comentario;
					} if (comentario.tipo_Solicitud === "Comentario_Jefe_Solicitante") {
						this.Comentario_Jefe_SolicitantePrint = comentario;
					} if (comentario.tipo_Solicitud === "Comentario_RRHH") {
						this.comentariosRRHHPrint = comentario;
					}
				});
			}
		});
	}

	// private filterDataComentarios(idInstancia: string, taskKey: string, name: string) {
	// 	return this.dataComentariosAprobacionesPrintPorPosicion.filter(item =>
	// 		(idInstancia ? item.rootProcInstId === idInstancia : true) && //Id de instancia
	// 		(taskKey ? item.procDefKey === taskKey : true) &&
	// 		(name ? item.name === name : true)
	// 	);
	// }

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
				}));
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

	onSelect6(data: any): void {
		console.log("Item clicked", JSON.parse(JSON.stringify(data)));
	}

	onActivate6(data: any): void {
		console.log("Activate", JSON.parse(JSON.stringify(data)));
	}

	onDeactivate6(data: any): void {
		console.log("Deactivate", JSON.parse(JSON.stringify(data)));
	}

	private exportarBitacoraSeleccion(formato: FormatoUtilReporte) {
		this.utilService.openLoadingSpinner("Obteniendo documento...");

		const headerTitles = ["Compañía", "Unidad de Negocio", "Localidad", "Nombre del jefe solicitante", "Área/Departamento", "Cargo requerido", "Nivel de dirección", "Tipo de requerimiento", "Estatus del proceso", "Fuente de reclutamiento", "Número de solicitud", "Fecha de aprobación de solicitud", "Fecha de cierre del proceso/Finalización del proceso", "Fecha de ingreso del nuevo colaborador", "Número de días de requisición en proceso (Workflow)", "Número de días de requisición hasta el ingreso del colaborador", "Etapa actual del proceso", "Apellidos y nombres del ocupante anterior"];

		const solicitudesData: any = structuredClone(this.dataTable);

		const ids: string = solicitudesData
			.map(({ idSolicitud }) => idSolicitud)
			.join("_");

		this.seleccionCandidatoService.getCandidatoByIds(ids).subscribe({
			next: (response: any) => {
				const detalleSolicitudes = response.seleccionCandidatoType;

				const lookup = detalleSolicitudes.reduce((acc, item) => {
					// acc[item.iD_SOLICITUD_PROCESO === "" ? item.iD_SOLICITUD : item.iD_SOLICITUD_PROCESO] = item;
					acc[item.iD_SOLICITUD] = item;

					return acc;
				}, {});
				console.log(lookup);

				const combined = solicitudesData.map(item => ({
					solicitud: item,
					detalle: lookup[item.idSolicitud]
				}));

				this.mantenimientoService.getCatalogo("RBPTF").subscribe({
					next: (response) => {
						const fuentesExterna = response.itemCatalogoTypes.map(({ codigo, valor }) => ({
							codigo,
							valor
						}));

						const bodyReport = combined.map(({ solicitud, detalle }) => ([
							solicitud.compania === null || solicitud.compania === undefined || solicitud.compania === "" ? "-" : solicitud.compania,
							solicitud.unidadNegocio === null || solicitud.unidadNegocio === undefined || solicitud.unidadNegocio === "" ? "-" : solicitud.unidadNegocio,
							solicitud.localidad === null || solicitud.localidad === undefined || solicitud.localidad === "" ? "-" : solicitud.localidad,
							solicitud.nombreJefeSolicitante === null || solicitud.nombreJefeSolicitante === undefined || solicitud.nombreJefeSolicitante === "" ? "-" : solicitud.nombreJefeSolicitante,
							solicitud.areaDepartamento === null || solicitud.areaDepartamento === undefined || solicitud.areaDepartamento === "" ? "-" : solicitud.areaDepartamento,
							solicitud.descripcionPosicion === null || solicitud.descripcionPosicion === undefined || solicitud.descripcionPosicion === "" ? "-" : solicitud.descripcionPosicion,
							solicitud.nivelDireccion === null || solicitud.nivelDireccion === undefined || solicitud.nivelDireccion === "" ? "-" : solicitud.nivelDireccion,
							solicitud.tipoMotivo === null || solicitud.tipoMotivo === undefined || solicitud.tipoMotivo === "" ? "-" : solicitud.tipoMotivo,
							solicitud.estado === null || solicitud.estado === undefined || solicitud.estado === "" ? "-" : solicitud.estado,
							detalle === undefined ? "-" : (detalle.fuenteExterna === null || detalle.fuenteExterna === undefined || detalle.fuenteExterna === "" ? "-" : fuentesExterna.find(fuenteExterna => fuenteExterna.codigo === detalle.fuenteExterna).valor),
							solicitud.idSolicitud,
							solicitud.fechaActualizacion === null || solicitud.fechaActualizacion === undefined || solicitud.fechaActualizacion === "" ? "-" : solicitud.fechaActualizacion,
							solicitud.fechaSalida === null || solicitud.fechaSalida === undefined || solicitud.fechaSalida === "" ? "-" : format(new Date(solicitud.fechaSalida), "dd/MM/yyyy HH:mm:ss"),
							solicitud.fechaIngreso === null || solicitud.fechaIngreso === undefined || solicitud.fechaIngreso === "" ? "-" : format(new Date(solicitud.fechaIngreso), "dd/MM/yyyy HH:mm:ss"),
							detalle === undefined ? "-" : (detalle.finProcesoContratacion === null || detalle.finProcesoContratacion === undefined || detalle.finProcesoContratacion === "" ? "-" : differenceInDays(new Date(detalle.finProcesoContratacion), new Date(parse(solicitud.fechaCreacion, "dd/MM/yyyy HH:mm:ss", new Date()))).toString()),
							detalle === undefined ? "-" : (detalle.finProcesoContratacion === null || detalle.finProcesoContratacion === undefined || detalle.finProcesoContratacion === "" ? "-" : differenceInDays(new Date(detalle.finProcesoContratacion), new Date(parse(solicitud.fechaCreacion, "dd/MM/yyyy HH:mm:ss", new Date()))).toString()),
							solicitud.estado === null || solicitud.estado === undefined || solicitud.estado === "" ? "-" : solicitud.estado,
							"No sé"
						]));

						this.utilService.generateReport(formato, "RPTWF-BS", "BS", headerTitles, bodyReport);
					}
				});
			},
			error: (err) => {
				this.utilService.modalResponse(err.message, "error");
			}
		});
	}

	private async exportarSeleccionPorSolicitud(formato: FormatoUtilReporte) {
		const { isConfirmed } = await Swal.fire({
			text: "Este tipo de reporte solo permite solicitudes de Requisición de Personal, las solicitudes de otro tipo no se agregarán al reporte. ¿Desea continuar?",
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

		this.utilService.openLoadingSpinner("Obteniendo documento...");

		const headerTitles = ["N° Solicitud", "Compañía", "Unidad de Negocio", "Motivo", "Estado", "Actualización del Perfil", "Búsqueda de Candidatos", "Entrevista", "Pruebas", "Referencias", "Elaboración de Informe", "Entrega al Jefe Solicitante el Informe de Selección", "Entrevista por parte de Jefaturas", "Toma de decisiones por parte de Jefaturas", "Candidato Seleccionado", "Proceso de Contratación", "Fin del Proceso de Selección y Proceso de Contratación", "Inicio de Proceso de Reingreso", "Fin de Proceso de Reingreso", "Inicio de Proceso de Contratación de Familiares", "Fin de Proceso de Contratación de Familiares"];

		const solicitudesData: any[] = structuredClone(this.dataTable).filter(({ idSolicitud }) => idSolicitud.toString().toUpperCase().includes("RP"));

		if (solicitudesData.length === 0) {
			this.utilService.modalResponse("La tabla no contiene ningún registro de Requisicón de Personal para generar el reporte.", "error");

			return;
		}

		const ids: string = solicitudesData
			.map(({ idSolicitud }) => idSolicitud)
			.join("_");

		this.seleccionCandidatoService.getCandidatoByIds(ids).subscribe({
			next: (response: any) => {
				const detalleSolicitudes = response.seleccionCandidatoType;

				const lookup = detalleSolicitudes.reduce((acc, item) => {
					acc[item.iD_SOLICITUD] = item;

					return acc;
				}, {});

				// Combinar usando el objeto de referencia
				const combined = solicitudesData.map(item => ({
					solicitud: item,
					detalle: lookup[item.idSolicitud]
				}));
				console.log(combined);

				const bodyReport = [];

				combined.forEach(({ solicitud, detalle }) => {
					if (solicitud.idSolicitud.toUpperCase().includes("RP")) {
						bodyReport.push([
							solicitud.idSolicitud,
							solicitud.compania === null || solicitud.compania === undefined || solicitud.compania === "" ? "-" : solicitud.compania,
							solicitud.unidadNegocio === null || solicitud.unidadNegocio === undefined || solicitud.unidadNegocio === "" ? "-" : solicitud.unidadNegocio,
							solicitud.tipoMotivo === null || solicitud.tipoMotivo === undefined || solicitud.tipoMotivo === "" ? "-" : solicitud.tipoMotivo,
							solicitud.estado === null || solicitud.estado === undefined || solicitud.estado === "" ? "-" : solicitud.estado,
							detalle === undefined ? "-" : (detalle.actualizacionDelPerfil === null || detalle.actualizacionDelPerfil === undefined || detalle.actualizacionDelPerfil === "" ? "-" : format(new Date(detalle.actualizacionDelPerfil), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.busquedaDeCandidatos === null || detalle.busquedaDeCandidatos === undefined || detalle.busquedaDeCandidatos === "" ? "-" : format(new Date(detalle.busquedaDeCandidatos), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.entrevista === null || detalle.entrevista === undefined || detalle.entrevista === "" ? "-" : format(new Date(detalle.entrevista), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.pruebas === null || detalle.pruebas === undefined || detalle.pruebas === "" ? "-" : format(new Date(detalle.pruebas), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.referencias === null || detalle.referencias === undefined || detalle.referencias === "" ? "-" : format(new Date(detalle.referencias), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.elaboracionDeInforme === null || detalle.elaboracionDeInforme === undefined || detalle.elaboracionDeInforme === "" ? "-" : format(new Date(detalle.elaboracionDeInforme), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.entregaAlJefeSol === null || detalle.entregaAlJefeSol === undefined || detalle.entregaAlJefeSol === "" ? "-" : format(new Date(detalle.entregaAlJefeSol), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.entrevistaPorJefatura === null || detalle.entrevistaPorJefatura === undefined || detalle.entrevistaPorJefatura === "" ? "-" : format(new Date(detalle.entrevistaPorJefatura), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.tomaDeDesiciones === null || detalle.tomaDeDesiciones === undefined || detalle.tomaDeDesiciones === "" ? "-" : format(new Date(detalle.tomaDeDesiciones), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.candidato === null || detalle.candidato === undefined || detalle.candidato === "" ? "-" : detalle.candidato),
							detalle === undefined ? "-" : (detalle.procesoDeContratacion === null || detalle.procesoDeContratacion === undefined || detalle.procesoDeContratacion === "" ? "-" : format(new Date(detalle.procesoDeContratacion), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : detalle.finProcesoContratacion === null || detalle.finProcesoContratacion === undefined || detalle.finProcesoContratacion === "" ? "-" : format(new Date(detalle.finProcesoContratacion), "dd/MM/yyyy HH:mm:ss"),
							detalle === undefined ? "-" : (detalle.fechaInicioReingreso === null || detalle.fechaInicioReingreso === undefined || detalle.fechaInicioReingreso === "" ? "-" : format(new Date(detalle.fechaInicioReingreso), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.fechaInicioReingreso === null || detalle.fechaInicioReingreso === undefined || detalle.fechaInicioReingreso === "" ? "-" : (detalle.fechaFinReingreso === null || detalle.fechaFinReingreso === undefined || detalle.fechaFinReingreso === "" ? "-" : format(new Date(detalle.fechaFinReingreso), "dd/MM/yyyy HH:mm:ss"))),
							detalle === undefined ? "-" : (detalle.fechaInicioContratacionFamiliares === null || detalle.fechaInicioContratacionFamiliares === undefined || detalle.fechaInicioContratacionFamiliares === "" ? "-" : format(new Date(detalle.fechaInicioContratacionFamiliares), "dd/MM/yyyy HH:mm:ss")),
							detalle === undefined ? "-" : (detalle.fechaInicioContratacionFamiliares === null || detalle.fechaInicioContratacionFamiliares === undefined || detalle.fechaInicioContratacionFamiliares === "" ? "-" : (detalle.fechaFinContratacionFamiliares === null || detalle.fechaFinContratacionFamiliares === undefined || detalle.fechaFinContratacionFamiliares === "" ? "-" : format(new Date(detalle.fechaFinContratacionFamiliares), "dd/MM/yyyy HH:mm:ss")))
						]);
					}
				});

				this.utilService.generateReport(formato, "RPTWF-TM", "RP", headerTitles, bodyReport);
			},
			error: (err) => {
				this.utilService.modalResponse(err, "error");
			}
		});
	}

	private exportarAprobacionSolicitudesPorResponsable(formato: FormatoUtilReporte) {
		this.utilService.openLoadingSpinner("Obteniendo documento...");

		const headerTitles = ["N° Solicitud", "Compañía", "Tipo de Solicitud", "Motivo", "Fecha de Creación", "1er Nivel de Aprobación", "Fecha de Aprobación", "2do Nivel de Aprobación", "Fecha de Aprobación", "3er Nivel de Aprobación", "Fecha de Aprobación", "4to Nivel de Aprobación", "Fecha de Aprobación", "Gerente de RR.HH. Corporativo", "Feca de Aprobación", "Comité de Remuneraciones", "Fecha de Aprobación"];

		const solicitudesData: any = structuredClone(this.dataTable);

		const ids: string = solicitudesData
			.map(({ idSolicitud }) => idSolicitud)
			.join("_");

		// this.seleccionCandidatoService.getCandidato().subscribe({
		// forkJoin(solicitudesData.map(({ idSolicitud }) => this.solicitudes.getDetalleAprobadoresSolicitudesById(idSolicitud))).subscribe({
			this.solicitudes.getDetalleAprobadoresSolicitudesByIds(ids).subscribe({
			next: (response: any) => {
				const idsArray = ids.split("_");

				const detalleSolicitudes = idsArray.map(id => ({
					iD_SOLICITUD: response.solicitudesFiltradas[id][0].id_Solicitud,
					detalleAprobadorSolicitud: response.solicitudesFiltradas[id].filter(({ ruta }) => ruta.toUpperCase().includes("PRIMER") || ruta.toUpperCase().includes("SEGUND") || ruta.toUpperCase().includes("TERCER") || ruta.toUpperCase().includes("CUART") || ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.") || ruta.toUpperCase().includes("REMUNERA"))
				}));

				const lookup = detalleSolicitudes.reduce((acc, item) => {
					acc[item.iD_SOLICITUD] = item;

					return acc;
				}, {});

				// Combinar usando el objeto de referencia
				const combined = solicitudesData.map(item => ({
					solicitud: item,
					detalle: lookup[item.idSolicitud]
				}));

				const bodyReport = combined.map(({ solicitud, detalle }) => ([
					solicitud.idSolicitud,
					solicitud.compania === null || solicitud.compania === undefined || solicitud.compania === "" ? "-" : solicitud.compania,
					solicitud.tipoSolicitud,
					solicitud.tipoMotivo === null || solicitud.tipoMotivo === undefined || solicitud.tipoMotivo === "" ? "-" : solicitud.tipoMotivo,
					solicitud.fechaCreacion === null || solicitud.fechaCreacion === undefined || solicitud.fechaCreacion === "" ? "-" : solicitud.fechaCreacion,
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("PRIMER") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[0].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("PRIMER") && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[0].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("SEGUND") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[1].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("SEGUND") && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[1].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("TERCER") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[2].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("TERCER") && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[2].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("CUART") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[3].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("CUART") && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[3].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => (ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.")) && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[4].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => (ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.")) && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[4].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("REMUNERA") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[5].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("REMUNERA") && usuarioAprobador !== "") ? format(new Date(detalle.detalleAprobadorSolicitud[5].fechaCreacion), "dd/MM/yyyy HH:mm:ss") : "-",
				]));

				this.utilService.generateReport(formato, "RPTWF-TM", "RP", headerTitles, bodyReport);
			},
			error: (err) => {
				this.utilService.modalResponse(err, "error");
			}
		});
	}
}
