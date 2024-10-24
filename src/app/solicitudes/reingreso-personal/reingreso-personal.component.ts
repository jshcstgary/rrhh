import { HttpErrorResponse } from "@angular/common/http";
import { Component, Type } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { format } from "date-fns";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";
import { UtilService } from "src/app/services/util/util.service";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { StarterService } from "src/app/starter/starter.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { Permiso } from "src/app/types/permiso.type";
import { environment, portalWorkFlow } from "src/environments/environment";
import Swal from "sweetalert2";
import { BuscarEmpleadoComponent } from "../buscar-empleado/buscar-empleado.component";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { RegistrarCandidatoService } from "../registrar-candidato/registrar-candidato.service";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { BuscarExempleadoComponent } from "./buscar-exempleado/buscar-exempleado.component";
import { DialogBuscarEmpleadosReingresoComponent } from "./dialog-buscar-empleados-reingreso/dialog-buscar-empleados-reingreso.component";
import { columnsAprobadores, dataTableAprobadores } from "./reingreso-personal.data";

interface DialogComponents {
	dialogBuscarEmpleados: Type<DialogBuscarEmpleadosReingresoComponent>;
	dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

const dialogComponentList: DialogComponents = {
	dialogBuscarEmpleados: DialogBuscarEmpleadosReingresoComponent,
	dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

@Component({
	selector: "app-reingreso-personal",
	templateUrl: "./reingreso-personal.component.html",
	styleUrls: ["./reingreso-personal.component.scss"],
})
export class ReingresoPersonalComponent extends CompleteTaskComponent {
	NgForm = NgForm;

	selectedOption: string = "No";
	columnsAprobadores = columnsAprobadores.columns;
	dataTableAprobadores = dataTableAprobadores;
	empleadoSearch: string = "";
	causaSalida: string = "";
	public codigoReportaA: string = "";
	public existeMatenedores: boolean = false;
	public existe: boolean = false;

	public fechaSalida: Date = new Date("");
	public fechaSalidaRG: Date = new Date("");
	public observacionReingreso: string = "";

	override model: RegistrarData = new RegistrarData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

	modelRG: RegistrarData = new RegistrarData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

	public responsableRRHHRG: any | { nombreCompleto } = { nombreCompleto: "" };
	public jefeSolicitanteQuery: any = "";
	public detallesComentarioJefes: any[] = [];

	public nombreJefeSolicitante: string = "";
	public puestoJefeInmediatoSuperior: string = "";
	public jefeReferenciaQuery: any | { nombreCompleto; descrPuesto } = { nombreCompleto: "", descrPuesto: "" };
	public puestoJefeReferencia: string = "";
	public responsableRRHHQuery: any | { nombreCompleto } = { nombreCompleto: "" };

	private searchSubject = new Subject<{
		campo: string;
		valor: string;
	}>();

	emailVariables = {
		de: "",
		password: "",
		alias: "",
		para: "",
		asunto: "",
		cuerpo: "",
	};

	private detalleNivelAprobacion: any[] = [];

	public solicitudDataInicial = new Solicitud();
	public tipo_solicitud_descripcion: string;
	public tipo_motivo_descripcion: string;
	public tipo_accion_descripcion: string;

	public keySelected: any;

	public detalleSolicitud = new DetalleSolicitud();
	public detalleSolicitudRG = new DetalleSolicitud();

	public solicitud = new Solicitud();
	public solicitudRG = new Solicitud();

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

	/*
	public dataTipoSolicitud: any = [
	  { id: 1, descripcion: "Requisición de Personal" },
	  { id: 2, descripcion: "Contratación de Familiares" },
	  { id: 3, descripcion: "Reingreso de personal" },
	  { id: 4, descripcion: "Acción de Personal" },
	];
	public dataTipoMotivo: any = [
	  { id: 1, descripcion: "Nuevo" },
	  { id: 2, descripcion: "Eventual" },
	  { id: 3, descripcion: "Pasante" },
	  { id: 4, descripcion: "Reemplazo" },
	];

	// public dataTipoAccion: any;

	public dataTipoAccion: any = [
	  { id: 1, descripcion: "Motivo1" },
	  { id: 2, descripcion: "Motivo2" },
	];
	*/

	public misParams: Solicitud;

	public dataTipoSolicitud: any = [];
	public dataTipoMotivo: any = [];

	// public dataTipoAccion: any;

	public dataTipoAccion: any = [];
	// public dataAprobacionesPorPosicion: { [idTipoSolicitud: number, IdTipoMotivo: number, IdNivelDireccion: number]: any[] } =
	// {};

	public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

	public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};

	public dataAprobacionesPorPosicionAPS: any = [];

	public dataTipoRuta: any[] = [];
	public dataTipoRutaEmp: any[] = [];
	public unidadNegocioEmp: string;

	public dataRuta: any[] = [];

	public dataNivelDireccion: any[] = [];

	// getDataNivelesAprobacionPorCodigoPosicion
	public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

	public dataNivelesAprobacion: any;

	public mostrarTipoJustificacionYMision = false;

	public RegistrarsolicitudCompletada = true;

	public restrictionsIds: any[] = ["1", "2", 1, 2];

	public restrictionsSubledgerIds: any[] = ["4", 4];

	public mostrarSubledger = false;

	public dataJefeSuperiorEmpleadoEvolution: any[] = [];
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

	public success: false;
	public params: any;
	public id_edit: undefined | string;

	private id_solicitud_by_params: any;

	public dataAprobadoresDinamicos: any[] = [];
	public suggestions: string[] = [];

	public idDeInstancia: any;

	public loadingComplete = 0;

	/*
	nombresEmpleados: string[] = [
	  ...new Set(
		this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto)
	  ),
	];

	subledgers: string[] = [
	  ...new Set(
		this.dataEmpleadoEvolution.map((empleado) => empleado.subledger)
	  ),
	];

	codigosPosicion: string[] = [
	  ...new Set(
		this.dataEmpleadoEvolution.map((empleado) => empleado.codigoPosicion)
	  ),
	];
	*/

	public jefesInmediatoSuperior: any[] = [];
	public jefesReferencia: any[] = [];
	public responsablesRRHH: any[] = [];
	public tareasPorCompletar: any;
	public primerNivelAprobacion: string = "";
	public aprobacion: any;

	eventSearch = {
		item: "",
	};

	subledgers: string[] = [];

	codigosPosicion: string[] = [];
	jsonResult: string;
	nombreCompletoCandidato: string = "";
	idSolicitudRP: string = "";

	constructor(route: ActivatedRoute, router: Router, camundaRestService: CamundaRestService, private mantenimientoService: MantenimientoService, private solicitudes: SolicitudesService, private utilService: UtilService, private consultaTareasService: ConsultaTareasService, private seleccionCandidatoService: RegistrarCandidatoService, private modalService: NgbModal, private starterService: StarterService) {
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

	getCandidatoValues() {
		this.seleccionCandidatoService.getCandidatoById(this.id_edit).subscribe({
			next: (res) => {
				const candidatoValues = res.seleccionCandidatoType[0];

				this.nombreCompletoCandidato = res.seleccionCandidatoType[0].candidato;
				this.idSolicitudRP = res.seleccionCandidatoType[0].iD_SOLICITUD;

				this.getSolicitudById(this.idSolicitudRP);
				this.getSolicitudById(this.id_solicitud_by_params);
			},
			error: (err) => {
				console.log(console.log(err));
			},
		});
	}

	async ngOnInit() {}

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
				if (id.toUpperCase().includes("RP")) {
					this.solicitud = response;
				} else if (id.toUpperCase().includes("RG")) {
					this.solicitudRG = response;
				}

				this.loadingComplete++;
				this.getDetalleSolicitudById(id);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	searchJefeInmediatoSuperior: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => {
				if (term.length < 1) {
					return [];
				} else {
					return this.jefesInmediatoSuperior.filter(({ nombreCompleto }) => nombreCompleto.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
				}
			})
		);

	formatOption = (value: { nombreCompleto: string }) => value.nombreCompleto;

	searchJefeReferencia: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => (term.length < 1 ? [] : this.jefesReferencia.filter(({ nombreCompleto }) => nombreCompleto.toLowerCase().includes(term.toLowerCase())).slice(0, 10)))
		);

	searchResponsableRRHH: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => (term.length < 1 ? [] : this.responsablesRRHH.filter(({ nombreCompleto }) => nombreCompleto.toLowerCase().includes(term.toLowerCase())).slice(0, 10)))
		);

	getDataJefeInmediatoSuperior() {
		// this.getDataEmpleadosEvolution(this.jefeInmediatoSuperiorQuery, "nombresJefeInmediatoSuperior");
	}

	getDataJefeReferencia() {
		// this.getDataEmpleadosEvolution(this.jefeReferenciaQuery, "nombresJefeReferencia");
	}

	getDataResponsableRRHH() {
		// this.getDataEmpleadosEvolution(this.responsableRRHHQuery, "nombresResponsableRRHH");
	}

	getDataEmpleadosEvolution(arrayToFill: string) {
		// this.mantenimientoService.getDataEmpleadosEvolution().subscribe({
		this.modalService
			// .open(dialogComponentList.dialogBuscarEmpleados, {
			.open(BuscarEmpleadoComponent, {
				ariaLabelledBy: "modal-title",
			})
			.result.then(
				(result) => {
					if (result?.action === "close") {
						return;
					}

					if (!result?.data) {
						return;
					}

					const datosEmpleado = result?.data;

					if (arrayToFill === "nombresResponsableRRHHRG") {
						// this.jefesInmediatoSuperior = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado))];

						this.responsableRRHHRG = Object.assign(
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
					} else if (arrayToFill === "nombresJefeReferencia") {
						// this.jefesReferencia = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado))];

						this.jefeReferenciaQuery = Object.assign(
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

						sessionStorage.setItem(LocalStorageKeys.JefeReferenciaQuery, JSON.stringify(this.jefeReferenciaQuery));
					} else {
						// this.responsablesRRHH = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado))];

						this.responsableRRHHQuery = Object.assign(
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

						sessionStorage.setItem(LocalStorageKeys.ResponsableRRHHQuery, JSON.stringify(this.responsableRRHHQuery));
					}
				},
				(reason) => {}
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
			console.log("Mis params: ", params);
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
						this.getCandidatoValues();
						this.date = this.tareasPorCompletar[0].startTime;
					},
					error: (error) => {
						console.error(error);
					},
				});
			} else {
				this.uniqueTaskId = params["id"];

				this.taskId = params["id"];

				// this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
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
			/*this.utilService.modalResponse(
			  "No existe un registro para este autocompletado",
			  "error"
			);*/
		}
	}
	modelRemuneracion: number = 0;
	observacionRemuneraciones: string = "";

	getDetalleSolicitudById(id: any) {
		return this.solicitudes.getDetalleSolicitudById(id).subscribe({
			next: (response: any) => {
				if (id.toUpperCase().includes("RP")) {
					this.detalleSolicitud = response.detalleSolicitudType[0];

					this.responsableRRHHRG.nombreCompleto = this.detalleSolicitud.responsableRRHH;
				} else if (id.toUpperCase().includes("RG")) {
					this.detalleSolicitudRG = response.detalleSolicitudType[0];
					this.fechaSalidaRG = new Date(this.detalleSolicitudRG.fechaSalida);
					// this.observacionReingreso = this.detalleSolicitudRG.justificacion;
				}

				// this.jefeInmediatoSuperiorQuery = this.detalleSolicitudRG.supervisaA === "NA" ? {
				this.jefeReferenciaQuery =
					this.detalleSolicitudRG.supervisaA === "NA"
						? {
								nombreCompleto: this.detalleSolicitudRG.jefeInmediatoSuperior,
								descrPuesto: this.detalleSolicitudRG.puestoJefeInmediato,
						  }
						: "";

				this.jefeReferenciaQuery =
					this.detalleSolicitudRG.supervisaA === "NA"
						? {
								nombreCompleto: this.detalleSolicitudRG.jefeReferencia,
								descrPuesto: this.detalleSolicitudRG.puesto,
						  }
						: "";

				this.responsableRRHHQuery = this.detalleSolicitudRG.supervisaA === "NA" ? { nombreCompleto: this.detalleSolicitudRG.responsableRRHH } : "";

				if (id.toUpperCase().includes("RP")) {
					if (this.detalleSolicitud.codigoPosicion.length > 0) {
						this.starterService.getUser(this.detalleSolicitud.jefeSolicitante).subscribe({
							next: (res) => {
								this.puestoJefeInmediatoSuperior = res.evType[0].nombreCargo;
								this.nombreJefeSolicitante = res.evType[0].nombreCompleto;
							},
							error: (err) => {
								console.error(err);

								this.puestoJefeInmediatoSuperior = "";
								this.nombreJefeSolicitante = "";
							},
						});

						this.model.codigoPosicion = this.detalleSolicitud.codigoPosicion;
						this.model.puestoJefeInmediato = this.detalleSolicitud.puestoJefeInmediato;
						this.model.jefeInmediatoSuperior = this.detalleSolicitud.jefeInmediatoSuperior;
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
						this.observacionRemuneraciones = this.detalleSolicitud.valor;
						this.codigoReportaA = this.detalleSolicitud.jefeSolicitante;
						this.modelRemuneracion = +this.model.sueldoAnual / 12 + +this.model.sueldoSemestral / 6 + +this.model.sueldoTrimestral / 3 + +this.model.sueldoMensual;
						this.unidadNegocioEmp = this.model.unidadNegocio;
					}
				} else if (id.toUpperCase().includes("RG")) {
					if (this.detalleSolicitudRG.codigoPosicion.length > 0) {
						this.unidadNegocioEmp = this.detalleSolicitudRG.unidadNegocio;
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
									this.keySelected = this.solicitudRG.idTipoSolicitud + "_" + this.solicitudRG.idTipoMotivo + "_" + this.model.nivelDir;

									if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
										this.getNivelesAprobacion();

										if (this.model.codigoPosicion.trim().length > 0) {
											this.obtenerAprobacionesPorPosicionAPS();
											this.obtenerAprobacionesPorPosicionAPD();
										}
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
									this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;

									if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
										this.getNivelesAprobacion();

										if (this.model.codigoPosicion.trim().length > 0) {
											this.obtenerAprobacionesPorPosicionAPS();
											this.obtenerAprobacionesPorPosicionAPD();
										}
									}
								},
								error: (error: HttpErrorResponse) => {
									this.utilService.modalResponse(error.error, "error");
								},
							});
						}

						this.modelRG.codigoPosicion = this.detalleSolicitudRG.codigoPosicion;
						this.modelRG.puestoJefeInmediato = this.detalleSolicitudRG.puestoJefeInmediato;
						this.modelRG.jefeInmediatoSuperior = this.detalleSolicitudRG.jefeInmediatoSuperior;
						this.modelRG.descrPosicion = this.detalleSolicitudRG.descripcionPosicion;
						this.modelRG.subledger = this.detalleSolicitudRG.subledger;
						this.modelRG.nombreCompleto = this.detalleSolicitudRG.nombreEmpleado;
						this.modelRG.compania = this.detalleSolicitudRG.compania;
						this.modelRG.unidadNegocio = this.detalleSolicitudRG.unidadNegocio;
						this.modelRG.departamento = this.detalleSolicitudRG.departamento;
						this.modelRG.nombreCargo = this.detalleSolicitudRG.cargo;
						this.modelRG.localidad = this.detalleSolicitudRG.localidad;
						this.modelRG.nivelDir = this.detalleSolicitudRG.nivelDireccion;
						this.modelRG.nomCCosto = this.detalleSolicitudRG.centroCosto;
						this.modelRG.misionCargo = this.detalleSolicitudRG.misionCargo;
						this.modelRG.justificacionCargo = this.detalleSolicitudRG.justificacion;
						this.modelRG.reportaA = this.detalleSolicitudRG.reportaA;
						this.modelRG.supervisaA = this.detalleSolicitudRG.supervisaA;
						this.modelRG.tipoContrato = this.detalleSolicitudRG.tipoContrato;
						this.modelRG.nivelRepa = this.detalleSolicitudRG.nivelReporteA;
						this.modelRG.sueldo = this.detalleSolicitudRG.sueldo;
						this.modelRG.sueldoMensual = this.detalleSolicitudRG.sueldoVariableMensual;
						this.modelRG.sueldoTrimestral = this.detalleSolicitudRG.sueldoVariableTrimestral;
						this.modelRG.sueldoSemestral = this.detalleSolicitudRG.sueldoVariableSemestral;
						this.modelRG.sueldoAnual = this.detalleSolicitudRG.sueldoVariableAnual;
						this.modelRG.correo = this.detalleSolicitudRG.correo;
						this.causaSalida = this.detalleSolicitudRG.causaSalida;
						this.codigoReportaA = this.detalleSolicitudRG.jefeSolicitante;
						this.modelRG.fechaIngreso = (this.detalleSolicitudRG.fechaIngreso as string).split("T")[0];
						this.fechaSalida = this.detalleSolicitudRG.fechaSalida as Date;
						this.remuneracion = Number(this.modelRG.sueldoAnual) / 12 + Number(this.modelRG.sueldoSemestral) / 6 + Number(this.modelRG.sueldoTrimestral) / 3 + Number(this.modelRG.sueldoMensual);
					}
				}

				this.loadingComplete++;

				this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);
				this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	getNivelesAprobacion() {
		if (this.detalleSolicitudRG.codigoPosicion !== "" && this.detalleSolicitudRG.codigoPosicion !== undefined && this.detalleSolicitudRG.codigoPosicion != null) {
			this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.detalleSolicitudRG.codigoPosicion, this.detalleSolicitudRG.nivelDireccion, this.dataTipoRutaEmp[0].id, "A").subscribe({
				next: (response) => {
					this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, this.dataTipoRutaEmp[0].id, "APD").subscribe({
						next: (responseAPD) => {
							this.primerNivelAprobacion = responseAPD.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
							this.mapearDetallesAprobadores(response.nivelAprobacionPosicionType);
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
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.detalleSolicitudRG.codigoPosicion, this.detalleSolicitudRG.nivelDireccion, this.dataTipoRutaEmp[0].id, "APS").subscribe({
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
		return this.solicitudes.obtenerAprobacionesPorPosicionRuta(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.detalleSolicitudRG.codigoPosicion, this.detalleSolicitudRG.nivelDireccion, this.dataTipoRutaEmp[0].id, "APD").subscribe({
			next: (response) => {
				this.dataAprobadoresDinamicos.length = 0;
				this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType;
				this.primerNivelAprobacion = response.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
				this.dataAprobacionesPorPosicionAPS.forEach((item) => {
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

	onSubmit() {
		Swal.fire({
			text: "¿Desea guardar la Solicitud?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "rgb(227, 199, 22)",
			cancelButtonColor: "#77797a",
			confirmButtonText: "Sí",
			cancelButtonText: "No",
		}).then((result) => {
			if (result.isConfirmed) {
				this.save();

				if (this.submitted) {
				}

				//Fin Solicitud
			}
		});
	}

	override generateVariablesFromFormFields() {
		let variables: any = {};

		if (this.taskType_Activity == environment.taskType_RG) {
			this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
				if (index === 0) {
					const htmlString = '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

					const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

					this.emailVariables = {
						de: this.solicitudes.modelDetalleAprobaciones.correo,
						para: elemento.aprobador.correo,
						// alias: this.solicitudes.modelDetalleAprobaciones.correo,
						alias: "Notificación 1",
						asunto: `Autorización de Solicitud de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
						cuerpo: modifiedHtmlString,
						password: "p4$$w0rd",
					};
				}
			});

			if (this.solicitudRG.estadoSolicitud.toUpperCase() === "DV") {
				variables.usuario_logged_reingresoDevolver = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}Reingreso de Personal: Solicitud Enviada por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			} else {
				variables.usuario_logged_reingreso = {
					value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}Reingreso de Personal: Solicitud Enviada por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
				};
			}

			variables.tipoSolicitud = {
				value: this.solicitudRG.tipoSolicitud,
			};
			variables.urlTarea = {
				value: `${portalWorkFlow}tareas/consulta-tareas`,
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
				this.detalleNivelAprobacion = nivelAprobacionPosicionType.map(({ nivelAprobacionType, aprobador }, index) => ({
					id_Solicitud: this.solicitudRG.idSolicitud,
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
				}));

				this.detalleNivelAprobacion.forEach(({ fechaCreacion, fechaModificacion }) => {
					convertTimeZonedDate(fechaCreacion);
					convertTimeZonedDate(fechaModificacion);
				});
			},
		});
	}

	onCompletar() {
		if (this.uniqueTaskId === null) {
			this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

			return;
		}

		this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");
		let variables = this.generateVariablesFromFormFields();

		if (this.solicitudRG.estadoSolicitud === "DV") {
			if (this.detalleNivelAprobacion.length > 0) {
				this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
					next: (res) => {
						this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
							next: (res) => {
								this.solicitudRG.empresa = this.modelRG.compania;
								this.solicitudRG.idEmpresa = this.modelRG.compania;
								this.solicitudRG.unidadNegocio = this.modelRG.unidadNegocio;
								this.solicitudRG.idUnidadNegocio = this.modelRG.unidadNegocio;

								this.solicitudRG.estadoSolicitud = "4";

								this.solicitudes.actualizarSolicitud(this.solicitudRG).subscribe({
									next: (responseSolicitud) => {
										sessionStorage.removeItem(LocalStorageKeys.JefeReferenciaQuery);
										sessionStorage.removeItem(LocalStorageKeys.JefeSolicitanteQuery);
										sessionStorage.removeItem(LocalStorageKeys.ResponsableRRHHQuery);

										this.solicitudes.getDetalleAprobadoresSolicitudesById(this.solicitudRG.idSolicitud).subscribe({
											next: (resJefe) => {
												resJefe.detalleAprobadorSolicitud.forEach((item) => {
													if (item.estadoAprobacion.toUpperCase() === "PORREVISAR") {
														const htmlString = item.estadoAprobacion.toUpperCase() === "PORREVISAR" ? '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n' : '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y registro de Comentario de Desempeño del Empleado en el área.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

														const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", item.usuarioAprobador).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

														this.emailVariables = {
															de: "emisor",
															para: item.correo,
															// alias: this.solicitudes.modelDetalleAprobaciones.correo,
															alias: "Notificación 1",
															asunto: `Autorización de Solicitud de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
															cuerpo: modifiedHtmlString,
															password: "password",
														};
														this.solicitudes.sendEmail(this.emailVariables).subscribe({
															next: () => {},
															error: (error) => {
																console.error(error);
															},
														});
													}
												});
											},
										});
									},
									error: (err) => {
										console.error(err);
									},
								});

								this.utilService.closeLoadingSpinner();

								this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitudRG.idSolicitud}]. Será redirigido en un momento...`, "success");

								setTimeout(() => {
									this.router.navigate(["/tareas/consulta-tareas"]);
								}, 1800);
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
			}
		} else {
			this.jefeReferenciaQuery = JSON.parse(sessionStorage.getItem(LocalStorageKeys.JefeReferenciaQuery));
			this.responsableRRHHQuery = JSON.parse(sessionStorage.getItem(LocalStorageKeys.ResponsableRRHHQuery));
			this.jefeSolicitanteQuery = JSON.parse(sessionStorage.getItem(LocalStorageKeys.JefeSolicitanteQuery));

			let jefes = [];

			if (this.jefeReferenciaQuery.codigo !== undefined) {
				jefes.push({
					...this.jefeReferenciaQuery,
					tipoJefe: "jefeInmediato",
				});
			}

			if (this.responsableRRHHQuery.codigo !== undefined) {
				jefes.push({
					...this.responsableRRHHQuery,
					tipoJefe: "responsableRRHH",
				});
			}

			jefes.push({
				...this.jefeSolicitanteQuery,
				tipoJefe: "jefeSolicitante",
			});

			const detallesJefes = jefes.map((jefe) => this.llenarModelDetalleAprobaciones(jefe));

			detallesJefes.forEach(({ fechaCreacion, fechaModificacion }) => {
				convertTimeZonedDate(fechaCreacion);
				convertTimeZonedDate(fechaModificacion);
			});

			this.solicitudes.cargarDetalleAprobacionesArreglo(detallesJefes).subscribe({
				next: () => {},
			});

			if (this.detalleNivelAprobacion.length > 0) {
				this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
					next: (res) => {
						this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
							next: (res) => {
								this.solicitudRG.empresa = this.modelRG.compania;
								this.solicitudRG.idEmpresa = this.modelRG.compania;
								this.solicitudRG.unidadNegocio = this.modelRG.unidadNegocio;
								this.solicitudRG.idUnidadNegocio = this.modelRG.unidadNegocio;

								this.solicitudRG.estadoSolicitud = "4";

								this.solicitudes.actualizarSolicitud(this.solicitudRG).subscribe({
									next: (responseSolicitud) => {
										sessionStorage.removeItem(LocalStorageKeys.JefeReferenciaQuery);
										sessionStorage.removeItem(LocalStorageKeys.JefeSolicitanteQuery);
										sessionStorage.removeItem(LocalStorageKeys.ResponsableRRHHQuery);

										this.solicitudes.getDetalleAprobadoresSolicitudesById(this.solicitudRG.idSolicitud).subscribe({
											next: (resJefe) => {
												resJefe.detalleAprobadorSolicitud.forEach((item) => {
													if (item.estadoAprobacion.toUpperCase().includes("COMENTARIOJEFE")) {
														const htmlString = item.estadoAprobacion.toUpperCase().includes("COMENTARIORRHH") ? '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y registro de Comentario de Salida del Empleado.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n' : '<!DOCTYPE html>\r\n<html lang="es">\r\n\r\n<head>\r\n  <meta charset="UTF-8">\r\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n  <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n  <h2>Estimado(a)</h2>\r\n  <h3>{NOMBRE_APROBADOR}</h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y registro de Comentario de Desempeño del Empleado en el área.</P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href="{URL_APROBACION}">{URL_APROBACION}</a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    </b>\r\n  </p>\r\n</body>\r\n\r\n</html>\r\n';

														const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", item.usuarioAprobador).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

														this.emailVariables = {
															de: "emisor",
															para: item.correo,
															// alias: this.solicitudes.modelDetalleAprobaciones.correo,
															alias: "Notificación 1",
															asunto: `Registro de Comentarios para la Solicitud de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
															cuerpo: modifiedHtmlString,
															password: "password",
														};
														this.solicitudes.sendEmail(this.emailVariables).subscribe({
															next: () => {},
															error: (error) => {
																console.error(error);
															},
														});
													}
												});
											},
										});

										//   this.utilService.closeLoadingSpinner();

										//   this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitudRG.idSolicitud}]. Será redirigido en un momento...`, "success");

										//   setTimeout(() => {
										//     this.router.navigate([
										//       "/tareas/consulta-tareas",
										//     ]);
										//   }, 1800);
										// }, 3000);
									},
									error: (err) => {
										console.error(err);
									},
								});

								this.utilService.closeLoadingSpinner();

								this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitudRG.idSolicitud}]. Será redirigido en un momento...`, "success");

								setTimeout(() => {
									this.router.navigate(["/tareas/consulta-tareas"]);
								}, 1800);
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
			}
		}

		this.submitted = true;
	}

	public onCancel(): void {}

	public onSelectItem(event: NgbTypeaheadSelectItemEvent<any>): void {
		console.log(event);
	}

	openModalReasignarUsuario() {
		const modelRef = this.modalService.open(dialogComponentList.dialogReasignarUsuario, {
			ariaLabelledBy: "modal-title",
		});

		modelRef.componentInstance.idParam = this.solicitudRG.idSolicitud;
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

	indexedModal: Record<keyof DialogComponents, any> = {
		dialogBuscarEmpleados: () => this.openModalBuscarExempleado(),
		dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
	};

	openModal(component: keyof DialogComponents) {
		this.indexedModal[component]();
	}

	llenarModelDetalleAprobaciones({ tipoJefe, ...jefe }: any) {
		return {
			id_Solicitud: this.solicitudRG.idSolicitud,
			id_NivelAprobacion: tipoJefe === "jefeInmediato" ? 300000 : tipoJefe === "responsableRRHH" ? 300001 : 350000,
			id_TipoSolicitud: this.solicitudRG.idTipoSolicitud.toString(),
			id_Accion: tipoJefe === "jefeInmediato" ? 300000 : tipoJefe === "responsableRRHH" ? 300001 : 350000,
			id_TipoMotivo: this.solicitudRG.idTipoMotivo,
			id_TipoRuta: tipoJefe === "jefeInmediato" ? 300000 : tipoJefe === "responsableRRHH" ? 300001 : 350000,
			id_Ruta: tipoJefe === "jefeInmediato" ? 300000 : tipoJefe === "responsableRRHH" ? 300001 : 350000,
			tipoSolicitud: this.solicitudRG.tipoSolicitud,
			motivo: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHH" : "RegistrarComentarioSolicitante",
			tipoRuta: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHH" : "RegistrarComentarioSolicitante",
			ruta: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHH" : "RegistrarComentarioSolicitante",
			accion: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHH" : "RegistrarComentarioSolicitante",
			nivelDirecion: jefe.nivelDir,
			nivelAprobacionRuta: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHH" : "RegistrarComentarioSolicitante",
			usuarioAprobador: jefe.nombreCompleto,
			codigoPosicionAprobador: jefe.codigoPosicion,
			descripcionPosicionAprobador: jefe.descrPosicion,
			sudlegerAprobador: jefe.subledger,
			nivelDireccionAprobador: jefe.nivelDir,
			codigoPosicionReportaA: jefe.codigoPosicionReportaA,
			estadoAprobacion: tipoJefe === "jefeInmediato" ? "RegistrarComentarioJefe" : tipoJefe === "responsableRRHH" ? "RegistrarComentarioRRHHPendiente" : "RegistrarComentarioSolicitante",
			estado: "A",
			correo: jefe.correo,
			usuarioCreacion: jefe.nombreCompleto,
			usuarioModificacion: jefe.nombreCompleto,
			fechaCreacion: new Date(),
			fechaModificacion: new Date(),
		};
	}

	save() {
		this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

		if (this.solicitudRG.estadoSolicitud === "DV") {
			this.submitted = true;
			let idInstancia = this.solicitudDataInicial.idInstancia;

			let extra = {
				idEmpresa: this.model.compania,
				empresa: this.model.compania,
				estadoSolicitud: "Pendiente",
				unidadNegocio: this.model.unidadNegocio,
				idUnidadNegocio: this.model.unidadNegocio,
			};

			this.solicitud.idSolicitud = this.id_solicitud_by_params;
			this.solicitud.empresa = this.model.compania;
			this.solicitud.idEmpresa = this.model.compania;

			this.solicitud.unidadNegocio = this.model.unidadNegocio;
			this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
			this.solicitud.estadoSolicitud = "3";
			this.solicitud.idTipoMotivo = 0;
			this.solicitud.idTipoAccion = 0;

			this.detalleSolicitud.responsableRRHH = this.responsableRRHHRG.nombreCompleto;
			this.detalleSolicitud.jefeInmediatoSuperior = this.nombreJefeSolicitante;
			this.detalleSolicitud.puestoJefeInmediato = this.puestoJefeInmediatoSuperior;

			this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
				next: () => {
					// setTimeout(() => {
					// 	window.location.reload();
					// }, 1800);
				},
			});

			this.solicitudes.getSolicitudById(this.id_solicitud_by_params).subscribe({
				next: (response: any) => {
					this.solicitudRG.idTipoSolicitud = response.idTipoSolicitud;
					this.solicitudRG.tipoSolicitud = response.tipoSolicitud;
					this.solicitudes.actualizarSolicitud(this.solicitudRG).subscribe({
						next: (responseSolicitud) => {
							this.detalleSolicitud.idSolicitud = this.id_solicitud_by_params;

							this.detalleSolicitud.areaDepartamento = this.modelRG.departamento;
							this.detalleSolicitud.justificacion = this.modelRG.justificacionCargo;
							this.detalleSolicitud.cargo = this.modelRG.nombreCargo;
							this.detalleSolicitud.centroCosto = this.modelRG.nomCCosto;
							this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
							this.detalleSolicitud.compania = this.modelRG.compania;
							this.detalleSolicitud.departamento = this.modelRG.departamento;
							this.detalleSolicitud.descripcionPosicion = this.model.descrPosicion;

							this.detalleSolicitud.localidad = this.modelRG.localidad;
							this.detalleSolicitud.localidadZona = this.modelRG.codigoPuesto;

							this.detalleSolicitud.misionCargo = this.modelRG.misionCargo;
							this.detalleSolicitud.nivelDireccion = this.modelRG.nivelDir;
							this.detalleSolicitud.nivelReporteA = this.modelRG.nivelRepa;

							this.detalleSolicitud.nombreEmpleado = this.modelRG.nombreCompleto;

							this.detalleSolicitud.reportaA = this.modelRG.reportaA;
							this.detalleSolicitud.supervisaA = "NA";

							this.detalleSolicitud.subledger = this.modelRG.subledger;

							this.detalleSolicitud.subledgerEmpleado = this.modelRG.subledger;

							this.detalleSolicitud.sucursal = this.modelRG.sucursal;

							this.detalleSolicitud.misionCargo = this.modelRG.misionCargo == "" || this.modelRG.misionCargo == undefined || this.modelRG.misionCargo == null ? "" : this.modelRG.misionCargo;

							this.detalleSolicitud.sueldo = this.modelRG.sueldo;
							this.detalleSolicitud.sueldoVariableMensual = this.modelRG.sueldoMensual;
							this.detalleSolicitud.sueldoVariableTrimestral = this.modelRG.sueldoTrimestral;
							this.detalleSolicitud.sueldoVariableSemestral = this.modelRG.sueldoSemestral;
							this.detalleSolicitud.sueldoVariableAnual = this.modelRG.sueldoAnual;
							this.detalleSolicitud.tipoContrato = this.modelRG.tipoContrato;
							this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

							this.detalleSolicitud.correo = this.modelRG.correo;

							this.detalleSolicitud.fechaIngreso = this.modelRG.fechaIngreso;

							this.detalleSolicitud.jefeInmediatoSuperior = this.modelRG.jefeInmediatoSuperior;
							this.detalleSolicitud.puestoJefeInmediato = this.model.puestoJefeInmediato;
							this.detalleSolicitud.jefeReferencia = this.jefeReferenciaQuery.nombreCompleto;
							this.detalleSolicitud.puesto = this.jefeReferenciaQuery.descrPuesto;
							this.detalleSolicitud.responsableRRHH = this.responsableRRHHQuery.nombreCompleto;
							this.detalleSolicitud.jefeSolicitante = this.codigoReportaA;
							this.detalleSolicitud.fechaSalida = this.fechaSalidaRG;
							this.detalleSolicitud.causaSalida = this.causaSalida;
							this.detalleSolicitud.justificacion = this.detalleSolicitudRG.justificacion;

							this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
								next: (responseDetalle) => {
									this.utilService.closeLoadingSpinner(); //comentado mmunoz
									this.utilService.modalResponse("Datos ingresados correctamente", "success");

									setTimeout(() => {
										window.location.reload();
									}, 1800);
								},
							});
						},
					});
				},
			});
		} else {
			this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.detalleSolicitudRG.jefeSolicitante).subscribe({
				next: (responseSolicitante) => {
					if (responseSolicitante.evType.length === 0) {
						Swal.fire({
							text: "No se encontró registro",
							icon: "info",
							confirmButtonColor: "rgb(227, 199, 22)",
							confirmButtonText: "Sí",
						});
					}

					this.jefeSolicitanteQuery = Object.assign(
						{},
						{
							...responseSolicitante.evType[0],
							sueldo: responseSolicitante.evType[0].sueldo,
							sueldoMensual: responseSolicitante.evType[0].sueldoVariableMensual,
							sueldoTrimestral: responseSolicitante.evType[0].sueldoVariableTrimestral,
							sueldoSemestral: responseSolicitante.evType[0].sueldoVariableSemestral,
							sueldoAnual: responseSolicitante.evType[0].sueldoVariableAnual,
						}
					);

					sessionStorage.setItem(LocalStorageKeys.JefeSolicitanteQuery, JSON.stringify(this.jefeSolicitanteQuery));

					this.submitted = true;
					let idInstancia = this.solicitudDataInicial.idInstancia;

					let extra = {
						idEmpresa: this.model.compania,
						empresa: this.model.compania,
						estadoSolicitud: "Pendiente",
						unidadNegocio: this.model.unidadNegocio,
						idUnidadNegocio: this.model.unidadNegocio,
					};

					this.solicitud.idSolicitud = this.id_solicitud_by_params;
					this.solicitud.empresa = this.model.compania;
					this.solicitud.idEmpresa = this.model.compania;

					this.solicitud.unidadNegocio = this.model.unidadNegocio;
					this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
					this.solicitud.estadoSolicitud = "3";
					this.solicitud.idTipoMotivo = 0;
					this.solicitud.idTipoAccion = 0;

					this.detalleSolicitud.responsableRRHH = this.responsableRRHHRG.nombreCompleto;

					this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
						next: (responseDetalle) => {
							// setTimeout(() => {
							// 	window.location.reload();
							// }, 1800);
						},
					});

					this.solicitudes.getSolicitudById(this.id_solicitud_by_params).subscribe({
						next: (response: any) => {
							this.solicitudRG.idTipoSolicitud = response.idTipoSolicitud;
							this.solicitudRG.tipoSolicitud = response.tipoSolicitud;
							this.solicitudes.actualizarSolicitud(this.solicitudRG).subscribe({
								next: (responseSolicitud) => {
									this.detalleSolicitud.idSolicitud = this.id_solicitud_by_params;

									this.detalleSolicitud.areaDepartamento = this.modelRG.departamento;
									this.detalleSolicitud.justificacion = this.modelRG.justificacionCargo;
									this.detalleSolicitud.cargo = this.modelRG.nombreCargo;
									this.detalleSolicitud.centroCosto = this.modelRG.nomCCosto;
									this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
									this.detalleSolicitud.compania = this.modelRG.compania;
									this.detalleSolicitud.departamento = this.modelRG.departamento;
									this.detalleSolicitud.descripcionPosicion = this.model.descrPosicion;

									this.detalleSolicitud.localidad = this.modelRG.localidad;
									this.detalleSolicitud.localidadZona = this.modelRG.codigoPuesto;

									this.detalleSolicitud.misionCargo = this.modelRG.misionCargo;
									this.detalleSolicitud.nivelDireccion = this.modelRG.nivelDir;
									this.detalleSolicitud.nivelReporteA = this.modelRG.nivelRepa;

									this.detalleSolicitud.nombreEmpleado = this.modelRG.nombreCompleto;

									this.detalleSolicitud.reportaA = this.modelRG.reportaA;
									this.detalleSolicitud.supervisaA = "NA";

									this.detalleSolicitud.subledger = this.modelRG.subledger;

									this.detalleSolicitud.subledgerEmpleado = this.modelRG.subledger;

									this.detalleSolicitud.sucursal = this.modelRG.sucursal;

									this.detalleSolicitud.misionCargo = this.modelRG.misionCargo == "" || this.modelRG.misionCargo == undefined || this.modelRG.misionCargo == null ? "" : this.modelRG.misionCargo;

									this.detalleSolicitud.sueldo = this.modelRG.sueldo;
									this.detalleSolicitud.sueldoVariableMensual = this.modelRG.sueldoMensual;
									this.detalleSolicitud.sueldoVariableTrimestral = this.modelRG.sueldoTrimestral;
									this.detalleSolicitud.sueldoVariableSemestral = this.modelRG.sueldoSemestral;
									this.detalleSolicitud.sueldoVariableAnual = this.modelRG.sueldoAnual;
									this.detalleSolicitud.tipoContrato = this.modelRG.tipoContrato;
									this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

									this.detalleSolicitud.correo = this.modelRG.correo;

									this.detalleSolicitud.fechaIngreso = new Date(this.modelRG.fechaIngreso as Date);
									convertTimeZonedDate(this.detalleSolicitud.fechaIngreso);

									this.detalleSolicitud.jefeInmediatoSuperior = this.modelRG.jefeInmediatoSuperior;
									this.detalleSolicitud.puestoJefeInmediato = this.model.puestoJefeInmediato;
									this.detalleSolicitud.jefeReferencia = this.jefeReferenciaQuery.nombreCompleto;
									this.detalleSolicitud.puesto = this.jefeReferenciaQuery.descrPuesto;
									this.detalleSolicitud.responsableRRHH = this.responsableRRHHQuery.nombreCompleto;
									this.detalleSolicitud.jefeSolicitante = this.codigoReportaA;
									this.detalleSolicitud.fechaSalida = this.fechaSalidaRG;
									this.detalleSolicitud.causaSalida = this.causaSalida;
									// this.detalleSolicitud.justificacion = this.observacionReingreso;
									this.detalleSolicitud.justificacion = this.detalleSolicitudRG.justificacion;

									this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
										next: (responseDetalle) => {
											this.utilService.closeLoadingSpinner(); //comentado mmunoz
											this.utilService.modalResponse("Datos ingresados correctamente", "success");

											setTimeout(() => {
												window.location.reload();
											}, 1800);
										},
									});
								},
							});
						},
					});
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse(error.error, "error");
				},
			});
		}

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

	public comp: string = "";
	public sueldo: string = "";
	public mensual: string = "";
	public anual: string = "";
	public trimestral: string = "";
	public semestral: string = "";
	public remuneracion: number;
	public puesto: string = "";
	public unidadNegocio: string = "";
	public localidad: string = "";
	public departamento: string = "";
	public feIng: Date;

	openModalBuscarExempleado() {
		this.modalService
			// .open(dialogComponentList.dialogBuscarEmpleados, {
			.open(BuscarExempleadoComponent, {
				ariaLabelledBy: "modal-title",
			})
			.result.then(
				(result) => {
					if (result?.action === "close") {
						return;
					}

					if (result?.data) {
						const data: any = result.data;

						this.fechaSalidaRG = data.fechaSalida === null || data.fechaSalida === "" || data.fechaSalida === undefined ? new Date(data.descripContrato.split(" ")[0]) : data.fechaSalida;
						this.modelRG.nombreCompleto = data.nombreCompleto;
						this.modelRG.subledger = data.subledger ?? "0";
						this.causaSalida = data.nombreCompania === null ? data.supervisaA : data.descr_CausaSalida ?? "";
						this.modelRG.compania = data.nombreCompania ?? data.compania;
						this.modelRG.sueldo = data.sueldo;
						this.modelRG.sueldoMensual = data.sueldoVariableMensual;
						this.modelRG.sueldoAnual = data.sueldoVariableAnual;
						this.modelRG.sueldoTrimestral = data.sueldoVariableTrimestral;
						this.modelRG.sueldoSemestral = data.sueldoVariableSemestral;
						this.modelRG.nombreCargo = data.nombreCargo ?? data.descrCargo;
						this.modelRG.unidadNegocio = data.unidadNegocio;
						this.modelRG.localidad = data.localidad;
						this.modelRG.departamento = data.departamento;
						this.modelRG.fechaIngreso = data.fechaIngresogrupo === null ? new Date(data.fechaIngreso).toISOString().split("T")[0] : new Date(data.fechaIngresogrupo).toISOString().split("T")[0];
						this.remuneracion = Number(this.modelRG.sueldoAnual) / 12 + Number(this.modelRG.sueldoSemestral) / 6 + Number(this.modelRG.sueldoTrimestral) / 3 + Number(this.modelRG.sueldoMensual);

						this.detalleSolicitudRG.supervisaA = "N-A";
					}
				},
				(reason) => {
					console.log(`Dismissed with: ${reason}`);
				}
			);
	}
}
