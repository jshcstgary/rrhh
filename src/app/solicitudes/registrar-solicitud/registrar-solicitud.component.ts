import { SolicitudesService } from "./solicitudes.service";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "registrarSolicitud",
  templateUrl: "./registrar-solicitud.component.html",
  styleUrls: ["./registrar-solicitud.component.scss"],

  providers: [CamundaRestService, HttpClientModule],
  exportAs: "registrarSolicitud",
})
export class RegistrarSolicitudComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  /* override model: RegistrarData = new RegistrarData(
    "123",
    "Description",
    0,
    "Observations"
  ); */

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

  // public solicitud = new Solicitud();

  private searchSubject = new Subject<{
    campo: string;
    valor: string;
  }>();

  public solicitudDataInicial = new Solicitud();
  public tipo_solicitud_descripcion: string;
  public tipo_motivo_descripcion: string;
  public tipo_accion_descripcion: string;

  public detalleSolicitud = new DetalleSolicitud();

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

  public dataNivelesAprobacion: any;
  public success: false;
  public params: any;
  public id_edit: undefined | string;
  public dataNivelDireccion: any[] = [];
  public suggestions: string[] = [];

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

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService
  ) {
    super(route, router, camundaRestService);

    this.searchSubject.pipe(debounceTime(0)).subscribe(({ campo, valor }) => {
      this.filtrarDatos(campo, valor);
    });

    this.modelBase = new DatosProcesoInicio();
  }

  searchCodigoPosicion: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
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
        term.length < 2
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
        term.length < 2
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
      console.log("Mis params: ", params);
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
        this.camundaRestService
          .getTask(environment.taskType_Registrar, params["id"])
          .subscribe((result) => {
            console.log("INGRESA AQUÍ: ", result);
            console.log(
              "environment.taskType_Registrar: ",
              environment.taskType_Registrar
            );
            console.log("params['id']: ", params["id"]);
            this.lookForError(result); // if error, then control gets redirected to err page

            // if result is success - bingo, we got the task id
            this.uniqueTaskId =
              result[0].id; /* Es como la tarea que se crea en esa instancia */
            this.taskId = params["id"]; /* Esta es la instancia */
            console.log("this.uniqueTaskId: ", this.uniqueTaskId);
            console.log("this.taskId: ", this.taskId);

            this.date = result[0].created;
            this.loadExistingVariables(
              this.uniqueTaskId ? this.uniqueTaskId : "",
              variableNames
            );
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

  onSelectItem(campo: string, event) {
    let valor = event.item;
    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      console.log("Empleado iterando: ", empleado);
      console.log(
        "empleado[campo]: " + empleado[campo] + ", valor: ",
        valor + ", campo: ",
        campo
      );
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

  getDataEmpleadosEvolution() {
    return this.solicitudes.getDataEmpleadosEvolution().subscribe({
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
      console.log("Empleado iterando: ", empleado);
      console.log(
        "empleado[campo]: " + empleado[campo] + ", valor: ",
        valor + ", campo: ",
        campo
      );
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
      console.log("dataTipoAccion = ", this.dataTipoAccion);
      console.log("dataTipoSolicitud = ", this.dataTipoSolicitud);
      console.log("dataTipoMotivo = ", this.dataTipoMotivo);
      console.log("variables: ", variables);
      switch (variableName) {
        case "tipoAccion":
          console.log("set tipo_accion = ", variables[variableName].value);
          console.log("this.dataTipoAccion?.filter = ", this.dataTipoAccion);
          this.tipo_accion_descripcion = this.dataTipoAccion?.filter(
            (data) => data.tipoAccion == variables[variableName].value
          )[0]?.tipoAccion;
          this.modelBase.tipo_cumplimiento = variables[variableName].value;
          break;

        case "tipoSolicitud":
          console.log("set tipo_solicitud = ", variables[variableName].value);
          console.log(
            "this.dataTipoSolicitud?.filter = ",
            this.dataTipoSolicitud
          );
          this.tipo_solicitud_descripcion =
            this.dataTipoSolicitud.tipoSolicitudType?.filter(
              (data) => data.tipoSolicitud == variables[variableName].value
            )[0]?.tipoSolicitud;
          this.modelBase.tipoSolicitud = variables[variableName].value;
          break;

        case "tipoMotivo":
          console.log("set tipo_motivo = ", variables[variableName].value);
          console.log("this.dataTipoMotivo?.filter = ", this.dataTipoMotivo);
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
      await this.ObtenerServicioNivelDireccion();
      // await this.getNivelesAprobacion();
      await this.getSolicitudes();
      if (this.id_edit !== undefined) {
        await this.getDetalleSolicitudById();
        await this.getSolicitudById();
      }
      await this.getDataEmpleadosEvolution();
      await this.loadDataCamunda();

      this.utilService.closeLoadingSpinner();
    } catch (error) {
      // Manejar errores aquí de manera centralizada
      this.utilService.modalResponse(error.error, "error");
    }
    // this.getNivelesAprobacion();
    // this.getSolicitudById();
    // this.getDetalleSolicitudById();
    // this.getSolicitudes();
    // this.ObtenerServicioTipoSolicitud();
    // this.ObtenerServicioTipoMotivo();
    // this.ObtenerServicioTipoAccion();
    // this.ObtenerServicioNivelDireccion();
  }

  pageSolicitudes() {
    this.router.navigate(["/solicitudes/consulta-solicitudes"]);
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

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  getSolicitudById() {
    /*return this.solicitudes.getSolicitudById(this.id_edit).subscribe({
      next: (response: any) => {
        console.log("Solicitud por id: ", response);
        this.solicitud = response;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });*/
  }

  getDetalleSolicitudById() {
    return this.solicitudes.getDetalleSolicitudById(this.id_edit).subscribe({
      next: (response: any) => {
        this.detalleSolicitud.estado = response.estado;
        this.detalleSolicitud.estado = response.estadoSolicitud;
        this.detalleSolicitud.idSolicitud = response.idSolicitud;
        this.detalleSolicitud.unidadNegocio = response.unidadNegocio;
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

  // tveas comentando método mmunoz
  /*onSubmit() {
    if (this.uniqueTaskId === null) {
      //handle this as an error
      this.errorMessage =
        "Unique Task id is empty. Cannot initiate task complete.";
      console.error(this.errorMessage);
      return;
    }

    const variables = this.generateVariablesFromFormFields();
    // basis of completeing the task using the unique id
    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe();
    this.submitted = true;
  }*/

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

    const variables = this.generateVariablesFromFormFields();
    // basis of completeing the task using the unique id
    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe((res) => {
        this.submitted = true;
        let idInstancia = this.solicitudDataInicial.idInstancia;
        console.log("this.uniqueTaskId: ", this.uniqueTaskId);
        console.log("variables: ", variables);
        console.log("res: ", res);

        console.log(
          "this.solicitudDataInicial.idInstancia: ",
          this.solicitudDataInicial.idInstancia
        );

        let extra = {
          idEmpresa: this.model.compania,
          empresa: this.model.compania,
          estadoSolicitud: "Pendiente",
          unidadNegocio: this.model.unidadNegocio,
          idUnidadNegocio: this.model.unidadNegocio,
        };

        this.solicitudes
          .actualizarSolicitud({ ...this.misParams, ...extra })
          .subscribe((response) => {
            console.log("MI MODELO AL ENVIAR ES ESTO: ", this.misParams);
            this.utilService.modalResponse(
              "Datos ingresados correctamente",
              "success"
            );
            setTimeout(() => {
              this.router.navigate(["/solicitudes/consulta-solicitudes"]);
            }, 1800);
            let reqd = {
              idSolicitud: this.misParams.idSolicitud,
              codigo: "string",
              valor: "string",
              estado: "Pendiente",
              compania: this.model.compania,
              unidadNegocio: this.model.unidadNegocio,
              codigoPosicion: this.model.codigoPosicion,
              descripcionPosicion: this.model.descrPosicion,
              areaDepartamento: this.model.departamento,
              localidadZona: this.model.localidad,
              nivelDireccion: this.model.nivelDir,
              centroCosto: this.model.nomCCosto,
              nombreEmpleado: this.model.nombreCompleto,
              subledger: this.model.subledger,
              reportaA: this.model.reportaA,
              nivelReporteA: this.model.nivelRepa,
              supervisaA: this.detalleSolicitud.supervisaA,
              tipoContrato: this.model.tipoContrato,
              departamento: this.model.departamento,
              cargo: this.model.nombreCargo,
              jefeSolicitante: "string",
              responsableRRHH: "string",
              localidad: this.model.localidad,
              fechaIngreso: this.model.fechaIngresogrupo,
              unidad: this.model.unidadNegocio,
              puesto: this.model.descrPuesto,
              jefeInmediatoSuperior: "string",
              jefeReferencia: "string",
              cargoReferencia: "string",
              fechaSalida: "2024-04-25T17:17:34.170Z",
              puestoJefeInmediato: "string",
              subledgerEmpleado: this.model.subledger,
              grupoDePago: "string",
              sucursal: "string",
              movilizacion: "string",
              alimentacion: "string",
              jefeAnteriorJefeReferencia: "string",
              causaSalida: "string",
              nombreJefeSolicitante: "string",
              misionCargo:
                this.model.misionCargo !== undefined
                  ? this.model.misionCargo
                  : "N/A",
              justificacion:
                this.model.justificacion !== undefined
                  ? this.model.justificacion
                  : "N/A",
            };
            console.log("Este es el req enviado a detalle222: ", reqd);
            /*this.solicitudes.guardarDetalleSolicitud(reqd).subscribe((res) => {
              this.utilService.modalResponse(
                "Datos ingresados correctamente",
                "success"
              );
              setTimeout(() => {
                this.router.navigate(
                  [
                    "/solicitudes/completar-solicitud",
                    this.misParams.idInstancia,
                  ],
                  {
                    queryParams: { idInstancia },
                  }
                );
              }, 1800);
            });*/
          });

        /*this.solicitudes
          .guardarSolicitud(this.solicitud)
          .subscribe((response) => {
            console.log("MI MODELO AL ENVIAR ES ESTO: ", this.solicitud);
            this.solicitud.idSolicitud = response.idSolicitud;
            this.solicitud.fechaActualizacion = response.fechaActualizacion;
            this.solicitud.fechaCreacion = response.fechaCreacion;
            this.submitted = true;
            console.log("IDDDDD INSTANCIA: ", this.solicitud.idInstancia);
            let idInstancia = this.solicitud.idInstancia;

            this.utilService.modalResponse(
              `Solicitud registrada correctamente [${idInstancia}]. Será redirigido en un momento...`,
              "success"
            );

            setTimeout(() => {
              this.router.navigate(
                [
                  "/solicitudes/completar-solicitud",
                  this.solicitud.idInstancia,
                ],
                {
                  queryParams: { idInstancia },
                }
              );
            }, 1800);
          });*/
      });
    this.submitted = true;
  }

  override generateVariablesFromFormFields() {
    /*const variables = {
      variables: {
        codigo: { value: "" },
        description: { value: "" },
        importe: { value: 0 },
        observations: { value: new String() },
      },
    };

    variables.variables["codigo"].value = "AAAA";
    variables.variables["description"].value = "BBBB";
    variables.variables["importe"].value = 5000;
    variables.variables["observations"].value = "DDDD";*/

    /*

    {
    "usuarioCreacion": "lnmora",
    "usuarioActualizacion": "lnmora",
    "estado": "Aprobado",
    "idInstancia": "c376953d-fcb6-11ee-ae9a-b05adab33404",
    "idEmpresa": "01",
    "empresa": "Reybanpac",
    "idUnidadNegocio": "01",
    "unidadNegocio": "Lacteos",
    "estadoSolicitud": "1",
    "idTipoSolicitud": 1,
    "idTipoMotivo": 1,
    "idTipoAccion": 1
}

    */

    /*const variables = {
      variables: {
        ...this.solicitud,
      },
    };*/

    // variables.variables["codigo"].value = "AAAA";
    // variables.variables["description"].value = "BBBB";
    // variables.variables["importe"].value = 5000;
    // variables.variables["observations"].value = "DDDD";

    /*

    {
    "usuarioCreacion": "lnmora",
    "usuarioActualizacion": "lnmora",
    "estado": "Aprobado",
    "idInstancia": "c376953d-fcb6-11ee-ae9a-b05adab33404",
    "idEmpresa": "01",
    "empresa": "Reybanpac",
    "idUnidadNegocio": "01",
    "unidadNegocio": "Lacteos",
    "estadoSolicitud": "1",
    "idTipoSolicitud": 1,
    "idTipoMotivo": 1,
    "idTipoAccion": 1
}

    */
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
    variables.descrNivelDir = { value: this.model.descrNivelDir };
    variables.nivelRepa = { value: this.model.nivelRepa };
    variables.sucursal = { value: this.model.sucursal };
    variables.unidadNegocio = { value: this.model.unidadNegocio };
    variables.tipoContrato = { value: this.model.tipoContrato };
    variables.descripContrato = { value: this.model.descripContrato };
    variables.status = { value: this.model.status };
    variables.sueldo = { value: "2000" };
    variables.mensual = { value: "2000" };
    variables.trimestral = { value: "2000" };
    variables.semestral = { value: "2000" };
    variables.anual = { value: "2000" };
    variables.anularSolicitud = { value: "No" };
    variables.codigoPosicion = { value: this.model.codigoPosicion };
    variables.misionCargo = { value: "Mision" };
    variables.justificacion = { value: "Aprobado Nuevo Yes" };
    variables.ruta = { value: "Ruta" };
    variables.nivelDireccion = { value: "nivelDireccion" };

    // tipo_solicitud_descripcion
    // tipo_motivo_descripcion
    /*variables.codigoPosicion = this.model.codigoPosicion; // Todos

    variables.nombreCompleto = this.model.nombreCompleto;
    variables.subledger = this.model.subledger;
    variables.misionCargo = this.model.misionCargo;
    variables.justificacion = this.model.justificacion;*/

    if (this.tipo_solicitud_descripcion === "requisicionPersonal") {
      if (
        this.tipo_motivo_descripcion === "Nuevo" ||
        this.tipo_motivo_descripcion === "Eventual"
      ) {
        variables.codigoPosicion = { value: this.model.codigoPosicion };
        variables.misionCargo = { value: this.model.misionCargo };
        variables.justificacion = { value: this.model.justificacion };
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

  save2() {
    this.solicitudes
      .guardarDetalleSolicitud(this.solicitudes.modelDetalleSolicitud)
      .subscribe((res) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
        setTimeout(() => {
          this.router.navigate(["/solicitudes/completar-solicitudes"], {
            // queryParams: { ...this.solicitud },
          });
        }, 1600);
      });
  }

  onCancel() {
    console.log("User action cancel");
    // mmunoz
    // this.router.navigate(["tasklist/Registrar"], { queryParams: {} });
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
    this.solicitudes
      // .getNivelesAprobacion(
      //   this.solicitud.idTipoSolicitud,
      //   this.solicitud.idTipoMotivo,
      //   this.detalleSolicitud.nivelDireccion
      // )
      .getNivelesAprobacion(1, 1, "TA")
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
  }
}
