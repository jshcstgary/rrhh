import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { addDays, format } from "date-fns";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { DialogComponents } from "src/app/shared/dialogComponents/dialog.components";
import { StarterService } from "src/app/starter/starter.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { Permiso } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { dialogComponentList } from "../registrar-candidato/registrar-candidato.component";
import { RegistrarCandidatoService } from "../registrar-candidato/registrar-candidato.service";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";

@Component({
	selector: "completaSolicitud",
	templateUrl: "./completa-solicitud.component.html",
	styleUrls: ["./completa-solicitud.component.scss"],
	providers: [CamundaRestService, HttpClientModule],
	exportAs: "completaSolicitud",
})
export class CompletaSolicitudComponent extends CompleteTaskComponent {
	NgForm = NgForm;

	textareaContent: string = "";
	isRequired: boolean = false;
	isFechaMaximaVisible: boolean = false;
	isFechaIngresoVisible: boolean = true;
	campoObligatorio: string = "";
	observaciontexto: string = "Observación";
	selectedDate: Date = new Date();
	selectedDateIn: Date = new Date();
	//buttonValue: string = '';
	disabledComplete: boolean = true;

	buttonValue: string | null = "aprobar";

	fechas: any = {
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
		finProcesoFamiliares: "",
		fechaIngresoCandidato: "",
	};

	public nombreCompletoCandidato: string = "";
	public selectedOption: string = "";
	public isChecked: boolean = false;
	public idSolicitudRP: string = "";
	public nombreCandidato: string = "";

	process(action: string) {
		this.buttonValue = action;

		// Aquí puedes añadir la lógica para manejar cada acción

		switch (action) {
			case "devolver":
				this.isRequired = true;
				this.campoObligatorio = "Campo Obligatorio...";
				this.observaciontexto = "Observación*";
				this.isFechaMaximaVisible = false;
				this.isFechaIngresoVisible = false;
				this.textareaContent = "";
				break;

			case "rechazar":
				this.isRequired = true;
				this.campoObligatorio = "Campo Obligatorio...";
				this.isFechaMaximaVisible = false;
				this.isFechaIngresoVisible = false;
				this.textareaContent = "";
				this.observaciontexto = "Observación*";
				break;

			case "aprobar":
				this.campoObligatorio = "Ingrese Comentario de aprobación...";
				this.isFechaMaximaVisible = false;
				this.isFechaIngresoVisible = true;
				this.textareaContent = "";
				this.observaciontexto = "Observación";
				break;

			case "esperar":
				this.campoObligatorio = "Ingrese Comentario en espera...";
				this.isFechaMaximaVisible = true;
				this.isFechaIngresoVisible = false;
				this.textareaContent = "";
				this.observaciontexto = "Observación";
				break;

			default:
		}
	}

	isSelected(action: string): boolean {
		return this.buttonValue === action;
	}

	override model: RegistrarData = new RegistrarData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

	// public solicitud = new Solicitud();

	private searchSubject = new Subject<{
		campo: string;
		valor: string;
	}>();

	public option: { codigo: string; valor: string } = {
		codigo: "",
		valor: "",
	};

	public solicitudDataInicial = new Solicitud();
	public tipo_solicitud_descripcion: string;
	public tipo_motivo_descripcion: string;
	public tipo_accion_descripcion: string;

	public keySelected: any;

	public detalleSolicitud = new DetalleSolicitud();
	public unidadNegocioEmp: string;
	public dataTipoRutaEmp: any[] = [];
	public solicitud = new Solicitud();

	public titulo: string = "Formulario De Registro";

	// Base model refers to the input at the beginning of BPMN
	// that is, Start Event
	public modelBase: DatosProcesoInicio;

	public modelSolicitud: DatosSolicitud;

	public dataSolicitudModel: any;

	// scenario-1: task id and date are handled via tasklist page.
	public taskId: string = "";
	public date: any; // task date handled as query param

	// scenario-2: User starts new process instance and directly comes to fill Registrar user task.
	// This is a more likely scenario.
	// In this case, parent flag is set to true. It requires additional handling to derive task id from process instance id.
	public parentIdFlag: string | null = "false"; // set to true if the id is for the process instance, instead of task-id

	public misParams: Solicitud;

	public dataTipoSolicitud: any = [];
	public dataTipoMotivo: any = [];

	// public dataTipoAccion: any;

	public dataTipoAccion: any = [];
	// public dataAprobacionesPorPosicion: { [idTipoSolicitud: number, IdTipoMotivo: number, IdNivelDireccion: number]: any[] } =
	// {};

	public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

	public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};

	// getDataNivelesAprobacionPorCodigoPosicion
	public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

	public dataNivelesAprobacion: any;

	public mostrarTipoJustificacionYMision = false;

	public RegistrarsolicitudCompletada = true;

	public restrictionsIds: any[] = ["1", "2", 1, 2];

	public restrictionsSubledgerIds: any[] = ["4", 4];

	public mostrarSubledger = false;

	public dataEmpleadoEvolution: any[] = [
		{
			codigo: "CODIGO_1", //?
			idEmpresa: "ID_EMPRESA", //?
			compania: "Reybanpac", // Ok
			departamento: "Inventarios", //ok
			nombreCargo: "Jefatura", // ok
			nomCCosto: "Zona camarones", // ok
			codigoPosicion: "0425", //
			descrPosicion: "Analista de recursos humanos", //ok
			codigoPuesto: "CODIGO_PUESTO", //
			descrPuesto: "Gerencia media", //
			fechaIngresogrupo: "2024-04-15T12:08:34.473", //
			grupoPago: "GRUPO_PAGO", //
			reportaA: "Gerente RRHH", // ok
			localidad: "Hacienda", // ok
			nivelDir: "Tecnico/Asistencia", // ok
			descrNivelDir: "Tecnico descripcion", //
			nivelRepa: "Gerencia Medios", // Es esto nivel de reporte?
			nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO", //
			subledger: "60067579", // Ok
			sucursal: "SUSURSAL 1", //
			unidadNegocio: "UNIDAD NEGOCIO 1", //ok
			tipoContrato: "Eventual", // ok
			descripContrato: "Eventual con remuneracion mixta", //
			status: "A",
		},
		{
			codigo: "CODIGO_2",
			idEmpresa: "ID_EMPRESA",
			compania: "Reybanpac",
			departamento: "Inventarios",
			nombreCargo: "Jefatura",
			nomCCosto: "Zona camarones",
			codigoPosicion: "0425",
			descrPosicion: "Analista de recursos humanos",
			codigoPuesto: "CODIGO_PUESTO",
			descrPuesto: "Gerencia media",
			fechaIngresogrupo: "2024-04-15T12:08:34.473",
			grupoPago: "GRUPO_PAGO",
			reportaA: "Gerente RRHH",
			localidad: "Hacienda",
			nivelDir: "Tecnico/Asistencia",
			descrNivelDir: "Tecnico descripcion",
			nivelRepa: "Gerencia Medios",
			nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
			subledger: "60067579",
			sucursal: "SUSURSAL 1",
			unidadNegocio: "UNIDAD NEGOCIO 1",
			tipoContrato: "Eventual",
			descripContrato: "Eventual con remuneracion mixta",
			status: "A",
		},
		{
			codigo: "CODIGO_3",
			idEmpresa: "ID_EMPRESA",
			compania: "Reybanpac",
			departamento: "Inventarios",
			nombreCargo: "Jefatura",
			nomCCosto: "Zona camarones",
			codigoPosicion: "0425",
			descrPosicion: "Analista de recursos humanos",
			codigoPuesto: "CODIGO_PUESTO",
			descrPuesto: "Gerencia media",
			fechaIngresogrupo: "2024-04-15T12:08:34.473",
			grupoPago: "GRUPO_PAGO",
			reportaA: "Gerente RRHH",
			localidad: "Hacienda",
			nivelDir: "Tecnico/Asistencia",
			descrNivelDir: "Tecnico descripcion",
			nivelRepa: "Gerencia Medios",
			nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
			subledger: "60067579",
			sucursal: "SUSURSAL 1",
			unidadNegocio: "UNIDAD NEGOCIO 1",
			tipoContrato: "Eventual",
			descripContrato: "Eventual con remuneracion mixta",
			status: "A",
		},
		{
			codigo: "CODIGO_4",
			idEmpresa: "ID_EMPRESA",
			compania: "Reybanpac",
			departamento: "Inventarios",
			nombreCargo: "Jefatura",
			nomCCosto: "Zona camarones",
			codigoPosicion: "0425",
			descrPosicion: "Analista de recursos humanos",
			codigoPuesto: "CODIGO_PUESTO",
			descrPuesto: "Gerencia media",
			fechaIngresogrupo: "2024-04-15T12:08:34.473",
			grupoPago: "GRUPO_PAGO",
			reportaA: "Gerente RRHH",
			localidad: "Hacienda",
			nivelDir: "Tecnico/Asistencia",
			descrNivelDir: "Tecnico descripcion",
			nivelRepa: "Gerencia Medios",
			nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
			subledger: "60067579",
			sucursal: "SUSURSAL 1",
			unidadNegocio: "UNIDAD NEGOCIO 1",
			tipoContrato: "Eventual",
			descripContrato: "Eventual con remuneracion mixta",
			status: "A",
		},
		{
			codigo: "CODIGO_2",
			idEmpresa: "ID_EMPRESA",
			compania: "Reybanpac",
			departamento: "Inventarios",
			nombreCargo: "Gerencia de Proyectos",
			nomCCosto: "Zona camarones",
			codigoPosicion: "0426",
			descrPosicion: "Gerencia de Proyectos",
			codigoPuesto: "CODIGO_PUESTO",
			descrPuesto: "Gerencia media",
			fechaIngresogrupo: "2024-04-15T12:08:34.473",
			grupoPago: "GRUPO_PAGO",
			reportaA: "0427",
			localidad: "Hacienda",
			nivelDir: "Gerencia Media",
			descrNivelDir: "Gerencia Media",
			nivelRepa: "Gerencia Medios",
			nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
			subledger: "60067579",
			sucursal: "SUSURSAL 1",
			unidadNegocio: "UNIDAD NEGOCIO 1",
			tipoContrato: "Eventual",
			descripContrato: "Eventual con remuneracion mixta",
			status: "A",
		},
	];
	public dataAprobacionesPorPosicionAPS: any = [];
	public aprobacion: any;

	public minDateValidation = new Date();
	public maxDateValidation = addDays(new Date(), 365);
	emailVariables = {
		de: "",
		para: "",
		alias: "",
		asunto: "",
		cuerpo: "",
		password: "",
	};

	public success: false;
	public params: any;
	public id_edit: undefined | string;

	private id_solicitud_by_params: any;

	public dataNivelDireccion: any[] = [];
	public suggestions: string[] = [];
	public tareasPorCompletar: any;

	public idDeInstancia: any;

	public loadingComplete = 0;

	nombresEmpleados: string[] = [];

	subledgers: string[] = [];

	codigosPosicion: string[] = [];
	public existeMatenedores: boolean = false;
	public existe: boolean = false;
	public dataComentariosAprobaciones: any[] = [];
	public dataComentariosAprobacionesPorPosicion: any[] = [];
	public dataComentariosAprobacionesRRHH: any[] = [];
	public dataComentariosAprobacionesCREM: any[] = [];

	constructor(route: ActivatedRoute, router: Router, camundaRestService: CamundaRestService, private mantenimientoService: MantenimientoService, private solicitudes: SolicitudesService, private utilService: UtilService, private consultaTareasService: ConsultaTareasService, private starterService: StarterService, private modalService: NgbModal, private seleccionCandidatoService: RegistrarCandidatoService) {
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

									this.utilService.closeLoadingSpinner();
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

	indexedModal: Record<keyof DialogComponents, any> = {
		dialogBuscarEmpleados: undefined,
		dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
	};

	openModal(component: keyof DialogComponents) {
		this.indexedModal[component]();
	}

	searchCodigoPosicion: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => (term.length < 1 ? [] : this.codigosPosicion.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
		);

	searchSubledger: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => (term.length < 1 ? [] : this.subledgers.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
		);

	searchNombreCompleto: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => (term.length < 1 ? [] : this.nombresEmpleados.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
		);

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
			//this.solicitud = params;
			this.misParams = params;
		});

		this.route.queryParamMap.subscribe((qParams) => {
			if (null !== qParams?.get("date")) {
				this.date = qParams.get("date");
			} else {
				this.date = "";
			}

			//
			// Comentado por ahora
			/*if (null !== qParams?.get("p")) {
			  this.parentIdFlag = qParams.get("p");
			}*/
			this.parentIdFlag = "true";
		});

		this.route.params.subscribe((params) => {
			// const variableNames = Object.keys(this.model).join(",");
			const variableNames = Object.keys(this.model).join(",");

			if ("true" === this.parentIdFlag) {
				// id is parent process instance id. so handle it accordingly
				// we are looking for task id 'Registrar' in a recently started process instance 'id'
				this.idDeInstancia = params["id"];
				this.solicitudes.getTaskId(this.idDeInstancia).subscribe({
					next: (result) => {
						this.tareasPorCompletar = result.filter((empleado) => {
							return empleado["deleteReason"] === null;
						});
						if (this.tareasPorCompletar.length === 0) {
							return;
						} else {
							this.uniqueTaskId = this.tareasPorCompletar[0].id;
							this.taskType_Activity = this.tareasPorCompletar[0].taskDefinitionKey;
							this.nameTask = this.tareasPorCompletar[0].name;
						}
						this.taskId = params["id"];
						// this.getDetalleSolicitudById(this.id_solicitud_by_params); // Si se comenta, causa problemas al abrir el Sweet Alert 2

						// this.getSolicitudById(this.id_solicitud_by_params);
						if (!this.id_solicitud_by_params.toUpperCase().includes("AP") && !this.id_solicitud_by_params.toUpperCase().includes("DP")) {
							this.getCandidatoValues();
						} else {
							this.getSolicitudById(this.id_solicitud_by_params);
						}

						this.date = this.tareasPorCompletar[0].startTime;
						this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
					},
					error: (error) => {
						console.error(error);
					},
				});
			} else {
				// unique id is from the route params
				this.uniqueTaskId = params["id"];
				this.taskId = params["id"];
				this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
			}
		});
	}

	getCandidatoValues() {
		this.seleccionCandidatoService.getCandidatoById(this.id_solicitud_by_params).subscribe({
			next: (res) => {
				const candidatoValues = res.seleccionCandidatoType[0];
				this.nombreCompletoCandidato = res.seleccionCandidatoType[0].candidato;

				this.model.tipoProceso = candidatoValues.tipoProceso;
				this.selectedOption = candidatoValues.fuenteExterna;
				this.isChecked = candidatoValues.tipoFuente;
				this.idSolicitudRP = res.seleccionCandidatoType[0].iD_SOLICITUD;

				this.fechas.actualizacionPerfil = candidatoValues.actualizacionDelPerfil === null ? "" : this.getFormattedDate(candidatoValues.actualizacionDelPerfil);

				this.fechas.busquedaCandidatos = candidatoValues.busquedaDeCandidatos === null ? "" : this.getFormattedDate(candidatoValues.busquedaDeCandidatos);

				this.fechas.entrevista = candidatoValues.entrevista === null ? "" : this.getFormattedDate(candidatoValues.entrevista);

				this.fechas.pruebas = candidatoValues.pruebas === null ? "" : this.getFormattedDate(candidatoValues.pruebas);

				this.fechas.referencias = candidatoValues.referencias === null ? "" : this.getFormattedDate(candidatoValues.referencias);

				this.fechas.elaboracionInforme = candidatoValues.elaboracionDeInforme === null ? "" : this.getFormattedDate(candidatoValues.elaboracionDeInforme);

				this.fechas.entregaJefe = candidatoValues.entregaAlJefeSol === null ? "" : this.getFormattedDate(candidatoValues.entregaAlJefeSol);

				this.fechas.entrevistaJefatura = candidatoValues.entrevistaPorJefatura === null ? "" : this.getFormattedDate(candidatoValues.entrevistaPorJefatura);

				this.fechas.tomaDecisiones = candidatoValues.tomaDeDesiciones === null ? "" : this.getFormattedDate(candidatoValues.tomaDeDesiciones);

				this.fechas.candidatoSeleccionado = candidatoValues.candidatoSeleccionado === null ? "" : this.getFormattedDate(candidatoValues.candidatoSeleccionado);

				this.fechas.procesoContratacion = candidatoValues.procesoDeContratacion === null ? "" : this.getFormattedDate(candidatoValues.procesoDeContratacion);

				this.fechas.finProcesoContratacion = candidatoValues.finProcesoContratacion === null ? "" : this.getFormattedDate(candidatoValues.finProcesoContratacion);

				this.fechas.reingreso = candidatoValues.fechaInicioReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioReingreso);

				this.fechas.finProceso = candidatoValues.fechaFinReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaFinReingreso);

				this.fechas.contratacionFamiliares = candidatoValues.fechaInicioContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioContratacionFamiliares);

				this.fechas.finProcesoFamiliares = candidatoValues.fechaFinContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaFinContratacionFamiliares);

				this.fechas.fechaIngresoCandidato = candidatoValues.fechaIngresoCandidato === null ? "" : this.getFormattedDate(candidatoValues.fechaIngresoCandidato);

				this.nombreCandidato = candidatoValues.candidato;

				if (this.id_solicitud_by_params.toUpperCase().includes("RG")) {
					this.getSolicitudById(this.idSolicitudRP);
					this.getSolicitudById(this.id_solicitud_by_params);
				} else {
					this.getSolicitudById(this.id_solicitud_by_params);
				}
			},
			error: (err) => {
				this.getSolicitudById(this.id_solicitud_by_params);
			},
		});
	}

	getFormattedDate(dateValue: string = ""): string {
		const date = dateValue === "" ? new Date() : new Date(dateValue);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Enero es 0!
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	onInputChange(campo: string, val: any) {
		let valor = (val.target as HTMLInputElement).value;

		this.searchSubject.next({ campo, valor });

		this.suggestions = this.dataEmpleadoEvolution.filter((empleado) => empleado[campo].startsWith(valor)).map((empleado) => empleado[campo]);
	}

	selectSuggestion(suggestion: string) {
		this.model.codigoPosicion = suggestion;
		this.suggestions = [];
	}

	obtenerAprobacionesPorPosicion() {
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, this.dataTipoRutaEmp[0].id, "A").subscribe({
			next: (response) => {
				this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
			},
		});
	}

	onSelectItem(campo: string, event) {
		let valor = event.item;
		const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
			return empleado[campo] === valor;
		});
		if (datosEmpleado) {
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
			this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.codigoPosicion + "_" + this.model.nivelDir;
			if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
				this.obtenerAprobacionesPorPosicion();
			}
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
			/*this.utilService.modalResponse(
			  "No existe un registro para este autocompletado",
			  "error"
			);*/
		}
	}

	getDataEmpleadosEvolution() {
		return this.mantenimientoService.getDataEmpleadosEvolution().subscribe({
			next: (response) => {
				this.dataEmpleadoEvolution = response.evType;

				this.nombresEmpleados = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];

				this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];

				this.codigosPosicion = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.codigoPosicion))];
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	filtrarDatos(campo: string, valor: string) {
		const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
			return empleado[campo] === valor;
		});
		if (datosEmpleado) {
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
			/*this.utilService.modalResponse(
			  "No existe un registro para este autocompletado",
			  "error"
			);*/
		}
	}

	override loadExistingVariables(taskId: String, variableNames: String) {
		this.camundaRestService.getVariablesForTask(taskId, variableNames).subscribe((result) => {
			this.lookForError(result);
			this.generateModelFromVariables(result);
		}); // comentado por pruebas mmunoz
	}

	override generateModelFromVariables(variables: { [x: string]: { value: any } }) {
		Object.keys(variables).forEach((variableName) => {
			switch (variableName) {
				case "tipoAccion":
					this.tipo_accion_descripcion = this.dataTipoAccion?.filter((data) => data.tipoAccion == variables[variableName].value)[0]?.tipoAccion;
					this.modelBase.tipo_cumplimiento = variables[variableName].value;
					break;

				case "tipoSolicitud":
					this.tipo_solicitud_descripcion = this.dataTipoSolicitud.tipoSolicitudType?.filter((data) => data.tipoSolicitud == variables[variableName].value)[0]?.tipoSolicitud;
					this.modelBase.tipoSolicitud = variables[variableName].value;
					break;

				case "tipoMotivo":
					this.tipo_motivo_descripcion = this.dataTipoMotivo?.filter((data) => data.tipoMotivo == variables[variableName].value)[0]?.tipoMotivo;
					this.modelBase.tipoMotivo = variables[variableName].value;

					break;
			}
		});
	}

	async ngOnInit() {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		try {
			await this.ObtenerServicioTipoSolicitud();
			await this.ObtenerServicioTipoMotivo();
			await this.ObtenerServicioTipoAccion();
			// await this.ObtenerServicioNivelDireccion();
			//await this.getSolicitudes();
			await this.getSolicitudById(this.id_edit);
			await this.getDataEmpleadosEvolution();
			await this.loadDataCamunda();
			this.utilService.closeLoadingSpinner();
		} catch (error) {
			// Manejar errores aquí de manera centralizada
			this.utilService.modalResponse(error.error, "error");
		}
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

	getSolicitudById(id: any) {
		return this.solicitudes.getSolicitudById(id).subscribe({
			next: (response: any) => {
				this.solicitud = response;

				this.loadingComplete += 2;
				this.getDetalleSolicitudById(this.id_edit);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	getDetalleSolicitudById(id: any) {
		return this.solicitudes.getDetalleSolicitudById(id).subscribe({
			next: (response: any) => {
				this.detalleSolicitud = response.detalleSolicitudType[0];
				if (this.detalleSolicitud.codigoPosicion.length > 0) {
					this.model.codigoPosicion = this.detalleSolicitud.codigoPosicion;
					this.model.descrPosicion = this.detalleSolicitud.descripcionPosicion;
					this.model.subledger = this.detalleSolicitud.subledger;
					this.model.nombreCompleto = this.detalleSolicitud.nombreEmpleado;
					this.model.compania = this.detalleSolicitud.compania;
					this.model.unidadNegocio = this.detalleSolicitud.unidadNegocio;
					this.model.departamento = this.detalleSolicitud.departamento;
					this.model.nombreCargo = this.detalleSolicitud.cargo;
					this.model.localidad = this.detalleSolicitud.localidad;
					this.model.nivelDir = this.detalleSolicitud.nivelDireccion;
					this.model.nomCCosto = this.detalleSolicitud.centroCosto;
					this.model.misionCargo = this.detalleSolicitud.misionCargo;
					this.model.justificacionCargo = this.detalleSolicitud.justificacion;
					this.model.reportaA = this.detalleSolicitud.reportaA;
					this.model.supervisaA = this.detalleSolicitud.supervisaA;
					this.model.tipoContrato = this.detalleSolicitud.tipoContrato;
					this.model.nivelRepa = this.detalleSolicitud.nivelReporteA;
					this.model.sueldo = this.detalleSolicitud.sueldo;
					this.model.sueldoMensual = this.detalleSolicitud.sueldoVariableMensual;
					this.model.sueldoTrimestral = this.detalleSolicitud.sueldoVariableTrimestral;
					this.model.sueldoSemestral = this.detalleSolicitud.sueldoVariableSemestral;
					this.model.sueldoAnual = this.detalleSolicitud.sueldoVariableAnual;
					this.model.correo = this.detalleSolicitud.correo;
					this.model.fechaIngreso = this.detalleSolicitud.fechaIngreso;
					if (this.detalleSolicitud.valor.includes("Solicitud en Espera")) {
						this.isFechaMaximaVisible = false;
						this.textareaContent = this.detalleSolicitud.valor;
						this.selectedDate = new Date(this.detalleSolicitud.fechaSalida);
					}
					this.unidadNegocioEmp = this.detalleSolicitud.unidadNegocio;
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

								// tveas, si incluye el id, debo mostrarlos (true)
								this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

								this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

								this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;
								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.getNivelesAprobacion();

									this.obtenerComentariosAtencionPorInstanciaRaiz();
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

								// tveas, si incluye el id, debo mostrarlos (true)
								this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

								this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

								this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;
								if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
									this.getNivelesAprobacion();

									this.obtenerComentariosAtencionPorInstanciaRaiz();
								}
							},
							error: (error: HttpErrorResponse) => {
								this.utilService.modalResponse(error.error, "error");
							},
						});
					}
				}

				this.mantenimientoService.getCatalogo("RBPTF").subscribe({
					next: (response) => {
						this.option = response.itemCatalogoTypes.find(({ codigo }) => codigo === this.selectedOption);
					},
				});
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	ngDoCheck(): void {
		if (this.loadingComplete === 2) {
			this.utilService.closeLoadingSpinner();
		}
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

	// Prueba servicio
	getSolicitudes() {
		this.solicitudes.getSolicitudes().subscribe((data) => {});
	}

	guardarSolicitud() {
		const id = Date.now().toString().slice(-6);

		let requestSolicitud = {
			idSolicitud: "RP-" + id,
			idInstancia: "InstanciaReybanpac",
			idEmpresa: "01",
			empresa: "Reybanpac",
			idUnidadNegocio: "02",
			unidadNegocio: "Banano",
			estadoSolicitud: "2",
			idTipoSolicitud: this.dataTipoSolicitud.id,
			tipoSolicitud: "string upt",
			idTipoMotivo: this.dataTipoMotivo.id,
			tipoMotivo: "TIPO MOTIVO 01",
			idTipoAccion: 1,
			tipoAccion: "Aumento",
			fechaActualizacion: "2024-03-27T20:48:24.177",
			fechaCreacion: "2024-03-27T20:48:24.177",
			usuarioCreacion: "lnmora",
			usuarioActualizacion: "lnmora",
			estado: "En Espera",
		};

		this.solicitudes.guardarSolicitud(requestSolicitud).subscribe((response) => {
			this.utilService.modalResponse("Datos ingresados correctamente", "success");
		});
	}

	// Handle any errors that may be present.
	lookForError(result: any): void {
		if (result.error !== undefined && result.error !== null) {
			this.errorMessage = result.error.message;
			this.utilService.modalResponse(this.errorMessage, "error");
		}
	}

	onSubmit() {
		this.save();
	}

	save() {
		this.utilService.openLoadingSpinner("Completando tarea, espere por favor...");

		this.saveDetalleAprobaciones();
	}

	onCompletar() {
		if (this.uniqueTaskId === null) {
			this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

			return;
		}

		let variables = this.generateVariablesFromFormFields();

		this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
			next: (res) => {
				this.solicitud.empresa = this.model.compania;
				this.solicitud.idEmpresa = this.model.compania;

				this.solicitud.unidadNegocio = this.model.unidadNegocio;
				this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

				switch (this.buttonValue) {
					case "rechazar":
						this.solicitud.estadoSolicitud = "5"; //Cancelado
						this.detalleSolicitud.fechaSalida = new Date();

						this.detalleSolicitud.valor = null;

						break;

					case "aprobar":
						this.detalleSolicitud.fechaSalida = new Date();
						this.detalleSolicitud.valor = null;

						this.solicitud.estadoSolicitud = "1";

						break;

					case "esperar":
						this.detalleSolicitud.fechaSalida = this.selectedDate;
						this.detalleSolicitud.valor = "Solicitud en Espera: " + this.textareaContent;

						this.solicitud.estadoSolicitud = "2";

						break;

					case "enEspera":
						this.detalleSolicitud.fechaSalida = this.selectedDate;
						this.detalleSolicitud.valor = "Solicitud en Espera: " + this.textareaContent;

						this.solicitud.estadoSolicitud = "2";

						break;

					default:
				}

				this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {
					this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
						next: (response) => {},
					});
				});

				if (this.solicitud.estadoSolicitud.includes("1")) {
					// ESTADO APROBADO
					this.solicitudes.obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params).subscribe({
						next: (responseAPS) => {
							this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
							this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("JEFATURA"));

							if (this.aprobacion.aprobador.usuario === null || this.aprobacion.aprobador.usuario === "" || this.aprobacion.aprobador.usuario === undefined) {
								this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("GERENCIA"));
							}

							const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimad@</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>Por favor su ayuda realizando la encuesta por la Aprobación de la Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION}</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

							const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.id_solicitud_by_params}`);

							this.emailVariables = {
								de: "emisor",
								para: this.aprobacion.aprobador.correo,
								alias: "Notificación 1",
								asunto: `Notificación de Encuesta - Solicitud - ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
								cuerpo: modifiedHtmlString,
								password: "password",
							};

							this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
								next: () => {},
								error: (err) => {
									console.error(err);
								},
							});

							this.solicitudes.sendEmail(this.emailVariables).subscribe({
								next: () => {},
								error: (error) => {
									console.error(error);
								},
							});
						},
					});
				} else if (this.solicitud.estadoSolicitud.includes("2")) {
					// EN ESPERA
					this.solicitudes.obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params).subscribe({
						next: (responseAPS) => {
							this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
							this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD"));

							const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimados</h2>\r\n  <h3>APROBADORES</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} se cambió a estado en Espera con la fecha máxima {FECHA_MAXIMA_ESPERA}</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

							const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace("{FECHA_MAXIMA_ESPERA}", this.selectedDate.toISOString().split("T")[0]).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.id_solicitud_by_params}`);

							this.emailVariables = {
								de: "emisor",
								para: this.aprobacion.aprobador.correo,
								alias: "Notificación 1",
								asunto: `Solicitud en Estado en Espera - ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
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
				} else if (this.solicitud.estadoSolicitud.includes("5")) {
					// CANCELAR
					this.solicitudes.obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params).subscribe({
						next: (responseAPS) => {
							this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
							this.aprobacion = this.dataAprobacionesPorPosicionAPS.find((elemento) => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD"));

							const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimados</h2>\r\n  <h3>APROBADORES</h3>\r\n\r\n  <P>Se le informa que ha sido rechazada la solicitud {ID_SOLICITUD} - {TIPO_SOLICITUD} </P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

							const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

							this.emailVariables = {
								de: "emisor",
								para: this.aprobacion.aprobador.correo,
								alias: "Notificación 1",
								asunto: `Notificación por rechazo de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
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
				}

				this.utilService.closeLoadingSpinner();
				this.utilService.modalResponse(`Solicitud completada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");
				setTimeout(() => {
					this.router.navigate(["/tareas/consulta-tareas"]);
				}, 1800);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});

		this.submitted = true;
	}

	completeAndCheckTask(taskId: string, variables: any) {
		this.camundaRestService.postCompleteTask(taskId, variables).subscribe((res) => {
			// Verifica si el nombre sigue siendo "Notificar revisión solicitud"
			if (res.name === "Notificar revisión solicitud") {
				// Llama nuevamente a la función para completar la siguiente tarea
				this.completeAndCheckTask(taskId, variables);
			} else {
				// El nombre ya no es "Notificar revisión solicitud", haz algo diferente
			}
		});
	}

	override generateVariablesFromFormFields() {
		let variables: any = {};

		if (this.solicitud.tipoSolicitud.toUpperCase().includes("REQUISICION") || this.solicitud.tipoSolicitud.toUpperCase().includes("REQUISICIÓN")) {
			if (this.taskType_Activity == environment.taskType_Revisar) {
				//APROBADORES DINAMICOS
				variables.atencionRevision = { value: this.buttonValue };
				variables.comentariosAtencion = { value: this.textareaContent };
			} else if (this.taskType_Activity == environment.taskType_RRHH) {
				//GERENTE RECURSOS HUMANOS
				variables.atencionRevisionGerente = { value: this.buttonValue };
				variables.comentariosAtencionGerenteRRHH = { value: this.textareaContent };
			} else if (this.taskType_Activity == environment.taskType_CREM) {
				// COMITE DE REMUNERACION
				variables.atencionRevisionRemuneraciones = { value: this.buttonValue };
				variables.comentariosAtencionRemuneraciones = { value: this.textareaContent };
			}

			if (this.taskType_Activity == environment.taskType_CompletarRequisicion) {
				if (this.buttonValue.toUpperCase().includes("ESPERA")) {
					this.buttonValue = "enEspera";
				}

				variables.atencionCompletarRequisicion = { value: this.buttonValue };
			}
		}

		let accion = "Completar Solicitud:";

		if (this.buttonValue.toUpperCase() === "APROBAR") {
			variables.usuario_logged_completa_RPAprobar = {
				value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${accion} Solicitud Aprobada por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
			};
		} else if (this.buttonValue.toUpperCase().includes("ESPERA")) {
			variables.usuario_logged_completa_RPEsperar = {
				value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${accion} Solicitud en Espera por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
			};
		} else {
			variables.usuario_logged_completa_RPRechazar = {
				value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}${accion} Solicitud Cancelada por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
			};
		}

		return { variables };
	}

	save2() {
		this.solicitudes.guardarDetalleSolicitud(this.solicitudes.modelDetalleSolicitud).subscribe((res) => {
			this.utilService.modalResponse("Datos ingresados correctamente", "success");
			setTimeout(() => {
				this.router.navigate(["/solicitudes/completar-solicitudes"]);
			}, 1600);
		});
	}

	onCancel() {
		this.router.navigate(["tareas/consulta-tareas"]);
	}

	compareNivelesAprobacion(a, b) {
		const orderMap = {
			"1er Nivel de Aprobación": 1,
			"2do Nivel de Aprobación": 2,
			"3er Nivel de Aprobación": 3,
			"4to Nivel de Aprobación": 4,
			"5to Nivel de Aprobación": 5,
		};

		// Ordenar segun 'orderMap' si existe
		if (orderMap[a.ruta] && orderMap[b.ruta]) {
			return orderMap[a.ruta] - orderMap[b.ruta];
		} else {
			// Elementos sin el patron especificado al final
			return a.ruta > b.ruta ? 1 : -1;
		}
	}

	getNivelesAprobacion() {
		if (this.solicitud !== null) {
			this.solicitudes.obtenerNivelesAprobacionRegistrados(this.solicitud.idSolicitud).subscribe({
				next: (response) => {
					this.dataAprobacionesPorPosicion = {
						[this.keySelected]: response.nivelAprobacionPosicionType,
					};
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
				},
			});
		}
	}

	getDataNivelesAprobacionPorCodigoPosicion() {
		if (this.detalleSolicitud.codigoPosicion !== "" && this.detalleSolicitud.codigoPosicion !== undefined && this.detalleSolicitud.codigoPosicion != null) {
			this.solicitudes.getDataNivelesAprobacionPorCodigoPosicion(this.detalleSolicitud.codigoPosicion).subscribe({
				next: (response) => {
					this.dataNivelesAprobacionPorCodigoPosicion[this.model.codigoPosicion] = response.evType;

					for (let key1 of Object.keys(this.dataAprobacionesPorPosicion)) {
						let eachDataNivelesDeAprobacion = this.dataAprobacionesPorPosicion[key1];

						for (let eachData of eachDataNivelesDeAprobacion) {
							for (let key2 of Object.keys(this.dataNivelesAprobacionPorCodigoPosicion)) {
								let eachDataNivelPorCodigoPosicion = this.dataNivelesAprobacionPorCodigoPosicion[key2];

								for (let eachDataNivelPorCodigo of eachDataNivelPorCodigoPosicion) {
									if (eachData.nivelDireccion == eachDataNivelPorCodigo.nivelDireccion) {
										eachData["usuario"] = eachDataNivelPorCodigo.usuario;
										eachData["descripcionPosicion"] = eachDataNivelPorCodigo.descripcionPosicion;
										break;
									}
								}
							}
						}
					}
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
				},
			});
		}
	}

	saveDetalleAprobaciones() {
		this.starterService.getUser(sessionStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
			next: (res) => {
				this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
				this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = 200000;
				this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.solicitud.idTipoSolicitud.toString();
				this.solicitudes.modelDetalleAprobaciones.id_Accion = 200000;
				this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.solicitud.idTipoMotivo;
				this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = 200000;
				this.solicitudes.modelDetalleAprobaciones.id_Ruta = 200000;
				this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.solicitud.tipoSolicitud;
				this.solicitudes.modelDetalleAprobaciones.motivo = "CompletarRequisicion";
				this.solicitudes.modelDetalleAprobaciones.tipoRuta = "CompletarRequisicion";
				this.solicitudes.modelDetalleAprobaciones.ruta = "Completar Requisicion";
				this.solicitudes.modelDetalleAprobaciones.accion = "CompletarRequisicion";
				this.solicitudes.modelDetalleAprobaciones.nivelDirecion = res.evType[0].nivelDir;
				this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = "CompletarRequisicion";
				this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = res.evType[0].codigoPosicion;
				this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = res.evType[0].descrPosicion;
				this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = res.evType[0].subledger;
				this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = res.evType[0].nivelDir;
				this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = res.evType[0].codigoPosicionReportaA;
				this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "Completado";
				this.solicitudes.modelDetalleAprobaciones.estado = "A";
				this.solicitudes.modelDetalleAprobaciones.correo = res.evType[0].correo;
				this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = res.evType[0].nombreCompleto;
				this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date();
				this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date();
				this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = this.buttonValue;
				this.solicitudes.modelDetalleAprobaciones.comentario = this.textareaContent;
				convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaCreacion);
				convertTimeZonedDate(this.solicitudes.modelDetalleAprobaciones.fechaModificacion);
				const request = {
					iD_SOLICITUD: this.solicitud.idSolicitud,
					iD_SOLICITUD_PROCESO: null,
					tipoFuente: null,
					fuenteExterna: null,
					tipoProceso: null,
					candidato: null,
					actualizacionDelPerfil: null,
					busquedaDeCandidatos: null,
					entrevista: null,
					pruebas: null,
					referencias: null,
					elaboracionDeInforme: null,
					entregaAlJefeSol: null,
					entrevistaPorJefatura: null,
					tomaDeDesiciones: null,
					candidatoSeleccionado: null,
					procesoDeContratacion: null,
					finProcesoContratacion: null,
					fechaInicioReingreso: null,
					fechaFinReingreso: null,
					fechaInicioContratacionFamiliares: null,
					fechaFinContratacionFamiliares: null,
					fechaIngresoCandidato: this.selectedDateIn,
				};

				this.seleccionCandidatoService.saveCandidato(request).subscribe({
					next: () => {
						this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
							next: () => {
								this.onCompletar();
							},
						});
					},
				});
			},
		});
	}

	obtenerComentariosAtencionPorInstanciaRaiz() {
		return this.solicitudes.obtenerComentariosAtencionPorInstanciaRaiz(this.solicitud.idInstancia + "COMENT").subscribe({
			next: (response) => {
				this.dataComentariosAprobaciones.length = 0;
				this.dataComentariosAprobacionesPorPosicion = response.variableType;

				this.dataComentariosAprobaciones = this.dataComentariosAprobacionesPorPosicion.filter((comentario) => comentario.name === "comentariosAtencion" && comentario.procDefKey === "RevisionSolicitud");
				this.dataComentariosAprobacionesRRHH = this.dataComentariosAprobacionesPorPosicion.filter((comentario) => comentario.name.includes("comentariosAtencionGerenteRRHH") && comentario.procDefKey === "RequisicionPersonal");
				this.dataComentariosAprobacionesCREM = this.dataComentariosAprobacionesPorPosicion.filter((comentario) => comentario.name.includes("comentariosAtencionRemuneraciones") && comentario.procDefKey === "RequisicionPersonal");

				// this.dataComentariosAprobaciones = this.filterDataComentarios(this.solicitud.idInstancia, "RevisionSolicitud", "comentariosAtencion");
				// this.dataComentariosAprobacionesRRHH = this.filterDataComentarios(this.solicitud.idInstancia, "RequisicionPersonal", "comentariosAtencionGerenteRRHH");
				// this.dataComentariosAprobacionesCREM = this.filterDataComentarios(this.solicitud.idInstancia, "RequisicionPersonal", "comentariosAtencionRemuneraciones");
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse("No existe comentarios de aprobadores", "error");
			},
		});
	}

	// filterDataComentarios(idInstancia: string, taskKey: string, name: string) {
	// 	return this.dataComentariosAprobacionesPorPosicion.filter(
	// 		(item) =>
	// 			(idInstancia ? item.rootProcInstId === idInstancia : true) && //Id de instancia
	// 			(taskKey ? item.procDefKey === taskKey : true) &&
	// 			(name ? item.name === name : true)
	// 	);
	// }
}
