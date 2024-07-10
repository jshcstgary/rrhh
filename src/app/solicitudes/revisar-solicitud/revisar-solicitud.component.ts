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
  map,
  switchMap,
} from "rxjs/operators";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { toDate } from "date-fns/esm";
import { DatosAprobadores } from "src/app/eschemas/DatosAprobadores";

@Component({
  selector: 'revisarSolicitud',
  templateUrl: './revisar-solicitud.component.html',
  styleUrls: ['./revisar-solicitud.component.scss'],
  providers: [CamundaRestService, HttpClientModule],
  exportAs: "revisarSolicitud",
})
export class RevisarSolicitudComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  textareaContent: string = '';
  apruebaRemuneraciones: string = "NO";
  aprobadorFijo: string = "NO";
  //variableNivel: string=this.datosAprobadores.nivelDireccion;
  disabledComplete: boolean = true;
  isRequired: boolean = false;
  isFechaMaximaVisible: boolean = false;
  campoObligatorio: string = '';
  observaciontexto: string = 'Observación';
  selectedDate: Date = new Date();
  datosAprobadores: DatosAprobadores = new DatosAprobadores();
  //buttonValue: string = '';

  buttonValue: string | null = 'aprobar';

  emailVariables = {
    de: "",
    para: "",
    alias: "",
    asunto: "",
    cuerpo: "",
    password: ""
  };

  private aprobadorSiguiente: any = {};
  private aprobadorActual: any = {};

  process(action: string) {
    this.buttonValue = action;

    console.log(`Acción seleccionada: ${action}`);
    // Aquí puedes añadir la lógica para manejar cada acción

    switch (action) {
      case 'devolver':
        this.isRequired = true;
        this.campoObligatorio = 'Campo Obligatorio...';
        this.observaciontexto = 'Observación*';
        this.isFechaMaximaVisible = false;
        this.textareaContent = '';
        break;

      case 'rechazar':
        this.isRequired = true;
        this.campoObligatorio = 'Campo Obligatorio...';
        this.isFechaMaximaVisible = false;
        this.textareaContent = '';
        this.observaciontexto = 'Observación*';
        break;

      case 'aprobar':
        this.campoObligatorio = 'Ingrese Comentario de aprobación...';
        this.isFechaMaximaVisible = false;
        this.textareaContent = '';
        this.observaciontexto = 'Observación';
        break;

      case 'esperar':
        this.campoObligatorio = 'Ingrese Comentario en espera...';
        this.isFechaMaximaVisible = true;
        this.textareaContent = '';
        this.observaciontexto = 'Observación';
        break;

      default:
    }

  }

  isSelected(action: string): boolean {
    return this.buttonValue === action;
  }

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
  public detalleAprobacionesPorPosicion: any[] = [];

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

  public dataNivelDireccion: any[] = [];
  public suggestions: string[] = [];

  public idDeInstancia: any;

  public loadingComplete = 0;

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService
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

  searchCodigoPosicion: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.codigosPosicion
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

  searchSubledger: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.subledgers
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );

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

        this.consultaTareasService.getTareaIdParam(this.id_solicitud_by_params)
          .subscribe((tarea) => {

            this.uniqueTaskId = tarea.solicitudes[0].taskId;
            this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
            this.nameTask = tarea.solicitudes[0].name;
            this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;
            this.taskId = params["id"];

            this.getSolicitudById(this.id_solicitud_by_params);
            this.date = tarea.solicitudes[0].fechaCreacion;
            this.loadExistingVariables(
              this.uniqueTaskId ? this.uniqueTaskId : "",
              variableNames
            );

            if (this.nameTask !== "Registrar solicitud") {
              this.RegistrarsolicitudCompletada = false;
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

  obtenerAprobacionesPorPosicion() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.codigoPosicion,
        this.model.nivelDir, 'A'
      )
      .subscribe({
        next: (response) => {
          this.dataAprobacionesPorPosicion[this.keySelected] =
            response.nivelAprobacionPosicionType;

          //console.log("Aprobaciones Miguel = ", response.nivelAprobacionPosicionType);
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            "No existe aprobadores de solicitud para los datos ingresados",
            "error"
          );
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
      this.keySelected =
        this.solicitud.idTipoSolicitud +
        "_" +
        this.solicitud.idTipoMotivo +
        "_" +
        this.model.codigoPosicion +
        "_" +
        this.model.nivelDir;
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

        this.nombresEmpleados = [
          ...new Set(
            this.dataEmpleadoEvolution.map(
              (empleado) => empleado.nombreCompleto
            )
          ),
        ];

        this.subledgers = [
          ...new Set(
            this.dataEmpleadoEvolution.map((empleado) => empleado.subledger)
          ),
        ];

        this.codigosPosicion = [
          ...new Set(
            this.dataEmpleadoEvolution.map(
              (empleado) => empleado.codigoPosicion
            )
          ),
        ];
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
      await this.loadDataCamunda();

      this.utilService.closeLoadingSpinner();
    } catch (error) {
      this.utilService.modalResponse(error.error, "error");
    }

  }

  pageSolicitudes() {
    this.router.navigate(["/tareas/consulta-tareas"]);
  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes;

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

        this.loadingComplete += 2;
        this.getDetalleSolicitudById(id);
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
          this.model.sueldoAnual = this.detalleSolicitud.sueldoVariableAnual
          this.model.correo = this.detalleSolicitud.correo;
          this.model.fechaIngreso = this.detalleSolicitud.fechaIngreso;
        }

        this.loadingComplete++;

        this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

        this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;

        if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
          this.getNivelesAprobacion();

          this.consultarNextTask(id);

          if (this.uniqueTaskId) {
            this.ObtenerNivelAprobadorTask();
          }

        }
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

        this.detalleSolicitud.justificacion = this.model.justificacionCargo;
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

        this.detalleSolicitud.misionCargo = this.model.misionCargo;
        this.detalleSolicitud.justificacion = this.model.justificacionCargo;

        this.detalleSolicitud.sueldo = this.model.sueldo;
        this.detalleSolicitud.sueldoVariableMensual =
          this.model.sueldoMensual;
        this.detalleSolicitud.sueldoVariableTrimestral =
          this.model.sueldoTrimestral;
        this.detalleSolicitud.sueldoVariableSemestral =
          this.model.sueldoSemestral;
        this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
        this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
        this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

        this.detalleSolicitud.correo = this.model.correo;

        this.detalleSolicitud.supervisaA = this.model.supervisaA;

        this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo == "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;

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
                "/tareas/consulta-tareas",
              ]);
            }, 1800);


          });
      }); //aqui debe crear los aprobadores
    this.submitted = true;
  }

  async onCompletar() { //completar tarea mmunoz
    const { isConfirmed } = await Swal.fire({
      text: `¿Desea ${this.buttonValue === "esperar" ? `guardar la solicitud ${this.solicitud.idSolicitud} en estado de espera` : `${this.buttonValue} la solicitud ${this.solicitud.idSolicitud}`}?`,
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

    if (this.uniqueTaskId === null) {
      this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

      return;
    }

    this.utilService.openLoadingSpinner(
      "Completando Tarea, espere por favor..."
    );

    let variables = this.generateVariablesFromFormFields();

    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe({
        next: (res) => {
          //actualizo la solicitud a enviada
          this.solicitud.empresa = this.model.compania;
          this.solicitud.idEmpresa = this.model.compania;

          this.solicitud.unidadNegocio = this.model.unidadNegocio;
          this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

          switch (this.buttonValue) {
            case 'devolver':
              this.solicitud.estadoSolicitud = "DV";  //Devolver
              break;

            case 'rechazar':
              this.solicitud.estadoSolicitud = "5"; //Cancelado
              break;

            case 'aprobar':
              this.solicitud.estadoSolicitud = "4";//Enviado
              break;

            case 'esperar':
              this.solicitud.estadoSolicitud = "2";//En espera

              break;

            default:
          }

          this.solicitudes
            .actualizarSolicitud(this.solicitud)
            .subscribe({
              next: () => {
                setTimeout(() => {
                  this.consultarNextTaskAprobador(this.solicitud.idSolicitud);
                }, 3000);
              },
              error: (error) => {
                console.error(error);
              }
            });


          this.utilService.closeLoadingSpinner();
          //fin actualizo la solicitud a enviada
          this.utilService.modalResponse(
            `Solicitud guardada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`,
            "success"
          );
          setTimeout(() => {
            this.router.navigate([
              "/tareas/consulta-tareas",
            ]);
          }, 1800);
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            error.error,
            "error"
          );
        },


      });

    this.submitted = true;
  }

  consultarNextTaskAprobador(IdSolicitud: string) {
   if(this.solicitud.estadoSolicitud !== "5"){
    this.consultaTareasService.getTareaIdParam(IdSolicitud).subscribe((tarea) => {
      // debugger;
      this.uniqueTaskId = tarea.solicitudes[0].taskId;
      this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
      this.nameTask = tarea.solicitudes[0].name;
      this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;

      if (this.taskType_Activity !== environment.taskType_Registrar) {
        this.RegistrarsolicitudCompletada = false;
      }

      let aprobadoractual = "";
      let aprobadoractualModel = "";
      let subledgerCreador = "";
      let correoCreador = "";
      let usuarioCreador = "";
      let aprobadorRRHH = "";
      let aprobadorRemuneracion = "";

      this.camundaRestService.getVariablesForTaskLevelAprove(this.uniqueTaskId).subscribe({
        next: (aprobador) => {
          aprobadoractual = aprobador.nivelAprobacion?.value;
          correoCreador = aprobador.correo_notificador_creador?.value;
          subledgerCreador = aprobador.subledgerNotificacionCreador?.value;
          usuarioCreador = aprobador.usuarioNotificacionCreador?.value;

        if(this.solicitud.estadoSolicitud==="4"){
          // debugger;
          if (aprobadoractual === undefined || aprobadoractual === null) {
            aprobadoractual = this.aprobadorSiguiente.aprobador.nivelDireccion;
            aprobadoractualModel = this.aprobadorActual.aprobador.nivelDireccion;
          }

          this.dataAprobacionesPorPosicion[this.keySelected].forEach((elemento) => {
           if(aprobadoractual !== "") {
            if (elemento.aprobador.nivelDireccion.trim() == aprobadoractual) {
              const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

              const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${elemento.aprobador.subledger}`);

              this.emailVariables = {
                de: "solicitud.workflow@rbp.com",
                para: elemento.aprobador.correo,
                // alias: "solicitud.workflow@rbp.com",
                alias: "Notificación 1",
                asunto: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
                cuerpo: modifiedHtmlString,
                password: "p4$$w0rd"
              };

              this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
              this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = elemento.nivelAprobacionType.idNivelAprobacion;
              this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = elemento.nivelAprobacionType.idTipoSolicitud.toString();
              this.solicitudes.modelDetalleAprobaciones.id_Accion = elemento.nivelAprobacionType.idAccion;
              this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = elemento.nivelAprobacionType.idTipoMotivo;
              this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = elemento.nivelAprobacionType.idTipoRuta;
              this.solicitudes.modelDetalleAprobaciones.id_Ruta = elemento.nivelAprobacionType.idRuta;
              this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = elemento.nivelAprobacionType.tipoSolicitud;
              this.solicitudes.modelDetalleAprobaciones.motivo = elemento.nivelAprobacionType.tipoMotivo;
              this.solicitudes.modelDetalleAprobaciones.tipoRuta = elemento.nivelAprobacionType.tipoRuta;
              this.solicitudes.modelDetalleAprobaciones.ruta = elemento.nivelAprobacionType.ruta;
              this.solicitudes.modelDetalleAprobaciones.accion = elemento.nivelAprobacionType.accion;
              this.solicitudes.modelDetalleAprobaciones.nivelDirecion = elemento.nivelAprobacionType.nivelDireccion;
              this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = elemento.nivelAprobacionType.nivelAprobacionRuta;
              this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = elemento.aprobador.usuario;
              this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = elemento.aprobador.codigoPosicion;
              this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = elemento.aprobador.descripcionPosicion;
              this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = elemento.aprobador.subledger;
              this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = elemento.aprobador.nivelDireccion;
              this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = elemento.aprobador.codigoPosicionReportaA;
              this.solicitudes.modelDetalleAprobaciones.estado = "A";
              if (aprobadoractual.toUpperCase().includes("RRHH")) {
                this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisarRRHH";
              }else{
                  if (aprobadoractual.toUpperCase().includes("REMUNERA")) {
                    this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisarRemuneraciones";
                  }else{
                    this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisar";
                  }
                }
              this.solicitudes.modelDetalleAprobaciones.correo = elemento.aprobador.correo;
              this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = elemento.aprobador.usuario;
              this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = elemento.aprobador.usuario;
              this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
              this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();

            }
           }
          });
         if(this.aprobadorFijo === "NO"){
          this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
            next: () => {

              this.solicitudes.sendEmail(this.emailVariables).subscribe({
                next: () => {
                },
                error: (error) => {
                  console.error(error);
                }
              });
            },
            error: (err) => {
              console.error(err);
            }
          });
        }else{
          if(this.apruebaRemuneraciones === "SI"){
            if (aprobadoractualModel.toUpperCase().includes("REMUNERA")) {
            const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>Se le informa que se encuentra aprobada la Solicitud {ID_SOLICITUD}<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>";

              const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", usuarioCreador).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${subledgerCreador}`);

              this.emailVariables = {
                de: "solicitud.workflow@rbp.com",
                para: correoCreador,
                // alias: "solicitud.workflow@rbp.com",
                alias: "Notificación 1",
                asunto: "Notificación Iniciador",
                cuerpo: modifiedHtmlString,
                password: "p4$$w0rd"
              };
            }
          }else{
            const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>Se le informa que se encuentra aprobada la Solicitud {ID_SOLICITUD}<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>";

              const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", usuarioCreador).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${subledgerCreador}`);

              this.emailVariables = {
                de: "solicitud.workflow@rbp.com",
                para: correoCreador,
                // alias: "solicitud.workflow@rbp.com",
                alias: "Notificación 1",
                asunto: "Notificación Iniciador",
                cuerpo: modifiedHtmlString,
                password: "p4$$w0rd"
              };
          }
          this.solicitudes.sendEmail(this.emailVariables).subscribe({
                next: () => {
                },
                error: (error) => {
                  console.error(error);
                }
              });
         }
        }if(this.solicitud.estadoSolicitud === "DV"){
            const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>Se le informa que ha sido devuelta la Solicitud {ID_SOLICITUD}<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>";

            const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", usuarioCreador).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${subledgerCreador}`);

            this.emailVariables = {
                de: "solicitud.workflow@rbp.com",
                para: correoCreador,
                // alias: "solicitud.workflow@rbp.com",
                alias: "Notificación 1",
                asunto: `Notificación por devolución de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
                cuerpo: modifiedHtmlString,
                password: "p4$$w0rd"
              };
            this.solicitudes.sendEmail(this.emailVariables).subscribe({
                next: () => {
                },
                error: (error) => {
                  console.error(error);
                }
              });
          }
       }
      });
    });
   }
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
          console.log(aprobacion);
          // Aquí puedes acceder a las propiedades de cada objeto
          console.log(aprobacion.nivelAprobacionType.idNivelAprobacion);
          console.log(aprobacion.aprobador.usuario);
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
        }
      });
  }

  //this.detalleSolicitud.idSolicitud
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
    //console.log(this.aprobadorSiguiente.aprobador);

    let variables: any = {};

    //variables.codigo = { value: this.model.codigo };
    //variables.idEmpresa = { value: this.model.idEmpresa };

      if (this.taskType_Activity == environment.taskType_Revisar) { //APROBADORES DINAMICOS

        variables.atencionRevision = { value: this.buttonValue };
        variables.comentariosAtencion = { value: this.datosAprobadores.nivelDireccion + ': ' + this.textareaContent };

        //RQ_GRRHH_RevisarSolicitud
      } else if (this.taskType_Activity == environment.taskType_RRHH) { //GERENTE RECURSOS HUMANOS
        variables.idSolicitud = {
          value: this.solicitud.idSolicitud
        };
        variables.tipoSolicitud = {
          value: this.solicitud.tipoSolicitud
        };
        variables.urlTarea = {
          value: `${portalWorkFlow}solicitudes/revisar-solicitud/${this.idDeInstancia}/${this.id_solicitud_by_params}`
        };
        variables.atencionRevisionGerente = { value: this.buttonValue };
        variables.comentariosAtencionGerenteRRHH = { value: this.textareaContent };

        /*{
          "variables": {
          "atencionRevisionGerente": {
              "value": "aprobar"
            },
          "comentariosAtencionGerente": {
              "value": ""
            },
          "ruta": {
              "value": ""
            }
          },
          "withVariablesInReturn": true
        }*/

      } else if (this.taskType_Activity == environment.taskType_CREM) {// COMITE DE REMUNERACION



        variables.atencionRevisionRemuneraciones = { value: this.buttonValue };
        variables.comentariosAtencionRemuneraciones = { value: this.textareaContent };


        /*
                            {
                "variables": {
                "atencionRevisionRemuneraciones": {
                    "value": "aprobar"
                  },
                "comentariosAtencionRemuneraciones": {
                    "value": ""
                  }
                },
                "withVariablesInReturn": true
              }


        */
      }

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

  onCancel() {
    console.log("User action cancel");
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
      this.solicitudes
        .obtenerNivelesAprobacionRegistrados(this.solicitud.idSolicitud)
        .subscribe({
          next: (response) => {
            this.dataAprobacionesPorPosicion = {
              [this.keySelected]: response.nivelAprobacionPosicionType
            }
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
          },
        });

    }

  }

  saveDetalleAprobaciones() {
    this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = this.buttonValue;
    this.solicitudes.modelDetalleAprobaciones.comentario = this.textareaContent;

    console.log(this.solicitudes.modelDetalleAprobaciones);
    // return;

    this.solicitudes
      .guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones)
      .subscribe({
        next: (res) => {
          Swal.fire({
            text: "Datos guardados",
            icon: "success",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Ok",
          });

          this.disabledComplete = false;
          /*this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          setTimeout(() => {
            this.router.navigate(["/solicitudes/completar-solicitudes"]);
          }, 1600);*/
        }
      });
  }

  ObtenerNivelAprobadorTask() {
    let aprobadoractual = '';
    let aprobadoractual2 = '';
    this.camundaRestService
      .getVariablesForTaskLevelAprove(this.uniqueTaskId).subscribe({
        next: (aprobador) => {
          aprobadoractual = aprobador.nivelAprobacion?.value;;

          for (const key in this.dataAprobacionesPorPosicion) {
            if (this.dataAprobacionesPorPosicion.hasOwnProperty(key)) {
              console.log(`Clave: ${key}`);
              const aprobacionesObj = this.dataAprobacionesPorPosicion[key];
              for (const index in aprobacionesObj) {
                if (aprobacionesObj.hasOwnProperty(index)) {
                  const aprobacion = aprobacionesObj[index];
                  if (aprobacion.aprobador.nivelDireccion !== "") {

                  if (aprobadoractual !== undefined) {
                    if (aprobacion.aprobador.nivelDireccion.trim() == aprobadoractual) {
                      this.aprobadorActual = aprobacionesObj[index];

                      const aprobacionSiguiente = aprobacionesObj[String(Number(index) + 1)];
                      console.log(aprobacionSiguiente);
                      if (aprobacionSiguiente.aprobador.nivelDireccion !== "") {
                      this.aprobadorSiguiente = aprobacionesObj[String(Number(index) + 1)];
                      }else{
                        const aprobacionSiguiente = aprobacionesObj[String(Number(index) + 2)];
                        if (aprobacionSiguiente.aprobador.nivelDireccion !== "") {
                          this.aprobadorSiguiente = aprobacionesObj[String(Number(index) + 2)];
                      }else{
                        this.aprobadorSiguiente = aprobacionesObj[index];
                        this.aprobadorActual = aprobacionesObj[index];
                      }}

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
                      this.solicitudes.modelDetalleAprobaciones.correo = aprobacion.aprobador.correo;
                      this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
                      this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();

                      this.datosAprobadores.idNivelAprobacion = String(Number(index) + 1);
                      this.datosAprobadores.usuario = aprobacion.aprobador.usuario;
                      this.datosAprobadores.nivelDireccion = aprobacion.aprobador.nivelDireccion;
                      this.datosAprobadores.descripcionPosicion = aprobacion.aprobador.nivelDireccion;

                    }


                  }

                  /* if(aprobacion.aprobador.nivelDireccion.trim()=='Gerente de RRHH Corporativo'){

                     this.datosAprobadores.idNivelAprobacion =String(Number(index) + 1);
                     this.datosAprobadores.usuario = aprobacion.aprobador.usuario;
                     this.datosAprobadores.nivelDireccion = aprobacion.aprobador.nivelDireccion;
                     this.datosAprobadores.descripcionPosicion = aprobacion.aprobador.nivelDireccion;

                   }*/

                  if (this.taskType_Activity == environment.taskType_RRHH && aprobadoractual === undefined) {

                    if (aprobacion.aprobador.nivelDireccion.trim().toUpperCase().indexOf('RRHH') > 0) {
                      if (aprobacionesObj[String(Number(index) + 1)] === undefined || aprobacionesObj[String(Number(index) + 1)] === null) {
                        this.aprobadorSiguiente = aprobacionesObj[index];
                        this.aprobadorActual = aprobacionesObj[index];
                        this.apruebaRemuneraciones = "NO";
                        this.aprobadorFijo = "SI";
                      } else {
                        this.aprobadorSiguiente = aprobacionesObj[String(Number(index) + 1)];
                        this.aprobadorActual = aprobacionesObj[index];
                        this.apruebaRemuneraciones = "SI";
                        this.aprobadorFijo = "SI";
                      }

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
                      this.solicitudes.modelDetalleAprobaciones.nivelDirecion = aprobacion.aprobador.nivelDirecion;
                      this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = aprobacion.nivelAprobacionType.nivelAprobacionRuta;
                      this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = aprobacion.aprobador.codigoPosicion;
                      this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = aprobacion.aprobador.descripcionPosicion;
                      this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = aprobacion.aprobador.subledger;
                      this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = aprobacion.aprobador.nivelDireccion;
                      this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = aprobacion.aprobador.codigoPosicionReportaA;
                      this.solicitudes.modelDetalleAprobaciones.estado = "A";
                      this.solicitudes.modelDetalleAprobaciones.correo = aprobacion.aprobador.correo;
                      this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
                      this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();

                      this.datosAprobadores.idNivelAprobacion = String(Number(index) + 1);
                      this.datosAprobadores.usuario = aprobacion.aprobador.usuario;
                      this.datosAprobadores.nivelDireccion = aprobacion.aprobador.nivelDireccion;
                      this.datosAprobadores.descripcionPosicion = aprobacion.aprobador.nivelDireccion;
                    }


                  } else if (this.taskType_Activity == environment.taskType_CREM && aprobadoractual === undefined) {

                    if (aprobacion.aprobador.nivelDireccion.trim().toUpperCase().indexOf('REMUNERA') > 0) {
                      this.aprobadorActual = aprobacionesObj[index];
                      this.aprobadorSiguiente = aprobacionesObj[index];
                      this.aprobadorFijo = "SI";

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
                      this.solicitudes.modelDetalleAprobaciones.nivelDirecion = aprobacion.aprobador.nivelDirecion;
                      this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = aprobacion.nivelAprobacionType.nivelAprobacionRuta;
                      this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = aprobacion.aprobador.codigoPosicion;
                      this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = aprobacion.aprobador.descripcionPosicion;
                      this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = aprobacion.aprobador.subledger;
                      this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = aprobacion.aprobador.nivelDireccion;
                      this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = aprobacion.aprobador.codigoPosicionReportaA;
                      this.solicitudes.modelDetalleAprobaciones.estado = "A";
                      this.solicitudes.modelDetalleAprobaciones.correo = aprobacion.aprobador.correo;
                      this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = aprobacion.aprobador.usuario;
                      this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
                      this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();

                      this.datosAprobadores.idNivelAprobacion = String(Number(index) + 1);
                      this.datosAprobadores.usuario = aprobacion.aprobador.usuario;
                      this.datosAprobadores.nivelDireccion = aprobacion.aprobador.nivelDireccion;
                      this.datosAprobadores.descripcionPosicion = aprobacion.aprobador.nivelDireccion;
                    }

                  } else if (aprobadoractual == undefined) {
                    this.aprobadorSiguiente = aprobacionesObj[String(Number(index) + 1)];

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
                    this.solicitudes.modelDetalleAprobaciones.nivelDirecion = aprobacion.nivelAprobacionType.nivelDirecion;
                    this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = aprobacion.nivelAprobacionType.nivelAprobacionRuta;
                    this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = aprobacion.aprobador.usuario;
                    this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = aprobacion.aprobador.codigoPosicion;
                    this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = aprobacion.aprobador.descripcionPosicion;
                    this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = aprobacion.aprobador.subledger;
                    this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = aprobacion.nivelAprobacionType.nivelDireccion;
                    this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = aprobacion.aprobador.codigoPosicionReportaA;
                    this.solicitudes.modelDetalleAprobaciones.estado = "A";
                    this.solicitudes.modelDetalleAprobaciones.correo = aprobacion.aprobador.correo;
                    this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = aprobacion.aprobador.usuario;
                    this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = aprobacion.aprobador.usuario;
                    this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
                    this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();

                    this.datosAprobadores.idNivelAprobacion = String(Number(index) + 1);
                    this.datosAprobadores.usuario = aprobacion.aprobador.usuario;
                    this.datosAprobadores.nivelDireccion = aprobacion.aprobador.nivelDireccion;
                    this.datosAprobadores.descripcionPosicion = aprobacion.aprobador.nivelDireccion;

                  }
                }
               }
              }
            }
          }


          // this.model.taskNivelAprobador = aprobador.nivelAprobacion.value;
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            error.error,
            "error"
          );
        },
      });


  }
}
