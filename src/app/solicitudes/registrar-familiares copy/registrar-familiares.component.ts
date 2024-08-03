import {
	HttpClientModule,
	HttpErrorResponse
} from "@angular/common/http";
import {
	Component,
	SimpleChange,
	Type
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject } from "rxjs";
import {
	debounceTime,
	distinctUntilChanged,
	map
} from "rxjs/operators";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { TableService } from "src/app/component/table/table.service";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { IEmpleadoData } from "src/app/services/mantenimiento/empleado.interface";
import {
	FamiliaresCandidatos,
	MantenimientoService,
} from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { StarterService } from "src/app/starter/starter.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import Swal from "sweetalert2";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { DialogBuscarEmpleadosFamiliaresComponent } from "./dialog-buscar-empleados-familiares/dialog-buscar-empleados-familiares.component";
import {
	columnsDatosFamiliares
} from "./registrar-familiares.data";

interface DialogComponents {
  dialogBuscarEmpleados: Type<DialogBuscarEmpleadosFamiliaresComponent>;
  dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

const dialogComponentList: DialogComponents = {
  dialogBuscarEmpleados: DialogBuscarEmpleadosFamiliaresComponent,
  dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

@Component({
  selector: "registrarFamiliares",
  templateUrl: "./registrar-familiares.component.html",
  styleUrls: ["./registrar-familiares.component.scss"],
  providers: [CamundaRestService, HttpClientModule],
  exportAs: "registrarFamiliares",
})
export class RegistrarFamiliaresComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  selectedOption: string = "No";
  columnsDatosFamiliares = columnsDatosFamiliares.columns;
  dataTableDatosFamiliares: FamiliaresCandidatos[] = [];

  public inputsEditRow: IInputsComponent = [
    {
      id: "parentesco",
      label: "parentezco",
      type: "string",
      required: true,
    },
  ];

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

  emailVariables = {
    de: "",
    password: "",
    alias: "",
    para: "",
    asunto: "",
    cuerpo: ""
  };

  private detalleNivelAprobacion: any[] = [];

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
  public primerNivelAprobacion: string="";


  public loadingComplete = 0;
  public tareasPorCompletar: any;
  public aprobacion: any;


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
    private modalService: NgbModal,
    private tableService: TableService,
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
      console.log("this.idDeInstancia: ", this.idDeInstancia);
    });
  }

  onSelectionChange() {
    console.log(this.selectedOption);
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
        this.idDeInstancia = params["id"];
        // this.camundaRestService.getTask(environment.taskType_CF, params["id"])
        this.solicitudes.getTaskId(this.idDeInstancia).subscribe({
          next: (result) => {
            this.tareasPorCompletar = result.filter((empleado) => {
              return empleado["deleteReason"] === null;
            });
            if(this.tareasPorCompletar.length === 0){
              return;
            }else{
            this.uniqueTaskId = this.tareasPorCompletar[0].id;
            this.taskType_Activity = this.tareasPorCompletar[0].taskDefinitionKey;
            this.nameTask = this.tareasPorCompletar[0].name;
            }        
            this.taskId = params["id"];
            // this.getDetalleSolicitudById(this.id_solicitud_by_params); // Si se comenta, causa problemas al abrir el Sweet Alert 2
            this.getSolicitudById(this.id_solicitud_by_params);
            this.date = this.tareasPorCompletar[0].startTime;
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

  obtenerAprobacionesPorPosicion() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.codigoPosicion,
        this.model.nivelDir,
        "A"
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

  obtenerAprobacionesPorPosicionAPS() {
    return this.solicitudes
      .obtenerAprobacionesPorPosicion(
        this.solicitud.idTipoSolicitud,
        this.solicitud.idTipoMotivo,
        this.model.codigoPosicion,
        this.model.nivelDir,
        "APS"
      )
      .subscribe({
        next: (response) => {
          this.dataTipoRuta.length = 0;
          this.dataRuta.length = 0;
          this.dataAprobacionesPorPosicionAPS = response.nivelAprobacionPosicionType;
          this.dataAprobacionesPorPosicionAPS.forEach((item) => {
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
        this.model.nivelDir,
        "APD"
      )
      .subscribe({
        next: (response) => {
          this.dataAprobadoresDinamicos.length = 0;
          this.dataAprobacionesPorPosicionAPS =
            response.nivelAprobacionPosicionType;
            this.primerNivelAprobacion=response.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
          this.dataAprobacionesPorPosicionAPS.forEach((item) => {
            this.dataAprobadoresDinamicos.push(item.aprobador.nivelDireccion);
            console.log("Aprobaciones APD = ", item.aprobador);
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
      console.log("ESTE MODELO SE ASIGNA: ", this.model);
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
      }); // comentado por pruebas mmunoz
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
      await this.loadDataCamunda();

      await this.obtenerServicioFamiliaresCandidatos({
        idSolicitud: this.id_solicitud_by_params,
      });

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

        this.loadingComplete += 2;
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
          this.model.sueldoMensual =
            this.detalleSolicitud.sueldoVariableMensual;
          this.model.sueldoTrimestral =
            this.detalleSolicitud.sueldoVariableTrimestral;
          this.model.sueldoSemestral =
            this.detalleSolicitud.sueldoVariableSemestral;
          this.model.sueldoAnual = this.detalleSolicitud.sueldoVariableAnual;
          this.model.correo = this.detalleSolicitud.correo;
          this.model.fechaIngreso = this.detalleSolicitud.fechaIngreso;
        }

        this.loadingComplete++;

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

          let variables = this.generateVariablesFromFormFields();
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

  guardarServicioFamiliaresCanidatos() {
    let requestFamiliares: FamiliaresCandidatos = {
      idSolicitud: "string",
      codigoPosicion: "string",
      codigoPosicionPadre: "",
      idSolicitudPadre: "",
      descripcionPosicion: "string",
      nombreEmpleado: "string",
      subledger: "string",
      cargo: "string",
      unidad: "string",
      codigoPosicionReportaA: "string",
      reportaA: "string",
      departamento: "string",
      localidad: "string",
      parentesco: "string",
      estado: "string",
      usuarioCreacion: "string",
      usuarioModificacion: "string",
      fechaCreacion: "2024-06-11T10:06:39.005Z",
      fechaModificacion: "2024-06-11T10:06:39.005Z",
    };

    this.mantenimientoService
      .guardarFamiliaresCandidato(requestFamiliares)
      .subscribe((response) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
      });
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

    this.solicitud.empresa = this.model.idEmpresa;
    this.solicitud.idEmpresa = this.model.idEmpresa;

    this.solicitud.unidadNegocio = this.model.unidadNegocio;
    this.solicitud.idUnidadNegocio = this.model.unidadNegocio;
    this.solicitud.estadoSolicitud = "2";
    console.log("this.solicitud: ", this.solicitud);
    this.solicitudes
      .actualizarSolicitud(this.solicitud)
      .subscribe((responseSolicitud) => {
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

        this.detalleSolicitud.misionCargo =
          this.model.misionCargo == "" ||
            this.model.misionCargo == undefined ||
            this.model.misionCargo == null
            ? ""
            : this.model.misionCargo;
        this.detalleSolicitud.justificacion =
          this.model.justificacionCargo == "" ||
            this.model.justificacionCargo == undefined ||
            this.model.justificacionCargo == null
            ? ""
            : this.model.justificacionCargo;
        this.detalleSolicitud.sueldo = this.model.sueldo;
        this.detalleSolicitud.sueldoVariableMensual = this.model.sueldoMensual;
        this.detalleSolicitud.sueldoVariableTrimestral =
          this.model.sueldoTrimestral;
        this.detalleSolicitud.sueldoVariableSemestral =
          this.model.sueldoSemestral;
        this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
        this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
        this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

        this.detalleSolicitud.correo = this.model.correo;

        this.detalleSolicitud.supervisaA = this.model.supervisaA;

        this.detalleSolicitud.fechaIngreso =
          this.model.fechaIngresogrupo == ""
            ? this.model.fechaIngreso
            : this.model.fechaIngresogrupo;

        console.log(
          "ESTO LE MANDO AL ACTUALIZAR this.detalleSolicitud: ",
          this.detalleSolicitud,
          this.model
        );

        this.solicitudes
          .actualizarDetalleSolicitud(this.detalleSolicitud)
          .subscribe((responseDetalle) => {
            console.log("responseDetalle: ", responseDetalle);

            this.utilService.closeLoadingSpinner(); //comentado mmunoz
            this.utilService.modalResponse(
              "Datos ingresados correctamente",
              "success"
            );

            console.log(
              "CON ESTO COMPLETO (this.uniqueTaskId): ",
              this.uniqueTaskId
            );

            console.log("AQUI HAY UN IDDEINSTANCIA?: ", this.idDeInstancia);

            setTimeout(() => {
              this.router.navigate(["/tareas/consulta-tareas"]);
            }, 1800);
          });
      }); //aqui debe crear los aprobadores
    this.submitted = true;
  }

  consultarNextTaskAprobador(IdSolicitud: string) {
    this.consultaTareasService.getTaskId(IdSolicitud)
      .subscribe((tarea) => {
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
                this.solicitudes
                .obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.model.nivelDir, 'APS')
                .subscribe({
                  next: (responseAPS) => {
                    this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));
                    if (aprobadoractual !== undefined) {
                      console.log( this.dataAprobacionesPorPosicionAPS);
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
                        next: () => {
                        },
                        error: (err) => {
                          console.error(err);
                        }
                      });
                    }else{

                      console.log(this.taskType_Activity);
        
                      if (this.taskType_Activity == environment.taskType_RRHH
                        || this.taskType_Activity == environment.taskType_CF_RRHH
                        || this.taskType_Activity == environment.taskType_AP_RRHH
                        || this.taskType_Activity == environment.taskType_RG_RRHH
        
                      ) { //GERENTE RECURSOS HUMANOS
                        aprobadoractual="RRHH";
                      } else{
                        aprobadoractual="REMUNERA";
                      }
                    }
                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));

                    const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
        
                    const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
        
                    this.emailVariables = {
                      de: "emisor",
                      para: this.aprobacion.aprobador.correo,
                      // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                      alias: "Notificación 1",
                      asunto: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
                      cuerpo: modifiedHtmlString,
                      password: "password"
                    };
                    this.solicitudes.sendEmail(this.emailVariables).subscribe({
                      next: () => {
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                  }
                });
          }
        });
      });
  }

  mapearDetallesAprobadores(nivelAprobacionPosicionType: any[]) {
    this.starterService.getUser(localStorage.getItem(LocalStorageKeys.IdUsuario)).subscribe({
      next: (res) => {
        this.detalleNivelAprobacion = nivelAprobacionPosicionType.map(({ nivelAprobacionType, aprobador }, index) => ({
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
          estadoAprobacion: nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes(this.primerNivelAprobacion.toUpperCase()) ? "PorRevisar" :  nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("RRHH") ? "PorRevisarRRHH" : (nivelAprobacionType.idNivelAprobacionRuta.toUpperCase().includes("REMUNERA") ? "PorRevisarRemuneraciones" : "PendienteAsignacion"),
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

  onCompletar() {
    if (this.uniqueTaskId === null) {
      this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

      return;
    }

    this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");

    let variables = this.generateVariablesFromFormFields();

    this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
      next: (res) => {
        this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
          next: (res) => {
            this.solicitud.empresa = this.model.idEmpresa;
            this.solicitud.idEmpresa = this.model.idEmpresa;
            this.solicitud.unidadNegocio = this.model.unidadNegocio;
            this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

            this.solicitud.estadoSolicitud === "No" ? "4" : "AN";

            console.log("this.solicitud: ", this.solicitud);
            this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
              next: (responseSolicitud) => {
                setTimeout(() => {
                //  this.consultarNextTaskAprobador(this.solicitud.idInstancia);

                  this.solicitudes.sendEmail(this.emailVariables).subscribe({
                    next: () => {
                    },
                    error: (error) => {
                      console.error(error);
                    }
                  });

                  this.utilService.closeLoadingSpinner();

                  this.utilService.modalResponse(`Solicitud registrada correctamente [${this.solicitud.idSolicitud}]. Será redirigido en un momento...`, "success");

                  setTimeout(() => {
                    this.router.navigate([
                      "/tareas/consulta-tareas",
                    ]);
                  }, 1800);
                }, 3000);
              },
              error: (err) => {
                console.error(err);
              }
            });

            this.utilService.closeLoadingSpinner();

            this.utilService.modalResponse(`Solicitud registrada correctamente [${this.idDeInstancia}]. Será redirigido en un momento...`, "success");

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
      }
    });

    this.submitted = true;
  }

  recorrerArreglo() {
    this.keySelected =
      this.solicitud.idTipoSolicitud +
      "_" +
      this.solicitud.idTipoMotivo +
      "_" +
      this.model.nivelDir;

    console.log(
      `Elemento en la posición Miguel1 ${this.keySelected}:`,
      this.dataAprobacionesPorPosicion
    );

    for (const key in this.dataAprobacionesPorPosicion) {
      if (this.dataAprobacionesPorPosicion.hasOwnProperty(key)) {
        console.log(`Clave: ${key}`);
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
        console.log("Segundo servicio completado:", res);

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

  // override generateVariablesFromFormFields() {
  //   let variables: any = {};

  //   this.crearRegistradorSolicitud();

  //   if (this.tipo_solicitud_descripcion.toUpperCase().includes("REQUISICION") || this.solicitud.tipoSolicitud.toUpperCase().includes("REQUISICIÓN")) {
  //     if (this.taskType_Activity == environment.taskType_CF) {
  //       variables.codigoPosicion = { value: this.model.codigoPosicion };
  //       variables.misionCargo = { value: this.model.misionCargo };
  //       variables.justificacionCargo = { value: this.model.justificacionCargo };
  //       variables.empresa = { value: this.model.compania };
  //       variables.unidadNegocio = { value: this.model.unidadNegocio };
  //       variables.descripcionPosicion = { value: this.model.descrPosicion };
  //       variables.areaDepartamento = { value: this.model.departamento };
  //       variables.localidadZona = { value: this.model.localidad };
  //       variables.centroCosto = { value: this.model.nomCCosto };
  //       variables.reportaa = { value: this.model.reportaA };
  //       variables.nivelReportea = { value: this.model.nivelRepa };
  //       variables.supervisa = { value: this.model.supervisaA };
  //       variables.tipoContrato = { value: this.model.tipoContrato };
  //       variables.sueldo = { value: this.model.sueldo };
  //       variables.sueldoMensual = { value: this.model.sueldoMensual };
  //       variables.sueldoTrimestral = { value: this.model.sueldoTrimestral };
  //       variables.sueldoSemestral = { value: this.model.sueldoSemestral };
  //       variables.sueldoAnual = { value: this.model.sueldoAnual };
  //       variables.anularSolicitud = { value: this.selectedOption };
  //       variables.comentariosAnulacion = {
  //         value: this.model.comentariosAnulacion,
  //       };
  //       variables.nivelDireccion = { value: this.model.nivelDir };
  //       variables.tipoRuta = {
  //         //value: ["Unidades","Unidades", "Aprobadores Fijos", "Aprobadores Fijos"],
  //         value: this.dataTipoRuta,
  //         type: "String",
  //         valueInfo: {
  //           objectTypeName: "java.util.ArrayList",
  //           serializationDataFormat: "application/json",
  //         },
  //       };
  //       variables.ruta = {
  //         // value : ["2doNivelAprobacion", "3erNivelAprobacion", "Remuneraciones"],
  //         value: this.dataRuta,
  //         type: "String",
  //         valueInfo: {
  //           objectTypeName: "java.util.ArrayList",
  //           serializationDataFormat: "application/json",
  //         },
  //       };

  //       variables.resultadoRutaAprobacion = {
  //         //value : "[\"Gerencia Media\", \"Gerencia de Unidad o Corporativa\"]",
  //         value: JSON.stringify(this.dataAprobadoresDinamicos),
  //         type: "Object",
  //         valueInfo: {
  //           objectTypeName: "java.util.ArrayList",
  //           serializationDataFormat: "application/json",
  //         },
  //       };
  //     }

  //     if (this.taskType_Activity == environment.taskType_CompletarRequisicion) {
  //       variables.atencionCompletarRequisicion = { value: "aprobar" };
  //     }
  //   }

  //   return { variables };
  // }

  override generateVariablesFromFormFields() {
    let variables: any = {};

    if (this.taskType_Activity == environment.taskType_CF) {
      this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
        if (index === 0) {
          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

          this.emailVariables = {
            de: this.solicitudes.modelDetalleAprobaciones.correo,
            para: elemento.aprobador.correo,
            // alias: this.solicitudes.modelDetalleAprobaciones.correo,
            alias: "Notificación 1",
            asunto: `Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
            cuerpo: modifiedHtmlString,
            password: "p4$$w0rd"
          };
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
        value: this.solicitud.idSolicitud
      };
      variables.tipoSolicitud = {
        value: this.solicitud.tipoSolicitud
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
    // mmunoz
    // this.router.navigate(["tasklist/Registrar"], { queryParams: {} });
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
    if (this.detalleSolicitud.codigoPosicion !== "" && this.detalleSolicitud.codigoPosicion !== undefined && this.detalleSolicitud.codigoPosicion != null) {
      this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.detalleSolicitud.codigoPosicion, this.detalleSolicitud.nivelDireccion, 'A').subscribe({
        next: (response) => {
          this.solicitudes
          .obtenerAprobacionesPorPosicion(
            this.solicitud.idTipoSolicitud,
            this.solicitud.idTipoMotivo,
            this.model.codigoPosicion,
            this.model.nivelDir, 'APD'
          )
          .subscribe({
            next: (responseAPD) => {
                this.primerNivelAprobacion=responseAPD.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
                this.mapearDetallesAprobadores(response.nivelAprobacionPosicionType);
    
              },
            error: (error: HttpErrorResponse) => {
              this.utilService.modalResponse(
                "No existe aprobadores de solicitud para los datos ingresados",
                "error"
              );
            }
          });
          this.dataAprobacionesPorPosicion[this.keySelected] = response.nivelAprobacionPosicionType;
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
    if (
      this.detalleSolicitud.codigoPosicion !== "" &&
      this.detalleSolicitud.codigoPosicion !== undefined &&
      this.detalleSolicitud.codigoPosicion != null
    ) {
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

                  console.log(`Elemento en la posición`, eachData);
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
      .guardarDetallesAprobacionesSolicitud(
        this.solicitudes.modelDetalleAprobaciones
      )
      .subscribe((res) => { });
  }

  indexedModal: Record<keyof DialogComponents, any> = {
    dialogBuscarEmpleados: () => this.openModalBuscarEmpleado(),
    dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
  };

  openModal(component: keyof DialogComponents) {
    this.indexedModal[component]();
  }

  openModalBuscarEmpleado() {
    this.modalService
      .open(dialogComponentList.dialogBuscarEmpleados, {
        ariaLabelledBy: "modal-title",
      })
      .result.then(
        (result) => {
          if (result?.action === "close") {
            return;
          }

          if (result?.data) {
            const data: IEmpleadoData = result.data;

            const dtoFamiliares: FamiliaresCandidatos = {
              idSolicitud: this.id_solicitud_by_params,
              nombreEmpleado: data.nombreCompleto,
              // fechaCreacion: new Date(data.fechaIngresogrupo) ?? new Date(),
              fechaCreacion: new Date(),
              cargo: data.nombreCargo,
              unidad: data.unidadNegocio,
              departamento: data.departamento,
              localidad: data.localidad,
              parentesco: "",
              codigoPosicion: data.codigoPosicion,
              fechaModificacion: new Date(),
              descripcionPosicion: data.descrPosicion,
              subledger: data.subledger,
              estado: "A",
              usuarioCreacion: this.solicitud.usuarioCreacion,
              usuarioModificacion: this.solicitud.usuarioActualizacion
            };

            /*
            {
              "codigoPosicionPadre": "string",
              "idSolicitudPadre": "string",
              "descripcionPosicion": "string",
              "codigoPosicionReportaA": "string",
              "reportaA": "string",

              "subledger": "string",
              "estado": "string",

              "codigoPosicion": "string",
              "idSolicitud": "string",
              "nombreEmpleado": "string",
              "cargo": "string",
              "unidad": "string",
              "departamento": "string",
              "localidad": "string",
              "parentesco": "string",
              "usuarioCreacion": "string",
              "usuarioModificacion": "string",
              "fechaCreacion": "2024-07-01T14:19:35.838Z",
              "fechaModificacion": "2024-07-01T14:19:35.838Z"
            }
            */

            this.mantenimientoService
              .guardarFamiliaresCandidato(dtoFamiliares)
              .subscribe({
                next: (response) => {
                  console.log(
                    "guardarFamiliaresCandidato:",
                    dtoFamiliares,
                    response
                  );
                  this.addNewRow(dtoFamiliares);
                  this.utilService.modalResponse(
                    "Familiar ingresado correctamente",
                    "success"
                  );
                },
                error: (err) => {
                  console.error(err);
                }
              });
          }
        },
        (reason) => {
          console.log(`Dismissed with: ${reason}`);
        }
      );
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
                this.router.navigate(["/mantenedores/reasignar-tareas-usuarios"]);
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

  /*Inicio de Funciones para la tabla de familiares*/
  public originalData = [];

  public ngOnChange(changes: SimpleChange): void {
    this.originalData = this.formatDataWithKeyNameTable(this.originalData);
  }

  public addNewRow(obj: any) {
    const newRow = {
      id: this.dataTableDatosFamiliares.length + 1,
      ...obj,
      isEditingRow: false,
    };

    this.dataTableDatosFamiliares = [...this.dataTableDatosFamiliares, newRow];
  }

  public onSaveRowTable(rowData: any, finishedClonningRow: boolean) {
    if (finishedClonningRow) {
      // Se está guardando una nueva fila
      this.dataTableDatosFamiliares.push(rowData);
    } else {
      // Se está guardando una fila modificada
      const index = this.dataTableDatosFamiliares.findIndex(
        (row) => row.nombreEmpleado === rowData.nombreEmpleado
      );
      if (index !== -1) {
        this.dataTableDatosFamiliares[index] = rowData;
      }
    }
  }

  private formatDataWithKeyNameTable(data: any[]): any[] {
    return this.tableService.formatDataToTable(data, "key");
  }

  handleChangeSort(column: any) {
    // console.log('Change sort:', column);
    //!Logica para cambiar orden se haga true la prop sortActive
    //*Si se quiere ordenar
  }

  handleSaveRowData(row: any) {
    this.updateRowData({
      ...row,
      estado: "A"
    });
  }

  async handleActionClick(event: any) {
    // console.log('Action click:', event);
    const { index, action } = event;

    switch (action) {
      case "editOnTable":
        console.log("EDITAR");
        this.startEditingRow(index);
        break;
      case "delete":
        console.log("ELIMINAR");
        this.dataTableDatosFamiliares[index].estado = "I";
        await this.mantenimientoService
          .putFamiliaresCandidatos(this.dataTableDatosFamiliares[index])
          .subscribe((response) => {
            console.log("response", response);
            this.utilService.modalResponse(
              "Familiar eliminado correctamente",
              "success"
            );
          });

        this.dataTableDatosFamiliares = this.dataTableDatosFamiliares.filter(
          (row) => row.estado !== "I"
        );
        break;
      default:
        console.log("Opcion no definida");
        break;
    }
  }

  startEditingRow(index) {
    // this.dataTableDatosFamiliares[index].isEditingRow = true;
    this.dataTableDatosFamiliares = this.dataTableDatosFamiliares.map(
      (row, indexRow) => {
        if (indexRow === index) {
          row.isEditingRow = true;
        }
        return row;
      }
    );
  }

  updateRowData(updatedRow: any) {
    this.mantenimientoService.putFamiliaresCandidatos(updatedRow).subscribe({
      next: () => {
        this.dataTableDatosFamiliares = this.dataTableDatosFamiliares.map((row) => {
          if (row.subledger === updatedRow.subledger) {
            return updatedRow;
          }
          return row;
        });
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          text: "No se pudo actualizar el registro",
          icon: "warning",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Ok"
        });
      }
    });
  }
}
