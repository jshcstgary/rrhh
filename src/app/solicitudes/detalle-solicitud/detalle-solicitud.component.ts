import {
  HttpErrorResponse
} from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { DatosAprobadores } from "src/app/eschemas/DatosAprobadores";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { FamiliaresCandidatos, MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { columnsDatosFamiliares } from "src/app/solicitudes/revisar-solicitud/registrar-familiares.data";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import Swal from "sweetalert2";
import { environment } from "../../../environments/environment";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { RegistrarCandidatoService } from "../registrar-candidato/registrar-candidato.service";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { ComentarioSalidaJefeService } from './comentario-salida-jefe.service';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { NumericLiteral } from "typescript";

@Component({
  selector: "app-detalle-solicitud",
  templateUrl: "./detalle-solicitud.component.html",

  styleUrls: ["./detalle-solicitud.component.scss"],
})
export class DetalleSolicitudComponent extends CompleteTaskComponent {
  NgForm = NgForm;
  isRequired: boolean = false;
  isFechaMaximaVisible: boolean = false;
  campoObligatorio: string = '';
  observaciontexto: string = 'Observación';
  modelPropuestos: RegistrarData = new RegistrarData();

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
    ""
  );

  public detalleSolicitudPropuestos = new DetalleSolicitud();


  columnsDatosFamiliares = columnsDatosFamiliares.columns;
  dataTableDatosFamiliares: FamiliaresCandidatos[] = [];
  datosAprobadores: DatosAprobadores = new DatosAprobadores();
  // public solicitud = new Solicitud();

  private searchSubject = new Subject<{
    campo: string;
    valor: string;
  }>();

  isChecked: boolean = false;
  idSolicitudRP: string = "";
  nombreCandidato: string = "";

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

  // private
  private id_solicitud_by_params: any;
  public solicitudDataInicial = new Solicitud();
  public tipo_solicitud_descripcion: string;
  public tipo_motivo_descripcion: string;
  public tipo_accion_descripcion: string;

  public keySelected: any;

  public mostrarTipoJustificacionYMision = false;

  public restrictionsIds: any[] = ["1", "2", 1, 2];

  public restrictionsSubledgerIds: any[] = ["4", 4];

  public mostrarSubledger = false;

  public detalleSolicitud: DetalleSolicitud = new DetalleSolicitud();
  public detalleSolicitudRG: DetalleSolicitud = new DetalleSolicitud();

  public solicitudRG: any;
  currentDate: Date = new Date();


  public solicitud = new Solicitud();

  public mostrarFormularioFamiliares: boolean = false;
  public mostrarFormularioReingreso: boolean = false;
  public mostrarRequisicion: boolean = false;
  public mostrarAccionPersonal: boolean = false;

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

  public loadingComplete = 0;

  // public dataTipoAccion: any;

  public dataTipoAccion: any = [];
  // public dataNivelesDeAprobacion: { [idTipoSolicitud: number, IdTipoMotivo: number, IdNivelDireccion: number]: any[] } =
  // {};

  public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

  // getDataNivelesAprobacionPorCodigoPosicion
  public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

  public dataNivelesAprobacion: any;

  public dataComentariosAprobaciones: any[] = [];
  public dataComentariosAprobacionesPorPosicion: any[] = [];
  public dataComentariosAprobacionesRRHH: any[] = [];
  public dataComentariosAprobacionesCREM: any[] = [];

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
  public dataNivelDireccion: any[] = [];
  public suggestions: string[] = [];

  public idDeInstancia: any;

  public selectedOption: string = "";

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];
  nombreCompletoCandidato: string = "";
  causaSalida: string = "";
  modelRemuneracion: number = 0;

  public remuneracion: number;
  public RegistrarsolicitudCompletada = true;
  public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};
  public comentariosJefeInmediato: any = {};
  public comentarios: string = "";
  public comentariosRRHH: any = {};
  public Comentario_Jefe_Solicitante: any = {};
  modelRG: RegistrarData = new RegistrarData(
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


  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService,
    private seleccionCandidatoService: RegistrarCandidatoService,
    private comentarioSalidaJefeService: ComentarioSalidaJefeService

  ) {
    super(route, router, camundaRestService);

    this.searchSubject.pipe(debounceTime(0)).subscribe(({ campo, valor }) => {
      this.filtrarDatos(campo, valor);
    });

    this.route.paramMap.subscribe((params) => {
      this.id_edit = params.get("id");
    });

    this.route.paramMap.subscribe((params) => {
      this.id_solicitud_by_params = params.get("id");
    });

    if (this.id_solicitud_by_params.toUpperCase().includes("AP") && this.id_solicitud_by_params.toUpperCase().includes("DP")) {
      this.getCandidatoValues();
    }

    this.modelBase = new DatosProcesoInicio();
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

  getComentarios() {
    this.comentarioSalidaJefeService.obtenerComentarios(this.detalleSolicitudRG.idSolicitud).subscribe({
      next: ({ comentarios }) => {
        comentarios.forEach(comentario => {
          if (comentario.tipo_Solicitud === "Comentario_Salida_Jefe") {
            this.comentariosJefeInmediato = comentario;
          } if (comentario.tipo_Solicitud === "Comentario_Jefe_Solicitante") {
            this.Comentario_Jefe_Solicitante = comentario;
          } if (comentario.tipo_Solicitud === "Comentario_RRHH") {
            this.comentariosRRHH = comentario;
          }
        })
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


        console.log(this.isChecked);

        this.fechas.actualizacionPerfil = candidatoValues.actualizacionDelPerfil === null ? "" : this.getFormattedDate(candidatoValues.actualizacionDelPerfil);
        // this.disabledFechas.actualizacionPerfil = this.fechas.actualizacionPerfil !== null && this.fechas.actualizacionPerfil !== "";

        this.fechas.busquedaCandidatos = candidatoValues.busquedaDeCandidatos === null ? "" : this.getFormattedDate(candidatoValues.busquedaDeCandidatos);
        // this.disabledFechas.busquedaCandidatos = this.fechas.busquedaCandidatos !== null && this.fechas.busquedaCandidatos !== "";

        this.fechas.entrevista = candidatoValues.entrevista === null ? "" : this.getFormattedDate(candidatoValues.entrevista);
        // this.disabledFechas.entrevista = this.fechas.entrevista !== null && this.fechas.entrevista !== "";

        this.fechas.pruebas = candidatoValues.pruebas === null ? "" : this.getFormattedDate(candidatoValues.pruebas);
        // this.disabledFechas.pruebas = this.fechas.pruebas !== null && this.fechas.pruebas !== "";

        this.fechas.referencias = candidatoValues.referencias === null ? "" : this.getFormattedDate(candidatoValues.referencias);
        // this.disabledFechas.referencias = this.fechas.referencias !== null && this.fechas.referencias !== "";

        this.fechas.elaboracionInforme = candidatoValues.elaboracionDeInforme === null ? "" : this.getFormattedDate(candidatoValues.elaboracionDeInforme);
        // this.disabledFechas.elaboracionInforme = this.fechas.elaboracionInforme !== null && this.fechas.elaboracionInforme !== "";

        this.fechas.entregaJefe = candidatoValues.entregaAlJefeSol === null ? "" : this.getFormattedDate(candidatoValues.entregaAlJefeSol);
        // this.disabledFechas.entregaJefe = this.fechas.entregaJefe !== null && this.fechas.entregaJefe !== "";

        this.fechas.entrevistaJefatura = candidatoValues.entrevistaPorJefatura === null ? "" : this.getFormattedDate(candidatoValues.entrevistaPorJefatura);
        // this.disabledFechas.entrevistaJefatura = this.fechas.entrevistaJefatura !== null && this.fechas.entrevistaJefatura !== "";

        this.fechas.tomaDecisiones = candidatoValues.tomaDeDesiciones === null ? "" : this.getFormattedDate(candidatoValues.tomaDeDesiciones);
        // this.disabledFechas.tomaDecisiones = this.fechas.tomaDecisiones !== null && this.fechas.tomaDecisiones !== "";

        this.fechas.candidatoSeleccionado = candidatoValues.candidatoSeleccionado === null ? "" : this.getFormattedDate(candidatoValues.candidatoSeleccionado);
        // this.disabledFechas.candidatoSeleccionado = this.fechas.candidatoSeleccionado !== null && this.fechas.candidatoSeleccionado !== "";

        this.fechas.procesoContratacion = candidatoValues.procesoDeContratacion === null ? "" : this.getFormattedDate(candidatoValues.procesoDeContratacion);
        // this.disabledFechas.procesoContratacion = this.fechas.procesoContratacion !== null && this.fechas.procesoContratacion !== "";

        this.fechas.finProcesoContratacion = candidatoValues.finProcesoContratacion === null ? "" : this.getFormattedDate(candidatoValues.finProcesoContratacion);
        // this.disabledFechas.finProcesoContratacion = this.fechas.finProcesoContratacion !== null && this.fechas.finProcesoContratacion !== "";

        this.fechas.reingreso = candidatoValues.fechaInicioReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioReingreso);

        this.fechas.finProceso = candidatoValues.fechaFinReingreso === null ? "" : this.getFormattedDate(candidatoValues.fechaFinReingreso);

        this.fechas.contratacionFamiliares = candidatoValues.fechaInicioContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaInicioContratacionFamiliares);

        this.fechas.finProcesoFamiliares = candidatoValues.fechaFinContratacionFamiliares === null ? "" : this.getFormattedDate(candidatoValues.fechaFinContratacionFamiliares);

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
        console.log(console.log(err));
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
            if (tarea.solicitudes.length > 0) {
              this.uniqueTaskId = tarea.solicitudes[0].taskId;
              this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
              this.nameTask = tarea.solicitudes[0].name;
              this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;
            }

            if (!this.id_solicitud_by_params.toUpperCase().includes("AP") && !this.id_solicitud_by_params.toUpperCase().includes("DP")) {
              this.getCandidatoValues();
            } else {
              this.getSolicitudById(this.id_solicitud_by_params);
            }


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

    this.searchSubject.next({ campo, valor });
    this.suggestions = this.dataEmpleadoEvolution
      .filter((empleado) => empleado[campo].startsWith(valor))
      .map((empleado) => empleado[campo]);
  }

  selectSuggestion(suggestion: string) {
    this.model.codigoPosicion = suggestion;
    this.suggestions = [];
  }

  onSelectItem(campo: string, event) {
    let valor = event.item;
    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });
    if (datosEmpleado) {
      this.model = Object.assign({}, datosEmpleado);
      this.keySelected =
        this.solicitud.idTipoSolicitud +
        "_" +
        this.solicitud.idTipoMotivo +
        "_" +
        this.model.nivelDir;
      if (!this.dataNivelesDeAprobacion[this.keySelected]) {
        this.getNivelesAprobacion();
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
    console.log("load existing variables ...", taskId);

    this.camundaRestService
      .getVariablesForTask(taskId, variableNames)
      .subscribe((result) => {
        this.lookForError(result);
        // console.log(
        //   "ESTAS SON LAS VARIABLES QUE ESTOY RECIBIENDO EN loadExistingVariables():",
        //   result
        // );
        this.generateModelFromVariables(result);
      });
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
  obtenerServicioFamiliaresCandidatos({ idSolicitud }: { idSolicitud: string; }) {
    return this.mantenimientoService.getFamiliaresCandidatoBySolicitud(this.id_solicitud_by_params).subscribe({
      next: (response) => {
        const data = response?.familiaresCandidato || [];
        console.log(data);

        console.log(idSolicitud);
        this.dataTableDatosFamiliares = data.filter(
          (d) => d.idSolicitud === idSolicitud
        );
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  async ngOnInit() {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    try {

      await this.loadDataCamunda();
      await this.obtenerServicioFamiliaresCandidatos({
        idSolicitud: this.id_solicitud_by_params,
      });
    } catch (error) {
      // Manejar errores aquí de manera centralizada
      this.utilService.modalResponse(error.error, "error");
    }

  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes; //verificar la estructura mmunoz

        this.detalleSolicitud.nivelDireccion =
          response.itemCatalogoTypes.filter(
            (data) => data.codigo == this.detalleSolicitud.nivelDireccion
          )[0]?.valor;
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
        this.mostrarRequisicion = this.solicitud.idSolicitud.includes("RP-");
        this.mostrarFormularioFamiliares = this.solicitud.idSolicitud.includes("CF-");
        this.mostrarFormularioReingreso = this.solicitud.idSolicitud.includes("RG-");
        this.mostrarAccionPersonal = this.solicitud.idSolicitud.includes("AP-");
        this.loadingComplete += 2;
        this.getDetalleSolicitudById(id);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
  totalRegistrosDetallesolicitud: number = 0;

  getDetalleSolicitudById(id: any) {
    return this.solicitudes.getDetalleSolicitudById(id).subscribe({
      next: (response: any) => {
        if (id.toUpperCase().includes("AP")) {

          this.totalRegistrosDetallesolicitud = response.totalRegistros;

          const detalleActual = response.detalleSolicitudType.find(detalle => detalle.idDetalleSolicitud === 1);

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
          this.model.fechaIngreso = detalleActual.fechaIngreso;
          this.model.grupoPago = detalleActual.grupoDePago;
          this.model.descrPuesto = detalleActual.descripcionPosicion;

          if (response.totalRegistros === 2) {
            const detallePropuestos = response.detalleSolicitudType.find(detalle => detalle.idDetalleSolicitud === 2);

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
            this.modelPropuestos.sucursal = detallePropuestos.sucursal;
            this.modelPropuestos.fechaIngreso = detallePropuestos.fechaIngreso;
            this.modelPropuestos.grupoPago = detallePropuestos.grupoDePago;
            this.modelPropuestos.descrPuesto = detallePropuestos.descripcionPosicion;
            this.detalleSolicitudPropuestos.movilizacion = detallePropuestos.movilizacion;
            this.detalleSolicitudPropuestos.alimentacion = detallePropuestos.alimentacion;
          }
        }
        else {
          this.detalleSolicitud = response.detalleSolicitudType[0];
          this.detalleSolicitudRG = response.detalleSolicitudType[0];
          if (!(id.toUpperCase().includes("RG")) && this.detalleSolicitud.codigoPosicion.length > 0) {
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
            this.modelRemuneracion = Number(this.model.sueldoAnual) / 12 + Number(this.model.sueldoSemestral) / 6 + Number(this.model.sueldoTrimestral) / 3 + Number(this.model.sueldoMensual);

          } else if (id.toUpperCase().includes("RG")) {
            if (this.detalleSolicitudRG.codigoPosicion.length > 0) {
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
              this.modelRG.correo = this.detalleSolicitudRG.correo;
              this.causaSalida = this.detalleSolicitudRG.causaSalida;
              this.modelRG.fechaIngreso = (this.detalleSolicitudRG.fechaIngreso as string).split("T")[0];
              this.remuneracion = Number(this.modelRG.sueldoAnual) / 12 + Number(this.modelRG.sueldoSemestral) / 6 + Number(this.modelRG.sueldoTrimestral) / 3 + Number(this.modelRG.sueldoMensual);

              this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;
              this.getComentarios();
            }
          }
        }

        this.loadingComplete++;

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
      // error while loading task. handle it by redirecting to error page
      this.errorMessage = result.error.message;
      this.router.navigate(["error"], {
        queryParams: { message: result.error.message },
      });
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
    if (this.uniqueTaskId === null) {
      //handle this as an error
      this.errorMessage =
        "Unique Task id is empty. Cannot initiate task complete.";
      return;
    }
    this.utilService.openLoadingSpinner(
      "Guardando información, espere por favor..."
    );
    const variables = this.generateVariablesFromFormFields();
    // basis of completeing the task using the unique id
    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe((res) => {
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
        this.solicitudes
          .actualizarSolicitud(this.solicitud)
          .subscribe((responseSolicitud) => {


            this.detalleSolicitud.areaDepartamento = this.model.departamento;

            this.detalleSolicitud.cargo = this.model.nombreCargo;
            this.detalleSolicitud.centroCosto = this.model.nomCCosto;
            this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
            this.detalleSolicitud.compania = this.model.idEmpresa;
            this.detalleSolicitud.departamento = this.model.departamento;
            this.detalleSolicitud.descripcionPosicion =
              this.model.descrPosicion;
            this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo;

            this.detalleSolicitud.justificacion = this.model.justificacionCargo;
            this.detalleSolicitud.localidad = this.model.localidad;
            this.detalleSolicitud.localidadZona = this.model.localidad;

            this.detalleSolicitud.misionCargo = this.model.misionCargo;
            this.detalleSolicitud.nivelDireccion = this.model.nivelDir;
            this.detalleSolicitud.nivelReporteA = this.model.nivelRepa;

            this.detalleSolicitud.nombreEmpleado = this.model.nombreCompleto;

            // this.detalleSolicitud.puesto = this.model.nombreCompleto;

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
            this.detalleSolicitud.unidad = this.model.unidadNegocio;
            this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

            this.solicitudes
              .actualizarDetalleSolicitud(this.detalleSolicitud)
              .subscribe((responseDetalle) => {
                this.utilService.closeLoadingSpinner();
                this.utilService.modalResponse(
                  "Datos ingresados correctamente",
                  "success"
                );

                this.camundaRestService
                  .getTask(environment.taskType_Notificar, this.idDeInstancia)
                  .subscribe((result) => {
                    // if result is success - bingo, we got the task id
                    this.uniqueTaskId =
                      result[0].id; /* Es como la tarea que se crea en esa instancia */
                    this.taskId = this.idDeInstancia; /* Esta es la instancia */

                  });

                // /solicitudes/consulta-solicitudes

                setTimeout(() => {
                  this.router.navigate(["/solicitudes/consulta-solicitudes"], {
                    queryParams: { idInstancia },
                  });
                }, 1800);

              });

            let dataSend = {
              idSolicitud: responseSolicitud.idSolicitud,
              codigo: "string",
              valor: "string",
              estado: "string",
              fechaRegistro: "2024-04-25T20:23:37.819Z",
              compania: "string",
              unidadNegocio: "string",
              codigoPosicion: "string",
              descripcionPosicion: "string",
              areaDepartamento: "string",
              localidadZona: "string",
              nivelDireccion: "string",
              centroCosto: "string",
              nombreEmpleado: "string",
              subledger: "string",
              reportaA: "string",
              nivelReporteA: "string",
              supervisaA: "string",
              tipoContrato: "string",
              departamento: "string",
              cargo: "string",
              jefeSolicitante: "string",
              responsableRRHH: "string",
              localidad: "string",
              fechaIngreso: "2024-04-25T20:23:37.819Z",
              unidad: "string",
              puesto: "string",
              jefeInmediatoSuperior: "string",
              jefeReferencia: "string",
              cargoReferencia: "string",
              fechaSalida: "2024-04-25T20:23:37.819Z",
              puestoJefeInmediato: "string",
              subledgerEmpleado: "string",
              grupoDePago: "string",
              sucursal: "string",
              movilizacion: "string",
              alimentacion: "string",
              jefeAnteriorJefeReferencia: "string",
              causaSalida: "string",
              nombreJefeSolicitante: "string",
              misionCargo: "string",
              justificacion: "string",
            };
          });


      });
    this.submitted = true;
  }


  override generateVariablesFromFormFields() {

    let variables: any = {};

    variables.codigo = { value: this.model.codigo };
    variables.idEmpresa = { value: this.model.idEmpresa };
    variables.compania = { value: this.model.compania };
    variables.departamento = { value: this.model.departamento };
    variables.nombreCargo = { value: this.model.nombreCargo };
    variables.nomCCosto = { value: this.model.nomCCosto };
    variables.descrPosicion = { value: this.model.descrPosicion };
    variables.codigoPuesto = { value: this.model.codigoPuesto };
    variables.descrPuesto = { value: this.model.descrPuesto };
    variables.fechaIngresogrupo = { value: this.model.fechaIngresogrupo };
    variables.grupoPago = { value: this.model.grupoPago };
    variables.reportaA = { value: this.model.reportaA };
    variables.localidad = { value: this.model.localidad };
    variables.nivelDir = { value: this.model.nivelDir };
    // variables.descrNivelDir = { value: this.model.descrNivelDir };
    variables.nivelRepa = { value: this.model.nivelRepa };
    variables.sucursal = { value: this.model.sucursal };
    variables.unidadNegocio = { value: this.model.unidadNegocio };
    variables.tipoContrato = { value: this.model.tipoContrato };
    variables.descripContrato = { value: this.model.descripContrato };
    variables.status = { value: this.model.status };
    variables.sueldo = { value: this.model.sueldo }; //sueldoVariableMensual
    variables.sueldoMensual = { value: this.model.sueldoMensual };
    variables.sueldoTrimestral = { value: this.model.sueldoTrimestral };
    variables.sueldoSemestral = { value: this.model.sueldoSemestral };
    variables.sueldoAnual = { value: this.model.sueldoAnual };
    variables.anularSolicitud = { value: "No" };
    variables.codigoPosicion = { value: this.model.codigoPosicion };
    variables.misionCargo = { value: this.model.misionCargo };
    variables.justificacionCargo = { value: this.model.justificacionCargo };
    variables.ruta = { value: null };
    variables.nivelDireccion = { value: this.model.nivelDir };
    variables.comentariosAtencion = { value: "SEND STATIC" };

    if (this.tipo_solicitud_descripcion === "requisicionPersonal") {
      if (
        this.tipo_motivo_descripcion === "Nuevo" ||
        this.tipo_motivo_descripcion === "Eventual"
      ) {
        variables.codigoPosicion = { value: this.model.codigoPosicion };
        variables.misionCargo = { value: this.model.misionCargo };
        variables.justificacionCargo = { value: this.model.justificacionCargo };
      } else if (this.tipo_motivo_descripcion === "Pasante") {
        variables.codigoPosicion = { value: this.model.misionCargo };
      } else if (this.tipo_motivo_descripcion === "Reemplazo") {
        variables.subledger = { value: this.model.subledger };
        variables.nombreCompleto = { value: this.model.nombreCompleto };
        variables.codigoPosicion = { value: this.model.codigoPosicion };
      }
    }

    return { variables };
  }



  onCancel() {
    this.router.navigate(["solicitudes/consulta-solicitudes"], {
      queryParams: {},
    });
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
            [this.keySelected]: response.nivelAprobacionPosicionType
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

  getDataNivelesAprobacionPorCodigoPosicion() {
    this.solicitudes
      .getDataNivelesAprobacionPorCodigoPosicion(
        this.detalleSolicitud.codigoPosicion
      )
      .subscribe({
        next: (response) => {
          this.dataNivelesAprobacionPorCodigoPosicion[
            this.model.codigoPosicion
          ] = response.evType;

          for (let key1 of Object.keys(this.dataNivelesDeAprobacion)) {
            let eachDataNivelesDeAprobacion =
              this.dataNivelesDeAprobacion[key1];

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

  consultarNextTask(IdSolicitud: string) {
    this.consultaTareasService.getTareaIdParam(IdSolicitud)
      .subscribe((tarea) => {
        console.log("Task: ", tarea);

        this.uniqueTaskId = tarea.solicitudes[0].taskId;
        this.taskType_Activity = tarea.solicitudes[0].tasK_DEF_KEY;
        this.nameTask = tarea.solicitudes[0].name;
        this.id_solicitud_by_params = tarea.solicitudes[0].idSolicitud;

        this.obtenerComentariosAtencionPorInstanciaRaiz();
      });
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
          console.log("Aprobaciones comentarios diamicos = ", this.dataComentariosAprobaciones);
          console.log("Aprobaciones comentarios rrhh = ", this.dataComentariosAprobacionesRRHH);
          console.log("Aprobaciones comentarios CREM = ", this.dataComentariosAprobacionesCREM);
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

  public exportar(): void {
    const backgroundCellColor: [number, number, number] = [218, 238, 243];
    const textColor: [number, number, number] = [54, 95, 145];
    const lineColor: [number, number, number] = [149, 179, 215];

    const doc = new jsPDF();

    // Esquina de la hoja
    autoTable(doc, {
      theme: "plain",
      body: [
        [
          {
            content: `RR.HH.: ${this.solicitud.idSolicitud}`,
            styles: {
              halign: "right",
              fontStyle: "bold"
            }
          }
        ],
      ]
    });

    // Títutlo
    autoTable(doc, {
      theme: "plain",
      body: [
        [
          {
            content: "REQUERIMIENTO DE PERSONAL",
            styles: {
              halign: "center",
              fontSize: 20,
              fontStyle: "bold",
              textColor: [0, 0, 255]
            }
          }
        ],
      ]
    });

    // Encabezado de la solicitud
    autoTable(doc, {
      theme: "grid",
      bodyStyles: {
        lineColor
      },
      body: [
        // ["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", format(this.solicitud.fechaCreacion!, "dd/MM/yyyy"), "Solicitud No:", this.solicitud.idSolicitud],
        ["Creado por:", this.solicitud.usuarioCreacion, "Fecha:", "dd/MM/yyyy", "Solicitud No:", this.solicitud.idSolicitud],
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
            content: "INFORMACIÓN DE LA POSICIÓN",
            colSpan: 4
          }
        ]
      ],
      body: [
        ["Unidad:", this.model.unidadNegocio, "Motivo", this.solicitud.tipoMotivo],
        ["Ciudad/Localidad:", this.model.localidad, "Empleado a reemplazar", this.model.nombreCompleto],
        ["Cargo solicitado:", this.model.nombreCargo, "Sueldo", this.model.sueldo],
        ["Área/Dpto:", this.model.departamento, "Variable mínima:", "0"],
        ["Centro de Costos", this.model.nomCCosto, "Total", "0"],
        [
          "Justificación:",
          {
            content: this.model.justificacionCargo,
            colSpan: 3
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
            content: "FUNCIONES Y RESPONSABILIDADES",
            colSpan: 4
          }
        ]
      ],
      body: [
        ["Reporta a:", this.model.reportaA, "Supervisa a:", this.model.supervisaA],
        [
          "Misión del cargo:",
          {
            content: this.model.misionCargo,
            colSpan: 3
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
        ["Actualización del perfil:", this.fechas.actualizacionPerfil],
        ["Búsqueda del candidato:", this.fechas.busquedaCandidatos],
        ["Entrevistas:", this.fechas.entrevista],
        ["Pruebas:", this.fechas.pruebas],
        ["Referencias:", this.fechas.referencias],
        ["Elaboración del Informe:", this.fechas.elaboracionInforme],
        ["Entrega al Jefe Solicitante el informe de selección:", this.fechas.entregaJefe],
        ["Entrevistas por parte de fejaturas:", this.fechas.entrevistaJefatura],
        ["Toma de decisiones por parte de fejaturas:", this.fechas.tomaDecisiones],
        ["Candidato seleccionado:", this.fechas.candidatoSeleccionado],
        ["Proceso de Contratación:", this.fechas.procesoContratacion],
        ["Fin del Proceso de Selección y Proceso de Contratación:", this.fechas.finProcesoContratacion],
        [
          {
            content: "",
            colSpan: 2
          }
        ],
        [
          {
            content: "Nombre del candidato escogido:",
            styles: {
              cellWidth: 70
            }
          },
          this.nombreCandidato
        ],
        [
          {
            content: "Fecha de ingreso:",
            styles: {
              cellWidth: 70
            }
          },
          this.nombreCandidato
        ]
      ],
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 120
        },
        1: {
          cellWidth: 60,
          halign: "center"
        }
      }
    });

    doc.save('table.pdf')
  }
}

/**
  onClickImprimir() {
    const currentDate: Date = new Date();

    const day: number = currentDate.getDate();
    const month: number = currentDate.getMonth() + 1;
    const year: number = currentDate.getFullYear();
    const hour: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const seconds: number = currentDate.getUTCSeconds();

    const weekOfYear: number = Math.ceil((((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(currentDate.getFullYear(), 0, 1).getDay() + 1) / 7);
    const pdf = new jsPDF({
      orientation: "landscape"
    });

    const npagina = 'Pagina: ' + pdf.getNumberOfPages();

    pdf.setFontSize(15);
    pdf.text(npagina, 10, 10);
    pdf.setFontSize(25);
    pdf.text("Registro de Pase", 150, 10, {
      align: "center"
    });

    // Muestra la fecha
    autoTable(pdf, {
      theme: "grid",
      body: [
        [
          {
            content: `No.: ${this.codigoPase}`,
            colSpan: 3
          }, `Semana: ${weekOfYear.toString().padStart(2, "0")}`
        ],
        [`Día: ${day.toString().padStart(2, "0")}`, `Mes: ${month.toString().padStart(2, "0")}`, `Año: ${year}`, `Hora: ${hour}:${minutes}:${seconds}`]
      ],
      margin: {
        left: 170
      },
      bodyStyles: {
        lineColor: 0
      },
      tableLineWidth: 0.1,
      tableLineColor: 0,
      columnStyles: {
        0: {
          cellWidth: 20
        },
        1: {
          cellWidth: 20
        },
        2: {
          cellWidth: 20
        }
      }
    });
    // Muestra los filtros    const servidorDesarrollo: Parametro = this.dataServidorDesarrollo.find(servidorDesarrollo => servidorDesarrollo.id === Number(this.RegistroObjetos.capSerDesarrollo));
    const servidorProduccion: Parametro = this.dataServidorProduccion.find(servidorProduccion => servidorProduccion.id === Number(this.RegistroObjetos.capSerProduccion));
    const unidadServicio: Parametro = this.dataServidorLocalidad.find(servidorLocalidad => servidorLocalidad.id === Number(this.RegistroObjetos.capLocalidad));
    const plataforma: Plataforma = this.dataAmbiente.find(plataforma => plataforma.id === Number(this.RegistroObjetos.plaSecuencia));
    const prioridad: Parametro = this.dataServidorPrioridad.find(prioridad => prioridad.id === Number(this.RegistroObjetos.capPrioridad));
    const motivo: Parametro = this.dataServidorMotivo.find(motivo => motivo.id === Number(this.RegistroObjetos.capMotivoPase));
    const tipoPase: Parametro = this.dataServidorTipo.find(tipo => tipo.id === Number(this.RegistroObjetos.capTipoPase));
    const applications: Set<string> = new Set(this.dataObjetoVersionSeleccionada.map(data => data.appDescription));

    autoTable(pdf, {
      body: [
        ["Aplicaciones:", Array.from(applications).join(", "), "Plataforma:", plataforma.descripcion],
        ["Servidor de desarrollo:", servidorDesarrollo.descripcion, "Prioridad:", prioridad.descripcion],
        ["Servidor de producción:", servidorProduccion.descripcion, "Motivo:", motivo.descripcion],
        ["Unidad/P. Servicio:", unidadServicio.descripcion, "Tipo de pase:", tipoPase.descripcion]
      ],
      theme: "plain",
      margin: {
        left: 15,
      },
      columnStyles: {
        0: {
          cellWidth: 50,
          halign: "right",
          fontStyle: "bold"
        },
        1: {
          cellWidth: 83
        },
        2: {
          cellWidth: 50,
          halign: "right",
          fontStyle: "bold"
        },
        3: {
          cellWidth: 83
        }
      }
    });

    const tablePdf: {
      headers: string[];
      values: (string | number)[][];
    } = {
      headers: [],
      values: []
    };

    // Manipula el contenido de la tabla    tablePdf.headers = Array.from(this.content.nativeElement.children).map((cell: HTMLTableCellElement) => cell.textContent);
    tablePdf.headers.shift();
    tablePdf.values = this.dataObjetoVersionSeleccionada.map((objeto) => {
      const devInt = this.dataTecnicos.find(t => t.id === Number(objeto.depDevInt));
      const depProv = this.dataProveedores.find(p => p.id === Number(objeto.depCodProv));

      return [objeto.appDescription, objeto.modDescription, objeto.codigo, objeto.descripcion, objeto.origen, objeto.destino, devInt !== undefined ? devInt.nombre : "", depProv !== undefined ? depProv.descripcion : "", objeto.descripcionCambio];
    });

    // Muestra la tabla
    autoTable(pdf, {
      head: [tablePdf.headers],
      body: tablePdf.values,
      columnStyles: {
        0: {
          cellWidth: 30
        },
        1: {
          cellWidth: 30
        },
        2: {
          cellWidth: 30
        },
        3: {
          cellWidth: 30
        },
        4: {
          cellWidth: 30
        },
        5: {
          cellWidth: 30
        },
        6: {
          cellWidth: 30
        },
        7: {
          cellWidth: 30
        },
        8: {
          cellWidth: 30
        }
      }
    });

    // Muestra los campos del footer
    autoTable(pdf, {
      body: [
        [
          {
            content: "Observaciones:",
            rowSpan: 2
          },
          {
            content: this.RegistroObjetos.capObservacion,
            rowSpan: 2
          },
          "Área solicitante:", this.RegistroObjetos.capAreaSolicitante
        ],
        ["Usuario solicitante:", this.RegistroObjetos.capUsuarioSolicitante],
        [
          {
            content: "Especificaciones de implementación:",
            rowSpan: 2
          },
          {
            content: this.RegistroObjetos.capReqImpPV,
            rowSpan: 2
          },
          "Proyecto/Caso:", this.RegistroObjetos.capNomPrj
        ],
        ["Anexo:", this.RegistroObjetos.paseAnexo.apvRutaObjetos]
      ],
      theme: "plain",
      columnStyles: {
        0: {
          cellWidth: 40,
          fontStyle: "bold"
        },
        1: {
          cellWidth: 110
        },
        2: {
          cellWidth: 45,
          fontStyle: "bold"
        }
      }
    });

    pdf.setProperties({
      title: "Registro del Pase"
    });
    pdf.save(this.codigoPase);
  }
 */
