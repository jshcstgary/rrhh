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
import { format } from "date-fns";
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
				text: "Mínimo debe seleccionar un Tipo de Solicitud o Ingresar el Nº de Solicitud",
				icon: "warning",
				confirmButtonColor: "#0056B3",
				confirmButtonText: "Sí",
			});

			return;
		}

		const data = structuredClone(this.dataFilterSolicitudes);

		if (this.dataFilterSolicitudes.fechaDesde !== undefined && this.dataFilterSolicitudes.fechaDesde !== null) {
			console.log(this.dataFilterSolicitudes);
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
							return solicitudes.solicitudType
								.map((solicitud) => {
									const detalles = detallesSolicitud.detalleSolicitudType.find((detalle) => detalle.idSolicitud === solicitud.idSolicitud);
									solicitud.fechaCreacion = new DatePipe('en-CO').transform(solicitud.fechaCreacion, 'dd/MM/yyyy HH:mm:ss');
									solicitud.fechaActualizacion = new DatePipe('en-CO').transform(solicitud.fechaActualizacion, 'dd/MM/yyyy HH:mm:ss');

									return {
										...solicitud,
										...detalles
									};
								})
								.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
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
		if (tooltip === "Formulario") {
			this.printForm(id_edit);
		} else if (tooltip === "Info") {
			this.router.navigate(["/solicitudes/detalle-solicitud", id_edit]);
		} else {
			this.router.navigate(["/solicitudes/trazabilidad", id_edit]);
		}
	}

	private printForm(idPrint: string) {
		this.utilService.openLoadingSpinner("Generando reporte...");

		if (!idPrint.toUpperCase().includes("AP") && !idPrint.toUpperCase().includes("DP")) {
			this.getCandidatoValues(idPrint);
		} else {
			this.getSolicitudById(idPrint);
		}
	}

	private getSolicitudById(idPrint: any) {
		return this.solicitudes.getSolicitudById(idPrint).subscribe({
			next: (response: any) => {
				this.solicitud = response;

				if (this.solicitud.tipoAccion.toUpperCase().includes("ASIGNA")) {
					this.muestraRemuneracion = true;
				}

				// this.mostrarRequisicion = this.solicitud.idSolicitud.includes("RP-");
				// this.mostrarFormularioFamiliares = this.solicitud.idSolicitud.includes("CF-");
				// this.mostrarFormularioReingreso = this.solicitud.idSolicitud.includes("RG-");
				// this.mostrarAccionPersonal = this.solicitud.idSolicitud.includes("AP-");
				// this.loadingComplete += 2;

				this.getDetalleSolicitudById(idPrint);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	private getDetalleSolicitudById(idPrint: any) {
		return this.solicitudes.getDetalleSolicitudById(idPrint).subscribe({
			next: (response: any) => {
				if (idPrint.toUpperCase().includes("AP")) {
					this.viewInputs = !(response.detalleSolicitudType[0].codigo === "100");

					const detalleActual = response.detalleSolicitudType.find(detalle => detalle.idDetalleSolicitud === 1);

					this.modelPrint.codigoPosicion = detalleActual.codigoPosicion;
					this.modelPrint.descrPosicion = detalleActual.descripcionPosicion;
					this.modelPrint.subledger = detalleActual.subledger;
					this.modelPrint.nombreCompleto = detalleActual.nombreEmpleado;
					this.modelPrint.compania = detalleActual.compania;
					this.modelPrint.unidadNegocio = detalleActual.unidadNegocio;
					this.modelPrint.departamento = detalleActual.departamento;
					this.modelPrint.nombreCargo = detalleActual.cargo;
					this.modelPrint.localidad = detalleActual.localidad;
					this.modelPrint.nivelDir = detalleActual.nivelDireccion;
					this.modelPrint.nomCCosto = detalleActual.centroCosto;
					this.modelPrint.misionCargo = detalleActual.misionCargo;
					this.modelPrint.justificacionCargo = detalleActual.justificacion;
					this.modelPrint.reportaA = detalleActual.reportaA;
					this.modelPrint.supervisaA = detalleActual.supervisaA;
					this.modelPrint.tipoContrato = detalleActual.tipoContrato;
					this.modelPrint.nivelRepa = detalleActual.nivelReporteA;
					this.modelPrint.sueldo = detalleActual.sueldo;
					this.modelPrint.sueldoMensual = detalleActual.sueldoVariableMensual;
					this.modelPrint.sueldoTrimestral = detalleActual.sueldoVariableTrimestral;
					this.modelPrint.sueldoSemestral = detalleActual.sueldoVariableSemestral;
					this.modelPrint.sueldoAnual = detalleActual.sueldoVariableAnual;
					this.modelPrint.correo = detalleActual.correo;
					this.modelPrint.fechaIngreso = detalleActual.fechaIngreso;
					this.modelPrint.sucursal = detalleActual.sucursal;
					this.modelPrint.fechaIngreso = detalleActual.fechaIngreso;
					this.modelPrint.grupoPago = detalleActual.grupoDePago;
					this.modelPrint.descrPuesto = detalleActual.descripcionPosicion;

					if (response.totalRegistros === 2) {
						const detallePropuestos = response.detalleSolicitudType.find(detalle => detalle.idDetalleSolicitud === 2);

						this.modelPrintPropuestos.codigoPosicion = detallePropuestos.codigoPosicion;
						this.modelPrintPropuestos.descrPosicion = detallePropuestos.descripcionPosicion;
						this.modelPrintPropuestos.subledger = detallePropuestos.subledger;
						this.modelPrintPropuestos.nombreCompleto = detallePropuestos.nombreEmpleado;
						this.modelPrintPropuestos.compania = detallePropuestos.compania;
						this.modelPrintPropuestos.unidadNegocio = detallePropuestos.unidadNegocio;
						this.modelPrintPropuestos.departamento = detallePropuestos.departamento;
						this.modelPrintPropuestos.nombreCargo = detallePropuestos.cargo;
						this.modelPrintPropuestos.localidad = detallePropuestos.localidad;
						this.modelPrintPropuestos.nivelDir = detallePropuestos.nivelDireccion;
						this.modelPrintPropuestos.nomCCosto = detallePropuestos.centroCosto;
						this.modelPrintPropuestos.misionCargo = detallePropuestos.misionCargo;
						this.modelPrintPropuestos.justificacionCargo = detallePropuestos.justificacion;
						this.modelPrintPropuestos.reportaA = detallePropuestos.reportaA;
						this.modelPrintPropuestos.supervisaA = detallePropuestos.supervisaA;
						this.modelPrintPropuestos.tipoContrato = detallePropuestos.tipoContrato;
						this.modelPrintPropuestos.nivelRepa = detallePropuestos.nivelReporteA;
						this.modelPrintPropuestos.sueldo = detallePropuestos.sueldo;
						this.modelPrintPropuestos.sueldoMensual = detallePropuestos.sueldoVariableMensual;
						this.modelPrintPropuestos.sueldoTrimestral = detallePropuestos.sueldoVariableTrimestral;
						this.modelPrintPropuestos.sueldoSemestral = detallePropuestos.sueldoVariableSemestral;
						this.modelPrintPropuestos.sueldoAnual = detallePropuestos.sueldoVariableAnual;
						this.modelPrintPropuestos.correo = detallePropuestos.correo;
						this.modelPrintPropuestos.fechaIngreso = detallePropuestos.fechaIngreso;
						this.modelPrintPropuestos.sucursal = detallePropuestos.sucursal;
						this.modelPrintPropuestos.fechaIngreso = detallePropuestos.fechaIngreso;
						this.modelPrintPropuestos.grupoPago = detallePropuestos.grupoDePago;
						this.modelPrintPropuestos.descrPuesto = detallePropuestos.descripcionPosicion;
						this.detalleSolicitudPrintPropuestos.movilizacion = detallePropuestos.movilizacion;
						this.detalleSolicitudPrintPropuestos.alimentacion = detallePropuestos.alimentacion;
					}
				}
				else {
					this.detalleSolicitudPrint = response.detalleSolicitudType[0];
					this.detalleSolicitudPrintRG = response.detalleSolicitudType[0];

					if (!(idPrint.toUpperCase().includes("RG")) && this.detalleSolicitudPrint.codigoPosicion.length > 0) {
						this.modelPrint.codigoPosicion = this.detalleSolicitudPrint.codigoPosicion;
						this.modelPrint.descrPosicion = this.detalleSolicitudPrint.descripcionPosicion;
						this.modelPrint.subledger = this.detalleSolicitudPrint.subledger;
						this.modelPrint.nombreCompleto = this.detalleSolicitudPrint.nombreEmpleado;
						this.detalleSolicitudPrint.nombreJefeSolicitante = this.detalleSolicitudPrint.nombreJefeSolicitante;
						this.modelPrint.compania = this.detalleSolicitudPrint.compania;
						this.modelPrint.unidadNegocio = this.detalleSolicitudPrint.unidadNegocio;
						this.modelPrint.departamento = this.detalleSolicitudPrint.departamento;
						this.modelPrint.nombreCargo = this.detalleSolicitudPrint.cargo;
						this.modelPrint.localidad = this.detalleSolicitudPrint.localidad;
						this.modelPrint.nivelDir = this.detalleSolicitudPrint.nivelDireccion;
						this.modelPrint.nomCCosto = this.detalleSolicitudPrint.centroCosto;
						this.modelPrint.misionCargo = this.detalleSolicitudPrint.misionCargo;
						this.modelPrint.justificacionCargo = this.detalleSolicitudPrint.justificacion;
						this.modelPrint.reportaA = this.detalleSolicitudPrint.reportaA;
						this.modelPrint.supervisaA = this.detalleSolicitudPrint.supervisaA;
						this.modelPrint.tipoContrato = this.detalleSolicitudPrint.tipoContrato;
						this.modelPrint.nivelRepa = this.detalleSolicitudPrint.nivelReporteA;
						this.modelPrint.sueldo = this.detalleSolicitudPrint.sueldo;
						this.modelPrint.sueldoMensual = this.detalleSolicitudPrint.sueldoVariableMensual;
						this.modelPrint.sueldoTrimestral = this.detalleSolicitudPrint.sueldoVariableTrimestral;
						this.modelPrint.sueldoSemestral = this.detalleSolicitudPrint.sueldoVariableSemestral;
						this.modelPrint.sueldoAnual = this.detalleSolicitudPrint.sueldoVariableAnual
						this.modelPrint.correo = this.detalleSolicitudPrint.correo;
						this.modelPrint.fechaIngreso = this.detalleSolicitudPrint.fechaIngreso;
						this.modelPrintRemuneracion = Number(this.modelPrint.sueldoAnual) / 12 + Number(this.modelPrint.sueldoSemestral) / 6 + Number(this.modelPrint.sueldoTrimestral) / 3 + Number(this.modelPrint.sueldoMensual);
					} else if (idPrint.toUpperCase().includes("RG")) {
						if (this.detalleSolicitudPrintRG.codigoPosicion.length > 0) {
							this.modelPrintRG.codigoPosicion = this.detalleSolicitudPrintRG.codigoPosicion;
							this.modelPrintRG.puestoJefeInmediato = this.detalleSolicitudPrintRG.puestoJefeInmediato;
							this.modelPrintRG.jefeInmediatoSuperior = this.detalleSolicitudPrintRG.jefeInmediatoSuperior;
							this.modelPrintRG.descrPosicion = this.detalleSolicitudPrintRG.descripcionPosicion;
							this.modelPrintRG.subledger = this.detalleSolicitudPrintRG.subledger;
							this.modelPrintRG.nombreCompleto = this.detalleSolicitudPrintRG.nombreEmpleado;
							this.modelPrintRG.compania = this.detalleSolicitudPrintRG.compania;
							this.modelPrintRG.unidadNegocio = this.detalleSolicitudPrintRG.unidadNegocio;
							this.modelPrintRG.departamento = this.detalleSolicitudPrintRG.departamento;
							this.modelPrintRG.nombreCargo = this.detalleSolicitudPrintRG.cargo;
							this.modelPrintRG.localidad = this.detalleSolicitudPrintRG.localidad;
							this.modelPrintRG.nivelDir = this.detalleSolicitudPrintRG.nivelDireccion;
							this.modelPrintRG.nomCCosto = this.detalleSolicitudPrintRG.centroCosto;
							this.modelPrintRG.misionCargo = this.detalleSolicitudPrintRG.misionCargo;
							this.modelPrintRG.justificacionCargo = this.detalleSolicitudPrintRG.justificacion;
							this.modelPrintRG.reportaA = this.detalleSolicitudPrintRG.reportaA;
							this.modelPrintRG.supervisaA = this.detalleSolicitudPrintRG.supervisaA;
							this.modelPrintRG.tipoContrato = this.detalleSolicitudPrintRG.tipoContrato;
							this.modelPrintRG.nivelRepa = this.detalleSolicitudPrintRG.nivelReporteA;
							this.modelPrintRG.sueldo = this.detalleSolicitudPrintRG.sueldo;
							this.modelPrintRG.sueldoMensual = this.detalleSolicitudPrintRG.sueldoVariableMensual;
							this.modelPrintRG.sueldoTrimestral = this.detalleSolicitudPrintRG.sueldoVariableTrimestral;
							this.modelPrintRG.sueldoSemestral = this.detalleSolicitudPrintRG.sueldoVariableSemestral;
							this.modelPrintRG.sueldoAnual = this.detalleSolicitudPrintRG.sueldoVariableAnual;
							this.modelPrintRG.correo = this.detalleSolicitudPrintRG.correo;
							// this.modelPrintRG.correo = this.detalleSolicitudPrintRG.correo;
							this.causaSalidaPrint = this.detalleSolicitudPrintRG.causaSalida;
							this.modelPrintRG.fechaIngreso = (this.detalleSolicitudPrintRG.fechaIngreso as string).split("T")[0];
							this.remuneracionPrint = Number(this.modelPrintRG.sueldoAnual) / 12 + Number(this.modelPrintRG.sueldoSemestral) / 6 + Number(this.modelPrintRG.sueldoTrimestral) / 3 + Number(this.modelPrintRG.sueldoMensual);

							this.keySelectedPrint = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.modelPrint.nivelDir;
							this.getComentarios();
						}
					}
				}

				this.mostrarTipoJustificacionYMisionPrint = this.restrictionsIdsPrint.includes(this.solicitud.idTipoMotivo);

				this.mostrarSubledgerPrint = this.restrictionsSubledgerIdsPrint.includes(this.solicitud.idTipoMotivo);

				this.keySelectedPrint = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.modelPrint.nivelDir}`;

				if (!this.dataAprobacionesPorPosicionPrint[this.keySelectedPrint]) {
					this.getNivelesAprobacion(idPrint);
					// this.obtenerComentariosAtencionPorInstanciaRaiz();
					// } else {
					// 	this.exportar();
				}

				// this.mantenimientoService.getCatalogo("RBPTF").subscribe({
				// 	next: (response) => {
				// 		this.optionPrint = response.itemCatalogoTypes.find(({ codigo }) => codigo === this.selectedOptionPrint);
				// 	}
				// });

				// this.exportar();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	private getNivelesAprobacion(idPrint: string) {
		if (this.solicitud !== null) {
			this.solicitudes.obtenerNivelesAprobacionRegistrados(idPrint).subscribe({
				next: (response) => {
					this.dataAprobacionesPorPosicionPrint = {
						[this.keySelectedPrint]: response.nivelAprobacionPosicionType
					}

					this.obtenerComentariosAtencionPorInstanciaRaiz(idPrint);
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
				},
			});
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

	private obtenerComentariosAtencionPorInstanciaRaiz(idPrint) {
		return this.solicitudes.obtenerComentariosAtencionPorInstanciaRaiz(`${this.solicitud.idInstancia}COMENT`).subscribe({
			next: (response) => {
				this.dataComentariosAprobacionesPrint.length = 0;
				this.dataComentariosAprobacionesPrintPorPosicion = response.variableType;
				this.dataComentariosAprobacionesPrint = this.filterDataComentarios(this.solicitud.idInstancia, 'RevisionSolicitud', 'comentariosAtencion');
				this.dataComentariosAprobacionesPrintRRHH = this.filterDataComentarios(this.solicitud.idInstancia, 'RequisicionPersonal', 'comentariosAtencionGerenteRRHH');
				this.dataComentariosAprobacionesPrintCREM = this.filterDataComentarios(this.solicitud.idInstancia, 'RequisicionPersonal', 'comentariosAtencionRemuneraciones');

				this.mantenimientoService.getCatalogo("RBPTF").subscribe({
					next: (response) => {
						this.optionPrint = response.itemCatalogoTypes.find(({ codigo }) => codigo === this.selectedOptionPrint);

						this.obtenerServicioFamiliaresCandidatos(idPrint);
					}
				});
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse("No existe comentarios de aprobadores", "error");
			},
		});
	}

	private filterDataComentarios(idInstancia: string, taskKey: string, name: string) {
		return this.dataComentariosAprobacionesPrintPorPosicion.filter(item =>
			(idInstancia ? item.rootProcInstId === idInstancia : true) && //Id de instancia
			(taskKey ? item.procDefKey === taskKey : true) &&
			(name ? item.name === name : true)
		);
	}

	getCandidatoValues(idPrint: string) {
		this.seleccionCandidatoService.getCandidatoById(idPrint).subscribe({
			next: (res) => {
				const candidatoValues = res.seleccionCandidatoType[0];
				this.nombreCompletoCandidatoPrint = res.seleccionCandidatoType[0].candidato;

				this.modelPrint.tipoProceso = candidatoValues.tipoProceso;
				this.selectedOptionPrint = candidatoValues.fuenteExterna;
				this.isCheckedPrint = candidatoValues.tipoFuente;
				this.idSolicitudRPPrint = res.seleccionCandidatoType[0].iD_SOLICITUD;

				this.fechasPrint.actualizacionPerfil = candidatoValues.actualizacionDelPerfil === null ? "" : format(new Date(candidatoValues.actualizacionDelPerfil), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.busquedaCandidatos = candidatoValues.busquedaDeCandidatos === null ? "" : format(new Date(candidatoValues.busquedaDeCandidatos), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.entrevista = candidatoValues.entrevista === null ? "" : format(new Date(candidatoValues.entrevista), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.pruebas = candidatoValues.pruebas === null ? "" : format(new Date(candidatoValues.pruebas), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.referencias = candidatoValues.referencias === null ? "" : format(new Date(candidatoValues.referencias), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.elaboracionInforme = candidatoValues.elaboracionDeInforme === null ? "" : format(new Date(candidatoValues.elaboracionDeInforme), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.entregaJefe = candidatoValues.entregaAlJefeSol === null ? "" : format(new Date(candidatoValues.entregaAlJefeSol), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.entrevistaJefatura = candidatoValues.entrevistaPorJefatura === null ? "" : format(new Date(candidatoValues.entrevistaPorJefatura), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.tomaDecisiones = candidatoValues.tomaDeDesiciones === null ? "" : format(new Date(candidatoValues.tomaDeDesiciones), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.candidatoSeleccionado = candidatoValues.candidatoSeleccionado === null ? "" : format(new Date(candidatoValues.candidatoSeleccionado), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.procesoContratacion = candidatoValues.procesoDeContratacion === null ? "" : format(new Date(candidatoValues.procesoDeContratacion), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.finProcesoContratacion = candidatoValues.finProcesoContratacion === null ? "" : format(new Date(candidatoValues.finProcesoContratacion), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.reingreso = candidatoValues.fechaInicioReingreso === null ? "" : format(new Date(candidatoValues.fechaInicioReingreso), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.finProceso = candidatoValues.fechaFinReingreso === null ? "" : format(new Date(candidatoValues.fechaFinReingreso), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.contratacionFamiliares = candidatoValues.fechaInicioContratacionFamiliares === null ? "" : format(new Date(candidatoValues.fechaInicioContratacionFamiliares), "yyyy-MM-dd HH:mm:ss");
				this.fechasPrint.finProcesoFamiliares = candidatoValues.fechaFinContratacionFamiliares === null ? "" : format(new Date(candidatoValues.fechaFinContratacionFamiliares), "yyyy-MM-dd HH:mm:ss");

				this.nombreCandidatoPrint = candidatoValues.candidato;

				if (idPrint.toUpperCase().includes("RG")) {
					this.getSolicitudById(this.idSolicitudRPPrint);
					this.getSolicitudById(idPrint);
				} else {
					this.getSolicitudById(idPrint);
				}
			},
			error: (err) => {
				this.getSolicitudById(idPrint);
			}
		});
	}

	obtenerServicioFamiliaresCandidatos(idPrint: string) {
		return this.mantenimientoService.getFamiliaresCandidatoBySolicitud(idPrint).subscribe({
			next: (response) => {
				const data = response?.familiaresCandidato || [];

				this.dataTableDatosFamiliaresPrint = data.filter((d) => d.idSolicitud === idPrint);

				this.dataTableDatosFamiliaresPrint = this.dataTableDatosFamiliaresPrint.map(dataFamiliar => {
					console.log(dataFamiliar.fechaCreacion);

					return {
						...dataFamiliar,
						fechaCreacion: format(new Date(dataFamiliar.fechaCreacion), "dd/MM/yyyy")
					};
				});

				this.exportar();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
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

		const headerTitles = ["Compañía", "Unidad de Negocio", "Localidad", "Nombre del jefe solicitante", "Àrea/Departamento", "Cargo requerido", "Nivel de dirección", "Tipo de requerimiento", "Estatus del proceso", "Fuente de reclutamiento", "Número de solicitud", "Fecha de aprobación de solicitud", "Fecha de cierre del proceso/Finalización del proceso", "Fecha de ingreso del nuevo colaborador", "Número de días de requisición en proceso (Workflow)", "Número de días de requisición hasta el ingreso del colaborador", "Etapa actual del proceso", "Apellidos y nombres del ocupante anterior"];

		const solicitudesData: any = structuredClone(this.dataTable);

		const ids: string = solicitudesData
			.map(({ idSolicitud }) => idSolicitud)
			.join("_");
		
		// this.seleccionCandidatoService.getCandidato().subscribe({
		forkJoin(solicitudesData.map(({ idSolicitud }) => this.seleccionCandidatoService.getCandidatoById(idSolicitud))).subscribe({
		// this.seleccionCandidatoService.getCandidatoById(ids).subscribe({
			next: (response: any[]) => {
				const detalleSolicitudes = response;

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
					solicitud.compania === null || solicitud.compania === undefined || solicitud.compania === "" ? "-" : solicitud.compania,
					solicitud.unidadNegocio === null || solicitud.unidadNegocio === undefined || solicitud.unidadNegocio === "" ? "-" : solicitud.unidadNegocio,
					solicitud.localidad === null || solicitud.localidad === undefined || solicitud.localidad === "" ? "-" : solicitud.localidad,
					solicitud.nombreJefeSolicitante === null || solicitud.nombreJefeSolicitante === undefined || solicitud.nombreJefeSolicitante === "" ? "-" : solicitud.nombreJefeSolicitante,
					solicitud.areaDepartamento === null || solicitud.areaDepartamento === undefined || solicitud.areaDepartamento === "" ? "-" : solicitud.areaDepartamento,
					solicitud.descripcionPosicion === null || solicitud.descripcionPosicion === undefined || solicitud.descripcionPosicion === "" ? "-" : solicitud.descripcionPosicion,
					solicitud.nivelDireccion === null || solicitud.nivelDireccion === undefined || solicitud.nivelDireccion === "" ? "-" : solicitud.nivelDireccion,
					solicitud.tipoMotivo === null || solicitud.tipoMotivo === undefined || solicitud.tipoMotivo === "" ? "-" : solicitud.tipoMotivo,
					solicitud.estado === null || solicitud.estado === undefined || solicitud.estado === "" ? "-" : solicitud.estado,
					detalle !== undefined ? (detalle.fuenteExterna === null || detalle.fuenteExterna === undefined || detalle.fuenteExterna === "" ? "-" : detalle.fuenteExterna) : "-",
					solicitud.idSolicitud,
					solicitud.fechaActualizacion === null || solicitud.fechaActualizacion === undefined || solicitud.fechaActualizacion === "" ? "-" : solicitud.fechaActualizacion,
					solicitud.fechaSalida === null || solicitud.fechaSalida === undefined || solicitud.fechaSalida === "" ? "-" : solicitud.fechaSalida,
					solicitud.fechaIngreso === null || solicitud.fechaIngreso === undefined || solicitud.fechaIngreso === "" ? "-" : solicitud.fechaIngreso,
					"No sé", // Número de días desde que se registró hasta cuando se completa (anulado, rechazado o aprobado), si todavía no está completado, va vacío
					"No sé", // Número de días desde que se registró hasta cuando se completa (anulado, rechazado o aprobado), si todavía no está completado, va vacío
					"No sé",
					"No sé"
				]));

				this.utilService.generateReport(formato, "RPTWF-TM", "RP", headerTitles, bodyReport);
			},
			error: (err) => {
				this.utilService.modalResponse(err.message, "error");
			}
		});
	}

	private exportarSeleccionPorSolicitud(formato: FormatoUtilReporte) {
		this.utilService.openLoadingSpinner("Obteniendo documento...");

		const headerTitles = ["N° Solicitud", "Compañía", "Unidad de Negocio", "Motivo", "Estado", "Actualización del Perfil", "Búsqueda de Candidatos", "Entrevista", "Pruebas", "Referencias", "Elaboración de Informe", "Entrega al Jefe Solicitante el Informe de Selección", "Entrevista por parte de Jefaturas", "Toma de decisiones por parte de Jefaturas", "Candidato Seleccionado", "Proceso de Contratación", "Fin del Proceso de Selección y Proceso de Contratación", "Inicio de Proceso de Reingreso", "Fin de Proceso de Reingreso", "Inicio de Proceso de Contratación de Familiares", "Fin de Proceso de Contratación de Familiares"];

		const solicitudesData: any = structuredClone(this.dataTable).filter(({ idSolicitud }) => idSolicitud.toString().toUpperCase().includes("RP"));

		const ids: string = solicitudesData
			.map(({ idSolicitud }) => idSolicitud)
			.join("_");

		// this.seleccionCandidatoService.getCandidato().subscribe({
		forkJoin(solicitudesData.map(({ idSolicitud }) => this.seleccionCandidatoService.getCandidatoById(idSolicitud))).subscribe({
		// this.seleccionCandidatoService.getCandidatoById(ids).subscribe({
			next: (response: any[]) => {
				// console.log(response);
				const detalleSolicitudes = response.map(({ seleccionCandidatoType }) => seleccionCandidatoType);
				// const detalleSolicitudes = response ?? [];

				const lookup = detalleSolicitudes.reduce((acc, item) => {
					acc[item.iD_SOLICITUD] = item;

					return acc;
				}, {});

				// Combinar usando el objeto de referencia
				const combined = solicitudesData.map(item => ({
					solicitud: item,
					detalle: lookup[item.idSolicitud]
				}));

				const bodyReport = [];

				combined.forEach(({ solicitud, detalle }) => {
					if (solicitud.idSolicitud.toUpperCase().includes("RP")) {
						bodyReport.push([
							solicitud.idSolicitud,
							solicitud.compania === null || solicitud.compania === undefined || solicitud.compania === "" ? "-" : solicitud.compania,
							solicitud.unidadNegocio === null || solicitud.unidadNegocio === undefined || solicitud.unidadNegocio === "" ? "-" : solicitud.unidadNegocio,
							solicitud.tipoMotivo === null || solicitud.tipoMotivo === undefined || solicitud.tipoMotivo === "" ? "-" : solicitud.tipoMotivo,
							"No sé",
							detalle !== undefined ? (detalle.actualizacionDelPerfil === null || detalle.actualizacionDelPerfil === undefined || detalle.actualizacionDelPerfil === "" ? "-" : format(new Date(detalle.actualizacionDelPerfil), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.busquedaDeCandidatos === null || detalle.busquedaDeCandidatos === undefined || detalle.busquedaDeCandidatos === "" ? "-" : format(new Date(detalle.busquedaDeCandidatos), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.entrevista === null || detalle.entrevista === undefined || detalle.entrevista === "" ? "-" : format(new Date(detalle.entrevista), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.pruebas === null || detalle.pruebas === undefined || detalle.pruebas === "" ? "-" : format(new Date(detalle.pruebas), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.referencias === null || detalle.referencias === undefined || detalle.referencias === "" ? "-" : format(new Date(detalle.referencias), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.elaboracionDeInforme === null || detalle.elaboracionDeInforme === undefined || detalle.elaboracionDeInforme === "" ? "-" : format(new Date(detalle.elaboracionDeInforme), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.entregaAlJefeSol === null || detalle.entregaAlJefeSol === undefined || detalle.entregaAlJefeSol === "" ? "-" : format(new Date(detalle.entregaAlJefeSol), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.entrevistaPorJefatura === null || detalle.entrevistaPorJefatura === undefined || detalle.entrevistaPorJefatura === "" ? "-" : format(new Date(detalle.entrevistaPorJefatura), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.tomaDeDesiciones === null || detalle.tomaDeDesiciones === undefined || detalle.tomaDeDesiciones === "" ? "-" : format(new Date(detalle.tomaDeDesiciones), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.candidato === null || detalle.candidato === undefined || detalle.candidato === "" ? "-" : detalle.candidato) : "-",
							detalle !== undefined ? (detalle.procesoDeContratacion === null || detalle.procesoDeContratacion === undefined || detalle.procesoDeContratacion === "" ? "-" : format(new Date(detalle.procesoDeContratacion), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.finProcesoContratacion === null || detalle.finProcesoContratacion === undefined || detalle.finProcesoContratacion === "" ? "-" : format(new Date(detalle.finProcesoContratacion), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.fechaInicioReingreso === null || detalle.fechaInicioReingreso === undefined || detalle.fechaInicioReingreso === "" ? "-" : format(new Date(detalle.fechaInicioReingreso), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.fechaFinReingreso === null || detalle.fechaFinReingreso === undefined || detalle.fechaFinReingreso === "" ? "-" : format(new Date(detalle.fechaFinReingreso), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.fechaInicioContratacionFamiliares === null || detalle.fechaInicioContratacionFamiliares === undefined || detalle.fechaInicioContratacionFamiliares === "" ? "-" : format(new Date(detalle.fechaInicioContratacionFamiliares), "dd/MM/yyyy HH:mm:ss")) : "-",
							detalle !== undefined ? (detalle.fechaFinContratacionFamiliares === null || detalle.fechaFinContratacionFamiliares === undefined || detalle.fechaFinContratacionFamiliares === "" ? "-" : format(new Date(detalle.fechaFinContratacionFamiliares), "dd/MM/yyyy HH:mm:ss")) : "-"
						]);
					}
				});

				if (bodyReport.length !== 0) {
					this.utilService.generateReport(formato, "RPTWF-TM", "RP", headerTitles, bodyReport);
				}
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
		forkJoin(solicitudesData.map(({ idSolicitud }) => this.solicitudes.getDetalleAprobadoresSolicitudesById(idSolicitud))).subscribe({
		// this.seleccionCandidatoService.getCandidatoById(ids).subscribe({
			next: (response: any) => {
				const detalleSolicitudes = response.map(({ detalleAprobadorSolicitud }) => ({
					iD_SOLICITUD: detalleAprobadorSolicitud[0].id_Solicitud,
					detalleAprobadorSolicitud: detalleAprobadorSolicitud.filter(({ ruta }) => ruta.toUpperCase().includes("PRIMER") || ruta.toUpperCase().includes("SEGUND") || ruta.toUpperCase().includes("TERCER") || ruta.toUpperCase().includes("CUART") || ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.") || ruta.toUpperCase().includes("REMUNERA"))
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
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("PRIMER") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[0].fechaCreacion : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("SEGUND") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[1].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("SEGUND") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[1].fechaCreacion : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("TERCER") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[2].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("TERCER") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[2].fechaCreacion : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("CUART") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[3].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("CUART") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[3].fechaCreacion : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => (ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.")) && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[4].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => (ruta.toUpperCase().includes("RRHH") || ruta.toUpperCase().includes("RR.HH.")) && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[4].fechaCreacion : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("REMUNERA") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[5].usuarioAprobador : "-",
					detalle.detalleAprobadorSolicitud.some(({ ruta, usuarioAprobador }) => ruta.toUpperCase().includes("REMUNERA") && usuarioAprobador !== "") ? detalle.detalleAprobadorSolicitud[5].fechaCreacion : "-",
				]));

				this.utilService.generateReport(formato, "RPTWF-TM", "RP", headerTitles, bodyReport);
			},
			error: (err) => {
				this.utilService.modalResponse(err, "error");
			}
		});
	}

	public exportar(): void {
		const backgroundCellColor: [number, number, number] = [218, 238, 243];
		const textColor: [number, number, number] = [56, 95, 147];
		const lineColor: [number, number, number] = [149, 179, 215];

		const doc: jsPDF = new jsPDF();

		const esquinaDeHoja = {
			theme: "plain",
			body: [
				[
					{
						content: "",
						styles: {
							halign: "right",
							fontStyle: "bold"
						}
					}
				],
			]
		};

		const tituloDeHoja = {
			theme: "plain",
			body: [
				[
					{
						content: "",
						styles: {
							halign: "center",
							fontSize: 20,
							fontStyle: "bold",
							textColor
						}
					}
				],
			]
		};

		this.solicitudesService.obtenerTareasPorInstanciaRaiz(this.solicitud.idInstancia).subscribe({
			next: ({ tareaType }) => {
				const logs = tareaType.map(({ parentTaskId }) => parentTaskId);

				if (this.solicitud.idSolicitud.toUpperCase().includes("RP")) {
					esquinaDeHoja.body[0][0].content = codigosSolicitudReporte.requisicionPersonal;
					tituloDeHoja.body[0][0].content = "REQUERIMIENTO DE PERSONAL";

					this.exportarRequisicionPersonal(doc, esquinaDeHoja, tituloDeHoja, backgroundCellColor, textColor, lineColor, logs);
				} else if (this.solicitud.idSolicitud.toUpperCase().includes("CF")) {
					esquinaDeHoja.body[0][0].content = codigosSolicitudReporte.contratacionFamiliares;
					tituloDeHoja.body[0][0].content = "CONTRATACIÓN DE FAMILIAR";

					this.exportarContratacionFamiliar(doc, esquinaDeHoja, tituloDeHoja, backgroundCellColor, textColor, lineColor, logs);
				} else if (this.solicitud.idSolicitud.toUpperCase().includes("RG")) {
					esquinaDeHoja.body[0][0].content = codigosSolicitudReporte.reingresoPersonal;
					tituloDeHoja.body[0][0].content = "REINGRESO DE PERSONAL";

					this.exportarReingresoPersonal(doc, esquinaDeHoja, tituloDeHoja, backgroundCellColor, textColor, lineColor, logs);
				} else if (this.solicitud.idSolicitud.toUpperCase().includes("AP")) {
					esquinaDeHoja.body[0][0].content = codigosSolicitudReporte.accionPersonal;
					tituloDeHoja.body[0][0].content = "ACCIÓN DE PERSONAL";

					this.exportarAccionPersonal(doc, esquinaDeHoja, tituloDeHoja, backgroundCellColor, textColor, lineColor, logs);
				}

				this.utilService.closeLoadingSpinner();
			},
			error: (err) => {
				console.error(err);
			}
		});
	}

	private exportarRequisicionPersonal(doc: jsPDF, esquinaDeHoja: any, tituloDeHoja: any, backgroundCellColor: [number, number, number], textColor: [number, number, number], lineColor: [number, number, number], logs: any[]): void {
		// Equina de la hoja
		autoTable(doc, esquinaDeHoja);

		// Título
		autoTable(doc, tituloDeHoja);

		// Encabezado de la solicitud
		autoTable(doc, {
			theme: "grid",
			bodyStyles: {
				lineColor
			},
			body: [
				["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"), "Solicitud No:", this.solicitud.idSolicitud],
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					halign: "right"
				},
				2: {
					fontStyle: "bold",
					halign: "right"
				},
				4: {
					fontStyle: "bold",
					halign: "right"
				}
			}
		});

		// Información de la posición
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "INFORMACIÓN DE LA POSICIÓN",
						colSpan: 4
					}
				]
			],
			body: [
				["Unidad:", this.modelPrint.unidadNegocio, "Motivo", this.solicitud.tipoMotivo],
				["Ciudad/Localidad:", this.modelPrint.localidad, "Empleado a reemplazar", this.modelPrint.nombreCompleto],
				["Cargo solicitado:", this.modelPrint.nombreCargo, "Sueldo", `$ ${parseFloat(this.modelPrint.sueldo).toFixed(2)}`],
				["Área/Dpto:", this.modelPrint.departamento, "Variable máxima:", `$ ${parseFloat(this.modelPrint.sueldoMensual).toFixed(2)}`],
				["Centro de Costos", this.modelPrint.nomCCosto, "Total", `$ ${(parseFloat(this.modelPrint.sueldo) + parseFloat(this.modelPrint.sueldoMensual)).toFixed(2)}`],
				[
					"Justificación:",
					{
						content: this.modelPrint.justificacionCargo,
						colSpan: 3,
						styles: {
							halign: "justify"
						}
					}
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 30
				},
				1: {
					cellWidth: 60
				},
				2: {
					fontStyle: "bold",
					cellWidth: 30
				},
				3: {
					cellWidth: 60
				}
			}
		});

		// Funciones y responsabilidades
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "FUNCIONES Y RESPONSABILIDADES",
						colSpan: 4
					}
				]
			],
			body: [
				["Reporta a:", this.modelPrint.reportaA, "Supervisa a:", this.modelPrint.supervisaA],
				[
					"Misión del cargo:",
					{
						content: this.modelPrint.misionCargo,
						colSpan: 3,
						styles: {
							halign: "justify"
						}
					}
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 30
				},
				1: {
					cellWidth: 60
				},
				2: {
					fontStyle: "bold",
					cellWidth: 30
				},
				3: {
					cellWidth: 60
				}
			}
		});

		// Sección de candidato
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "SELECCIÓN DE CANDIDATO",
						colSpan: 2
					}
				]
			],
			body: [
				[
					{
						content: "TAREA:",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "FECHA:",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				["Actualización del perfil:", this.fechasPrint.actualizacionPerfil],
				["Búsqueda del candidato:", this.fechasPrint.busquedaCandidatos],
				["Entrevistas:", this.fechasPrint.entrevista],
				["Pruebas:", this.fechasPrint.pruebas],
				["Referencias:", this.fechasPrint.referencias],
				["Elaboración del Informe:", this.fechasPrint.elaboracionInforme],
				["Entrega al Jefe Solicitante el informe de selección:", this.fechasPrint.entregaJefe],
				["Entrevistas por parte de jefaturas:", this.fechasPrint.entrevistaJefatura],
				["Toma de decisiones por parte de jefaturas:", this.fechasPrint.tomaDecisiones],
				["Candidato seleccionado:", this.fechasPrint.candidatoSeleccionado],
				["Proceso de Contratación:", this.fechasPrint.procesoContratacion],
				["Fin del Proceso de Selección y Proceso de Contratación:", this.fechasPrint.finProcesoContratacion],
				[
					{
						content: "",
						colSpan: 2,
						styles: {
							fillColor: backgroundCellColor,
							cellPadding: "2px"
						}
					}
				],
				["Nombre del candidato escogido:", this.nombreCandidatoPrint],
				["Fecha de ingreso:", this.fechasPrint.reingreso === "" ? this.fechasPrint.contratacionFamiliares : this.fechasPrint.reingreso]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 110
				},
				1: {
					cellWidth: 70,
					halign: "center"
				}
			}
		});

		// Log del flujo
		const logData = logs.map(log => log.split("|"));

		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "Log del flujo",
						colSpan: 3
					}
				]
			],
			body: [
				[
					{
						content: "Fecha",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Acción",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Responsable",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				// ...this.dataAprobacionesPorPosicionPrint[this.keySelectedPrint].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
				...logData.map(data => ([data[2].split("=")[1], data[1].split("=")[1], data[0].split("=")[1]]))
			],
			columnStyles: {
				0: {
					cellWidth: 30,
					halign: "center"
				},
				1: {
					cellWidth: 75
				},
				2: {
					cellWidth: 75
				}
			}
		});

		doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	}

	private exportarContratacionFamiliar(doc: jsPDF, esquinaDeHoja: any, tituloDeHoja: any, backgroundCellColor: [number, number, number], textColor: [number, number, number], lineColor: [number, number, number], logs: any[]): void {
		// Esquina de la hoja
		autoTable(doc, esquinaDeHoja);

		// Títutlo
		autoTable(doc, tituloDeHoja);

		// Encabezado de la solicitud
		autoTable(doc, {
			theme: "grid",
			bodyStyles: {
				lineColor
			},
			body: [
				[
					{
						content: "Creado por:",
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: this.solicitud.usuarioCreacion,
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: "Fecha:",
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"),
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					"Solicitud No:",
					this.solicitud.idSolicitud
				],
				["Requisición de Personal No:", this.idSolicitudRPPrint]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					halign: "right"
				},
				2: {
					fontStyle: "bold",
					halign: "right"
				},
				4: {
					fontStyle: "bold",
					halign: "right"
				}
			}
		});

		// Información de la persona a contratar
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "INFORMACIÓN DE LA PERSONA A CONTRATAR",
						colSpan: 2
					}
				]
			],
			body: [
				["Apellidos y nombres:", this.nombreCompletoCandidatoPrint],
				["Unidad:", this.modelPrint.unidadNegocio],
				["Departamento:", this.modelPrint.departamento],
				["Cargo:", this.modelPrint.nombreCargo],
				["Localidad:", this.modelPrint.localidad],
				["Jefe Solicitante:", this.solicitud.usuarioCreacion],
				["Responsable de RR.HH.:", this.solicitud.usuarioCreacion],
				[
					"Justificación:",
					{
						content: this.modelPrint.justificacionCargo,
						styles: {
							halign: "justify"
						}
					}
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 50
				},
				1: {
					cellWidth: 130
				}
			}
		});

		// Datos de familiares que ya laboran en la empresa
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "DATOS DE FAMILIARES QUE YA LABORAN EN LA EMPRESA",
						colSpan: 7
					}
				]
			],
			body: [
				[
					{
						content: "Nombre",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Fecha de ingreso",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Cargo",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Unidad",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Departamento",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Localidad",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					},
					{
						content: "Parentezco",
						styles: {
							fontStyle: "bold",
							halign: "center"
						}
					}
				],
				...this.dataTableDatosFamiliaresPrint.map(datoFamiliar => ([datoFamiliar.nombreEmpleado, datoFamiliar.fechaCreacion as string, datoFamiliar.cargo, datoFamiliar.unidad, datoFamiliar.departamento, datoFamiliar.localidad, datoFamiliar.parentesco]))
			],
			columnStyles: {
				0: {
					cellWidth: 25
				},
				1: {
					cellWidth: 25
				},
				2: {
					cellWidth: 25
				},
				3: {
					cellWidth: 25
				},
				4: {
					cellWidth: 30
				},
				5: {
					cellWidth: 25
				},
				6: {
					cellWidth: 25
				}
			}
		});

		// Log del flujo
		const logData = logs.map(log => log.split("|"));

		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "Log del flujo",
						colSpan: 3
					}
				]
			],
			body: [
				[
					{
						content: "Fecha",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Acción",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Responsable",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				// ...this.dataAprobacionesPorPosicionPrint[this.keySelectedPrint].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
				...logData.map(data => ([data[2].split("=")[1], data[1].split("=")[1], data[0].split("=")[1]]))
			],
			columnStyles: {
				0: {
					cellWidth: 30,
					halign: "center"
				},
				1: {
					cellWidth: 75
				},
				2: {
					cellWidth: 75
				}
			}
		});

		doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	}

	private exportarReingresoPersonal(doc: jsPDF, esquinaDeHoja: any, tituloDeHoja: any, backgroundCellColor: [number, number, number], textColor: [number, number, number], lineColor: [number, number, number], logs: any[]): void {
		const variableMaxima = Math.max(...[parseInt(this.modelPrint.sueldoAnual), parseInt(this.modelPrint.sueldoMensual), parseInt(this.modelPrint.sueldoSemestral), parseInt(this.modelPrint.sueldoTrimestral)]);
		const variableMaximaRG = Math.max(...[parseInt(this.modelPrintRG.sueldoAnual), parseInt(this.modelPrintRG.sueldoMensual), parseInt(this.modelPrintRG.sueldoSemestral), parseInt(this.modelPrintRG.sueldoTrimestral)]);

		// Esquina de la hoja
		autoTable(doc, esquinaDeHoja);

		// Títutlo
		autoTable(doc, tituloDeHoja);

		// Encabezado de la solicitud
		autoTable(doc, {
			theme: "grid",
			bodyStyles: {
			},
			body: [
				[
					{
						content: "Creado por:",
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: this.solicitud.usuarioCreacion,
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: "Fecha:",
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					{
						content: format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"),
						rowSpan: 2,
						styles: {
							valign: "middle"
						}
					},
					"Solicitud No:",
					this.solicitud.idSolicitud
				],
				["Requisición de Personal No:", this.idSolicitudRPPrint]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					halign: "right"
				},
				2: {
					fontStyle: "bold",
					halign: "right"
				},
				4: {
					fontStyle: "bold",
					halign: "right"
				}
			}
		});

		// Información de la persona a contratar
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "INFORMACIÓN DE LA PERSONA A CONTRATAR",
						colSpan: 4
					}
				]
			],
			body: [
				["Apellidos y nombres:", this.nombreCompletoCandidatoPrint, "Fecha de ingreso:", format(new Date(this.modelPrintRG.fechaIngreso), "dd/MM/yyyy")]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 40
				},
				1: {
					cellWidth: 75
				},
				2: {
					fontStyle: "bold",
					cellWidth: 35
				},
				3: {
					cellWidth: 30
				}
			}
		});

		// Datos de contratación
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "DATOS DE CONTRTACIÓN",
						colSpan: 3
					}
				]
			],
			body: [
				[
					{
						content: "Descripción",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Contratación anterior",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Contratación actual",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				["Compañía:", this.modelPrint.compania, this.modelPrintRG.compania],
				["Sueldo:", `$ ${parseFloat(this.modelPrintRG.sueldo).toFixed(2)}`, `$ ${parseFloat(this.modelPrint.sueldo).toFixed(2)}`],
				["Variable Máxima:", `$ ${variableMaximaRG.toFixed(2)}`, `$ ${variableMaxima.toFixed(2)}`],
				["Remuneración Total:", `$ ${(parseFloat(this.modelPrintRG.sueldo) + variableMaximaRG).toFixed(2)}`, `$ ${(parseFloat(this.modelPrint.sueldo) + variableMaxima).toFixed(2)}`],
				["Cargo:", this.modelPrint.descrPosicion, this.modelPrintRG.descrPosicion],
				["Departamento:", this.modelPrint.departamento, this.modelPrintRG.departamento],
				["Fecha de Ingreso:", format(new Date(this.modelPrint.fechaIngreso), "dd/MM/yyyy"), format(new Date(this.modelPrintRG.fechaIngreso), "dd/MM/yyyy")],
				["Fecha de Salida:", format(new Date(this.detalleSolicitudPrintRG.fechaSalida), "dd/MM/yyyy"), format(new Date(this.detalleSolicitud.fechaSalida), "dd/MM/yyyy")],
				["Jefe Inmediato Superior:", this.detalleSolicitudPrintRG.jefeInmediatoSuperior, this.detalleSolicitud.jefeInmediatoSuperior],
				["Cargo Jefe Inemdiato Superior:", this.detalleSolicitudPrintRG.puestoJefeInmediato, this.detalleSolicitud.puestoJefeInmediato],
				["Responsable de RR.HH.:", this.detalleSolicitudPrintRG.responsableRRHH, this.detalleSolicitud.responsableRRHH]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 60
				},
				1: {
					cellWidth: 60
				},
				2: {
					cellWidth: 60
				}
			}
		});

		// Referencia de recursos humanos
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "REFERENCIA DE RECURSOS HUMANOS",
						colSpan: 4
					}
				]
			],
			body: [
				[
					"Forma de salida:",
					{
						content: this.comentariosRRHHPrint.comentario,
						colSpan: 3
					}
				],
				[
					"Causa real de salida:",
					{
						content: this.causaSalidaPrint,
						colSpan: 3
					}
				],
				[
					"Justificación", "", "Fecha:", format(this.currentDatePrint, "dd/MM/yyyy")
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 40
				},
				2: {
					fontStyle: "bold",
					cellWidth: 25
				},
				3: {
					cellWidth: 35
				}
			}
		});

		// Referencia del último jefe
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "REFERENCIA DEL ÚLTIMO JEFE",
						colSpan: 2
					}
				]
			],
			body: [
				["¿Cómo fue el desempeño en el área?:", this.comentariosJefeInmediatoPrint.comentario],
				["Fecha:", format(this.currentDatePrint, "dd/MM/yyyy")]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 70
				}
			}
		});

		// Jefe solicitante
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor: textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "JEFE SOLICITANTE",
						colSpan: 4
					}
				]
			],
			body: [
				["Nombre del jefe solicitante:", this.detalleSolicitudPrintRG.nombreJefeSolicitante, "Cargo:", this.detalleSolicitudPrintRG.puesto],
				[
					"Justificación:",
					{
						content: this.Comentario_Jefe_SolicitantePrint.comentario,
						styles: {
							halign: "justify"
						}
					},
					"Fecha:",
					format(this.currentDatePrint, "dd/MM/yyyy")
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 60
				},
				2: {
					fontStyle: "bold",
					cellWidth: 25
				},
				3: {
					cellWidth: 25
				}
			}
		});

		// Log del flujo
		const logData = logs.map(log => log.split("|"));

		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "Log del flujo",
						colSpan: 3
					}
				]
			],
			body: [
				[
					{
						content: "Fecha",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Acción",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Responsable",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				// ...this.dataAprobacionesPorPosicionPrint[this.keySelectedPrint].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
				...logData.map(data => ([data[2].split("=")[1], data[1].split("=")[1], data[0].split("=")[1]]))
			],
			columnStyles: {
				0: {
					cellWidth: 30,
					halign: "center"
				},
				1: {
					cellWidth: 75
				},
				2: {
					cellWidth: 75
				}
			}
		});

		doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	}

	private exportarAccionPersonal(doc: jsPDF, esquinaDeHoja: any, tituloDeHoja: any, backgroundCellColor: [number, number, number], textColor: [number, number, number], lineColor: [number, number, number], logs: any[]): void {
		const variableMaxima = Math.max(...[parseInt(this.modelPrint.sueldoAnual), parseInt(this.modelPrint.sueldoMensual), parseInt(this.modelPrint.sueldoSemestral), parseInt(this.modelPrint.sueldoTrimestral)]);
		const variableMaximaPropuestos = Math.max(...[parseInt(this.modelPrintPropuestos.sueldoAnual), parseInt(this.modelPrintPropuestos.sueldoMensual), parseInt(this.modelPrintPropuestos.sueldoSemestral), parseInt(this.modelPrintPropuestos.sueldoTrimestral)]);

		// Esquina de la hoja
		autoTable(doc, esquinaDeHoja);

		// Títutlo
		autoTable(doc, tituloDeHoja);

		// Encabezado de la solicitud
		autoTable(doc, {
			theme: "grid",
			bodyStyles: {
				lineColor
			},
			body: [
				["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", format(new Date(this.solicitud.fechaCreacion), "dd/MM/yyyy"), "Solicitud No:", this.solicitud.idSolicitud],
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					halign: "right"
				},
				2: {
					fontStyle: "bold",
					halign: "right"
				},
				4: {
					fontStyle: "bold",
					halign: "right"
				}
			}
		});
		console.log(this.modelPrint.sueldo);

		// Información
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "INFORMACIÓN",
						colSpan: 4
					}
				]
			],
			body: [
				[
					{
						content: "Nombre empleado"
					},
					{
						content: this.modelPrint.nombreCompleto,
						colSpan: 3
					}
				],
				[
					{
						content: "ORIGEN",
						colSpan: 2,
						styles: {
							textColor,
							halign: "center"
						}
					},
					{
						content: "DESTINO",
						colSpan: 2,
						styles: {
							textColor,
							halign: "center"
						}
					}
				],
				["Fecha de ingreso:", format(new Date(this.modelPrint.fechaIngreso), "dd/MM/yyyy"), "Fecha de cambio:", this.modelPrintPropuestos.fechaIngreso === "" || this.modelPrintPropuestos.fechaIngreso === undefined || this.modelPrintPropuestos.fechaIngreso === null ? "" : format(new Date(this.modelPrintPropuestos.fechaIngreso), "dd/MM/yyyy")],
				["Cargo:", this.modelPrint.descrPuesto, "Cargo:", this.modelPrintPropuestos.descrPuesto],
				["Unidad:", this.modelPrint.unidadNegocio, "Unidad:", this.modelPrintPropuestos.unidadNegocio],
				["Área/Departamento:", this.modelPrint.departamento, "Área/Departamento::", this.modelPrintPropuestos.departamento],
				["Localidad:", this.modelPrint.localidad, "Localidad:", this.modelPrintPropuestos.localidad],
				["Sueldo:", this.modelPrint.sueldo === "" ? "$ 0.00" : `$ ${parseInt(this.modelPrint.sueldo).toFixed(2)}`, "Sueldo:", this.modelPrintPropuestos.sueldo === "" ? "$ 0.00" : `$ ${parseInt(this.modelPrintPropuestos.sueldo).toFixed(2)}`],
				["Variable máxima:", `$ ${variableMaxima.toFixed(2)}`, "Variable máxima:", `$ ${variableMaximaPropuestos.toFixed(2)}`],
				["Movilizavión:", this.detalleSolicitudPrint.movilizacion !== "" ? `$ ${parseInt(this.detalleSolicitudPrintPropuestos.movilizacion).toFixed(2)}` : "$ 0.00", "Movilización:", this.detalleSolicitudPrintPropuestos.movilizacion !== "" ? `$ ${parseInt(this.detalleSolicitudPrintPropuestos.movilizacion).toFixed(2)}` : "$ 0.00"],
				["Alimentación:", this.detalleSolicitudPrint.alimentacion !== "" ? `$ ${parseInt(this.detalleSolicitudPrintPropuestos.alimentacion).toFixed(2)}` : "$ 0.00", "Alimentación:", this.detalleSolicitudPrintPropuestos.alimentacion !== "" ? `$ ${parseInt(this.detalleSolicitudPrintPropuestos.alimentacion).toFixed(2)}` : "$ 0.00"],
				["Centro de Costos:", this.modelPrint.nomCCosto, "Centro de Costos:", this.modelPrintPropuestos.nomCCosto],
				["Grupo de pago:", this.modelPrint.grupoPago, "Grupo de pago:", this.modelPrintPropuestos.grupoPago],
				["Sucursal (Nómina):", this.modelPrint.sucursal, "Scursal (Nómina):", this.modelPrintPropuestos.sucursal],
				["Distribución contable:", this.modelPrint.nomCCosto.split(";")[1], "Distribución Contable:", this.modelPrintPropuestos.nomCCosto.split(";")[1]]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 40
				},
				1: {
					cellWidth: 50
				},
				2: {
					fontStyle: "bold",
					cellWidth: 40
				},
				3: {
					cellWidth: 50
				}
			}
		});

		// Descripción
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "DESCRIPCIÓN",
						colSpan: 2
					}
				]
			],
			body: [
				["Tipo de Acción:", this.solicitud.tipoAccion],
				[
					"Justificación:",
					{
						content: this.modelPrint.justificacionCargo,
						styles: {
							halign: "justify"
						}
					}
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 30
				}
			}
		});

		// Sección para recursos humanos
		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				halign: "center",
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "SECCIÓN PARA RECURSOS HUMANOS",
						colSpan: 2
					}
				]
			],
			body: [
				["Observaciones:", ""],
				[
					{
						content: "",
						colSpan: 2,
						styles: {
							minCellHeight: 20
						}
					}
				],
				[
					{
						content: "ACEPTACIÓN DEL EMPLEADO",
						colSpan: 2,
						styles: {
							halign: "center"
						}
					}
				]
			],
			columnStyles: {
				0: {
					fontStyle: "bold",
					cellWidth: 30
				}
			}
		});

		// Log del flujo
		const logData = logs.map(log => log.split("|"));

		autoTable(doc, {
			theme: "grid",
			headStyles: {
				fillColor: backgroundCellColor,
				textColor,
				lineColor
			},
			bodyStyles: {
				lineColor
			},
			head: [
				[
					{
						content: "Log del flujo",
						colSpan: 3
					}
				]
			],
			body: [
				[
					{
						content: "Fecha",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Acción",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					},
					{
						content: "Responsable",
						styles: {
							halign: "center",
							textColor,
							fontStyle: "bold"
						}
					}
				],
				// ...this.dataAprobacionesPorPosicionPrint[this.keySelectedPrint].map(dataAprobador => ([format(new Date(dataAprobador.nivelAprobacionType.fechaCreacion), "dd/MM/yyyy"), dataAprobador.nivelAprobacionType.ruta, dataAprobador.aprobador.usuario === "" ? "No aplica" : dataAprobador.aprobador.usuario]))
				...logData.map(data => ([data[2].split("=")[1], data[1].split("=")[1], data[0].split("=")[1]]))
			],
			columnStyles: {
				0: {
					cellWidth: 30,
					halign: "center"
				},
				1: {
					cellWidth: 75
				},
				2: {
					cellWidth: 75
				}
			}
		});

		doc.save(`${this.solicitud.idSolicitud}-${format(new Date(), "dd-MM-yyyy")}.pdf`)
	}
}
