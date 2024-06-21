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
import { environment } from "../../../environments/environment";
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
import { RegistrarCandidatoService } from "./registrar-candidato.service";
import { TipoSolicitudService } from "src/app/mantenedores/tipo_solicitud/tipo-solicitud.service";
import { StarterService } from "src/app/starter/starter.service";

@Component({
  selector: 'app-registrar-candidato',
  templateUrl: './registrar-candidato.component.html',
  styleUrls: ['./registrar-candidato.component.scss'],

  providers: [CamundaRestService, HttpClientModule],
  exportAs: "registrarSolicitud",
})
export class RegistrarCandidatoComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  disabledSave: boolean = true;

  tipoProceso: string = "";
  tipoFuente: string;
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
    finProcesoFamiliares: ""
  };

  disabledFechas: any = {
    actualizacionPerfil: false,
    busquedaCandidatos: false,
    entrevista: false,
    pruebas: false,
    referencias: false,
    elaboracionInforme: false,
    entregaJefe: false,
    entrevistaJefatura: false,
    tomaDecisiones: false,
    candidatoSeleccionado: false,
    procesoContratacion: false,
    finProcesoContratacion: false,
    reingreso: false,
    finProceso: false,
    contratacionFamiliares: false,
    finProcesoFamiliares: false
  };



  isFuenteExternaVisible: boolean = true;



  //tipoProceso: String = '';

  isChecked: boolean = true; // Valor inicial del checkbox
  isDivVisible = true; // Valor inicial del div, visible

  isCheckedPerfil: boolean = false;
  isCheckedBusquedaCandidato: boolean = false;
  isCheckedFinContratacion: boolean = false;
  isCheckedProcesoContratacion: boolean = false;
  isCheckedCandidatoSeleccionado: boolean = false;
  isCheckedTomaDecisiones: boolean = false;
  isCheckedEntrevistaJefatura: boolean = false;
  isCheckedEntregaJefe: boolean = false;
  isCheckedElaboracionInforme: boolean = false;
  isCheckedReferencias: boolean = false;
  isCheckedPruebas: boolean = false;
  isCheckedEntrevista: boolean = false;

  nombreCandidato: string = "";
  codigoSolicitudProceso: string = "";
  disabledTipoProceso: boolean = false;

  toggleDivVisibility(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.isChecked = inputElement.checked;
    this.isDivVisible = this.isChecked;
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
  //Multitrabajo, LinkedIn, Instagram
  selectedOption: string;
  options: Array<{ value: string, descripcion: string }> = [
    { value: '1', descripcion: 'Multitrabajo' },
    { value: '2', descripcion: 'LinkedIn' },
    { value: '3', descripcion: 'Instagram' },
  ];

  public dataComentariosAprobaciones: any[] = [];
  public dataComentariosAprobacionesPorPosicion: any[] = [];
  public dataComentariosAprobacionesRRHH: any[] = [];
  public dataComentariosAprobacionesCREM: any[] = [];

  public misParams: Solicitud;

  public dataTipoSolicitud: any = [];
  public dataTipoMotivo: any = [];
  public dataTipoProceso: any = [];

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

  public success: false;
  public params: any;
  public id_edit: undefined | string;

  private id_solicitud_by_params: any;

  public dataNivelDireccion: any[] = [];
  public suggestions: string[] = [];

  public idDeInstancia: any;

  public loadingComplete = 0;

  public tipoProcesoSaved: string = "";

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
    private seleccionCandidatoService: RegistrarCandidatoService,
    private tipoSolicitudServicio: TipoSolicitudService,
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

    this.selectedOption = this.options[0].descripcion;

    this.getCandidatoValues();

    if (this.model.tipoProceso !== "") {
      this.disabledSave = false;
    }
  }

  getCandidatoValues() {
    this.seleccionCandidatoService.getCandidatoById(this.id_solicitud_by_params).subscribe({
      next: (res) => {
        const candidatoValues = res.seleccionCandidatoType[0];

        this.model.tipoProceso = candidatoValues.tipoProceso;
        this.tipoProcesoSaved = candidatoValues.tipoProceso;
        this.selectedOption = candidatoValues.fuenteExterna;
        this.isChecked = candidatoValues.tipoFuente;
        this.isDivVisible = this.isChecked;

        if (this.model.tipoProceso !== "") {
          this.disabledSave = false;
          this.disabledTipoProceso = true;
        }

        this.fechas.actualizacionPerfil = candidatoValues.actualizacionDelPerfil === null ? "" : this.getFormattedDate(candidatoValues.actualizacionDelPerfil);
        this.disabledFechas.actualizacionPerfil = this.fechas.actualizacionPerfil !== null && this.fechas.actualizacionPerfil !== "";
        if (this.disabledFechas.actualizacionPerfil) {
          this.isCheckedPerfil = true;
        }

        this.fechas.busquedaCandidatos = candidatoValues.busquedaDeCandidatos === null ? "" : this.getFormattedDate(candidatoValues.busquedaDeCandidatos);
        this.disabledFechas.busquedaCandidatos = this.fechas.busquedaCandidatos !== null && this.fechas.busquedaCandidatos !== "";
        if (this.disabledFechas.busquedaCandidatos) {
          this.isCheckedBusquedaCandidato = true;
        }

        this.fechas.entrevista = candidatoValues.entrevista === null ? "" : this.getFormattedDate(candidatoValues.entrevista);
        this.disabledFechas.entrevista = this.fechas.entrevista !== null && this.fechas.entrevista !== "";
        if (this.disabledFechas.entrevista) {
          this.isCheckedEntrevista = true;
        }

        this.fechas.pruebas = candidatoValues.pruebas === null ? "" : this.getFormattedDate(candidatoValues.pruebas);
        this.disabledFechas.pruebas = this.fechas.pruebas !== null && this.fechas.pruebas !== "";
        if (this.disabledFechas.pruebas) {
          this.isCheckedPruebas = true;
        }

        this.fechas.referencias = candidatoValues.referencias === null ? "" : this.getFormattedDate(candidatoValues.referencias);
        this.disabledFechas.referencias = this.fechas.referencias !== null && this.fechas.referencias !== "";
        if (this.disabledFechas.referencias) {
          this.isCheckedReferencias = true;
        }

        this.fechas.elaboracionInforme = candidatoValues.elaboracionDeInforme === null ? "" : this.getFormattedDate(candidatoValues.elaboracionDeInforme);
        this.disabledFechas.elaboracionInforme = this.fechas.elaboracionInforme !== null && this.fechas.elaboracionInforme !== "";
        if (this.disabledFechas.elaboracionInforme) {
          this.isCheckedElaboracionInforme = true;
        }

        this.fechas.entregaJefe = candidatoValues.entregaAlJefeSol === null ? "" : this.getFormattedDate(candidatoValues.entregaAlJefeSol);
        this.disabledFechas.entregaJefe = this.fechas.entregaJefe !== null && this.fechas.entregaJefe !== "";
        if (this.disabledFechas.entregaJefe) {
          this.isCheckedEntregaJefe = true;
        }

        this.fechas.entrevistaJefatura = candidatoValues.entrevistaPorJefatura === null ? "" : this.getFormattedDate(candidatoValues.entrevistaPorJefatura);
        this.disabledFechas.entrevistaJefatura = this.fechas.entrevistaJefatura !== null && this.fechas.entrevistaJefatura !== "";
        if (this.disabledFechas.entrevistaJefatura) {
          this.isCheckedEntrevistaJefatura = true;
        }

        this.fechas.tomaDecisiones = candidatoValues.tomaDeDesiciones === null ? "" : this.getFormattedDate(candidatoValues.tomaDeDesiciones);
        this.disabledFechas.tomaDecisiones = this.fechas.tomaDecisiones !== null && this.fechas.tomaDecisiones !== "";
        if (this.disabledFechas.tomaDecisiones) {
          this.isCheckedTomaDecisiones = true;
        }

        this.fechas.candidatoSeleccionado = candidatoValues.candidatoSeleccionado === null ? "" : this.getFormattedDate(candidatoValues.candidatoSeleccionado);
        this.disabledFechas.candidatoSeleccionado = this.fechas.candidatoSeleccionado !== null && this.fechas.candidatoSeleccionado !== "";
        if (this.disabledFechas.candidatoSeleccionado) {
          this.isCheckedCandidatoSeleccionado = true;
        }

        this.fechas.procesoContratacion = candidatoValues.procesoDeContratacion === null ? "" : this.getFormattedDate(candidatoValues.procesoDeContratacion);
        this.disabledFechas.procesoContratacion = this.fechas.procesoContratacion !== null && this.fechas.procesoContratacion !== "";
        if (this.disabledFechas.procesoContratacion) {
          this.isCheckedProcesoContratacion = true;
        }

        this.fechas.finProcesoContratacion = candidatoValues.finProcesoContratacion === null ? "" : this.getFormattedDate(candidatoValues.finProcesoContratacion);
        this.disabledFechas.finProcesoContratacion = this.fechas.finProcesoContratacion !== null && this.fechas.finProcesoContratacion !== "";
        if (this.disabledFechas.finProcesoContratacion) {
          this.isCheckedFinContratacion = true;
        }

        this.fechas.reingreso = candidatoValues.fechaInicioReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioReingreso);

        this.fechas.finProceso = candidatoValues.fechaFinReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaFinReingreso);

        this.fechas.contratacionFamiliares = candidatoValues.fechaInicioContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioContratacionFamiliares);

        this.fechas.finProcesoFamiliares = candidatoValues.fechaFinContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaFinContratacionFamiliares);

        this.nombreCandidato = candidatoValues.candidato;
      },
      error: (err) => {
        console.log(console.log(err));

        this.disabledSave = true;
      }
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
        this.detalleSolicitud.idSolicitud =
          this.solicitudDataInicial.idSolicitud;
      }

      // console.log("ID editar: ", this.id_edit);
      // Utiliza el id_edit obtenido
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
        this.consultaTareasService.getTareaIdParam(this.id_solicitud_by_params)
          .subscribe((tarea) => {

            this.uniqueTaskId = tarea.solicitudes[0].taskId;
            this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
            this.nameTask = tarea.solicitudes[0].name;
            this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;
            this.rootProces = tarea.solicitudes[0].rootProcInstId;
            this.taskId = params["id"];

            this.getDetalleSolicitudById(this.id_solicitud_by_params);
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
      await this.ObtenerServicioTipoSolicitud();
      await this.ObtenerServicioTipoMotivo();
      await this.ObtenerServicioTipoAccion();
      //await this.ObtenerServicioNivelDireccion();
      //await this.getSolicitudes();
      //if (this.id_edit !== undefined) { //comentado mmunoz
      //await this.getDetalleSolicitudById(this.id_edit); //comentado mmunoz
      await this.getSolicitudById(this.id_edit);
      //} // comentado munoz
      await this.getDataEmpleadosEvolution();
      // await this.ObtenerServicioTipoProceso();
      await this.loadDataCamunda(); //comentado para prueba mmunoz
      //console.log("impreme arreglo de aprobadores: ");
      //await this.recorrerArreglo();

      // await this.getNivelesAprobacion();
      this.utilService.closeLoadingSpinner();
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

  ObtenerServicioTipoProceso() {
    return this.mantenimientoService.getTipoProcesoPorTipoSolicitud(this.solicitud.idTipoSolicitud).subscribe({
      next: (response) => {
        this.dataTipoProceso = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoProceso,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  getSolicitudById(id: any) {
    return this.solicitudes.getSolicitudById(id).subscribe({
      next: async (response: any) => {
        this.solicitud = response;

        await this.ObtenerServicioTipoProceso();

        this.loadingComplete++;
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
          this.model.sueldoAnual = this.detalleSolicitud.sueldoVariableAnual
          this.model.correo = this.detalleSolicitud.correo;
          this.model.fechaIngreso = this.detalleSolicitud.fechaIngreso;


        }

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

          this.obtenerComentariosAtencionPorInstanciaRaiz();

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
      text: "¿Desea Guardar la Solicitud?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(227, 199, 22)",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        //this.save(); // comentado hasta confirmar que se debe Guardar para seleccion de candidato mmunoz

        if (this.submitted) {
        }

        //Fin Solicitud
      }
    });
  }

  llenarModelDetalleAprobaciones(res) {
    this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitud.idSolicitud;
    this.solicitudes.modelDetalleAprobaciones.id_NivelAprobacion = 150000;
    this.solicitudes.modelDetalleAprobaciones.id_TipoSolicitud = this.solicitud.idTipoSolicitud.toString();
    this.solicitudes.modelDetalleAprobaciones.id_Accion = 150000;
    this.solicitudes.modelDetalleAprobaciones.id_TipoMotivo = this.solicitud.idTipoMotivo;
    this.solicitudes.modelDetalleAprobaciones.id_TipoRuta = 150000;
    this.solicitudes.modelDetalleAprobaciones.id_Ruta = 150000;
    this.solicitudes.modelDetalleAprobaciones.tipoSolicitud = this.solicitud.tipoSolicitud;
    this.solicitudes.modelDetalleAprobaciones.motivo = "SeleccionCandidato";
    this.solicitudes.modelDetalleAprobaciones.tipoRuta = "SeleccionCandidato";
    this.solicitudes.modelDetalleAprobaciones.ruta = "Selección de Candidato";
    this.solicitudes.modelDetalleAprobaciones.accion = "SeleccionCandidato";
    this.solicitudes.modelDetalleAprobaciones.nivelDirecion = res.evType[0].nivelDir;
    this.solicitudes.modelDetalleAprobaciones.nivelAprobacionRuta = "SeleccionCandidato";
    this.solicitudes.modelDetalleAprobaciones.usuarioAprobador = res.evType[0].nombreCompleto;
    this.solicitudes.modelDetalleAprobaciones.codigoPosicionAprobador = res.evType[0].codigoPosicion;
    this.solicitudes.modelDetalleAprobaciones.descripcionPosicionAprobador = res.evType[0].descrPosicion;
    this.solicitudes.modelDetalleAprobaciones.sudlegerAprobador = res.evType[0].subledger;
    this.solicitudes.modelDetalleAprobaciones.nivelDireccionAprobador = res.evType[0].nivelDir;
    this.solicitudes.modelDetalleAprobaciones.codigoPosicionReportaA = res.evType[0].codigoPosicionReportaA;
    this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "SeleccionCandidato";
    this.solicitudes.modelDetalleAprobaciones.estado = "A";
    this.solicitudes.modelDetalleAprobaciones.correo = res.evType[0].correo;
    this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = res.evType[0].nombreCompleto;
    this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = res.evType[0].nombreCompleto;
    this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
    this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();
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

    this.starterService.getUser(localStorage.getItem("idUsuario")!).subscribe({
      next: (res) => {
        this.llenarModelDetalleAprobaciones(res);

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
            this.detalleSolicitud.descripcionPosicion =
              this.model.descrPosicion;

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
      }
    });

    this.submitted = true;
  }

  onChangeTipoProceso(event: any) {
    // this.disabledSave = false;
    this.disabledSave = this.model.tipoProceso !== "";

    if (this.model.tipoProceso.toUpperCase().includes("FAMILIA")) {
      this.fechas.contratacionFamiliares = this.getFormattedDate();
      this.fechas.reingreso = "";
    } else if (this.model.tipoProceso.toUpperCase().includes("REINGRESO")) {
      this.fechas.reingreso = this.getFormattedDate();
      this.fechas.contratacionFamiliares = "";
    } else {
      this.fechas.reingreso = "";
      this.fechas.contratacionFamiliares = "";
    }
  }

  async saveCandidato() {

    const request = {
      iD_SOLICITUD: this.solicitud.idSolicitud,
      iD_SOLICITUD_PROCESO: "",
      tipoFuente: this.isChecked,
      fuenteExterna: this.isChecked ? this.selectedOption : null,
      tipoProceso: this.model.tipoProceso,
      candidato: this.nombreCandidato,
      actualizacionDelPerfil: this.fechas.actualizacionPerfil === "" ? null : this.fechas.actualizacionPerfil.replace(" ", "T"),
      busquedaDeCandidatos: this.fechas.busquedaCandidatos === "" ? null : this.fechas.busquedaCandidatos.replace(" ", "T"),
      entrevista: this.fechas.entrevista === "" ? null : this.fechas.entrevista.replace(" ", "T"),
      pruebas: this.fechas.pruebas === "" ? null : this.fechas.pruebas.replace(" ", "T"),
      referencias: this.fechas.referencias === "" ? null : this.fechas.referencias.replace(" ", "T"),
      elaboracionDeInforme: this.fechas.elaboracionInforme === "" ? null : this.fechas.elaboracionInforme.replace(" ", "T"),
      entregaAlJefeSol: this.fechas.entregaJefe === "" ? null : this.fechas.entregaJefe.replace(" ", "T"),
      entrevistaPorJefatura: this.fechas.entrevistaJefatura === "" ? null : this.fechas.entrevistaJefatura.replace(" ", "T"),
      tomaDeDesiciones: this.fechas.tomaDecisiones === "" ? null : this.fechas.tomaDecisiones.replace(" ", "T"),
      candidatoSeleccionado: this.fechas.candidatoSeleccionado === "" ? null : this.fechas.candidatoSeleccionado.replace(" ", "T"),
      procesoDeContratacion: this.fechas.procesoContratacion === "" ? null : this.fechas.procesoContratacion.replace(" ", "T"),
      finProcesoContratacion: this.fechas.finProcesoContratacion === "" ? null : this.fechas.finProcesoContratacion.replace(" ", "T"),
      fechaInicioReingreso: this.fechas.reingreso === '' ? null : this.fechas.reingreso.replace(" ", "T"),
      fechaFinReingreso: null,
      fechaInicioContratacionFamiliares: this.fechas.contratacionFamiliares === '' ? null : this.fechas.contratacionFamiliares.replace(" ", "T"),
      fechaFinContratacionFamiliares: null,
      fechaIngresoCandidato: null
    };

    // return;

    this.seleccionCandidatoService.saveCandidato(request).subscribe({
      next: () => {
        this.starterService.getUser(localStorage.getItem("idUsuario")!).subscribe({
          next: (res) => {
            this.llenarModelDetalleAprobaciones(res);

            this.saveDetalleAprobaciones()

            Swal.fire({
              text: "Datos actualizados con éxito",
              icon: "success",
              confirmButtonColor: "rgb(227, 199, 22)",
              confirmButtonText: "Sí"
            });

            this.tipoProcesoSaved = this.model.tipoProceso;
            this.disabledTipoProceso = this.tipoProcesoSaved !== "";

            this.disabledFechas.actualizacionPerfil = this.fechas.actualizacionPerfil !== null && this.fechas.actualizacionPerfil !== "";
            this.disabledFechas.busquedaCandidatos = this.fechas.busquedaCandidatos !== null && this.fechas.busquedaCandidatos !== "";
            this.disabledFechas.entrevista = this.fechas.entrevista !== null && this.fechas.entrevista !== "";
            this.disabledFechas.pruebas = this.fechas.pruebas !== null && this.fechas.pruebas !== "";
            this.disabledFechas.referencias = this.fechas.referencias !== null && this.fechas.referencias !== "";
            this.disabledFechas.elaboracionInforme = this.fechas.elaboracionInforme !== null && this.fechas.elaboracionInforme !== "";
            this.disabledFechas.entregaJefe = this.fechas.entregaJefe !== null && this.fechas.entregaJefe !== "";
            this.disabledFechas.entrevistaJefatura = this.fechas.entrevistaJefatura !== null && this.fechas.entrevistaJefatura !== "";
            this.disabledFechas.tomaDecisiones = this.fechas.tomaDecisiones !== null && this.fechas.tomaDecisiones !== "";
            this.disabledFechas.candidatoSeleccionado = this.fechas.candidatoSeleccionado !== null && this.fechas.candidatoSeleccionado !== "";
            this.disabledFechas.procesoContratacion = this.fechas.procesoContratacion !== null && this.fechas.procesoContratacion !== "";
            this.disabledFechas.finProcesoContratacion = this.fechas.finProcesoContratacion !== null && this.fechas.finProcesoContratacion !== "";
          }
        });
      },
      error: (error) => {
        console.error(error);
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

    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe({
        next: (res) => {
          //actualizo la solicitud a enviada
          this.solicitud.empresa = this.model.compania;
          this.solicitud.idEmpresa = this.model.compania;

          this.solicitud.unidadNegocio = this.model.unidadNegocio;
          this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
          this.solicitud.estadoSolicitud = "4";
          this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {

            if (this.model.tipoProceso.toUpperCase().includes("FAMILIA") || this.model.tipoProceso.toUpperCase().includes("REINGRESO")) {
              if (this.model.tipoProceso.toUpperCase().includes("FAMILIA")) {
                this.codigoSolicitudProceso = "CF";
              } else if (this.model.tipoProceso.toUpperCase().includes("REINGRESO")) {
                this.codigoSolicitudProceso = "RG";
              }

              this.tipoSolicitudServicio.index().subscribe(
                {
                  next: res => {
                    const idTipoSolicitud = res.tipoSolicitudType.find(r => r.codigoTipoSolicitud === this.codigoSolicitudProceso).id;

                    const solicitud = {
                      fechaActualizacion: new Date(),
                      fechaCreacion: new Date(),
                      usuarioCreacion: this.solicitud.usuarioCreacion,
                      usuarioActualizacion: this.solicitud.usuarioActualizacion,
                      estado: "3",
                      idSolicitud: "string",
                      idInstancia: this.solicitud.idInstancia,
                      idEmpresa: this.solicitud.idEmpresa,
                      empresa: this.solicitud.empresa,
                      idUnidadNegocio: this.solicitud.idUnidadNegocio,
                      unidadNegocio: this.solicitud.unidadNegocio,
                      estadoSolicitud: "3",
                      idTipoSolicitud,
                      tipoSolicitud: "string",
                      idTipoMotivo: 0,
                      tipoMotivo: "string",
                      idTipoAccion: 0,
                      tipoAccion: "string"
                    };

                    this.solicitudes.guardarSolicitud(solicitud).subscribe({
                      next: res => {

                        this.solicitudes.getDetalleSolicitudById(this.solicitud.idSolicitud).subscribe({
                          next: (detalleSolicitud) => {
                            let detalle = detalleSolicitud.detalleSolicitudType[0];

                            detalle = {
                              ...detalle,
                              idSolicitud: res.idSolicitud
                            }

                            const request = {
                              iD_SOLICITUD: this.solicitud.idSolicitud,
                              iD_SOLICITUD_PROCESO: res.idSolicitud,
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
                              fechaIngresoCandidato: null
                            };

                            this.seleccionCandidatoService.saveCandidato(request).subscribe({
                              next: (res) => {
                                this.solicitudes.guardarDetalleSolicitud(detalle).subscribe({
                                  next: (res) => {
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              );
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

        if (this.taskType_Activity !== environment.taskType_Registrar) {
          this.RegistrarsolicitudCompletada = false;
        }

      });
  }

  override generateVariablesFromFormFields() {

    let variables: any = {};

    if (this.solicitud.tipoSolicitud.toUpperCase().includes("REQUISICION") || this.solicitud.tipoSolicitud.toUpperCase().includes("REQUISICIÓN")) {


      if (this.taskType_Activity == environment.taskType_RegistrarCandidato) {
        if (this.model.tipoProceso.toUpperCase().includes("FAMILIA")) {
          variables.tipoSolicitud = { value: "contratacionFamiliares" };
        } else if (this.model.tipoProceso.toUpperCase().includes("REINGRESO")) {
          variables.tipoSolicitud = { value: "reingresoPersonal" };
        } else if (this.model.tipoProceso.toUpperCase().includes("REEMPLAZO")) {
          variables.tipoSolicitud = { value: "nuevoIngresoReemplazo" };
        }

      }

    }

    return { variables };
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
    if (this.detalleSolicitud.codigoPosicion !== "" &&
      this.detalleSolicitud.codigoPosicion !== undefined &&
      this.detalleSolicitud.codigoPosicion != null &&
      this.solicitud.idTipoSolicitud !== 0 &&
      this.solicitud.idTipoSolicitud !== undefined &&
      this.solicitud.idTipoSolicitud !== null &&
      this.solicitud.idTipoMotivo !== 0 &&
      this.solicitud.idTipoMotivo !== undefined &&
      this.solicitud.idTipoMotivo !== null) {


      this.solicitudes
        .obtenerAprobacionesPorPosicion(
          this.solicitud.idTipoSolicitud,
          this.solicitud.idTipoMotivo,
          this.detalleSolicitud.codigoPosicion,
          this.detalleSolicitud.nivelDireccion, 'A'
        )
        .subscribe({
          next: (response) => {
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

      });
  }

  onCheckboxChangeCandidato(event: any) {
    const inputElement = event.target as HTMLInputElement;

    switch (inputElement.name) {
      case 'checkPerfil':
        this.isCheckedPerfil = inputElement.checked;
        if (this.isCheckedPerfil) {
          this.fechas.actualizacionPerfil = this.getFormattedDate();
        } else {
          this.fechas.actualizacionPerfil = "";
        }
        break;

      case 'checkBusquedaCandidato':
        this.isCheckedBusquedaCandidato = inputElement.checked;
        if (this.isCheckedBusquedaCandidato) {
          this.fechas.busquedaCandidatos = this.getFormattedDate();
        } else {
          this.fechas.busquedaCandidatos = "";
        }
        break;

      case 'checkEntrevista':
        this.isCheckedEntrevista = inputElement.checked;
        if (this.isCheckedEntrevista) {
          this.fechas.entrevista = this.getFormattedDate();
        } else {
          this.fechas.entrevista = "";
        }
        break;

      case 'checkPruebas':
        this.isCheckedPruebas = inputElement.checked;
        if (this.isCheckedPruebas) {
          this.fechas.pruebas = this.getFormattedDate();
        } else {
          this.fechas.pruebas = "";
        }
        break;

      case 'checkReferencias':
        this.isCheckedReferencias = inputElement.checked;

        if (this.isCheckedReferencias) {
          this.fechas.referencias = this.getFormattedDate();
        } else {
          this.fechas.referencias = "";
        }
        break;



      case 'checkElaboracionInforme':
        this.isCheckedElaboracionInforme = inputElement.checked;

        if (this.isCheckedElaboracionInforme) {
          this.fechas.elaboracionInforme = this.getFormattedDate();
        } else {
          this.fechas.elaboracionInforme = "";
        }
        break;


      case 'checkEntregaJefe':
        this.isCheckedEntregaJefe = inputElement.checked;

        if (this.isCheckedEntregaJefe) {
          this.fechas.entregaJefe = this.getFormattedDate();
        } else {
          this.fechas.entregaJefe = "";
        }
        break;



      case 'checkEntrevistaJefatura':
        this.isCheckedEntrevistaJefatura = inputElement.checked;

        if (this.isCheckedEntrevistaJefatura) {
          this.fechas.entrevistaJefatura = this.getFormattedDate();
        } else {
          this.fechas.entrevistaJefatura = "";
        }
        break;


      case 'checkTomaDecisiones':
        this.isCheckedTomaDecisiones = inputElement.checked;

        if (this.isCheckedTomaDecisiones) {
          this.fechas.tomaDecisiones = this.getFormattedDate();
        } else {
          this.fechas.tomaDecisiones = "";
        }
        break;

      case 'checkCandidatoSeleccionado':
        this.isCheckedCandidatoSeleccionado = inputElement.checked;

        if (this.isCheckedCandidatoSeleccionado) {
          this.fechas.candidatoSeleccionado = this.getFormattedDate();
        } else {
          this.fechas.candidatoSeleccionado = "";
        }
        break;


      case 'checkProcesoContratacion':
        this.isCheckedProcesoContratacion = inputElement.checked;

        if (this.isCheckedProcesoContratacion) {
          this.fechas.procesoContratacion = this.getFormattedDate();
        } else {
          this.fechas.procesoContratacion = "";
        }
        break;


      case 'checkFinContratacion':
        this.isCheckedFinContratacion = inputElement.checked;

        if (this.isCheckedFinContratacion) {
          this.fechas.finProcesoContratacion = this.getFormattedDate();
        } else {
          this.fechas.finProcesoContratacion = "";
        }
        break;

      default:

    }

    //this.isDivVisible = !this.isChecked;
  }

  getFormattedDate(dateValue: string = ""): string {
    const date = dateValue === "" ? new Date() : new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  obtenerComentariosAtencionPorInstanciaRaiz() {

    return this.solicitudes
      .obtenerComentariosAtencionPorInstanciaRaiz(
        this.solicitud.idInstancia + 'COMENT'
      )
      .subscribe({
        next: (response) => {
          this.dataComentariosAprobaciones.length = 0;
          this.dataComentariosAprobacionesPorPosicion = response.variableType;
          this.dataComentariosAprobaciones = this.filterDataComentarios(this.solicitud.idInstancia, 'RevisionSolicitud', 'comentariosAtencion');
          this.dataComentariosAprobacionesRRHH = this.filterDataComentarios(this.solicitud.idInstancia, 'RequisicionPersonal', 'comentariosAtencionGerenteRRHH');
          this.dataComentariosAprobacionesCREM = this.filterDataComentarios(this.solicitud.idInstancia, 'RequisicionPersonal', 'comentariosAtencionRemuneraciones');
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(
            "No existe comentarios de aprobadores",
            "error"
          );
        },
      });

  }

  filterDataComentarios(idInstancia: string, taskKey: string, name: string) {
    return this.dataComentariosAprobacionesPorPosicion.filter(item =>
      (idInstancia ? item.rootProcInstId === idInstancia : true) && //Id de instancia
      (taskKey ? item.procDefKey === taskKey : true) &&
      (name ? item.name === name : true)
    );
  }



}

