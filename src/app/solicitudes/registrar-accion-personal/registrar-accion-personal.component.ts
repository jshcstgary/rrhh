import { HttpErrorResponse } from "@angular/common/http";
import { Component, Type } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { LoginServices } from "src/app/auth/services/login.services";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { IEmpleadoData, IEmpleados } from "src/app/services/mantenimiento/empleado.interface";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { StarterService } from "src/app/starter/starter.service";
import { Permiso } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { BuscarEmpleadoComponent } from "../buscar-empleado/buscar-empleado.component";

interface DialogComponents {
	dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

const dialogComponentList: DialogComponents = {
	dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

@Component({
	selector: "app-registrar-accion-personal",
	templateUrl: "./registrar-accion-personal.component.html",
	styleUrls: ["./registrar-accion-personal.component.scss"],
})
export class RegistrarAccionPersonalComponent extends CompleteTaskComponent {
	NgForm = NgForm;

	selectedOptionAnulacion: string = "No";
	selected_tipo_accion: number;
	selectedOption: string = "No";
	empleadoSearch: string = "";
	nivelDireccionDatoPropuesto: string = "";
	public sueldoEmpleado: {
		sueldo: string;
		variableMensual: string;
		variableTrimestral: string;
		variableSemestral: string;
		variableAnual: string;
	} = {
		sueldo: "0",
		variableMensual: "0",
		variableTrimestral: "0",
		variableSemestral: "0",
		variableAnual: "0",
	};

	public existeMatenedores: boolean = false;

	public existe: boolean = false;
	public codigoReportaA: string = "";
	public primerNivelAprobacion: string = "";
	public RegistrarsolicitudCompletada = false;

	public tiposAcciones: any[] = [];

	private readonly NIVEL_APROBACION_GERENCIA_MEDIA: string = "GERENCIA MEDIA";
	private readonly NIVEL_APROBACION_GERENCIA_UNIDAD: string = "GERENCIA DE UNIDAD O CORPORATIVA";
	private readonly NIVEL_APROBACION_JEFATURA: string = "JEFATURA";
	private readonly NIVEL_APROBACION_VICEPRESIDENCIA: string = "VICEPRESIDENCIA";
	private readonly NIVEL_APROBACION_RRHH: string = "Gerente de RRHH Corporativo";
	override model: RegistrarData = new RegistrarData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

	modelPropuestos: RegistrarData = new RegistrarData();

	public oldData = {
		subledger: "",
		justificacion: "",
		idTipoAccion: 0,
		fechaCambioPropuesto: new Date(""),
		companiaPropuesto: "",
		unidadPropuesto: "",
		codigoPosicionPropuesto: "",
		movilizacionPropuesto: "",
		alimentacionPropuesto: "",
		sueldoPropuesto: "",
		sueldoMensualPropuesto: "",
		sueldoTrimestralPropuesto: "",
		sueldoSemestralPropuesto: "",
		sueldoAnualPropuesto: "",
	};

	private searchSubject = new Subject<{
		campo: string;
		valor: string;
	}>();

	public estadoSolicitud: string = "";

	public solicitudDataInicial = new Solicitud();
	public tipo_solicitud_descripcion: string;
	public tipo_motivo_descripcion: string;
	public tipo_accion_descripcion: string;
	public minDateValidation = startOfMonth(new Date());
	public maxDateValidation = endOfMonth(new Date());

	public keySelected: any;

	public detalleSolicitud = new DetalleSolicitud();

	public detalleSolicitudPropuestos = new DetalleSolicitud();

	public solicitud = new Solicitud();

	taskKey: string = "";

	public titulo: string = "Formulario De Registro";

	// Base model refers to the input at the beginning of BPMN
	// that is, Start Event
	public modelBase: DatosProcesoInicio;

	public modelSolicitud: DatosSolicitud;

	public dataSolicitudModel: any;

	// scenario-1: task id and date are handled via tasklist page.
	public taskId: string = "";
	public tareasPorCompletar: any;

	public date: any; // task date handled as query param

	// scenario-2: User starts new process instance and directly comes to fill Registrar user task.
	// This is a more likely scenario.
	// In this case, parent flag is set to true. It requires additional handling to derive task id from process instance id.
	public parentIdFlag: string | null = "false"; // set to true if the id is for the process instance, instead of task-id

	public misParams: Solicitud;

	public dataTipoSolicitud: any = [];
	public dataTipoMotivo: any = [];
	dataUnidadesNegocio: string[] = [];
	dataEmpresa: string[] = [];

	transferenciaCompania: string = "";
	transferenciaUnidadNegocio: string = "";
	fechaCambioPropuesta: Date = new Date("");

	// public dataTipoAccion: any;

	public dataTipoAccion: any = [];
	// public dataAprobacionesPorPosicion: { [idTipoSolicitud: number, IdTipoMotivo: number, IdNivelDireccion: number]: any[] } =
	// {};

	public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

	public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};

	public dataAprobacionesPorPosicionAPS: any = [];
	public dataAprobacionesPorPosicionAPD: any = [];
	public unidadNegocioEmp: string;
	public dataTipoRutaEmp: any[] = [];

	public dataTipoRuta: any[] = [];

	public dataRuta: any[] = [];

	public dataNivelDireccion: any[] = [];

	// oDataNivelesAprobacionPorCodigoPosicion
	public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

	public dataNivelesAprobacion: any;

	public mostrarTipoJustificacionYMision = false;

	public restrictionsIds: any[] = ["1", "2", 1, 2];

	public restrictionsSubledgerIds: any[] = ["4", 4];

	public mostrarSubledger = false;

	eventSearch = {
		item: "",
	};

	public dataEmpleadoEvolution: any[] = [];

	public success: false;
	public params: any;
	public id_edit: undefined | string;
	existenNivelesAprobacion: boolean = false;

	private id_solicitud_by_params: any;

	public dataAprobadoresDinamicos: any[] = [];
	private detalleNivelAprobacion: any[] = [];

	public suggestions: string[] = [];

	public idDeInstancia: any;
	public aprobacion: any;

	public loadingComplete = 0;
	public viewInputs: boolean = false;

	nombres: string[] = [];

	subledgers: string[] = [];

	codigosPosicion: string[] = [];
	jsonResult: string;

	emailVariables = {
		de: "",
		password: "",
		alias: "",
		para: "",
		asunto: "",
		cuerpo: "",
	};

	emailVariables2 = {
		de: "",
		password: "",
		alias: "",
		para: "",
		asunto: "",
		cuerpo: "",
	};

	constructor(route: ActivatedRoute, router: Router, camundaRestService: CamundaRestService, private mantenimientoService: MantenimientoService, private solicitudes: SolicitudesService, private utilService: UtilService, private consultaTareasService: ConsultaTareasService, private modalService: NgbModal, private starterService: StarterService, private loginService: LoginServices) {
		super(route, router, camundaRestService);

		this.searchSubject.pipe(debounceTime(0)).subscribe(({ campo, valor }) => {
			this.filtrarDatos(campo, valor);
		});

		this.route.paramMap.subscribe((params) => {
			this.id_edit = params.get("idSolicitud");
		});

		this.modelBase = new DatosProcesoInicio();

		this.route.paramMap.subscribe((params) => {
			this.id_solicitud_by_params = params.get("idSolicitud");
			this.idDeInstancia = params.get("id");
		});

		this.verifyData();
	}

	private verifyData(): void {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		try {
			this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
				next: (res) => {
					return this.consultaTareasService.getTareasUsuario(res.evType[0].subledger).subscribe({
						next: async (response) => {
							this.existe = response.solicitudes.some(({ idSolicitud, rootProcInstId }) => idSolicitud === this.id_solicitud_by_params && rootProcInstId === this.idDeInstancia);

							const permisos: Permiso[] = JSON.parse(sessionStorage.getItem(LocalStorageKeys.Permisos)!);

							this.existeMatenedores = permisos.some((permiso) => permiso.codigo === PageCodes.AprobadorFijo);

							if (this.existe || this.existeMatenedores) {
								try {
									await this.loadDataCamunda();

									this.obtenerEmpresaYUnidadNegocio();

									// this.utilService.closeLoadingSpinner();
								} catch (error) {
									this.utilService.modalResponse(error.error, "error");
								}
							} else {
								this.utilService.closeLoadingSpinner();

								await Swal.fire({
									text: "Usuario no asignado",
									icon: "info",
									confirmButtonColor: "rgb(227, 199, 22)",
								});

								this.router.navigate(["/solicitudes/consulta-solicitudes"]);
							}
						},
						error: (error: HttpErrorResponse) => {
							this.utilService.modalResponse(error.error, "error");

							this.utilService.closeLoadingSpinner();
						},
					});
				},
			});
		} catch (error) {
			this.utilService.modalResponse(error.error, "error");
		}
	}

	async ngOnInit() {
		// this.utilService.openLoadingSpinner(
		//   "Cargando información, espere por favor..."
		// );
		// console.log("this.id_solicitud_by_params: ", this.id_solicitud_by_params);
		// try {
		// 	await this.loadDataCamunda();
		//   this.utilService.closeLoadingSpinner();
		// } catch (error) {
		//   this.utilService.modalResponse(error.error, "error");
		// }
	}

	private obtenerTipoAccionPorSolicitud(): void {
		this.mantenimientoService.getTiposAccionesPorTipoSolicitud(this.solicitud.idTipoSolicitud).subscribe({
			next: (response) => {
				this.tiposAcciones = response;
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoSolicitud() {
		return this.mantenimientoService.getTipoSolicitud().subscribe({
			next: (response: any) => {
				this.dataTipoSolicitud = response;
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoMotivo() {
		return this.mantenimientoService.getTipoMotivo().subscribe({
			next: (response) => {
				this.dataTipoMotivo = response;
				// this.solicitud.request.tipoMotivo = this.dataTipoMotivo.tipoMotivo;
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ObtenerServicioTipoAccion() {
		return this.mantenimientoService.getTipoAccion().subscribe({
			next: (response) => {
				this.dataTipoAccion = response;
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
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

	ObtenerServicioNivelDireccion() {
		return this.mantenimientoService.getCatalogo("RBPND").subscribe({
			// return this.mantenimientoService.getCatalogoRBPND().subscribe({
			next: (response) => {
				this.dataNivelDireccion = response.itemCatalogoTypes; //verificar la estructura mmunoz

				this.detalleSolicitud.nivelDireccion = response.itemCatalogoTypes.filter((data) => data.codigo == this.detalleSolicitud.nivelDireccion)[0]?.valor;

				//this.utilService.closeLoadingSpinner(); //comentado mmunoz
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	// Prueba servicio
	getSolicitudes() {
		this.solicitudes.getSolicitudes().subscribe((data) => {});
	}

	getSolicitudById(id: any) {
		return this.solicitudes.getSolicitudById(id).subscribe({
			next: (response: any) => {
				this.solicitud = response;
				// this.minDateValidation = this.solicitud.fechaCreacion;

				console.log(this.solicitud);
				this.model.codigo = this.solicitud.idSolicitud;
				this.model.idEmpresa = this.solicitud.idEmpresa;
				this.model.compania = this.solicitud.empresa;
				this.model.unidadNegocio = this.solicitud.unidadNegocio;

				this.loadingComplete += 2;

				this.getDetalleSolicitudById(this.id_edit);

				this.obtenerTipoAccionPorSolicitud();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	searchSubledger: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => {
				if (term.length < 1) {
					return [];
				} else {
					return this.subledgers.filter((subledger) => subledger.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
				}
			})
		);

	searchNombre: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => {
				if (term.length < 1) {
					return [];
				} else {
					return this.nombres.filter((nombreCompleto) => nombreCompleto.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
				}
			})
		);

	getDataEmpleadosEvolution(tipo: string) {
		let tipoValue: string = "";

		if (tipo === "subledger") {
			tipoValue = this.model.subledger;
		} else if (tipo === "nombreCompleto") {
			tipoValue = this.model.nombreCompleto;
		} else {
			tipoValue = this.model.nombreCompleto;
		}

		this.mantenimientoService.getDataEmpleadosEvolutionPorId(tipoValue).subscribe({
			next: (response) => {
				if (response.evType.length === 0) {
					Swal.fire({
						text: "No se encontró registro",
						icon: "info",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Sí",
					});

					this.clearModel();
					this.keySelected = "";
					this.dataAprobacionesPorPosicion = {};

					return;
				}

				this.dataEmpleadoEvolution = response.evType;

				if (tipo === "subledger") {
					this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];
					this.eventSearch.item = this.dataEmpleadoEvolution[0].subledger;
					this.onSelectItem("subledger", this.eventSearch);
				} else if (tipo === "nombreCompleto") {
					this.nombres = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
					this.eventSearch.item = this.dataEmpleadoEvolution[0].nombreCompleto;
					this.onSelectItem("nombreCompleto", this.eventSearch);
				}
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	onSelectItem(campo: string, event) {
		const valor = event.item;

		const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
			return empleado[campo] === valor;
		});

		if (datosEmpleado) {
			this.sueldoEmpleado.sueldo = datosEmpleado.sueldo;
			this.sueldoEmpleado.variableMensual = datosEmpleado.sueldoVariableMensual;
			this.sueldoEmpleado.variableTrimestral = datosEmpleado.sueldoVariableTrimestral;
			this.sueldoEmpleado.variableSemestral = datosEmpleado.sueldoVariableSemestral;
			this.sueldoEmpleado.variableAnual = datosEmpleado.sueldoVariableAnual;

			this.model = Object.assign(
				{},
				{
					...datosEmpleado,
					sueldo: datosEmpleado.sueldo,
					sueldoMensual: datosEmpleado.sueldoVariableMensual,
					sueldoTrimestral: datosEmpleado.sueldoVariableTrimestral,
					sueldoSemestral: datosEmpleado.sueldoVariableSemestral,
					sueldoAnual: datosEmpleado.sueldoVariableAnual,
				}
			);

			if (this.model.nivelDir.toUpperCase().includes("VICEPRESIDENCIA") || this.model.nivelDir.toUpperCase().includes("CORPORATIVO") || this.model.nivelDir.toUpperCase().includes("CORPORATIVA")) {
				Swal.fire({
					text: "Nivel de Dirección no permitido: " + this.model.nivelDir,
					icon: "info",
					confirmButtonColor: "rgb(227, 199, 22)",
					confirmButtonText: "Sí",
				});

				this.clearModel();

				this.keySelected = "";
				this.dataAprobacionesPorPosicion = {};

				return;
			}

			this.mantenimientoService.getDataEmpleadosEvolutionPorId(datosEmpleado.codigoPosicionReportaA).subscribe({
				next: (response) => {
					if (response.evType.length === 0) {
						this.model.jefeInmediatoSuperior = "";
						this.model.puestoJefeInmediato = "";
						this.codigoReportaA = "";

						return;
					}

					this.model.jefeInmediatoSuperior = response.evType[0].nombreCompleto;
					this.model.puestoJefeInmediato = response.evType[0].descrPosicion;
					this.codigoReportaA = response.evType[0].subledger;
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse(error.error, "error");
				},
			});

			this.modelPropuestos = structuredClone(this.model);
			this.modelPropuestos.fechaIngreso = structuredClone(this.model.fechaIngresogrupo);
			this.detalleSolicitudPropuestos.movilizacion = "0";
			this.detalleSolicitudPropuestos.alimentacion = "0";
			this.unidadNegocioEmp = datosEmpleado.unidadNegocio;

			if (this.unidadNegocioEmp.toUpperCase().includes("AREAS") || this.unidadNegocioEmp.toUpperCase().includes("ÁREAS")) {
				this.mantenimientoService.getTipoRuta().subscribe({
					next: (response) => {
						this.dataTipoRutaEmp = response.tipoRutaType
							.filter(({ estado }) => estado === "A")
							.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("CORPORATIV"))
							.map((r) => ({
								id: r.id,
								descripcion: r.tipoRuta,
							}));

						this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

						if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
							this.obtenerAprobacionesPorPosicion();
						}
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse(error.error, "error");
					},
				});
			} else {
				this.mantenimientoService.getTipoRuta().subscribe({
					next: (response) => {
						this.dataTipoRutaEmp = response.tipoRutaType
							.filter(({ estado }) => estado === "A")
							.filter(({ tipoRuta }) => tipoRuta.toUpperCase() === "UNIDADES")
							.map((r) => ({
								id: r.id,
								descripcion: r.tipoRuta,
							}));

						this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

						if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
							this.obtenerAprobacionesPorPosicion();
						}
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse(error.error, "error");
					},
				});
			}
		} else {
			let tempSearch = valor;
			this.model = new RegistrarData();

			if (campo == "codigoPosicion") {
				this.model.codigoPosicion = tempSearch;
			} else if (campo == "subledger") {
				this.model.subledger = tempSearch;
			} else if (campo == "nombreCompleto") {
				this.model.nombreCompleto = tempSearch;
			}
		}
	}

	clearModel() {
		this.model = {
			codigo: "",
			idEmpresa: "",
			compania: "",
			departamento: "",
			nombreCargo: "",
			nomCCosto: "",
			misionCargo: "",
			justificacionCargo: "",
			codigoPosicion: "",
			descrPosicion: "",
			codigoPuesto: "",
			descrPuesto: "",
			fechaIngresogrupo: "",
			grupoPago: "",
			reportaA: "",
			supervisaA: "",
			localidad: "",
			nivelDir: "",
			descrNivelDir: "",
			nivelRepa: "",
			nombreCompleto: "",
			subledger: "",
			sucursal: "",
			unidadNegocio: "",
			tipoContrato: "",
			tipoProceso: "",
			descripContrato: "",
			status: "",
			correo: "",
			fechaIngreso: new Date(),
			comentariosAnulacion: "",
			sueldo: "",
			sueldoMensual: "",
			sueldoTrimestral: "",
			sueldoSemestral: "",
			sueldoAnual: "",
			taskNivelAprobador: "",
			puestoJefeInmediato: "",
			jefeInmediatoSuperior: "",
			responsableRRHH: "",
		};
	}

	loadDataCamunda() {
		this.route.queryParamMap.subscribe((qParams) => {
			if (null !== qParams?.get("date")) {
				this.date = qParams.get("date");
			} else {
				this.date = "";
			}

			if (null !== qParams?.get("p")) {
				this.parentIdFlag = qParams.get("p");
			}
		});

		this.route.queryParams.subscribe((params: any) => {
			if (params["id_edit"] !== undefined) {
				this.id_edit = params["id_edit"];
			} else {
				this.solicitudDataInicial = this.solicitudes.modelSolicitud;
				this.detalleSolicitud = this.solicitudes.modelDetalleSolicitud;
				this.detalleSolicitud.idSolicitud = this.solicitudDataInicial.idSolicitud;
			}
		});

		this.route.queryParams.subscribe((params: Solicitud) => {
			this.misParams = params;
		});

		this.route.queryParamMap.subscribe((qParams) => {
			if (null !== qParams?.get("date")) {
				this.date = qParams.get("date");
			} else {
				this.date = "";
			}

			this.parentIdFlag = "true";
		});

		this.route.params.subscribe((params) => {
			const variableNames = Object.keys(this.model).join(",");

			if ("true" === this.parentIdFlag) {
				this.idDeInstancia = params["id"];

				this.solicitudes.getTaskId(this.idDeInstancia).subscribe({
					next: (result) => {
						this.tareasPorCompletar = result.filter((empleado) => empleado["deleteReason"] === null);

						if (this.tareasPorCompletar.length === 0) {
							return;
						} else {
							this.uniqueTaskId = this.tareasPorCompletar[0].id;
							this.taskType_Activity = this.tareasPorCompletar[0].taskDefinitionKey;
							this.nameTask = this.tareasPorCompletar[0].name;
						}

						this.taskId = params["id"];
						this.getSolicitudById(this.id_solicitud_by_params);
						this.date = this.tareasPorCompletar[0].startTime;
					},
					error: (error) => {
						console.error(error);
					},
				});
			} else {
				this.uniqueTaskId = params["id"];
				this.taskId = params["id"];

				this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
			}
		});
	}

	filtrarDatos(campo: string, valor: string) {
		const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
			console.log("Empleado iterando: ", empleado);
			console.log("empleado[campo]: " + empleado[campo] + ", valor: ", valor + ", campo: ", campo);
			console.log("\n");
			return empleado[campo] === valor;
		});
		console.log("Valor de datosEmpleado: ", datosEmpleado);
		if (datosEmpleado) {
			console.log("Ingresa en el if: ", datosEmpleado);
			this.model = Object.assign({}, datosEmpleado);
		} else {
			// this.model.reset();
			let tempSearch = valor;
			this.model = new RegistrarData();

			if (campo == "codigoPosicion") {
				this.model.codigoPosicion = tempSearch;
			} else if (campo == "subledger") {
				this.model.subledger = tempSearch;
			} else if (campo == "nombreCompleto") {
				this.model.nombreCompleto = tempSearch;
			}
		}
	}

	totalRegistrosDetallesolicitud: number = 0;

	getDetalleSolicitudById(id: any) {
		return this.solicitudes.getDetalleSolicitudById(id).subscribe({
			next: (response: any) => {
				this.totalRegistrosDetallesolicitud = response.totalRegistros;

				if (response.detalleSolicitudType[0].codigoPosicion > 0) {
					this.detalleSolicitud = response.detalleSolicitudType[0];
					this.RegistrarsolicitudCompletada = true;

					if (!this.existeMatenedores) {
						if (this.RegistrarsolicitudCompletada) {
							if (this.solicitud.estadoSolicitud.toUpperCase() === "DV") {
								this.estadoSolicitud = this.detalleSolicitud.estado;

								if (this.estadoSolicitud === "DV") {
									Swal.fire({
										text: "Solicitud guardada, puede proceder a enviarla.",
										icon: "info",
										confirmButtonColor: "rgb(227, 199, 22)",
										confirmButtonText: "Ok",
										timer: 30000,
									});
								}
							} else {
								Swal.fire({
									text: "Solicitud guardada, puede proceder a enviarla.",
									icon: "info",
									confirmButtonColor: "rgb(227, 199, 22)",
									confirmButtonText: "Ok",
									timer: 30000,
								});
							}
						}
					}

					const detalleActual = response.detalleSolicitudType.find((detalle) => detalle.idDetalleSolicitud === 1);
					this.sueldoEmpleado.sueldo = detalleActual.sueldo;
					this.sueldoEmpleado.variableMensual = detalleActual.sueldoVariableMensual;
					this.sueldoEmpleado.variableTrimestral = detalleActual.sueldoVariableTrimestral;
					this.sueldoEmpleado.variableSemestral = detalleActual.sueldoVariableSemestral;
					this.sueldoEmpleado.variableAnual = detalleActual.sueldoVariableAnual;

					this.model.codigoPosicion = detalleActual.codigoPosicion;
					this.model.descrPosicion = detalleActual.descripcionPosicion;
					this.model.subledger = detalleActual.subledger;
					this.model.nombreCompleto = detalleActual.nombreEmpleado;
					this.model.compania = detalleActual.compania;
					this.model.unidadNegocio = detalleActual.unidadNegocio;
					this.model.departamento = detalleActual.departamento;
					this.model.nombreCargo = detalleActual.cargo;
					this.model.localidad = detalleActual.localidad;
					this.model.nivelDir = detalleActual.nivelDireccion;
					this.model.nomCCosto = detalleActual.centroCosto;
					this.model.misionCargo = detalleActual.misionCargo;
					this.model.justificacionCargo = detalleActual.justificacion;
					this.model.reportaA = detalleActual.reportaA;
					this.model.supervisaA = detalleActual.supervisaA;
					this.model.tipoContrato = detalleActual.tipoContrato;
					this.model.nivelRepa = detalleActual.nivelReporteA;
					this.model.sueldo = detalleActual.sueldo;
					this.model.sueldoMensual = detalleActual.sueldoVariableMensual;
					this.model.sueldoTrimestral = detalleActual.sueldoVariableTrimestral;
					this.model.sueldoSemestral = detalleActual.sueldoVariableSemestral;
					this.model.sueldoAnual = detalleActual.sueldoVariableAnual;
					this.model.correo = detalleActual.correo;
					this.model.fechaIngreso = detalleActual.fechaIngreso;
					this.model.sucursal = detalleActual.sucursal;
					this.model.fechaIngresogrupo = detalleActual.fechaIngreso;
					this.model.grupoPago = detalleActual.grupoDePago;
					this.model.descrPuesto = detalleActual.descripcionPosicion;
					this.codigoReportaA = detalleActual.jefeSolicitante;
					this.nivelDireccionDatoPropuesto = detalleActual.nivelDireccion;
					this.viewInputs = detalleActual.codigo === "1";
					this.unidadNegocioEmp = detalleActual.unidadNegocio;

					if (this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
						this.viewInputs = false;
						this.RegistrarsolicitudCompletada = false;

						if (this.detalleSolicitud.supervisaA.toUpperCase().includes("TRANSFERENCIA")) {
							this.RegistrarsolicitudCompletada = true;
						}
					}

					// if (this.unidadNegocioEmp.toUpperCase().includes("AREAS") || this.unidadNegocioEmp.toUpperCase().includes("ÁREAS")) {
					// 	this.mantenimientoService.getTipoRuta().subscribe({
					// 		next: (response) => {
					// 			this.dataTipoRutaEmp = response.tipoRutaType
					// 				.filter(({ estado }) => estado === "A")
					// 				.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("CORPORATIV"))
					// 				.map((r) => ({
					// 					id: r.id,
					// 					descripcion: r.tipoRuta,
					// 				}));

					// 			this.loadingComplete++;

					// 			this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

					// 			this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

					// 			this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.nivelDir}`;

					// 			if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
					// 				this.getNivelesAprobacion();

					// 				if (this.model.codigoPosicion.trim().length > 0) {
					// 					this.obtenerAprobacionesPorPosicionAPS();
					// 					this.obtenerAprobacionesPorPosicionAPD();
					// 				}

					// 				let variables = this.generateVariablesFromFormFields();
					// 			}
					// 		},
					// 		error: (error: HttpErrorResponse) => {
					// 			this.utilService.modalResponse(error.error, "error");
					// 		},
					// 	});
					// } else {
					// 	this.mantenimientoService.getTipoRuta().subscribe({
					// 		next: (response) => {
					// 			this.dataTipoRutaEmp = response.tipoRutaType
					// 				.filter(({ estado }) => estado === "A")
					// 				.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("UNIDAD"))
					// 				.map((r) => ({
					// 					id: r.id,
					// 					descripcion: r.tipoRuta,
					// 				}));

					// 			this.loadingComplete++;

					// 			this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

					// 			this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

					// 			this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.nivelDir}`;

					// 			if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
					// 				this.getNivelesAprobacion();

					// 				if (this.model.codigoPosicion.trim().length > 0) {
					// 					this.obtenerAprobacionesPorPosicionAPS();
					// 					this.obtenerAprobacionesPorPosicionAPD();
					// 				}

					// 				let variables = this.generateVariablesFromFormFields();
					// 			}
					// 		},
					// 		error: (error: HttpErrorResponse) => {
					// 			this.utilService.modalResponse(error.error, "error");
					// 		},
					// 	});
					// }
				}

				if (response.totalRegistros === 2) {
					const detallePropuestos = response.detalleSolicitudType.find((detalle) => detalle.idDetalleSolicitud === 2);

					this.modelPropuestos.codigoPosicion = detallePropuestos.codigoPosicion;
					this.modelPropuestos.descrPosicion = detallePropuestos.descripcionPosicion;
					this.modelPropuestos.subledger = detallePropuestos.subledger;
					this.modelPropuestos.nombreCompleto = detallePropuestos.nombreEmpleado;
					this.modelPropuestos.compania = detallePropuestos.compania;
					this.modelPropuestos.unidadNegocio = detallePropuestos.unidadNegocio;
					this.modelPropuestos.departamento = detallePropuestos.departamento;
					this.modelPropuestos.nombreCargo = detallePropuestos.cargo;
					this.modelPropuestos.localidad = detallePropuestos.localidad;
					this.modelPropuestos.nivelDir = detallePropuestos.nivelDireccion;
					this.modelPropuestos.nomCCosto = detallePropuestos.centroCosto;
					this.modelPropuestos.misionCargo = detallePropuestos.misionCargo;
					this.modelPropuestos.justificacionCargo = detallePropuestos.justificacion;
					this.modelPropuestos.reportaA = detallePropuestos.reportaA;
					this.modelPropuestos.supervisaA = detallePropuestos.supervisaA;
					this.modelPropuestos.tipoContrato = detallePropuestos.tipoContrato;
					this.modelPropuestos.nivelRepa = detallePropuestos.nivelReporteA;
					this.modelPropuestos.sueldo = detallePropuestos.sueldo;
					this.modelPropuestos.sueldoMensual = detallePropuestos.sueldoVariableMensual;
					this.modelPropuestos.sueldoTrimestral = detallePropuestos.sueldoVariableTrimestral;
					this.modelPropuestos.sueldoSemestral = detallePropuestos.sueldoVariableSemestral;
					this.modelPropuestos.sueldoAnual = detallePropuestos.sueldoVariableAnual;
					this.modelPropuestos.correo = detallePropuestos.correo;
					this.modelPropuestos.fechaIngreso = detallePropuestos.fechaIngreso;
					this.fechaCambioPropuesta = new Date(detallePropuestos.fechaIngreso);
					this.modelPropuestos.sucursal = detallePropuestos.sucursal;
					this.modelPropuestos.grupoPago = detallePropuestos.grupoDePago;
					this.modelPropuestos.descrPuesto = detallePropuestos.descripcionPosicion;
					this.detalleSolicitudPropuestos.movilizacion = detallePropuestos.movilizacion;
					this.detalleSolicitudPropuestos.alimentacion = detallePropuestos.alimentacion;
					this.codigoReportaA = detallePropuestos.jefeSolicitante;
					this.unidadNegocioEmp = detallePropuestos.unidadNegocio;

					this.transferenciaCompania = detallePropuestos.compania;
					this.transferenciaUnidadNegocio = detallePropuestos.unidadNegocio;

					if (this.unidadNegocioEmp.toUpperCase().includes("AREAS") || this.unidadNegocioEmp.toUpperCase().includes("ÁREAS")) {
						this.mantenimientoService.getTipoRuta().subscribe({
							next: (response) => {
								this.dataTipoRutaEmp = response.tipoRutaType
									.filter(({ estado }) => estado === "A")
									.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("CORPORATIV"))
									.map((r) => ({
										id: r.id,
										descripcion: r.tipoRuta,
									}));
								this.loadingComplete++;

								this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

								this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

								this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.modelPropuestos.nivelDir}`;

								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.getNivelesAprobacion();

									if (this.modelPropuestos.codigoPosicion.trim().length > 0) {
										this.obtenerAprobacionesPorPosicionAPS();
										this.obtenerAprobacionesPorPosicionAPD();
										console.log("SI LLEGA");
									}

									let variables = this.generateVariablesFromFormFields();
								}
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					} else {
						this.mantenimientoService.getTipoRuta().subscribe({
							next: (response) => {
								this.dataTipoRutaEmp = response.tipoRutaType
									.filter(({ estado }) => estado === "A")
									.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("UNIDAD"))
									.map((r) => ({
										id: r.id,
										descripcion: r.tipoRuta,
									}));
								this.loadingComplete++;

								this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

								this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

								this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.modelPropuestos.nivelDir}`;

								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.getNivelesAprobacion();

									if (this.modelPropuestos.codigoPosicion.trim().length > 0) {
										this.obtenerAprobacionesPorPosicionAPS();
										this.obtenerAprobacionesPorPosicionAPD();
										console.log("SI LLEGA");
									}

									let variables = this.generateVariablesFromFormFields();
								}
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					}
				}

				this.oldData = structuredClone({
					subledger: this.model.subledger,
					justificacion: this.model.justificacionCargo,
					idTipoAccion: this.solicitud.idTipoAccion,
					fechaCambioPropuesto: new Date(this.fechaCambioPropuesta),
					companiaPropuesto: this.transferenciaCompania,
					unidadPropuesto: this.transferenciaUnidadNegocio,
					codigoPosicionPropuesto: this.modelPropuestos.codigoPosicion,
					movilizacionPropuesto: this.detalleSolicitudPropuestos.movilizacion,
					alimentacionPropuesto: this.detalleSolicitudPropuestos.alimentacion,
					sueldoPropuesto: this.sueldoEmpleado.sueldo,
					sueldoMensualPropuesto: this.sueldoEmpleado.variableMensual,
					sueldoTrimestralPropuesto: this.sueldoEmpleado.variableTrimestral,
					sueldoSemestralPropuesto: this.sueldoEmpleado.variableSemestral,
					sueldoAnualPropuesto: this.sueldoEmpleado.variableAnual,
				});

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	obtenerAprobacionesPorPosicion() {
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
			next: (res) => {
				if (res.totalRegistros === 0 || res.totalRegistros === null) {
					this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");

					this.existenNivelesAprobacion = false;

					return;
				}

				this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
					next: (response) => {
						this.existenNivelesAprobacion = true;

						this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
					},
				});
			},
		});
	}

	obtenerAprobacionesPorPosicionPropuesto() {
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
			next: (res) => {
				if (res.totalRegistros === 0 || res.totalRegistros === null) {
					this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");

					this.existenNivelesAprobacion = false;

					return;
				}

				this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
					next: (response) => {
						this.existenNivelesAprobacion = true;

						this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
					},
					error: (error: HttpErrorResponse) => {
						this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
					},
				});
			},
		});
	}

	getNivelesAprobacion() {
		if (this.modelPropuestos.codigoPosicion !== "" && this.modelPropuestos.codigoPosicion !== undefined && this.modelPropuestos.codigoPosicion != null) {
			this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
				next: (response) => {
					this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "APD").subscribe({
						next: (responseAPD) => {
							this.primerNivelAprobacion = responseAPD.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
							this.mapearDetallesAprobadores(response.nivelAprobacionPosicionType);

							this.existenNivelesAprobacion = true;
						},
						error: (error: HttpErrorResponse) => {
							this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
						},
					});
					this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
				},
			});
		}
	}

	obtenerAprobacionesPorPosicionAPS() {
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "APS").subscribe({
			next: (response) => {
				this.dataTipoRuta.length = 0;
				this.dataRuta.length = 0;
				this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType || [];
				this.dataAprobacionesPorPosicionAPS.forEach((item) => {
					this.dataTipoRuta.push(item.nivelAprobacionType.tipoRuta);
					this.dataRuta.push(item.nivelAprobacionType.ruta);
				});
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
			},
		});
	}

	obtenerAprobacionesPorPosicionAPD() {
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.modelPropuestos.codigoPosicion, this.modelPropuestos.nivelDir, this.dataTipoRutaEmp[0].id, "APD").subscribe({
			next: (response) => {
				this.dataAprobadoresDinamicos.length = 0;
				this.dataAprobacionesPorPosicionAPD = response.nivelAprobacionPosicionType;
				this.primerNivelAprobacion = response.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
				this.dataAprobacionesPorPosicionAPD.forEach((item) => {
					this.dataAprobadoresDinamicos.push(item.aprobador.nivelDireccion);
				});
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
			},
		});
	}

	lookForError(result: any): void {
		if (result.error !== undefined && result.error !== null) {
			console.log("routing to app error page ", result.error.message);
			this.errorMessage = result.error.message;
			this.utilService.modalResponse(this.errorMessage, "error");
		}
	}

	async onSubmit() {
		// const regexp = /^[0-9.,]+$/.test(this.modelPropuestos.sueldo);
		// const regexp1 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoMensual);
		// const regexp2 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoTrimestral);
		// const regexp3 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoSemestral);
		// const regexp4 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoAnual);

		// if (!regexp || !regexp1 || !regexp2 || !regexp3 || !regexp4) {
		// 	Swal.fire({
		// 		text: "Debe ingresar solo números en el sueldo y tipo variable",
		// 		icon: "info",
		// 		confirmButtonColor: "rgb(227, 199, 22)",
		// 		confirmButtonText: "OK",
		// 	});

		// 	return;
		// }

		this.modelPropuestos.sueldo = this.modelPropuestos.sueldo === null || this.modelPropuestos.sueldo === undefined || this.modelPropuestos.sueldo === "" ? "0" : this.modelPropuestos.sueldo;
		this.modelPropuestos.sueldoMensual = this.modelPropuestos.sueldoMensual === null || this.modelPropuestos.sueldoMensual === undefined || this.modelPropuestos.sueldoMensual === "" ? "0" : this.modelPropuestos.sueldoMensual;
		this.modelPropuestos.sueldoTrimestral = this.modelPropuestos.sueldoTrimestral === null || this.modelPropuestos.sueldoTrimestral === undefined || this.modelPropuestos.sueldoTrimestral === "" ? "0" : this.modelPropuestos.sueldoTrimestral;
		this.modelPropuestos.sueldoSemestral = this.modelPropuestos.sueldoSemestral === null || this.modelPropuestos.sueldoSemestral === undefined || this.modelPropuestos.sueldoSemestral === "" ? "0" : this.modelPropuestos.sueldoSemestral;
		this.modelPropuestos.sueldoAnual = this.modelPropuestos.sueldoAnual === null || this.modelPropuestos.sueldoAnual === undefined || this.modelPropuestos.sueldoAnual === "" ? "0" : this.modelPropuestos.sueldoAnual;

		if (parseFloat(this.sueldoEmpleado.sueldo) < parseFloat(this.modelPropuestos.sueldo) || parseFloat(this.sueldoEmpleado.variableMensual) < parseFloat(this.modelPropuestos.sueldoMensual) || parseFloat(this.sueldoEmpleado.variableTrimestral) < parseFloat(this.modelPropuestos.sueldoTrimestral) || parseFloat(this.sueldoEmpleado.variableSemestral) < parseFloat(this.modelPropuestos.sueldoSemestral) || parseFloat(this.sueldoEmpleado.variableAnual) < parseFloat(this.modelPropuestos.sueldoAnual)) {
			Swal.fire({
				text: "No se puede registrar valores variables mayores a los obtenidos del sistema",
				icon: "info",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "OK",
			});

			return;
		}

		const { isConfirmed } = await Swal.fire({
			text: "¿Desea guardar la Solicitud?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "rgb(227, 199, 22)",
			cancelButtonColor: "#77797a",
			confirmButtonText: "Sí",
			cancelButtonText: "No",
		});

		if (isConfirmed) {
			this.save();

			if (this.submitted) {
			}
		}
	}

	override generateVariablesFromFormFields() {
		let variables: any = {};

		if (this.taskType_Activity == environment.taskType_AP_Registrar) {
			this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
				if (index === 0) {
					const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

					const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

					variables.correo_notificador_creador = {
						value: this.solicitudes.modelDetalleAprobaciones.correo,
					};
					variables.alias = {
						value: this.solicitudes.modelDetalleAprobaciones.correo,
					};
					variables.correo_aprobador = {
						value: elemento.aprobador.correo,
					};
					variables.asunto_revision_solicitud = {
						value: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
					};
					variables.cuerpo_notificacion = {
						value: modifiedHtmlString,
					};
					variables.password = {
						value: "p4$$w0rd",
					};

					this.emailVariables = {
						de: this.solicitudes.modelDetalleAprobaciones.correo,
						para: elemento.aprobador.correo,
						// alias: this.solicitudes.modelDetalleAprobaciones.correo,
						alias: "Notificación 1",
						asunto: variables.asunto_revision_solicitud.value,
						cuerpo: modifiedHtmlString,
						password: variables.password.value,
					};

					this.emailVariables2 = {
						de: this.solicitudes.modelDetalleAprobaciones.correo,
						para: elemento.aprobador.correo,
						// alias: this.solicitudes.modelDetalleAprobaciones.correo,
						alias: "Notificación 1",
						asunto: variables.asunto_revision_solicitud.value,
						cuerpo: modifiedHtmlString,
						password: variables.password.value,
					};
				}

				if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_MEDIA) {
					variables.correoNotificacionGerenciaMedia = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenciaMedia = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenciaMedia = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenciaMedia = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenciaMedia = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_UNIDAD) {
					variables.correoNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_JEFATURA) {
					variables.correoNotificacionJefatura = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionJefatura = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionJefatura = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionJefatura = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionJefatura = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion.toUpperCase().includes(this.NIVEL_APROBACION_VICEPRESIDENCIA)) {
					variables.correoNotificacionVicepresidencia = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionVicepresidencia = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionVicepresidencia = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionVicepresidencia = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionVicepresidencia = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_RRHH) {
					variables.correoNotificacionGerenteRRHH = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenteRRHH = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenteRRHH = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenteRRHH = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenteRRHH = {
						value: elemento.aprobador.subledger,
					};
				}
			});

			if (this.solicitud.estadoSolicitud.toUpperCase() === "DV") {
				variables.usuario_logged_accionDevolver = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${this.selectedOption.toUpperCase() === "SI" ? "Registrar Solicitud: Solicitud Anulada" : "Registrar Solicitud: Solicitud Enviada"} por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			} else {
				variables.usuario_logged_accion = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${this.selectedOption.toUpperCase() === "SI" ? "Registrar Solicitud: Solicitud Anulada" : "Registrar Solicitud: Solicitud Enviada"} por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			}

			variables.codigoPosicion = {
				value: this.modelPropuestos.codigoPosicion,
			};
			variables.misionCargo = {
				value: this.modelPropuestos.misionCargo,
			};
			variables.justificacionCargo = {
				value: this.modelPropuestos.justificacionCargo,
			};
			variables.empresa = {
				value: this.modelPropuestos.compania,
			};
			variables.unidadNegocio = {
				value: this.modelPropuestos.unidadNegocio,
			};
			variables.descripcionPosicion = {
				value: this.modelPropuestos.descrPosicion,
			};
			variables.areaDepartamento = {
				value: this.modelPropuestos.departamento,
			};
			variables.localidadZona = {
				value: this.modelPropuestos.localidad,
			};
			variables.centroCosto = {
				value: this.modelPropuestos.nomCCosto,
			};
			variables.reportaa = {
				value: this.modelPropuestos.reportaA,
			};
			variables.nivelReportea = {
				value: this.modelPropuestos.nivelRepa,
			};
			variables.supervisa = {
				value: this.modelPropuestos.supervisaA,
			};
			variables.tipoContrato = {
				value: this.modelPropuestos.tipoContrato,
			};
			variables.sueldo = {
				value: this.modelPropuestos.sueldo,
			};
			variables.sueldoMensual = {
				value: this.modelPropuestos.sueldoMensual,
			};
			variables.sueldoTrimestral = {
				value: this.modelPropuestos.sueldoTrimestral,
			};
			variables.sueldoSemestral = {
				value: this.modelPropuestos.sueldoSemestral,
			};
			variables.sueldoAnual = {
				value: this.modelPropuestos.sueldoAnual,
			};
			variables.anularSolicitud = {
				value: this.selectedOption,
			};
			variables.comentariosAnulacion = {
				value: this.modelPropuestos.comentariosAnulacion,
			};
			variables.nivelDireccion = {
				value: this.modelPropuestos.nivelDir,
			};
			variables.usuarioNotificacionCreador = {
				value: this.solicitudes.modelDetalleAprobaciones.usuarioAprobador,
			};
			variables.nivelDireccionNotificacionCreador = {
				value: this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador,
			};
			variables.descripcionPosicionCreador = {
				value: this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador,
			};
			variables.subledgerNotificacionCreador = {
				value: this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador,
			};
			variables.Id_Solicitud = {
				value: this.solicitud.idSolicitud,
			};
			variables.tipoSolicitud = {
				value: this.solicitud.tipoSolicitud,
			};
			if (this.solicitud.tipoAccion.toUpperCase().includes("TEMPORAL")) {
				variables.tipoAccion = { value: "asignacionTemporal" };
			} else {
				variables.tipoAccion = { value: this.solicitud.tipoAccion };
			}

			variables.transferenciaCompania = {
				value: this.viewInputs,
			};
			variables.urlTarea = {
				value: `${portalWorkFlow}solicitudes/revisar-solicitud/${this.idDeInstancia}/${this.id_solicitud_by_params}`,
			};
			variables.tipoRuta = {
				value: this.dataTipoRuta,
				type: "String",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
			variables.ruta = {
				value: this.dataRuta,
				type: "String",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
			variables.resultadoRutaAprobacion = {
				value: JSON.stringify(this.dataAprobadoresDinamicos),
				type: "Object",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
		}
		if (this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
			this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
				if (index === 0) {
					const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

					const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

					variables.correo_notificador_creador = {
						value: this.solicitudes.modelDetalleAprobaciones.correo,
					};
					variables.alias = {
						value: this.solicitudes.modelDetalleAprobaciones.correo,
					};
					variables.correo_aprobador = {
						value: elemento.aprobador.correo,
					};
					variables.asunto_revision_solicitud = {
						value: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
					};
					variables.cuerpo_notificacion = {
						value: modifiedHtmlString,
					};
					variables.password = {
						value: "p4$$w0rd",
					};

					this.emailVariables = {
						de: this.solicitudes.modelDetalleAprobaciones.correo,
						para: elemento.aprobador.correo,
						// alias: this.solicitudes.modelDetalleAprobaciones.correo,
						alias: "Notificación 1",
						asunto: variables.asunto_revision_solicitud.value,
						cuerpo: modifiedHtmlString,
						password: variables.password.value,
					};

					this.emailVariables2 = {
						de: this.solicitudes.modelDetalleAprobaciones.correo,
						para: elemento.aprobador.correo,
						// alias: this.solicitudes.modelDetalleAprobaciones.correo,
						alias: "Notificación 1",
						asunto: variables.asunto_revision_solicitud.value,
						cuerpo: modifiedHtmlString,
						password: variables.password.value,
					};
				}

				if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_MEDIA) {
					variables.correoNotificacionGerenciaMedia = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenciaMedia = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenciaMedia = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenciaMedia = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenciaMedia = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_UNIDAD) {
					variables.correoNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenciaUnidadCorporativa = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_JEFATURA) {
					variables.correoNotificacionJefatura = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionJefatura = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionJefatura = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionJefatura = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionJefatura = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion.toUpperCase().includes(this.NIVEL_APROBACION_VICEPRESIDENCIA)) {
					variables.correoNotificacionVicepresidencia = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionVicepresidencia = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionVicepresidencia = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionVicepresidencia = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionVicepresidencia = {
						value: elemento.aprobador.subledger,
					};
				} else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_RRHH) {
					variables.correoNotificacionGerenteRRHH = {
						value: elemento.aprobador.correo,
					};
					variables.usuarioNotificacionGerenteRRHH = {
						value: elemento.aprobador.usuario,
					};
					variables.nivelDireccionNotificacionGerenteRRHH = {
						value: elemento.aprobador.nivelDireccion,
					};
					variables.descripcionPosicionNotificacionGerenteRRHH = {
						value: elemento.aprobador.descripcionPosicion,
					};
					variables.subledgerNotificacionGerenteRRHH = {
						value: elemento.aprobador.subledger,
					};
				}
			});

			if (this.solicitud.estadoSolicitud.toUpperCase() === "DV") {
				variables.usuario_logged_accion_completaDevolver = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${this.selectedOption.toUpperCase() === "SI" ? "Transferencia de Compañia: Solicitud Anulada" : "Transferencia de Compañia: Solicitud Enviada"} por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			} else {
				variables.usuario_logged_accion_completa = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${this.selectedOption.toUpperCase() === "SI" ? "Transferencia de Compañia: Solicitud Anulada" : "Transferencia de Compañia: Solicitud Enviada"} por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			}

			variables.urlTarea = {
				value: `${portalWorkFlow}solicitudes/revisar-solicitud/${this.idDeInstancia}/${this.id_solicitud_by_params}`,
			};
			variables.tipoRuta = {
				value: this.dataTipoRuta,
				type: "String",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
			variables.ruta = {
				value: this.dataRuta,
				type: "String",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
			variables.resultadoRutaAprobacion = {
				value: JSON.stringify(this.dataAprobadoresDinamicos),
				type: "Object",
				valueInfo: {
					objectTypeName: "java.util.ArrayList",
					serializationDataFormat: "application/json",
				},
			};
		}

		return { variables };
	}

	consultarNextTaskAprobador(IdSolicitud: string) {
		this.consultaTareasService.getTaskId(IdSolicitud).subscribe((tarea) => {
			this.tareasPorCompletar = tarea.filter((empleado) => {
				return empleado["deleteReason"] === null;
			});
			if (this.tareasPorCompletar.length === 0) {
				return;
			} else {
				this.uniqueTaskId = this.tareasPorCompletar[0].id;
				this.taskType_Activity = this.tareasPorCompletar[0].taskDefinitionKey;
				this.nameTask = this.tareasPorCompletar[0].name;

				if (this.taskType_Activity !== environment.taskType_Registrar) {
					this.RegistrarsolicitudCompletada = false;
				}
			}
			this.id_solicitud_by_params = this.solicitud.idSolicitud;

			let aprobadoractual = "";

			this.camundaRestService.getVariablesForTaskLevelAprove(this.uniqueTaskId).subscribe({
				next: (aprobador) => {
					aprobadoractual = aprobador.nivelAprobacion?.value;
					this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, this.dataTipoRutaEmp[0].id, "APS").subscribe({
						next: (responseAPS) => {
							this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
							this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));
							if (aprobadoractual !== undefined) {
								console.log(this.dataAprobacionesPorPosicionAPS);
								console.log(this.aprobacion);

								if (this.aprobacion.aprobador.nivelDireccion.trim() !== null) {
									this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
									this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = this.aprobacion.nivelAprobacionType.idNivelAprobacion;
									this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.aprobacion.nivelAprobacionType.idTipoSolicitud.toString();
									this.solicitudes.modelDetalleAprobaciones.id_Accion = this.aprobacion.nivelAprobacionType.idAccion;
									this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.aprobacion.nivelAprobacionType.idTipoMotivo;
									this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = this.aprobacion.nivelAprobacionType.idTipoRuta;
									this.solicitudes.modelDetalleAprobaciones.id_Ruta = this.aprobacion.nivelAprobacionType.idRuta;
									this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.aprobacion.nivelAprobacionType.tipoSolicitud;
									this.solicitudes.modelDetalleAprobaciones.motivo = this.aprobacion.nivelAprobacionType.tipoMotivo;
									this.solicitudes.modelDetalleAprobaciones.tipoRuta = this.aprobacion.nivelAprobacionType.tipoRuta;
									this.solicitudes.modelDetalleAprobaciones.ruta = this.aprobacion.nivelAprobacionType.ruta;
									this.solicitudes.modelDetalleAprobaciones.accion = this.aprobacion.nivelAprobacionType.accion;
									this.solicitudes.modelDetalleAprobaciones.nivelDirecion = this.aprobacion.nivelAprobacionType.nivelDireccion;
									this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = this.aprobacion.nivelAprobacionType.nivelAprobacionRuta;
									this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = this.aprobacion.aprobador.usuario;
									this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = this.aprobacion.aprobador.codigoPosicion;
									this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = this.aprobacion.aprobador.descripcionPosicion;
									this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = this.aprobacion.aprobador.subledger;
									this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = this.aprobacion.aprobador.nivelDireccion;
									this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = this.aprobacion.aprobador.codigoPosicionReportaA;
									this.solicitudes.modelDetalleAprobaciones.estado = "A";
									this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisar";
									this.solicitudes.modelDetalleAprobaciones.correo = this.aprobacion.aprobador.correo;
									this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = this.aprobacion.aprobador.usuario;
									this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = this.aprobacion.aprobador.usuario;
									this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
									this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();
								}

								this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
									next: () => {},
									error: (err) => {
										console.error(err);
									},
								});
							} else {
								console.log(this.taskType_Activity);

								if (this.taskType_Activity == environment.taskType_RRHH || this.taskType_Activity == environment.taskType_CF_RRHH || this.taskType_Activity == environment.taskType_AP_RRHH || this.taskType_Activity == environment.taskType_RG_RRHH) {
									//GERENTE RECURSOS HUMANOS
									aprobadoractual = "RRHH";
								} else {
									aprobadoractual = "REMUNERA";
								}
							}
							this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));

							const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

							const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

							this.emailVariables = {
								de: "emisor",
								para: this.aprobacion.aprobador.correo,
								// alias: this.solicitudes.modelDetalleAprobaciones.correo,
								alias: "Notificación 1",
								asunto: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
								cuerpo: modifiedHtmlString,
								password: "password",
							};
							this.solicitudes.sendEmail(this.emailVariables).subscribe({
								next: () => {},
								error: (error) => {
									console.error(error);
								},
							});
						},
					});
				},
			});
		});
	}

	mapearDetallesAprobadores(nivelAprobacionPosicionType: any[]) {
		this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)).subscribe({
			next: (res) => {
				this.detalleNivelAprobacion = nivelAprobacionPosicionType.map(({ nivelAprobacionType, aprobador }, index) => {
					const detalleNivel = {
						id_Solicitud: this.solicitud.idSolicitud,
						id_NivelAprobacion: nivelAprobacionType.idNivelAprobacion,
						id_TipoSolicitud: nivelAprobacionType.idTipoSolicitud.toString(),
						id_Accion: nivelAprobacionType.idAccion,
						id_TipoMotivo: nivelAprobacionType.idTipoMotivo,
						id_TipoRuta: nivelAprobacionType.idTipoRuta,
						id_Ruta: nivelAprobacionType.idRuta,
						tipoSolicitud: nivelAprobacionType.tipoSolicitud,
						motivo: nivelAprobacionType.tipoMotivo,
						tipoRuta: nivelAprobacionType.tipoRuta,
						ruta: nivelAprobacionType.ruta,
						accion: nivelAprobacionType.accion,
						nivelDirecion: nivelAprobacionType.nivelDireccion,
						nivelAprobacionRuta: nivelAprobacionType.nivelAprobacionRuta,
						usuarioAprobador: aprobador.usuario,
						codigoPosicionAprobador: aprobador.codigoPosicion,
						descripcionPosicionAprobador: aprobador.descripcionPosicion,
						sudlegerAprobador: aprobador.subledger,
						codigoPosicionReportaA: aprobador.codigoPosicionReportaA,
						nivelDireccionAprobador: aprobador.nivelDireccion,
						estadoAprobacion: nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes(this.primerNivelAprobacion.toUpperCase()) ? "PorRevisar" : nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("RRHH") ? "PorRevisarRRHH" : nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("REMUNERA") ? "PorRevisarRemuneraciones" : "PendienteAsignacion",
						estado: nivelAprobacionType.estado,
						correo: aprobador.correo === null ? "" : aprobador.correo,
						usuarioCreacion: res.evType[0].nombreCompleto,
						usuarioModificacion: res.evType[0].nombreCompleto,
						comentario: "",
						fechaCreacion: new Date(),
						fechaModificacion: new Date(),
					};

					convertTimeZonedDate(detalleNivel.fechaCreacion);
					convertTimeZonedDate(detalleNivel.fechaModificacion);

					return detalleNivel;
				});
			},
		});
	}

	crearAnuladorSolicitud() {
		this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
			next: (res) => {
				this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
				this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = 200001;
				this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.solicitud.idTipoSolicitud.toString();
				this.solicitudes.modelDetalleAprobaciones.id_Accion = 200001;
				this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.solicitud.idTipoMotivo;
				this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = 200001;
				this.solicitudes.modelDetalleAprobaciones.id_Ruta = 200001;
				this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.solicitud.tipoSolicitud;
				this.solicitudes.modelDetalleAprobaciones.motivo = "AnularSolicitud";
				this.solicitudes.modelDetalleAprobaciones.tipoRuta = "AnularSolicitud";
				this.solicitudes.modelDetalleAprobaciones.ruta = "Anular Solicitud";
				this.solicitudes.modelDetalleAprobaciones.accion = "AnularSolicitud";
				this.solicitudes.modelDetalleAprobaciones.nivelDirecion = res.evType[0].nivelDir;
				this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = "Anular Solicitud";
				this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = res.evType[0].codigoPosicion;
				this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = res.evType[0].descrPosicion;
				this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = res.evType[0].subledger;
				this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = res.evType[0].nivelDir;
				this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = res.evType[0].codigoPosicionReportaA;
				this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "Anulado";
				this.solicitudes.modelDetalleAprobaciones.estado = "A";
				this.solicitudes.modelDetalleAprobaciones.correo = res.evType[0].correo;
				this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date();
				this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date();
				this.solicitudes.modelDetalleAprobaciones.comentario = this.model.comentariosAnulacion;

				convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaCreacion);
				convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaModificacion);

				this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
					next: () => {},
				});
			},
		});
	}

	onCompletar() {
		if (this.selectedOption === "No") {
			const regexp = /^[0-9.,]+$/.test(this.modelPropuestos.sueldo);
			const regexp1 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoMensual);
			const regexp2 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoTrimestral);
			const regexp3 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoSemestral);
			const regexp4 = /^[0-9.,]+$/.test(this.modelPropuestos.sueldoAnual);

			if (this.viewInputs && this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
				if (!regexp || !regexp1 || !regexp2 || !regexp3 || !regexp4) {
					Swal.fire({
						text: "No se puede Enviar Solicitud: Debe ingresar solo números en el sueldo y tipo variable",
						icon: "info",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "OK",
					});
					return;
				}
			}

			if (parseFloat(this.sueldoEmpleado.sueldo) < parseFloat(this.modelPropuestos.sueldo) || parseFloat(this.sueldoEmpleado.variableMensual) < parseFloat(this.modelPropuestos.sueldoMensual) || parseFloat(this.sueldoEmpleado.variableTrimestral) < parseFloat(this.modelPropuestos.sueldoTrimestral) || parseFloat(this.sueldoEmpleado.variableSemestral) < parseFloat(this.modelPropuestos.sueldoSemestral) || parseFloat(this.sueldoEmpleado.variableAnual) < parseFloat(this.modelPropuestos.sueldoAnual)) {
				Swal.fire({
					text: "No se puede Enviar Solicitud: Valores variables mayores a los obtenidos del sistema",
					icon: "info",
					confirmButtonColor: "rgb(227, 199, 22)",
					confirmButtonText: "OK",
				});
				return;
			}
		}

		if (this.uniqueTaskId === null) {
			this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

			return;
		}

		this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");

		let variables = this.generateVariablesFromFormFields();

		if (this.selectedOption.toUpperCase().includes("SI")) {
			this.solicitud.estadoSolicitud = "AN";
		} else {
			this.solicitud.estadoSolicitud = "4";
		}

		// if (this.solicitud.tipoAccion.toUpperCase().includes("ASIGNA")) {
		// 	// this.solicitud.estadoSolicitud = "AT";

		// 	this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
		// 		next: (responseSolicitud) => {
		// 			setTimeout(() => {
		// 				this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)).subscribe({
		// 					next: (res) => {
		// 						const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} de Tipo Acci\u00F3n Asignaci\u00F3n Temporal est\u00E1 disponible para completar la tarea.<p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

		// 						const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", res.evType[0].nombreCompleto).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/detalle-solicitud/${this.solicitud.idSolicitud}`);

		// 						this.emailVariables = {
		// 							de: "emisor",
		// 							para: res.evType[0].correo,
		// 							alias: "Notificación 1",
		// 							asunto: `Asignación Temporal de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
		// 							cuerpo: modifiedHtmlString,
		// 							password: "password"
		// 						};

		// 						this.solicitudes.sendEmail(this.emailVariables).subscribe({
		// 							next: () => {
		// 							},
		// 							error: (error) => {
		// 								console.error(error);
		// 							}
		// 						});

		// 						this.utilService.closeLoadingSpinner();

		// 						this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");
		// 					}
		// 				});

		// 				setTimeout(() => {
		// 					this.router.navigate([
		// 						"/tareas/consulta-tareas",
		// 					]);
		// 				}, 1800);
		// 			}, 3000);
		// 		},
		// 		error: (error) => {
		// 			console.error(error);
		// 		}
		// 	});
		// }

		if (this.solicitud.estadoSolicitud !== "AN") {
			if (this.detalleSolicitud.codigo === "1" && !this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
				// const request = {
				// 	codigoPerfil: codigoPerfilDelegado,
				// 	codigoAplicacion: appCode,
				// 	codigoRecurso: resourceCode,
				// 	usuario: sessionStorage.getItem(LocalStorageKeys.IdLogin),
				// 	correo: sessionStorage.getItem(LocalStorageKeys.IdUsuario)
				// };

				// this.loginService.obtenerUsuariosPerfil(request).subscribe({
				// 	next: res => {
				// 		if (res.length === 0) {
				// 			Swal.fire({
				// 				text: "No existen usuario.",
				// 				icon: "error",
				// 				showCancelButton: false,
				// 				confirmButtonColor: "rgb(227, 199, 22)",
				// 				cancelButtonColor: "#77797a",
				// 				confirmButtonText: "OK"
				// 			});

				// 			return;
				// 		}

				// 		const emails = res.map(({ email }) => email).join(",");
				// 	}
				// });

				this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)).subscribe({
					next: (res) => {
						// const usuarios = res.evType.filter(r => r.compania === this.modelPropuestos.compania && r.unidadNegocio === this.modelPropuestos.unidadNegocio);

						// if (usuarios.length === 0) {
						// 	Swal.fire({
						// 		text: "No existen usuarios registrados para esta Compañía y Unidad de Negocio.",
						// 		icon: "error",
						// 		showCancelButton: false,
						// 		confirmButtonColor: "rgb(227, 199, 22)",
						// 		cancelButtonColor: "#77797a",
						// 		confirmButtonText: "OK"
						// 	});

						// 	return;
						// }

						// TODO: Reemplazar el res.evType por ususarios

						this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
						this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = 1300000;
						this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.solicitud.idTipoSolicitud.toString();
						this.solicitudes.modelDetalleAprobaciones.id_Accion = 1300000;
						this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.solicitud.idTipoMotivo;
						this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = 1300000;
						this.solicitudes.modelDetalleAprobaciones.id_Ruta = 1300000;
						this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.solicitud.tipoSolicitud;
						this.solicitudes.modelDetalleAprobaciones.motivo = "Transferencia de Compañia";
						this.solicitudes.modelDetalleAprobaciones.tipoRuta = "Transferencia de Compañia";
						this.solicitudes.modelDetalleAprobaciones.ruta = "Transferencia de Compañia";
						this.solicitudes.modelDetalleAprobaciones.accion = "Transferencia de Compañia";
						this.solicitudes.modelDetalleAprobaciones.nivelDirecion = res.evType[0].nivelDir;
						this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = "Transferencia de Compañia";
						this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = res.evType[0].nombreCompleto;
						this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = res.evType[0].codigoPosicion;
						this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = res.evType[0].descrPosicion;
						this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = res.evType[0].subledger;
						this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = res.evType[0].nivelDir;
						this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = res.evType[0].codigoPosicionReportaA;
						this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "Transferencia";
						this.solicitudes.modelDetalleAprobaciones.estado = "A";
						this.solicitudes.modelDetalleAprobaciones.correo = res.evType[0].correo;
						this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = res.evType[0].nombreCompleto;
						this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = res.evType[0].nombreCompleto;
						this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date();
						this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date();

						convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaCreacion);
						convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaModificacion);

						this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
							next: () => {
								this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
									next: (responsecamunda) => {
										this.solicitud.empresa = this.model.compania;
										this.solicitud.idEmpresa = this.model.compania;
										this.solicitud.unidadNegocio = this.model.unidadNegocio;
										this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

										this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
											next: (responseSolicitud) => {
												setTimeout(() => {
													const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} por Transferencia de Compa\u00F1\u00EDa para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para completar la tarea.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

													const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", res.evType[0].nombreCompleto).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

													this.emailVariables = {
														de: "emisor",
														para: res.evType[0].correo,
														// alias: this.solicitudes.modelDetalleAprobaciones.correo,
														alias: "Notificación 1",
														asunto: `Transferencia de Compañía de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
														cuerpo: modifiedHtmlString,
														password: "password",
													};

													this.solicitudes.sendEmail(this.emailVariables).subscribe({
														next: () => {},
														error: (error) => {
															console.error(error);
														},
													});

													this.utilService.closeLoadingSpinner();

													this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");

													setTimeout(() => {
														this.router.navigate(["/tareas/consulta-tareas"]);
													}, 1800);
												}, 3000);
											},
											error: (error) => {
												console.error(error);
											},
										});
									},
									error: (error: HttpErrorResponse) => {
										this.utilService.modalResponse(error.error, "error");
									},
								});
							},
						});
					},
				});

				return;
			}

			if (!this.solicitud.estadoSolicitud.includes("AN") && this.detalleNivelAprobacion.length > 0) {
				this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
					next: (res) => {
						this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
							next: (res) => {
								this.solicitud.empresa = this.model.compania;
								this.solicitud.idEmpresa = this.model.compania;
								this.solicitud.unidadNegocio = this.model.unidadNegocio;
								this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

								this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
									next: (responseSolicitud) => {
										setTimeout(() => {
											this.solicitudes.sendEmail(this.emailVariables2).subscribe({
												next: () => {},
												error: (error) => {
													console.error(error);
												},
											});

											this.utilService.closeLoadingSpinner();

											this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");

											setTimeout(() => {
												this.router.navigate(["/tareas/consulta-tareas"]);
											}, 1800);
										}, 3000);
									},
									error: (error) => {
										console.error(error);
									},
								});
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					},
					error: (err) => {
						console.error(err);
					},
				});

				this.submitted = true;
			}
		}

		if (this.solicitud.estadoSolicitud.includes("AN")) {
			const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} ha sido anulada.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

			const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.solicitud.usuarioCreacion).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.solicitud.idSolicitud}`);

			this.emailVariables = {
				de: "emisor",
				para: sessionStorage.getItem(LocalStorageKeys.IdUsuario),
				// alias: this.solicitudes.modelDetalleAprobaciones.correo,
				alias: "Notificación 1",
				asunto: `Notificación por Anulación de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
				cuerpo: modifiedHtmlString,
				password: "password",
			};
			this.solicitud.empresa = this.model.compania;
			this.solicitud.idEmpresa = this.model.compania;
			this.solicitud.unidadNegocio = this.model.unidadNegocio;
			this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

			this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
				next: (res) => {
					this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
						next: (responseSolicitud) => {
							setTimeout(() => {
								//this.consultarNextTaskAprobador(this.solicitud.idInstancia);
								this.crearAnuladorSolicitud();

								this.solicitudes.sendEmail(this.emailVariables).subscribe({
									next: () => {},
									error: (error) => {
										console.error(error);
									},
								});

								this.utilService.closeLoadingSpinner();

								this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");

								setTimeout(() => {
									this.router.navigate(["/solicitudes/consulta-solicitudes"]);
								}, 1800);
							}, 3000);
						},
						error: (error) => {
							console.error(error);
						},
					});
				},
			});
		}
	}

	public onCancel(): void {}

	save() {
		this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

		if (this.viewInputs && !this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
			this.modelPropuestos.codigoPosicion = "";
			this.modelPropuestos.departamento = "";
			this.modelPropuestos.localidad = "";
			this.modelPropuestos.grupoPago = "";
			this.modelPropuestos.descrPuesto = "";
			this.modelPropuestos.nomCCosto = "";
			this.modelPropuestos.sucursal = "";
			this.detalleSolicitudPropuestos.movilizacion = "";
			this.detalleSolicitudPropuestos.alimentacion = "";
			this.modelPropuestos.sueldo = "";
			this.modelPropuestos.sueldoMensual = "";
			this.modelPropuestos.sueldoTrimestral = "";
			this.modelPropuestos.sueldoSemestral = "";
			this.modelPropuestos.sueldoAnual = "";
		}

		this.submitted = true;
		let idInstancia = this.solicitudDataInicial.idInstancia;

		let extra = {
			idEmpresa: this.model.compania,
			empresa: this.model.compania,
			estadoSolicitud: "Pendiente",
			unidadNegocio: this.model.unidadNegocio,
			idUnidadNegocio: this.model.unidadNegocio,
		};

		this.solicitud.empresa = this.model.compania;
		this.solicitud.idEmpresa = this.model.compania;

		this.solicitud.unidadNegocio = this.model.unidadNegocio;
		this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

		this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {
			if (this.solicitud.estadoSolicitud.toUpperCase() === "DV") {
				this.detalleSolicitud.estado = "DV";
			}

			this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

			this.detalleSolicitud.areaDepartamento = this.model.departamento;

			this.detalleSolicitud.cargo = this.model.nombreCargo;
			this.detalleSolicitud.centroCosto = this.model.nomCCosto;
			this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
			this.detalleSolicitud.compania = this.model.compania;
			this.detalleSolicitud.departamento = this.model.departamento;
			this.detalleSolicitud.descripcionPosicion = this.model.descrPuesto;

			this.detalleSolicitud.localidad = this.model.localidad;
			this.detalleSolicitud.localidadZona = this.model.codigoPuesto;

			this.detalleSolicitud.misionCargo = this.model.misionCargo;
			this.detalleSolicitud.nivelDireccion = this.model.nivelDir;
			this.detalleSolicitud.nivelReporteA = this.model.nivelRepa;

			this.detalleSolicitud.nombreEmpleado = this.model.nombreCompleto;
			this.detalleSolicitud.jefeInmediatoSuperior = this.model.jefeInmediatoSuperior;
			this.detalleSolicitud.puestoJefeInmediato = this.model.puestoJefeInmediato;
			this.detalleSolicitud.nombreJefeSolicitante = this.model.jefeInmediatoSuperior;
			this.detalleSolicitud.responsableRRHH = this.solicitud.usuarioCreacion;
			this.detalleSolicitud.jefeSolicitante = this.codigoReportaA;

			this.detalleSolicitud.reportaA = this.model.reportaA;

			this.detalleSolicitud.subledger = this.model.subledger;

			this.detalleSolicitud.subledgerEmpleado = this.model.subledger;

			this.detalleSolicitud.sucursal = this.model.sucursal;

			this.detalleSolicitud.grupoDePago = this.model.grupoPago;

			this.detalleSolicitud.misionCargo = this.model.misionCargo === "" || this.model.misionCargo === undefined || this.model.misionCargo === null ? "" : this.model.misionCargo;
			this.detalleSolicitud.justificacion = this.model.justificacionCargo === "" || this.model.justificacionCargo === undefined || this.model.justificacionCargo === null ? "" : this.model.justificacionCargo;
			this.detalleSolicitud.sueldo = this.model.sueldo;
			this.detalleSolicitud.sueldoVariableMensual = this.model.sueldoMensual;
			this.detalleSolicitud.sueldoVariableTrimestral = this.model.sueldoTrimestral;
			this.detalleSolicitud.sueldoVariableSemestral = this.model.sueldoSemestral;
			this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
			this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
			this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

			this.detalleSolicitud.correo = this.model.correo;

			this.detalleSolicitud.supervisaA = this.model.supervisaA;
			this.detalleSolicitud.codigo = this.viewInputs ? "1" : "100";

			this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo === "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;
			if (this.taskType_Activity.toUpperCase().includes("AP_COMPLETARSOLICITUD")) {
				this.detalleSolicitud.supervisaA = "Transferencia";
				this.detalleSolicitud.codigo = "1";
			}

			this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe((responseDetalle) => {
				this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

				this.detalleSolicitud.areaDepartamento = this.modelPropuestos.departamento;

				this.detalleSolicitud.cargo = this.modelPropuestos.nombreCargo;
				this.detalleSolicitud.centroCosto = this.modelPropuestos.nomCCosto;
				this.detalleSolicitud.codigoPosicion = this.modelPropuestos.codigoPosicion;
				this.detalleSolicitud.compania = this.viewInputs ? this.model.compania : this.modelPropuestos.compania;
				this.detalleSolicitud.departamento = this.modelPropuestos.departamento;
				this.detalleSolicitud.descripcionPosicion = this.modelPropuestos.descrPuesto;

				this.detalleSolicitud.localidad = this.modelPropuestos.localidad;
				this.detalleSolicitud.localidadZona = this.modelPropuestos.codigoPuesto;

				this.detalleSolicitud.misionCargo = this.modelPropuestos.misionCargo;
				this.detalleSolicitud.nivelDireccion = this.modelPropuestos.nivelDir;
				this.detalleSolicitud.nivelReporteA = this.modelPropuestos.nivelRepa;

				this.detalleSolicitud.nombreEmpleado = this.modelPropuestos.nombreCompleto;

				this.detalleSolicitud.reportaA = this.modelPropuestos.reportaA;

				this.detalleSolicitud.subledger = this.modelPropuestos.subledger;

				this.detalleSolicitud.subledgerEmpleado = this.modelPropuestos.subledger;

				this.detalleSolicitud.sucursal = this.modelPropuestos.sucursal;

				this.detalleSolicitud.grupoDePago = this.modelPropuestos.grupoPago;

				this.detalleSolicitud.misionCargo = "";
				this.detalleSolicitud.justificacion = this.model.justificacionCargo;
				this.detalleSolicitud.sueldo = this.modelPropuestos.sueldo;
				this.detalleSolicitud.sueldoVariableMensual = this.modelPropuestos.sueldoMensual;
				this.detalleSolicitud.sueldoVariableTrimestral = this.modelPropuestos.sueldoTrimestral;
				this.detalleSolicitud.sueldoVariableSemestral = this.modelPropuestos.sueldoSemestral;
				this.detalleSolicitud.sueldoVariableAnual = this.modelPropuestos.sueldoAnual;
				this.detalleSolicitud.tipoContrato = this.modelPropuestos.tipoContrato;
				this.detalleSolicitud.unidadNegocio = this.modelPropuestos.unidadNegocio;

				this.detalleSolicitud.correo = this.modelPropuestos.correo;

				this.detalleSolicitud.supervisaA = this.modelPropuestos.supervisaA;

				this.detalleSolicitud.fechaIngreso = !(this.fechaCambioPropuesta instanceof Date) ? this.model.fechaIngreso : this.fechaCambioPropuesta;

				this.detalleSolicitud.alimentacion = this.detalleSolicitudPropuestos.alimentacion.toString();
				this.detalleSolicitud.movilizacion = this.detalleSolicitudPropuestos.movilizacion.toString();

				this.detalleSolicitud.compania = this.transferenciaCompania;
				this.detalleSolicitud.unidadNegocio = this.transferenciaUnidadNegocio;

				if (this.totalRegistrosDetallesolicitud === 2) {
					this.detalleSolicitud.idDetalleSolicitud = 2;
					this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe((responseDetalle) => {
						this.utilService.closeLoadingSpinner(); //comentado mmunoz
						this.utilService.modalResponse("Datos ingresados correctamente", "success");

						setTimeout(() => {
							window.location.reload();
						}, 1800);
					});
				} else {
					this.detalleSolicitud.idDetalleSolicitud = 100;

					this.solicitudes.guardarDetalleSolicitud(this.detalleSolicitud).subscribe((responseDetalle) => {
						this.utilService.closeLoadingSpinner(); //comentado mmunoz
						this.utilService.modalResponse("Datos ingresados correctamente", "success");

						setTimeout(() => {
							window.location.reload();
						}, 1800);
					});
				}
			});
		});
		this.submitted = true;
	}

	openModalReasignar(componentName: keyof DialogComponents) {
		console.log("SE ABRIO EL MODAL");
		this.modalService
			.open(dialogComponentList[componentName], {
				ariaLabelledBy: "modal-title",
			})
			.result.then(
				(result) => {
					console.log("Result: ", result);

					if (result === "close") {
						return;
					}
					if (Object.keys(result).length > 0) {
						console.log("Probando");
						// this.dataTableAprobadores.push(result);
					}
				},
				(reason) => {
					console.log(`Dismissed with: ${reason}`);
				}
			);
	}

	onSelectionChange() {
		console.log(this.selectedOption);
	}

	empleado: string = "";
	isDisabledEmpleado: boolean = false;
	subledger: string = "";
	isDisabledSubledger: boolean = false;

	search = (value: string, propSearch: "nombreCompleto" | "subledger", setEmpleadoData: (data: IEmpleadoData) => void): void => {
		this.mantenimientoService
			.getDataEmpleadosEvolution("ev")
			.pipe(
				map(this.buscarValor.bind(this, value, "evType", propSearch)), // Asegúrate de pasar propSearch aquí
				catchError((error) => {
					return this.mantenimientoService.getDataEmpleadosEvolution("jaff").pipe(map(this.buscarValor.bind(this, value, "jaffType", propSearch)));
				}),
				catchError((error) => {
					return this.mantenimientoService.getDataEmpleadosEvolution("spyral").pipe(map(this.buscarValor.bind(this, value, "spyralType", propSearch)));
				})
			)
			.subscribe({
				next: (data) => {
					console.log("Encontro", data);
					setEmpleadoData(data as IEmpleadoData);
				},
				error: (error) => {
					console.error(error);
				},
			});
	};

	buscarValor = (search, type: "jaffType" | "evType" | "spyralType", propSearch: "nombreCompleto" | "subledger", data: IEmpleados) => {
		const result = data?.[type].find((item) => {
			const regex = new RegExp(search, "i");
			return item[propSearch]?.match(regex); // Asegúrate de que item[propSearch] exista
		});
		if (!result) {
			throw new Error("No se encontró el valor esperado");
		}
		return result;
	};

	onCheckedComp = (event: Event): void => {
		const isChecked = (event.target as HTMLInputElement).checked;

		this.viewInputs = !isChecked;
	};

	fechaCambio: string = "";
	isDisabledFechaCambio: boolean = false;

	validateFechaCambio = (value: string) => {
		const fechaReferencia = this.formatter(this.detalleSolicitud.fechaIngreso);

		if (value.length !== 10) {
			return;
		}

		this.isDisabledFechaCambio = true;

		if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			this.errorFechaCambio(`El formato ingresado no es válido`);
			this.isDisabledFechaCambio = false;
			return;
		}

		const fechaIngresada = new Date(value);

		if (isNaN(fechaIngresada.getTime())) {
			this.errorFechaCambio(`La fecha ingresada no es valida, por favor verifique`);
			this.isDisabledFechaCambio = false;

			return;
		}

		const diferenciaMeses = this.calcularDiferenciaMeses(fechaReferencia, fechaIngresada);

		if (diferenciaMeses > 1) {
			this.errorFechaCambio(`La fecha de estar dentro del mes en el que se genero esta solicitud`);
			this.isDisabledFechaCambio = false;
			return;
		}
	};

	errorFechaCambio = (msg: string) => {
		Swal.fire({
			title: "Error",
			text: msg,
			icon: "error",
			confirmButtonText: "Ok",
		});
	};

	calcularDiferenciaMeses = (fechaDesde: Date, fechaHasta: Date) => {
		const year1 = fechaDesde.getFullYear();
		const year2 = fechaHasta.getFullYear();
		const month1 = fechaDesde.getMonth();
		const month2 = fechaHasta.getMonth();
		const diferencia = (year2 - year1) * 12 + (month2 - month1);
		return diferencia;
	};

	formatter = (timestamp: any): Date => {
		const fecha = new Date(timestamp);

		const fechaFormateada = new Intl.DateTimeFormat("en-CA", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(fecha);

		return new Date(fechaFormateada);
	};

	openModalReasignarUsuario() {
		const modelRef = this.modalService.open(dialogComponentList.dialogReasignarUsuario, {
			ariaLabelledBy: "modal-title",
		});

		modelRef.componentInstance.idParam = this.solicitud.idSolicitud;
		modelRef.componentInstance.taskId = this.taskType_Activity;

		modelRef.result.then(
			(result) => {
				if (result === "close") {
					return;
				}

				if (result?.data) {
					Swal.fire({
						text: result.data,
						icon: "success",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Ok",
					}).then((result) => {
						if (result.isConfirmed) {
							this.router.navigate(["/solicitudes/reasignar-tareas-usuarios"]);
							if (this.submitted) {
							}
						}
					});
				}
			},
			(reason) => {
				console.log(`Dismissed with: ${reason}`);
			}
		);
	}

	// indexedModal: Record<keyof DialogComponents, any> = {
	// 	dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
	// };

	// openModal(component: keyof DialogComponents) {
	// 	this.indexedModal[component]();
	// }

	public openModal() {
		this.modalService
			.open(BuscarEmpleadoComponent, {
				backdrop: "static",
				keyboard: false,
			})
			.result.then(
				(result) => {
					const datosEmpleado = result.data;

					this.sueldoEmpleado.sueldo = datosEmpleado.sueldo;
					this.sueldoEmpleado.variableMensual = datosEmpleado.sueldoVariableMensual;
					this.sueldoEmpleado.variableTrimestral = datosEmpleado.sueldoVariableTrimestral;
					this.sueldoEmpleado.variableSemestral = datosEmpleado.sueldoVariableSemestral;
					this.sueldoEmpleado.variableAnual = datosEmpleado.sueldoVariableAnual;

					this.model = Object.assign(
						{},
						{
							...datosEmpleado,
							sueldo: datosEmpleado.sueldo,
							sueldoMensual: datosEmpleado.sueldoVariableMensual,
							sueldoTrimestral: datosEmpleado.sueldoVariableTrimestral,
							sueldoSemestral: datosEmpleado.sueldoVariableSemestral,
							sueldoAnual: datosEmpleado.sueldoVariableAnual,
						}
					);

					if (this.model.nivelDir.toUpperCase().includes("VICEPRESIDENCIA") || this.model.nivelDir.toUpperCase().includes("CORPORATIVO") || this.model.nivelDir.toUpperCase().includes("CORPORATIVA")) {
						Swal.fire({
							text: "Nivel de Dirección no permitido: " + this.model.nivelDir,
							icon: "info",
							confirmButtonColor: "rgb(227, 199, 22)",
							confirmButtonText: "Sí",
						});

						this.clearModel();

						this.keySelected = "";
						this.dataAprobacionesPorPosicion = {};

						return;
					}

					this.mantenimientoService.getDataEmpleadosEvolutionPorId(datosEmpleado.codigoPosicionReportaA).subscribe({
						next: (response) => {
							if (response.evType.length === 0) {
								this.model.jefeInmediatoSuperior = "";
								this.model.puestoJefeInmediato = "";
								this.codigoReportaA = "";

								return;
							}

							this.model.jefeInmediatoSuperior = response.evType[0].nombreCompleto;
							this.model.puestoJefeInmediato = response.evType[0].descrPosicion;
							this.codigoReportaA = response.evType[0].subledger;
						},
						error: (error: HttpErrorResponse) => {
							this.utilService.modalResponse(error.error, "error");
						},
					});

					this.transferenciaCompania = this.model.compania;
					this.transferenciaUnidadNegocio = this.model.unidadNegocio;

					this.unidadNegocioEmp = datosEmpleado.unidadNegocio;

					// if (this.unidadNegocioEmp.toUpperCase().includes("AREAS") || this.unidadNegocioEmp.toUpperCase().includes("ÁREAS")) {
					// 	this.mantenimientoService.getTipoRuta().subscribe({
					// 		next: (response) => {
					// 			this.dataTipoRutaEmp = response.tipoRutaType
					// 				.filter(({ estado }) => estado === "A")
					// 				.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("CORPORATIV"))
					// 				.map((r) => ({
					// 					id: r.id,
					// 					descripcion: r.tipoRuta,
					// 				}));

					// 			this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

					// 			if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
					// 				this.obtenerAprobacionesPorPosicion();
					// 			}
					// 		},
					// 		error: (error: HttpErrorResponse) => {
					// 			this.utilService.modalResponse(error.error, "error");
					// 		},
					// 	});
					// } else {
					// 	this.mantenimientoService.getTipoRuta().subscribe({
					// 		next: (response) => {
					// 			this.dataTipoRutaEmp = response.tipoRutaType
					// 				.filter(({ estado }) => estado === "A")
					// 				.filter(({ tipoRuta }) => tipoRuta.toUpperCase() === "UNIDADES")
					// 				.map((r) => ({
					// 					id: r.id,
					// 					descripcion: r.tipoRuta,
					// 				}));

					// 			this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

					// 			if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
					// 				this.obtenerAprobacionesPorPosicion();
					// 			}
					// 		},
					// 		error: (error: HttpErrorResponse) => {
					// 			this.utilService.modalResponse(error.error, "error");
					// 		},
					// 	});
					// }
				},
				(reason) => {
					console.log(`Dismissed with: ${reason}`);
				}
			);
	}

	public openModalPropuestos() {
		this.modalService
			.open(BuscarEmpleadoComponent, {
				backdrop: "static",
				keyboard: false,
			})
			.result.then(
				(result) => {
					const datosEmpleado = result.data;

					this.sueldoEmpleado.sueldo = datosEmpleado.sueldo;
					this.sueldoEmpleado.variableMensual = datosEmpleado.sueldoVariableMensual;
					this.sueldoEmpleado.variableTrimestral = datosEmpleado.sueldoVariableTrimestral;
					this.sueldoEmpleado.variableSemestral = datosEmpleado.sueldoVariableSemestral;
					this.sueldoEmpleado.variableAnual = datosEmpleado.sueldoVariableAnual;

					if (!this.viewInputs) {
						if (this.transferenciaCompania !== datosEmpleado.compania || this.transferenciaUnidadNegocio !== datosEmpleado.unidadNegocio) {
							Swal.fire({
								text: `Posición seleccionada no pertenece a la compañía o Unidad de Negocio actual`,
								icon: "error",
								confirmButtonColor: "rgb(227, 199, 22)",
								confirmButtonText: "Ok",
							});

							return;
						}
					}

					this.modelPropuestos = Object.assign(
						{},
						{
							...datosEmpleado,
							sueldo: datosEmpleado.sueldo,
							sueldoMensual: datosEmpleado.sueldoVariableMensual,
							sueldoTrimestral: datosEmpleado.sueldoVariableTrimestral,
							sueldoSemestral: datosEmpleado.sueldoVariableSemestral,
							sueldoAnual: datosEmpleado.sueldoVariableAnual,
						}
					);

					this.detalleSolicitudPropuestos.alimentacion = "0";
					this.detalleSolicitudPropuestos.movilizacion = "0";

					// if (this.model.nivelDir.toUpperCase().includes("VICEPRESIDENCIA") || this.model.nivelDir.toUpperCase().includes("CORPORATIVO") || this.model.nivelDir.toUpperCase().includes("CORPORATIVA")) {
					// 	Swal.fire({
					// 		text: "Nivel de Dirección no permitido: " + this.model.nivelDir,
					// 		icon: "info",
					// 		confirmButtonColor: "rgb(227, 199, 22)",
					// 		confirmButtonText: "Sí",
					// 	});

					// 	this.clearModel();

					// 	this.keySelected = "";
					// 	this.dataAprobacionesPorPosicion = {};

					// 	return;
					// }

					this.mantenimientoService.getDataEmpleadosEvolutionPorId(datosEmpleado.codigoPosicionReportaA).subscribe({
						next: (response) => {
							if (response.evType.length === 0) {
								this.modelPropuestos.jefeInmediatoSuperior = "";
								this.modelPropuestos.puestoJefeInmediato = "";
								this.codigoReportaA = "";

								return;
							}

							this.modelPropuestos.jefeInmediatoSuperior = response.evType[0].nombreCompleto;
							this.modelPropuestos.puestoJefeInmediato = response.evType[0].descrPosicion;
							this.codigoReportaA = response.evType[0].subledger;
						},
						error: (error: HttpErrorResponse) => {
							this.utilService.modalResponse(error.error, "error");
						},
					});

					this.modelPropuestos.compania = this.model.compania;
					this.modelPropuestos.unidadNegocio = this.model.unidadNegocio;

					this.unidadNegocioEmp = datosEmpleado.unidadNegocio;

					if (this.unidadNegocioEmp.toUpperCase().includes("AREAS") || this.unidadNegocioEmp.toUpperCase().includes("ÁREAS")) {
						this.mantenimientoService.getTipoRuta().subscribe({
							next: (response) => {
								this.dataTipoRutaEmp = response.tipoRutaType
									.filter(({ estado }) => estado === "A")
									.filter(({ tipoRuta }) => tipoRuta.toUpperCase().includes("CORPORATIV"))
									.map((r) => ({
										id: r.id,
										descripcion: r.tipoRuta,
									}));

								this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.modelPropuestos.codigoPosicion}_${this.modelPropuestos.nivelDir}`;

								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.obtenerAprobacionesPorPosicionPropuesto();
								}
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					} else {
						this.mantenimientoService.getTipoRuta().subscribe({
							next: (response) => {
								this.dataTipoRutaEmp = response.tipoRutaType
									.filter(({ estado }) => estado === "A")
									.filter(({ tipoRuta }) => tipoRuta.toUpperCase() === "UNIDADES")
									.map((r) => ({
										id: r.id,
										descripcion: r.tipoRuta,
									}));

								this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.modelPropuestos.codigoPosicion}_${this.modelPropuestos.nivelDir}`;

								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.obtenerAprobacionesPorPosicionPropuesto();
								}
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					}
				},
				(reason) => {
					console.log(`Dismissed with: ${reason}`);
				}
			);
	}

	public bloquearEnDevolver() {
		if (this.solicitud.estadoSolicitud.toUpperCase() !== "DV") {
			return false;
		}

		if (this.estadoSolicitud === "DV") {
			return false;
		}

		if (this.oldData.subledger !== this.model.subledger) {
			return false;
		} else if (this.oldData.justificacion !== this.model.justificacionCargo) {
			return false;
		} else if (this.solicitud.idTipoAccion !== 0 && this.oldData.idTipoAccion !== this.solicitud.idTipoAccion) {
			return false;
		} else if (this.oldData.fechaCambioPropuesto.getTime() !== new Date(this.fechaCambioPropuesta).getTime()) {
			return false;
		} else if (this.viewInputs) {
			if (this.oldData.companiaPropuesto !== this.transferenciaCompania) {
				return false;
			} else if (this.oldData.unidadPropuesto !== this.transferenciaUnidadNegocio) {
				return false;
			} else {
				return true;
			}
		} else {
			if (this.oldData.codigoPosicionPropuesto !== this.modelPropuestos.codigoPosicion) {
				return false;
			} else if (this.oldData.movilizacionPropuesto !== this.detalleSolicitudPropuestos.movilizacion) {
				return false;
			} else if (this.oldData.alimentacionPropuesto !== this.detalleSolicitudPropuestos.alimentacion) {
				return false;
			} else if (parseFloat(this.oldData.sueldoPropuesto).toFixed(2) !== parseFloat(this.model.sueldo).toFixed(2)) {
				return false;
			} else if (parseFloat(this.oldData.sueldoMensualPropuesto).toFixed(2) !== parseFloat(this.model.sueldoMensual).toFixed(2)) {
				return false;
			} else if (parseFloat(this.oldData.sueldoTrimestralPropuesto).toFixed(2) !== parseFloat(this.model.sueldoTrimestral).toFixed(2)) {
				return false;
			} else if (parseFloat(this.oldData.sueldoSemestralPropuesto).toFixed(2) !== parseFloat(this.model.sueldoSemestral).toFixed(2)) {
				return false;
			} else if (parseFloat(this.oldData.sueldoAnualPropuesto).toFixed(2) !== parseFloat(this.model.sueldoAnual).toFixed(2)) {
				return false;
			} else {
				return true;
			}
		}
	}

	public validateFechaCambioPropuesta(): boolean {
		return isNaN(this.fechaCambioPropuesta.getTime());
	}
}
