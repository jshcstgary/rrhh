import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from "rxjs/operators";
import { CamundaRestService } from 'src/app/camunda-rest.service';
import { DatosProcesoInicio } from 'src/app/eschemas/DatosProcesoInicio';
import { DatosSolicitud } from 'src/app/eschemas/DatosSolicitud';
import { DetalleSolicitud } from 'src/app/eschemas/DetalleSolicitud';
import { RegistrarData } from 'src/app/eschemas/RegistrarData';
import { Solicitud } from 'src/app/eschemas/Solicitud';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { UtilService } from 'src/app/services/util/util.service';
import { DialogComponents, dialogComponentList } from 'src/app/shared/dialogComponents/dialog.components';
import { ConsultaTareasService } from 'src/app/tareas/consulta-tareas/consulta-tareas.service';
import { environment, portalWorkFlow } from 'src/environments/environment';
import { CompleteTaskComponent } from '../general/complete-task.component';
import { SolicitudesService } from '../registrar-solicitud/solicitudes.service';
import { columnsAprobadores, dataTableAprobadores } from './registrar-comentario-salida-jefe.data';
import { RegistrarCandidatoService } from '../registrar-candidato/registrar-candidato.service';
import { StarterService } from 'src/app/starter/starter.service';
import { ComentarioSalidaJefeService } from './comentario-salida-jefe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-comentario-salida-jefe',
  templateUrl: './registrar-comentario-salida-jefe.component.html',
  styleUrls: ['./registrar-comentario-salida-jefe.component.scss']
})
export class RegistrarComentarioSalidaJefeComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  selectedOption: string = 'No';
  columnsAprobadores = columnsAprobadores.columns;
  dataTableAprobadores = dataTableAprobadores;

  currentDate: Date = new Date();

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

  public completeDisabled: boolean = true;

  emailVariables = {
    de: "",
    password: "",
    alias: "",
    para: "",
    asunto: "",
    cuerpo: ""
  };

  public remuneracion: number;
  public comentarios: string = "";

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
  public detalleSolicitudRG = new DetalleSolicitud();

  public solicitud = new Solicitud();
  public solicitudRG = new Solicitud();

  private detalleNivelAprobacion: any[] = [];

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

  public comentariosJefeInmediato: any = {};

  public comentariosRRHH: any = {};

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

  nombreCompletoCandidato: string = "";
  idSolicitudRP: string = "";

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];
  jsonResult: string;
  taskKey: string = "";
  taskKeyUltimoJefe: string = environment.taskType_RGC_ULTIMO_JEFE;
  taskKeyRRHH: string = environment.taskType_RGC_RRHH;
  taskKeySolicitante: string = environment.taskType_RG_Jefe_Solicitante;

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService,
    private seleccionCandidatoService: RegistrarCandidatoService,
    private modalService: NgbModal,
    private starterService: StarterService,
    private comentarioSalidaJefeService: ComentarioSalidaJefeService
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
      console.log("this.idDeInstancia: ", this.idDeInstancia);
    });
  }

  async ngOnInit() {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    try {
      await this.loadDataCamunda();

      this.utilService.closeLoadingSpinner();
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

  // Prueba servicio
  getSolicitudes() {
    this.solicitudes.getSolicitudes().subscribe((data) => { });
  }

  getSolicitudById(id: any) {
    return this.solicitudes.getSolicitudById(id).subscribe({
      next: (response: any) => {
        if (id.toUpperCase().includes("RP")) {
          this.solicitud = response;
        } else if (id.toUpperCase().includes("RG")) {
          this.solicitudRG = response;

          this.getComentarios();
        }

        this.loadingComplete++;
        this.getDetalleSolicitudById(id);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  getComentarios() {
    this.comentarioSalidaJefeService.obtenerComentarios(this.solicitudRG.idSolicitud).subscribe({
      next: ({ comentarios }) => {
        comentarios.forEach(comentario => {
          if (comentario.tipo_Solicitud === "Comentario_Salida_Jefe") {
            this.comentariosJefeInmediato = comentario;
          } else {
            this.comentariosRRHH = comentario;
          }
        })
      }
    });
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

        // this.disabledSave = true;
      }
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
      const variableNames = Object.keys(this.model).join(",");

      if ("true" === this.parentIdFlag) {
        this.idDeInstancia = params["id"];
        this.solicitudes.getTareaIdParam(this.id_solicitud_by_params).subscribe((result) => {
          this.taskKey = result.solicitudes[0].tasK_DEF_KEY;

          this.lookForError(result);
          this.uniqueTaskId = result.solicitudes[0].taskId;
          this.taskId = params["id"];

          this.getCandidatoValues();

          this.date = result.solicitudes[0].startTime;
          // this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
        });
      } else {
        // unique id is from the route params
        this.uniqueTaskId = params["id"];
        this.taskId = params["id"];
        // this.loadExistingVariables(
        //   this.uniqueTaskId ? this.uniqueTaskId : "",
        //   variableNames
        // );
      }
      // console.log("Así es mi variablesNames: ", variableNames);
      // ready to do the processing now
    });
  }

  filtrarDatos(campo: string, valor: string) {
    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
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
  modelRemuneracionRG: number = 0;
  getDetalleSolicitudById(id: any) {
    return this.solicitudes.getDetalleSolicitudById(id).subscribe({
      next: (response: any) => {
        if (id.toUpperCase().includes("RP")) {
          this.detalleSolicitud = response.detalleSolicitudType[0];
        } else if (id.toUpperCase().includes("RG")) {
          this.detalleSolicitudRG = response.detalleSolicitudType[0];
        }

        if (id.toUpperCase().includes("RP")) {
          if (this.detalleSolicitud.codigoPosicion.length > 0) {
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
            this.modelRemuneracion = +this.model.sueldoAnual / 12 + +this.model.sueldoSemestral / 6 + +this.model.sueldoTrimestral / 3 + +this.model.sueldoMensual;

            console.log(response.detalleSolicitudType[0]);
          }
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
            this.modelRG.fechaIngreso = (this.detalleSolicitudRG.fechaIngreso as string).split("T")[0];
            this.remuneracion = Number(this.modelRG.sueldoAnual) / 12 + Number(this.modelRG.sueldoSemestral) / 6 + Number(this.modelRG.sueldoTrimestral) / 3 + Number(this.modelRG.sueldoMensual);

            this.keySelected = this.solicitud.idTipoSolicitud + "_" + this.solicitud.idTipoMotivo + "_" + this.model.nivelDir;

            if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
              this.getNivelesAprobacion();

              if (this.model.codigoPosicion.trim().length > 0) {
                this.obtenerAprobacionesPorPosicionAPS();
                this.obtenerAprobacionesPorPosicionAPD();
              }
            }
          }
        }

        this.loadingComplete++;

        this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);
        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

        this.consultarNextTask(id);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  getNivelesAprobacion() {
    if (this.solicitudRG !== null) {
      this.solicitudes
        .obtenerNivelesAprobacionRegistrados(this.solicitudRG.idSolicitud)
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

  // getNivelesAprobacion() {
  //   if (this.detalleSolicitudRG.codigoPosicion !== "" && this.detalleSolicitudRG.codigoPosicion !== undefined && this.detalleSolicitudRG.codigoPosicion != null) {
  //     this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.detalleSolicitudRG.codigoPosicion, this.detalleSolicitudRG.nivelDireccion, 'A').subscribe({
  //       next: (response) => {
  //         this.mapearDetallesAprobadores(response.nivelAprobacionPosicionType);

  //         this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.utilService.modalResponse(
  //           "No existen niveles de aprobación para este empleado",
  //           "error"
  //         );
  //       },
  //     });
  //   }
  // }

  mapearDetallesAprobadores(nivelAprobacionPosicionType: any[]) {
    this.starterService.getUser(localStorage.getItem("idUsuario")).subscribe({
      next: (res) => {
        this.detalleNivelAprobacion = nivelAprobacionPosicionType.map(({ nivelAprobacionType, aprobador }) => ({
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
  }

  // getNivelesAprobacion() {
  //   if (this.detalleSolicitud.codigoPosicion !== "" &&
  //     this.detalleSolicitud.codigoPosicion !== undefined &&
  //     this.detalleSolicitud.codigoPosicion != null) {


  //     this.solicitudes
  //       .obtenerAprobacionesPorPosicion(
  //         this.solicitud.idTipoSolicitud,
  //         this.solicitud.idTipoMotivo,
  //         this.detalleSolicitud.codigoPosicion,
  //         this.detalleSolicitud.nivelDireccion, 'A'
  //       )
  //       .subscribe({
  //         next: (response) => {
  //           this.dataAprobacionesPorPosicion[this.keySelected] =
  //             response.nivelAprobacionPosicionType;
  //         },
  //         error: (error: HttpErrorResponse) => {
  //           this.utilService.modalResponse(
  //             "No existen niveles de aprobación para este empleado",
  //             "error"
  //           );
  //         },
  //       });

  //   }

  // }

  obtenerAprobacionesPorPosicionAPS() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.modelRG.codigoPosicion, this.modelRG.nivelDir, 'APS')
      .subscribe({
        next: (response) => {
          this.dataTipoRuta.length = 0;
          this.dataRuta.length = 0;
          this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType || [];

          this.dataAprobacionesPorPosicionAPS.forEach(item => {
            this.dataTipoRuta.push(item.nivelAprobacionType.tipoRuta);
            this.dataRuta.push(item.nivelAprobacionType.ruta);
            console.log("Aprobaciones APS = ", item.nivelAprobacionType);
          });
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
        },
      });
  }

  obtenerAprobacionesPorPosicionAPD() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(this.solicitudRG.idTipoSolicitud, this.solicitudRG.idTipoMotivo, this.modelRG.codigoPosicion, this.modelRG.nivelDir, 'APD')
      .subscribe({
        next: (response) => {
          this.dataAprobadoresDinamicos.length = 0;
          this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType;
          this.dataAprobacionesPorPosicionAPS.forEach(item => {
            this.dataAprobadoresDinamicos.push(item.aprobador.nivelDireccion);
            console.log("Aprobaciones APD = ", item.aprobador);
          });
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse("No existe aprobadores de solicitud para los datos ingresados", "error");
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

        if (this.taskType_Activity !== environment.taskType_Registrar) {
          this.RegistrarsolicitudCompletada = false;
        }
      });
  }

  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      console.log("routing to app error page ", result.error.message);
      this.errorMessage = result.error.message;
      this.utilService.modalResponse(this.errorMessage, "error");
    }
  }

  public onSubmit(): void {
    this.save();
  }

  public save() {
    if (this.comentarios === "") {
      Swal.fire({
        text: "Debe ingresar un comentario",
        icon: "error",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
      });

      return;
    }

    const comentario = {
      id_Solicitud: this.solicitudRG.idSolicitud,
      id_Tipo_Solicitud: this.solicitudRG.idTipoSolicitud.toString(),
      tipo_Solicitud: this.taskKey === environment.taskType_RGC_ULTIMO_JEFE ? "Comentario_Salida_Jefe" : (this.taskKey === environment.taskType_RGC_RRHH ? "Comentario_RRHH" : "Comentario_Jefe_Solicitante"),
      comentario: this.comentarios,
      fecha_Creacion: new Date(),
      fecha_Modificacion: new Date()
    };

    this.comentarioSalidaJefeService.registrarComentario(comentario).subscribe({
      next: (res) => {
        Swal.fire({
          text: "Datos guardados",
          icon: "success",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Ok",
        });

        this.completeDisabled = false;
      }
    });
  }


  public pageSolicitudes(): void {

  }

  generateVariablesFromFormFieldsJefeSolicitante() {
    let variables: any = {};

    if (this.taskType_Activity == environment.taskType_RG_Jefe_Solicitante) {
      this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
        if (index === 0) {
          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas?idUsuario=${elemento.aprobador.subledger}`);

          this.emailVariables = {
            de: this.solicitudes.modelDetalleAprobaciones.correo,
            para: elemento.aprobador.correo,
            alias: this.solicitudes.modelDetalleAprobaciones.correo,
            asunto: `Autorización de Solicitud de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
            cuerpo: modifiedHtmlString,
            password: "p4$$w0rd"
          };

          this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitudRG.idSolicitud;
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
          this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = "PorRevisar";
          this.solicitudes.modelDetalleAprobaciones.correo = elemento.aprobador.correo;
          this.solicitudes.modelDetalleAprobaciones.usuarioCreacion = elemento.aprobador.usuario;
          this.solicitudes.modelDetalleAprobaciones.usuarioModificacion = elemento.aprobador.usuario;
          this.solicitudes.modelDetalleAprobaciones.fechaCreacion = new Date().toISOString();
          this.solicitudes.modelDetalleAprobaciones.fechaModificacion = new Date().toISOString();
        }
      });

      variables.anularSolicitud = {
        value: this.selectedOption
      };
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
        value: this.solicitudRG.idSolicitud
      };
      variables.tipoSolicitud = {
        value: this.solicitudRG.tipoSolicitud
      };
      variables.urlTarea = {
        value: `${portalWorkFlow}solicitudes/revisar-solicitud/${this.idDeInstancia}/${this.id_solicitud_by_params}`
      };
      variables.tipoRuta = {
        value: this.dataTipoRuta,
        type: "String",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }
      };
      variables.ruta = {
        value: this.dataRuta,
        type: "String",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }
      };
      variables.resultadoRutaAprobacion = {
        value: JSON.stringify(this.dataAprobadoresDinamicos),
        type: "Object",
        valueInfo: {
          objectTypeName: "java.util.ArrayList",
          serializationDataFormat: "application/json"
        }
      };
    }

    return { variables };
  }

  public onCompletar(): void {
    if (this.uniqueTaskId === null) {
      this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

      return;
    }

    let variables = this.generateVariablesFromFormFields();

    this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");

    if (this.taskKey === this.taskKeySolicitante) {
      variables = this.generateVariablesFromFormFieldsJefeSolicitante();

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
    }

    this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
      next: () => {
        this.utilService.closeLoadingSpinner();

        this.utilService.modalResponse(`Solicitud registrada correctamente [${this.idDeInstancia}]. Será redirigido en un momento...`, "success");

        setTimeout(() => {
          this.router.navigate([`/tareas/consulta-tareas`]);
        }, 1800);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });

    this.submitted = true;
  }

  public onCancel(): void {

  }

  public onSelectItem(codigoPosicion: string, event: NgbTypeaheadSelectItemEvent<any>): void {

  }


  openModal(componentName: keyof DialogComponents) {
    console.log('SE ABRIO EL MODAL')
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
            console.log('Probando')
            // this.dataTableAprobadores.push(result);
          }
        },
        (reason) => {
          console.log(`Dismissed with: ${reason}`);
        }
      );
  }

}