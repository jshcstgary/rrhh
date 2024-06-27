import { SolicitudesService } from "./solicitudes.service";
import { Component } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import {
  HttpClientModule,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Subject, Observable, OperatorFunction } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  isEmpty,
  map,
  switchMap,
} from "rxjs/operators";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { StarterService } from "src/app/starter/starter.service";

@Component({
  selector: "registrarSolicitud",
  templateUrl: "./registrar-solicitud.component.html",
  styleUrls: ["./registrar-solicitud.component.scss"],

  providers: [CamundaRestService, HttpClientModule],
  exportAs: "registrarSolicitud",
})
export class RegistrarSolicitudComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  selectedOption: string = 'No';

  emailVariables = {
    de: "",
    password: "",
    alias: "",
    para: "",
    asunto: "",
    cuerpo: ""
  };

  private readonly NIVEL_APROBACION_GERENCIA_MEDIA: string = "GERENCIA MEDIA";
  private readonly NIVEL_APROBACION_GERENCIA_UNIDAD: string = "GERENCIA DE UNIDAD O CORPORATIVA";
  private readonly NIVEL_APROBACION_JEFATURA: string = "JEFATURA";
  private readonly NIVEL_APROBACION_VICEPRESIDENCIA: string = "VICEPRESIDENCIA";
  private readonly NIVEL_APROBACION_RRHH: string = "Gerente de RRHH Corporativo";

  override model: RegistrarData = new RegistrarData(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );

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

  public dataAprobador: {
    correo: string;
    usuarioAprobador: string;
    nivelDireccion: string;
    descripcionPosicion: string;
    subledger: string;
  } = {
      correo: "",
      usuarioAprobador: "",
      nivelDireccion: "",
      descripcionPosicion: "",
      subledger: ""
    };

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

  private detalleNivelAprobacion: any[] = [];

  // public dataTipoAccion: any;

  public dataTipoAccion: any = [];
  // public dataAprobacionesPorPosicion: { [idTipoSolicitud: number, IdTipoMotivo: number, IdNivelDireccion: number]: any[] } =
  // {};

  public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

  public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};

  public dataAprobacionesPorPosicionAPS: any = [];
  public dataAprobacionesPorPosicionAPD: any = [];

  public dataTipoRuta: any[] = [];

  public dataRuta: any[] = [];

  public dataNivelDireccion: any[] = [];


  // getDataNivelesAprobacionPorCodigoPosicion
  public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

  public dataNivelesAprobacion: any;

  public mostrarTipoJustificacionYMision = false;

  public RegistrarsolicitudCompletada = false;

  public restrictionsIds: any[] = ["1", "2", 1, 2];

  public restrictionsSubledgerIds: any[] = ["4", 4];

  public mostrarSubledger = false;

  public IsCodigoPosicion = false;

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

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];
  jsonResult: string;

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService,
    private starterService: StarterService
  ) {
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
  }

  onSelectionChange() {
    console.log(this.selectedOption);
  }

  // searchCodigoPosicion: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 1
  //         ? []
  //         : this.codigosPosicion
  //           .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //           .slice(0, 10)
  //     )
  //   );

  // searchSubledger: OperatorFunction<string, readonly string[]> = (
  //   text$: Observable<string>
  // ) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 1
  //         ? []
  //         : this.subledgers
  //           .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //           .slice(0, 10)
  //     )
  //   );

  searchNombreCompleto: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.nombresEmpleados
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

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
        this.detalleSolicitud.idSolicitud =
          this.solicitudDataInicial.idSolicitud;
      }

      // console.log("ID editar: ", this.id_edit);
      // Utiliza el id_edit obtenido
    });

    this.route.queryParams.subscribe((params: Solicitud) => {
      //this.solicitud = params;
      this.misParams = params;


      /*this.solicitud.infoGeneral.idTipoSolicitud = this.dataTipoSolicitud.id;
      this.solicitud.infoGeneral.tipoSolicitud =
        this.dataTipoSolicitud.tipoSolicitud;
      this.solicitud.request.idTipoSolicitud = this.dataTipoSolicitud.id;
      this.solicitud.request.tipoSolicitud =
        this.dataTipoSolicitud.tipoSolicitud;

      this.solicitud.infoGeneral.idTipoMotivo = this.dataTipoMotivo.id;
      this.solicitud.infoGeneral.tipoMotivo = this.dataTipoMotivo.tipoMotivo;
      this.solicitud.request.idTipoMotivo = this.dataTipoMotivo.id;

      this.solicitud.infoGeneral.idTipoAccion = this.dataTipoAccion.id;
      this.solicitud.infoGeneral.tipoAccion = this.dataTipoAccion.tipoAccion;
      this.solicitud.request.idTipoAccion = this.dataTipoAccion.id;
      this.solicitud.request.tipoAccion = this.dataTipoAccion.tipoAccion;*/
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
        // this.camundaRestService.getTask(environment.taskType_Registrar, params["id"]).subscribe({
        console.log(this.id_solicitud_by_params);
        this.solicitudes.getTareaIdParam(this.id_solicitud_by_params).subscribe({
          next: (result) => {
            this.lookForError(result); // if error, then control gets redirected to err page

            console.log(result.solicitudes[0].taskId);
            // if result is success - bingo, we got the task id
            this.uniqueTaskId = result.solicitudes[0].taskId; /* Es como la tarea que se crea en esa instancia */
            this.taskId = params["id"]; /* Esta es la instancia */
            this.getDetalleSolicitudById(this.id_solicitud_by_params);
            this.getSolicitudById(this.id_solicitud_by_params);
            this.date = result.solicitudes[0].startTime;
            this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
          },
          error: (error) => {
            console.error(error);
          }
        });
      } else {
        // unique id is from the route params
        this.uniqueTaskId = params["id"];
        this.taskId = params["id"];
        this.loadExistingVariables(
          this.uniqueTaskId ? this.uniqueTaskId : "",
          variableNames
        );
      }
      // console.log("Así es mi variablesNames: ", variableNames);
      // ready to do the processing now
    });
  }

  onInputChange(campo: string, val: any) {
    let valor = (val.target as HTMLInputElement).value;
    console.log(
      "INGRESA en onInputChange campo = " + campo + " valor = " + valor
    );
    this.searchSubject.next({ campo, valor });
    this.suggestions = this.dataEmpleadoEvolution
      .filter((empleado) => empleado[campo].startsWith(valor))
      .map((empleado) => empleado[campo]);
    console.log("this.suggestions = ", this.suggestions);
  }

  selectSuggestion(suggestion: string) {
    this.model.codigoPosicion = suggestion;
    this.suggestions = [];
  }

  mapearDetallesAprobadores(nivelAprobacionPosicionType: any[]) {
    this.starterService.getUser(localStorage.getItem("idUsuario")).subscribe({
      next: (res) => {
        this.detalleNivelAprobacion = nivelAprobacionPosicionType.map(({ nivelAprobacionType, aprobador }) => ({
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
          estadoAprobacion: nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("RRHH") ? "PorRevisarRRHH" : (nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("REMUNERA") ? "PorRevisarRemuneraciones" : "PendienteAsignacion"),
          estado: nivelAprobacionType.estado,
          correo: aprobador.correo === null ? "" : aprobador.correo,
          usuarioCreacion: res.evType[0].nombreCompleto,
          usuarioModificacion: res.evType[0].nombreCompleto,
          comentario: "",
          fechaCreacion: new Date().toISOString(),
          fechaModificacion: new Date().toISOString()
        }));
      }
    });

    console.log(this.detalleNivelAprobacion);
  }

  obtenerAprobacionesPorPosicion() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, 'A')
      .subscribe({
        next: (response) => {
          this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            "No existe aprobadores de solicitud para los datos ingresados",
            "error"
          );
        },
      });
  }

  obtenerAprobacionesPorPosicionAPS() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.codigoPosicion,
        this.model.nivelDir, 'APS'
      )
      .subscribe({
        next: (response) => {
          this.dataTipoRuta.length = 0;
          this.dataRuta.length = 0;
          this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType;
          this.dataAprobacionesPorPosicionAPS.forEach(item => {
            this.dataTipoRuta.push(item.nivelAprobacionType.tipoRuta);
            this.dataRuta.push(item.nivelAprobacionType.ruta);
          });
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            "No existe aprobadores de solicitud para los datos ingresados",
            "error"
          );
        },
      });
  }

  obtenerAprobacionesPorPosicionAPD() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.codigoPosicion,
        this.model.nivelDir, 'APD'
      )
      .subscribe({
        next: (response) => {
          this.dataAprobadoresDinamicos.length = 0;
          this.dataAprobacionesPorPosicionAPD = response.nivelAprobacionPosicionType;

          this.dataAprobacionesPorPosicionAPD.forEach(item => {
            this.dataAprobadoresDinamicos.push(item.aprobador.nivelDireccion);
          });
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            "No existe aprobadores de solicitud para los datos ingresados",
            "error"
          );
        }
      });
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
      responsableRRHH: ""
    };
  }

  onSelectItem(campo: string, event) {
    console.log(this.dataEmpleadoEvolution);
    console.log(campo);
    let valor = event.item;
    console.log(valor);

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
      console.log(this.model);

      this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

      console.log(!this.dataAprobacionesPorPosicion[this.keySelected]);
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

  getDataEmpleadosEvolution(tipo: string) {
    // return this.mantenimientoService.getDataEmpleadosEvolution().subscribe({
    let tipoValue: string = "";

    if (tipo === "codigoPosicion") {
      tipoValue = this.model.codigoPosicion;
    } else if (tipo === "subledger") {
      tipoValue = this.model.subledger;
    } else if (tipo === "nombreCompleto") {
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

        this.model = Object.assign(
          {},
          {
            ...this.dataEmpleadoEvolution[0],
            sueldo: this.dataEmpleadoEvolution[0].sueldo,
            sueldoMensual: this.dataEmpleadoEvolution[0].sueldoVariableMensual,
            sueldoTrimestral: this.dataEmpleadoEvolution[0].sueldoVariableTrimestral,
            sueldoSemestral: this.dataEmpleadoEvolution[0].sueldoVariableSemestral,
            sueldoAnual: this.dataEmpleadoEvolution[0].sueldoVariableAnual,
          }
        );

        this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

        if (tipo === "nombreCompleto") {
          this.nombresEmpleados = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
        }

        if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
          this.obtenerAprobacionesPorPosicion();
        }
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

    this.camundaRestService
      .getVariablesForTask(taskId, variableNames)
      .subscribe((result) => {
        this.lookForError(result);
        // console.log(
        //   "ESTAS SON LAS VARIABLES QUE ESTOY RECIBIENDO EN loadExistingVariables():",
        //   result
        // );
        this.generateModelFromVariables(result);
      }); // comentado por pruebas mmunoz
  }

  override generateModelFromVariables(variables: {
    [x: string]: { value: any };
  }) {
    Object.keys(variables).forEach((variableName) => {
      switch (variableName) {
        case "tipoAccion":
          this.tipo_accion_descripcion = this.dataTipoAccion?.filter(
            (data) => data.tipoAccion == variables[variableName].value
          )[0]?.tipoAccion;
          this.modelBase.tipo_cumplimiento = variables[variableName].value;
          break;

        case "tipoSolicitud":
          this.tipo_solicitud_descripcion =
            this.dataTipoSolicitud.tipoSolicitudType?.filter(
              (data) => data.tipoSolicitud == variables[variableName].value
            )[0]?.tipoSolicitud;
          this.modelBase.tipoSolicitud = variables[variableName].value;
          break;

        case "tipoMotivo":
          this.tipo_motivo_descripcion = this.dataTipoMotivo?.filter(
            (data) => data.tipoMotivo == variables[variableName].value
          )[0]?.tipoMotivo;
          this.modelBase.tipoMotivo = variables[variableName].value;

          break;
      }
    });
  }

  async ngOnInit() {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    try {
      await this.ObtenerServicioTipoSolicitud();
      await this.ObtenerServicioTipoMotivo();
      await this.ObtenerServicioTipoAccion();
      await this.getSolicitudes();
      //if (this.id_edit !== undefined) { //comentado mmunoz
      //await this.getDetalleSolicitudById(this.id_edit); //comentado mmunoz
      await this.getSolicitudById(this.id_edit);
      //} // comentado munoz
      // await this.getDataEmpleadosEvolution();
      await this.loadDataCamunda(); //comentado para prueba mmunoz
      //console.log("impreme arreglo de aprobadores: ");
      //await this.recorrerArreglo();

      // await this.getNivelesAprobacion();
      this.utilService.closeLoadingSpinner();

      // this.starterService.getUser("60063916");
    } catch (error) {
      // Manejar errores aquí de manera centralizada
      this.utilService.modalResponse(error.error, "error");
    }

  }

  pageSolicitudes() {
    this.router.navigate(["/tareas/consulta-tareas"]);
  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      // return this.mantenimientoService.getCatalogoRBPND().subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes; //verificar la estructura mmunoz

        this.detalleSolicitud.nivelDireccion =
          response.itemCatalogoTypes.filter(
            (data) => data.codigo == this.detalleSolicitud.nivelDireccion
          )[0]?.valor;

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

        //data de solicitudes

        /* this.model.codigo=this.solicitud.idSolicitud ;
         this.model.idEmpresa = this.solicitud.idEmpresa ;
         this.model.compania=this.solicitud.empresa ;
         this.model.unidadNegocio=this.solicitud.unidadNegocio;*/


        this.loadingComplete++;
        this.getDetalleSolicitudById(this.id_edit);

        // tveas, si incluye el id, debo mostrarlos (true)
        /*this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(
          this.solicitud.idTipoMotivo
        );

        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(
          this.solicitud.idTipoMotivo
        );*/ // comentado mmunoz

        //console.log("DATA SOLICITUD BY ID: ", this.solicitud);
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

          this.RegistrarsolicitudCompletada = true;

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
          this.model.sueldoAnual = this.detalleSolicitud.sueldoVariableAnual
          this.model.correo = this.detalleSolicitud.correo;
          this.model.fechaIngreso = this.detalleSolicitud.fechaIngreso;


        }
        /* this.detalleSolicitud.estado = response.estado;
         this.detalleSolicitud.estado = response.estadoSolicitud;
         this.detalleSolicitud.idSolicitud = response.idSolicitud;
         this.detalleSolicitud.unidadNegocio = response.unidadNegocio;*/ //comentado mmunoz
        //console.log("DATA DETALLE SOLICITUD BY ID: ", this.detalleSolicitud);
        this.loadingComplete++;

        // tveas, si incluye el id, debo mostrarlos (true)
        this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(
          this.solicitud.idTipoMotivo
        );

        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(
          this.solicitud.idTipoMotivo
        );

        this.keySelected =
          this.solicitud.idTipoSolicitud +
          "_" +
          this.solicitud.idTipoMotivo +
          "_" +
          this.model.nivelDir;
        if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
          this.getNivelesAprobacion();
          if (this.model.codigoPosicion.trim().length > 0) {
            this.obtenerAprobacionesPorPosicionAPS();
            this.obtenerAprobacionesPorPosicionAPD();
          }


          // const jsonArrayString = JSON.stringify(this.dataAprobadoresDinamicos);
          // console.log("conversion aprobadores dinamicos", jsonArrayString);
          //console.log("Ruta", this.dataRuta);
          let variables = this.generateVariablesFromFormFields();
        }

        this.consultarNextTask(id);

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
    this.solicitudes.getSolicitudes().subscribe((data) => { });
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

    this.solicitudes
      .guardarSolicitud(requestSolicitud)
      .subscribe((response) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
      });
  }

  // Handle any errors that may be present.
  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      console.log("routing to app error page ", result.error.message);
      this.errorMessage = result.error.message;
      this.utilService.modalResponse(this.errorMessage, "error");
    }
  }


  onSubmit() {
    Swal.fire({
      text: "¿Desea guardar los cambios?",
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


  save() {
    this.utilService.openLoadingSpinner(
      "Guardando información, espere por favor..."
    ); // comentado mmunoz

    this.submitted = true;
    let idInstancia = this.solicitudDataInicial.idInstancia;

    let extra = {
      idEmpresa: this.model.compania,
      empresa: this.model.compania,
      estadoSolicitud: "Pendiente",
      unidadNegocio: this.model.unidadNegocio,
      idUnidadNegocio: this.model.unidadNegocio,
    };

    this.solicitud.empresa = this.model.idEmpresa;
    this.solicitud.idEmpresa = this.model.idEmpresa;

    this.solicitud.unidadNegocio = this.model.unidadNegocio;
    this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
    this.solicitud.estadoSolicitud = "2";


    this.solicitudes
      .actualizarSolicitud(this.solicitud)
      .subscribe((responseSolicitud) => {

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

        this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo === "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;


        this.solicitudes
          .actualizarDetalleSolicitud(this.detalleSolicitud)
          .subscribe((responseDetalle) => {

            this.utilService.closeLoadingSpinner(); //comentado mmunoz
            this.utilService.modalResponse(
              "Datos ingresados correctamente",
              "success"
            );

            setTimeout(() => {
              this.router.navigate([
                "/solicitudes/registrar-solicitud/" + this.solicitud.idInstancia + "/" + this.solicitud.idSolicitud,
              ]).then(() => {
                // Recarga la página actual
                window.location.reload();
              });
            }, 1800);


            /* setTimeout(() => {
              this.router.navigate([
               "/solicitudes/registrar-solicitud/" + this.solicitud.idInstancia +"/" +this.solicitud.idSolicitud,
               ]);
             }, 1800);*/


          });
      }); //aqui debe crear los aprobadores
    this.submitted = true;
  }

  crearRegistradorSolicitud() {
    this.starterService.getUser(localStorage.getItem("idUsuario")!).subscribe({
      next: (res) => {
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
        this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
        this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();
      }
    });
  }

  onCompletar() { //completar tarea mmunoz
    if (this.uniqueTaskId === null) {
      //handle this as an error
      this.errorMessage =
        "Unique Task id is empty. Cannot initiate task complete.";
      return;
    }
    this.utilService.openLoadingSpinner(
      "Completando Tarea, espere por favor..."
    );

    let variables = this.generateVariablesFromFormFields();
    // return;

    // this.crearRegistradorSolicitud();

    this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
      next: (res) => {
        this.camundaRestService
          .postCompleteTask(this.uniqueTaskId, variables)
          .subscribe({
            next: (res) => {
              //actualizo la solicitud a enviada
              this.solicitud.empresa = this.model.compania;
              this.solicitud.idEmpresa = this.model.compania;

              this.solicitud.unidadNegocio = this.model.unidadNegocio;
              this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

              if (this.selectedOption == "No") {
                this.solicitud.estadoSolicitud = "4";
              } else {
                this.solicitud.estadoSolicitud = "AN";
              }

              this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
                next: (responseSolicitud) => {
                  setTimeout(() => {
                    this.consultarNextTaskAprobador(this.solicitud.idSolicitud);

                    this.solicitudes.sendEmail(this.emailVariables).subscribe({
                      next: () => {
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });

                    this.utilService.closeLoadingSpinner();
                    //fin actualizo la solicitud a enviada
                    this.utilService.modalResponse(
                      `Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`,
                      "success"
                    );
                    setTimeout(() => {
                      this.router.navigate([
                        "/tareas/consulta-tareas",
                      ]);
                    }, 1800);
                  }, 3000);
                },
                error: (error) => {
                  console.error(error);
                }
              });
            },
            error: (error: HttpErrorResponse) => {
              this.utilService.modalResponse(
                error.error,
                "error"
              );
            },
          });
      },
      error: (err) => {
        console.error(err);
      }
    });

    // this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
    //   next: () => {

    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });

    this.submitted = true;
  }

  recorrerArreglo() {

    this.keySelected =
      this.solicitud.idTipoSolicitud +
      "_" +
      this.solicitud.idTipoMotivo +
      "_" +
      this.model.nivelDir;

    for (const key in this.dataAprobacionesPorPosicion) {
      if (this.dataAprobacionesPorPosicion.hasOwnProperty(key)) {
        const aprobacionesArray = this.dataAprobacionesPorPosicion[key];
        for (const aprobacion of aprobacionesArray) {
          // Aquí puedes acceder a las propiedades de cada objeto
        }
      }
    }

  }

  completeAndCheckTask(taskId: string, variables: any) {
    this.camundaRestService
      .postCompleteTask(taskId, variables)
      .subscribe((res) => {
        // Aquí puedes manejar la respuesta del segundo servicio

        // Verifica si el nombre sigue siendo "Notificar revisión solicitud"
        if (res.name === "Notificar revisión solicitud") {
          // Llama nuevamente a la función para completar la siguiente tarea
          this.completeAndCheckTask(taskId, variables);
        } else {
          // El nombre ya no es "Notificar revisión solicitud", haz algo diferente
          console.log("Nombre diferente:", res.name);
        }
      });
  }

  //this.detalleSolicitud.idSolicitud
  consultarNextTaskAprobador(IdSolicitud: string) {
    this.consultaTareasService.getTareaIdParam(IdSolicitud)
      .subscribe((tarea) => {
        this.uniqueTaskId = tarea.solicitudes[0].taskId;
        this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
        this.nameTask = tarea.solicitudes[0].name;
        this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;

        if (this.taskType_Activity !== environment.taskType_Registrar) {
          this.RegistrarsolicitudCompletada = false;
        }

        let aprobadoractual = "";

        this.camundaRestService.getVariablesForTaskLevelAprove(this.uniqueTaskId).subscribe({
          next: (aprobador) => {
            aprobadoractual = aprobador.nivelAprobacion?.value;

            if (aprobadoractual !== undefined) {
              this.dataAprobacionesPorPosicionAPS.forEach((elemento) => {
                const aprobacion = elemento;

                if (aprobacion.aprobador.nivelDireccion.trim() == aprobadoractual) {
                  this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
                  this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = aprobacion.nivelAprobacionType.idNivelAprobacion;
                  this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = aprobacion.nivelAprobacionType.idTipoSolicitud.toString();
                  this.solicitudes.modelDetalleAprobaciones.id_Accion = aprobacion.nivelAprobacionType.idAccion;
                  this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = aprobacion.nivelAprobacionType.idTipoMotivo;
                  this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = aprobacion.nivelAprobacionType.idTipoRuta;
                  this.solicitudes.modelDetalleAprobaciones.id_Ruta = aprobacion.nivelAprobacionType.idRuta;
                  this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = aprobacion.nivelAprobacionType.tipoSolicitud;
                  this.solicitudes.modelDetalleAprobaciones.motivo = aprobacion.nivelAprobacionType.tipoMotivo;
                  this.solicitudes.modelDetalleAprobaciones.tipoRuta = aprobacion.nivelAprobacionType.tipoRuta;
                  this.solicitudes.modelDetalleAprobaciones.ruta = aprobacion.nivelAprobacionType.ruta;
                  this.solicitudes.modelDetalleAprobaciones.accion = aprobacion.nivelAprobacionType.accion;
                  this.solicitudes.modelDetalleAprobaciones.nivelDirecion = aprobacion.nivelAprobacionType.nivelDireccion;
                  this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = aprobacion.nivelAprobacionType.nivelAprobacionRuta;
                  this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = aprobacion.aprobador.usuario;
                  this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = aprobacion.aprobador.codigoPosicion;
                  this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = aprobacion.aprobador.descripcionPosicion;
                  this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = aprobacion.aprobador.subledger;
                  this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = aprobacion.aprobador.nivelDireccion;
                  this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = aprobacion.aprobador.codigoPosicionReportaA;
                  this.solicitudes.modelDetalleAprobaciones.estado = "A";
                  this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisar";
                  this.solicitudes.modelDetalleAprobaciones.correo = aprobacion.aprobador.correo;
                  this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = aprobacion.aprobador.usuario;
                  this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = aprobacion.aprobador.usuario;
                  this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
                  this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();
                }
              });

              this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
                next: () => {
                },
                error: (err) => {
                  console.error(err);
                }
              });
            }
          }
        });
      });
  }

  consultarNextTask(IdSolicitud: string) {
    this.consultaTareasService.getTareaIdParam(IdSolicitud)
      .subscribe((tarea) => {

        this.uniqueTaskId = tarea.solicitudes[0].taskId;
        this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
        this.nameTask = tarea.solicitudes[0].name;
        this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;
        this.rootProces = tarea.solicitudes[0].rootProcInstId;

        if (this.nameTask !== "Registrar solicitud") {
          this.RegistrarsolicitudCompletada = false;
        }
      });
  }

  override generateVariablesFromFormFields() {
    let variables: any = {};

    this.crearRegistradorSolicitud();

    if (this.taskType_Activity == environment.taskType_Registrar) {
      this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
        if (index === 0) {
          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${elemento.aprobador.subledger}`);

          variables.correo_notificador_creador = {
            value: this.solicitudes.modelDetalleAprobaciones.correo
          };
          variables.alias = {
            value: this.solicitudes.modelDetalleAprobaciones.correo
          };
          variables.correo_aprobador = {
            value: elemento.aprobador.correo
          };
          variables.asunto_revision_solicitud = {
            value: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`
          };
          variables.cuerpo_notificacion = {
            value: modifiedHtmlString
          };
          variables.password = {
            value: "p4$$w0rd"
          };

          this.emailVariables = {
            de: this.solicitudes.modelDetalleAprobaciones.correo,
            para: elemento.aprobador.correo,
            alias: this.solicitudes.modelDetalleAprobaciones.correo,
            asunto: variables.asunto_revision_solicitud.value,
            cuerpo: modifiedHtmlString,
            password: variables.password.value
          };
        }

        if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_MEDIA) {
          variables.correoNotificacionGerenciaMedia = {
            value: elemento.aprobador.correo
          };
          variables.usuarioNotificacionGerenciaMedia = {
            value: elemento.aprobador.usuario
          };
          variables.nivelDireccionNotificacionGerenciaMedia = {
            value: elemento.aprobador.nivelDireccion
          };
          variables.descripcionPosicionNotificacionGerenciaMedia = {
            value: elemento.aprobador.descripcionPosicion
          };
          variables.subledgerNotificacionGerenciaMedia = {
            value: elemento.aprobador.subledger
          };
        } else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_GERENCIA_UNIDAD) {
          variables.correoNotificacionGerenciaUnidadCorporativa = {
            value: elemento.aprobador.correo
          };
          variables.usuarioNotificacionGerenciaUnidadCorporativa = {
            value: elemento.aprobador.usuario
          };
          variables.nivelDireccionNotificacionGerenciaUnidadCorporativa = {
            value: elemento.aprobador.nivelDireccion
          };
          variables.descripcionPosicionNotificacionGerenciaUnidadCorporativa = {
            value: elemento.aprobador.descripcionPosicion
          };
          variables.subledgerNotificacionGerenciaUnidadCorporativa = {
            value: elemento.aprobador.subledger
          };
        } else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_JEFATURA) {
          variables.correoNotificacionJefatura = {
            value: elemento.aprobador.correo
          };
          variables.usuarioNotificacionJefatura = {
            value: elemento.aprobador.usuario
          };
          variables.nivelDireccionNotificacionJefatura = {
            value: elemento.aprobador.nivelDireccion
          };
          variables.descripcionPosicionNotificacionJefatura = {
            value: elemento.aprobador.descripcionPosicion
          };
          variables.subledgerNotificacionJefatura = {
            value: elemento.aprobador.subledger
          };
        } else if (elemento.aprobador.nivelDireccion.toUpperCase().includes(this.NIVEL_APROBACION_VICEPRESIDENCIA)) {
          variables.correoNotificacionVicepresidencia = {
            value: elemento.aprobador.correo
          };
          variables.usuarioNotificacionVicepresidencia = {
            value: elemento.aprobador.usuario
          };
          variables.nivelDireccionNotificacionVicepresidencia = {
            value: elemento.aprobador.nivelDireccion
          };
          variables.descripcionPosicionNotificacionVicepresidencia = {
            value: elemento.aprobador.descripcionPosicion
          };
          variables.subledgerNotificacionVicepresidencia = {
            value: elemento.aprobador.subledger
          };
        } else if (elemento.aprobador.nivelDireccion === this.NIVEL_APROBACION_RRHH) {
          variables.correoNotificacionGerenteRRHH = {
            value: elemento.aprobador.correo
          };
          variables.usuarioNotificacionGerenteRRHH = {
            value: elemento.aprobador.usuario
          };
          variables.nivelDireccionNotificacionGerenteRRHH = {
            value: elemento.aprobador.nivelDireccion
          };
          variables.descripcionPosicionNotificacionGerenteRRHH = {
            value: elemento.aprobador.descripcionPosicion
          };
          variables.subledgerNotificacionGerenteRRHH = {
            value: elemento.aprobador.subledger
          };
        }
      });

      variables.codigoPosicion = { value: this.model.codigoPosicion };
      variables.misionCargo = { value: this.model.misionCargo };
      variables.justificacionCargo = { value: this.model.justificacionCargo };
      variables.empresa = { value: this.model.compania };
      variables.unidadNegocio = { value: this.model.unidadNegocio };
      variables.descripcionPosicion = { value: this.model.descrPosicion };
      variables.areaDepartamento = { value: this.model.departamento };
      variables.localidadZona = { value: this.model.localidad };
      variables.centroCosto = { value: this.model.nomCCosto };
      variables.reportaa = { value: this.model.reportaA };
      variables.nivelReportea = { value: this.model.nivelRepa };
      variables.supervisa = { value: this.model.supervisaA };
      variables.tipoContrato = { value: this.model.tipoContrato };
      variables.sueldo = { value: this.model.sueldo }; //sueldoVariableMensual
      variables.sueldoMensual = { value: this.model.sueldoMensual };
      variables.sueldoTrimestral = { value: this.model.sueldoTrimestral };
      variables.sueldoSemestral = { value: this.model.sueldoSemestral };
      variables.sueldoAnual = { value: this.model.sueldoAnual };
      variables.anularSolicitud = { value: this.selectedOption };
      variables.comentariosAnulacion = { value: this.model.comentariosAnulacion };
      variables.nivelDireccion = { value: this.model.nivelDir };
      variables.usuarioNotificacionCreador = {
        value: this.solicitudes.modelDetalleAprobaciones.usuarioAprobador
      };
      variables.nivelDireccionNotificacionCreador = {
        value: this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador
      };
      variables.descripcionPosicionCreador = {
        value: this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador
      };
      variables.subledgerNotificacionCreador = {
        value: this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador
      };
      variables.Id_Solicitud = {
        value: this.solicitud.idSolicitud
      };
      variables.tipoSolicitud = {
        value: this.solicitud.tipoSolicitud
      };
      variables.urlTarea = {
        value: `${portalWorkFlow}solicitudes/revisar-solicitud/${this.idDeInstancia}/${this.id_solicitud_by_params}`
      };
      variables.tipoRuta = {
        //value: ["Unidades","Unidades", "Aprobadores Fijos", "Aprobadores Fijos"],
        value: this.dataTipoRuta,
        type: "String",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }

      };
      variables.ruta = {
        // value : ["2doNivelAprobacion", "3erNivelAprobacion", "Remuneraciones"],
        value: this.dataRuta,
        type: "String",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }
      };
      variables.resultadoRutaAprobacion = { //value : "[\"Gerencia Media\", \"Gerencia de Unidad o Corporativa\"]",
        value: JSON.stringify(this.dataAprobadoresDinamicos),
        type: "Object",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }
      };
    }


    /*if(this.taskType_Activity==environment.taskType_CompletarRequisicion){

      variables.atencionCompletarRequisicion = { value : "aprobar" };


   }*/



    return { variables };
  }

  save2() {
    this.solicitudes
      .guardarDetalleSolicitud(this.solicitudes.modelDetalleSolicitud)
      .subscribe((res) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
        setTimeout(() => {
          this.router.navigate(["/solicitudes/completar-solicitudes"]);
        }, 1600);
      });
  }

  // onCancel() {
  //   console.log("User action cancel");
  //   // mmunoz
  //   // this.router.navigate(["tasklist/Registrar"], { queryParams: {} });
  //   this.router.navigate(["tareas/consulta-tareas"]);
  // }



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
    if (this.detalleSolicitud.codigoPosicion !== "" &&
      this.detalleSolicitud.codigoPosicion !== undefined &&
      this.detalleSolicitud.codigoPosicion != null) {


      this.solicitudes
        .obtenerAprobacionesPorPosicion(
          this.solicitud.idTipoSolicitud,
          this.solicitud.idTipoMotivo,
          this.detalleSolicitud.codigoPosicion,
          this.detalleSolicitud.nivelDireccion, 'A'
        )
        .subscribe({
          next: (response) => {
            this.mapearDetallesAprobadores(response.nivelAprobacionPosicionType);

            this.dataAprobacionesPorPosicion[this.keySelected] =
              response.nivelAprobacionPosicionType;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(
              "No existen niveles de aprobación para este empleado",
              "error"
            );
          },
        });

    }

  }


  getDataNivelesAprobacionPorCodigoPosicion() {

    if (this.detalleSolicitud.codigoPosicion !== "" &&
      this.detalleSolicitud.codigoPosicion !== undefined &&
      this.detalleSolicitud.codigoPosicion != null) {

      this.solicitudes
        .getDataNivelesAprobacionPorCodigoPosicion(
          this.detalleSolicitud.codigoPosicion
        )
        .subscribe({
          next: (response) => {
            this.dataNivelesAprobacionPorCodigoPosicion[
              this.model.codigoPosicion
            ] = response.evType;

            for (let key1 of Object.keys(this.dataAprobacionesPorPosicion)) {
              let eachDataNivelesDeAprobacion =
                this.dataAprobacionesPorPosicion[key1];

              for (let eachData of eachDataNivelesDeAprobacion) {
                for (let key2 of Object.keys(
                  this.dataNivelesAprobacionPorCodigoPosicion
                )) {
                  let eachDataNivelPorCodigoPosicion =
                    this.dataNivelesAprobacionPorCodigoPosicion[key2];

                  for (let eachDataNivelPorCodigo of eachDataNivelPorCodigoPosicion) {
                    if (
                      eachData.nivelDireccion ==
                      eachDataNivelPorCodigo.nivelDireccion
                    ) {
                      eachData["usuario"] = eachDataNivelPorCodigo.usuario;
                      eachData["descripcionPosicion"] =
                        eachDataNivelPorCodigo.descripcionPosicion;
                      break;
                    }
                  }

                }
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(
              "No existen niveles de aprobación para este empleado",
              "error"
            );
          },
        });

    }
  }

  saveDetalleAprobaciones() {
    this.solicitudes
      .guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones)
      .subscribe((res) => {
        /*this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
         setTimeout(() => {
          this.router.navigate(["/solicitudes/completar-solicitudes"]);
        }, 1600);*/
      });
  }

  /*getNivelesAprobacion() {
    this.solicitudes
      .getNivelesAprobacion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.nivelDir
      )
      // .getNivelesAprobacion(1, 1, "TA")
      .subscribe({
        next: (response) => {
          this.dataNivelesAprobacion = response.nivelAprobacionType.sort(
            this.compareNivelesAprobacion
          );
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
  }*/
}
