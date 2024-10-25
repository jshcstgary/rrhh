import { HttpErrorResponse } from "@angular/common/http";
import { Component, Type } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { environment } from "src/environments/environment";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";

// import {
//   DialogComponents,
//   dialogComponentList,
// } from "src/app/shared/dialogComponents/dialog.components";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { StarterService } from "src/app/starter/starter.service";
import { Permiso } from "src/app/types/permiso.type";
import Swal from "sweetalert2";

interface DialogComponents {
	dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

const dialogComponentList: DialogComponents = {
	dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

@Component({
	selector: "app-completar-accion-personal",
	templateUrl: "./completar-accion-personal.component.html",
	styleUrls: ["./completar-accion-personal.component.scss"],
})
export class CompletarAccionPersonalComponent extends CompleteTaskComponent {
	NgForm = NgForm;

	selectedOptionAnulacion: string;
	selected_tipo_accion: number;
	selectedOption: string = "No";
	empleadoSearch: string = "";

	override model: RegistrarData = new RegistrarData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

	// public solicitud = new Solicitud();

	private searchSubject = new Subject<{
		campo: string;
		valor: string;
	}>();

	// private

	public solicitudDataInicial = new Solicitud();
	public tipo_solicitud_descripcion: string;
	public tipo_motivo_descripcion: string;
	public tipo_accion_descripcion: string;

	public keySelected: any;

	public detalleSolicitud = new DetalleSolicitud();

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

	public existeMatenedores: boolean = false;
	public existe: boolean = false;

	nombresEmpleados: string[] = [];

	subledgers: string[] = [];

	codigosPosicion: string[] = [];
	jsonResult: string;

	constructor(route: ActivatedRoute, router: Router, camundaRestService: CamundaRestService, private mantenimientoService: MantenimientoService, private solicitudes: SolicitudesService, private utilService: UtilService, private consultaTareasService: ConsultaTareasService, private modalService: NgbModal, private starterService: StarterService) {
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
									await this.ObtenerServicioTipoSolicitud();
									await this.ObtenerServicioTipoMotivo();
									await this.ObtenerServicioTipoAccion();
									await this.ObtenerServicioNivelDireccion();
									await this.getSolicitudes();
									await this.getSolicitudById(this.id_edit);
									await this.getDataEmpleadosEvolution();
									await this.loadDataCamunda(); //comentado para prueba mmunoz

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
				this.solicitud = response;

				this.loadingComplete++;
				this.getDetalleSolicitudById(this.id_edit);
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
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
			// const variableNames = Object.keys(this.model).join(",");
			const variableNames = Object.keys(this.model).join(",");

			if ("true" === this.parentIdFlag) {
				// id is parent process instance id. so handle it accordingly
				// we are looking for task id 'Registrar' in a recently started process instance 'id'
				this.idDeInstancia = params["id"];
				this.camundaRestService.getTask(environment.taskType_CF, params["id"]).subscribe((result) => {
					this.lookForError(result); // if error, then control gets redirected to err page

					this.uniqueTaskId = result[0].id; /* Es como la tarea que se crea en esa instancia */
					this.taskId = params["id"]; /* Esta es la instancia */
					this.getDetalleSolicitudById(this.id_solicitud_by_params);
					this.getSolicitudById(this.id_solicitud_by_params);
					this.date = result[0].created;
					this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
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
		}
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
				}

				this.loadingComplete++;

				this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

				this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

				this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;
				if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
					this.getNivelesAprobacion();
					if (this.model.codigoPosicion.trim().length > 0) {
						this.obtenerAprobacionesPorPosicionAPS();
						this.obtenerAprobacionesPorPosicionAPD();
					}

					let variables = this.generateVariablesFromFormFields();
				}
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	getNivelesAprobacion() {
		if (this.detalleSolicitud.codigoPosicion !== "" && this.detalleSolicitud.codigoPosicion !== undefined && this.detalleSolicitud.codigoPosicion != null) {
			this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.detalleSolicitud.codigoPosicion, this.detalleSolicitud.nivelDireccion, "A").subscribe({
				next: (response) => {
					this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
				},
			});
		}
	}

	obtenerAprobacionesPorPosicionAPS() {
		return this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, "APS").subscribe({
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
		return this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, "APD").subscribe({
			next: (response) => {
				this.dataAprobadoresDinamicos.length = 0;
				this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType;
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
			this.errorMessage = result.error.message;
			this.utilService.modalResponse(this.errorMessage, "error");
		}
	}

	onSubmit() {
		Swal.fire({
			text: "¿Desea crear la Solicitud?",
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

	onCompletar() {
		//completar tarea mmunoz
		if (this.uniqueTaskId === null) {
			//handle this as an error
			this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";
			return;
		}
		this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");

		let variables = this.generateVariablesFromFormFields();

		this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
			next: (res) => {
				this.solicitud.empresa = this.model.compania;
				this.solicitud.idEmpresa = this.model.compania;

				this.solicitud.unidadNegocio = this.model.unidadNegocio;
				this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
				if (this.selectedOption == "No") {
					this.solicitud.estadoSolicitud = "4";
				} else {
					this.solicitud.estadoSolicitud = "AN";
				}

				this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {
					console.log("responseSolicitud: ", responseSolicitud);
				});

				this.utilService.closeLoadingSpinner();
				//fin actualizo la solicitud a enviada
				this.utilService.modalResponse(`Solicitud registrada correctamente [${this.idDeInstancia}]. Será redirigido en un momento...`, "success");
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

	public onCancel(): void {}

	public onSelectItem(codigoPosicion: string, event: NgbTypeaheadSelectItemEvent<any>): void {}

	indexedModal: Record<keyof DialogComponents, any> = {
		dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
	};

	openModal(component: keyof DialogComponents) {
		this.indexedModal[component]();
	}

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

	save() {
		this.utilService.openLoadingSpinner("Guardando información, espere por favor..."); // comentado mmunoz

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
		this.solicitud.estadoSolicitud = "2";
		console.log("this.solicitud: ", this.solicitud);
		this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {
			console.log("responseSolicitud: ", responseSolicitud);

			this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

			this.detalleSolicitud.areaDepartamento = this.model.departamento;

			this.detalleSolicitud.cargo = this.model.nombreCargo;
			this.detalleSolicitud.centroCosto = this.model.nomCCosto;
			this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
			this.detalleSolicitud.compania = this.model.compania; //idEmpresa
			this.detalleSolicitud.departamento = this.model.departamento;
			this.detalleSolicitud.descripcionPosicion = this.model.descrPosicion;

			this.detalleSolicitud.localidad = this.model.localidad;
			this.detalleSolicitud.localidadZona = this.model.localidad;

			this.detalleSolicitud.misionCargo = this.model.misionCargo;
			this.detalleSolicitud.nivelDireccion = this.model.nivelDir;
			this.detalleSolicitud.nivelReporteA = this.model.nivelRepa;

			this.detalleSolicitud.nombreEmpleado = this.model.nombreCompleto;

			this.detalleSolicitud.reportaA = this.model.reportaA;

			this.detalleSolicitud.subledger = this.model.subledger;

			this.detalleSolicitud.subledgerEmpleado = this.model.subledger;

			this.detalleSolicitud.sucursal = this.model.sucursal;

			this.detalleSolicitud.misionCargo = this.model.misionCargo == "" || this.model.misionCargo == undefined || this.model.misionCargo == null ? "" : this.model.misionCargo;
			this.detalleSolicitud.justificacion = this.model.justificacionCargo == "" || this.model.justificacionCargo == undefined || this.model.justificacionCargo == null ? "" : this.model.justificacionCargo;
			this.detalleSolicitud.sueldo = this.model.sueldo;
			this.detalleSolicitud.sueldoVariableMensual = this.model.sueldoMensual;
			this.detalleSolicitud.sueldoVariableTrimestral = this.model.sueldoTrimestral;
			this.detalleSolicitud.sueldoVariableSemestral = this.model.sueldoSemestral;
			this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
			this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
			this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

			this.detalleSolicitud.correo = this.model.correo;

			this.detalleSolicitud.supervisaA = this.model.supervisaA;

			this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo == "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;

			console.log("ESTO LE MANDO AL ACTUALIZAR this.detalleSolicitud: ", this.detalleSolicitud, this.model);

			this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe((responseDetalle) => {
				console.log("responseDetalle: ", responseDetalle);

				this.utilService.closeLoadingSpinner(); //comentado mmunoz
				this.utilService.modalResponse("Datos ingresados correctamente", "success");

				console.log("CON ESTO COMPLETO (this.uniqueTaskId): ", this.uniqueTaskId);

				console.log("AQUI HAY UN IDDEINSTANCIA?: ", this.idDeInstancia);

				setTimeout(() => {
					this.router.navigate(["/tareas/consulta-tareas"]);
				}, 1800);
			});
		}); //aqui debe crear los aprobadores
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
		console.log(this.selectedOptionAnulacion);
	}
}
