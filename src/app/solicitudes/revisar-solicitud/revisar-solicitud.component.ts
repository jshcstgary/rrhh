import {
  HttpClientModule,
  HttpErrorResponse
} from "@angular/common/http";
import { Component, Type } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map
} from "rxjs/operators";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { DatosAprobadores } from "src/app/eschemas/DatosAprobadores";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { IEmpleadoData } from "src/app/services/mantenimiento/empleado.interface";
import { FamiliaresCandidatos, MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { columnsDatosFamiliares } from "src/app/solicitudes/revisar-solicitud/registrar-familiares.data";
import { StarterService } from "src/app/starter/starter.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { Permiso } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { RegistrarCandidatoService } from "../registrar-candidato/registrar-candidato.service";
import { DialogBuscarEmpleadosFamiliaresComponent } from "../registrar-familiares/dialog-buscar-empleados-familiares/dialog-buscar-empleados-familiares.component";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { ComentarioSalidaJefeService } from './comentario-salida-jefe.service';
import { addDays } from "date-fns";

interface DialogComponents {
  dialogBuscarEmpleados: Type<DialogBuscarEmpleadosFamiliaresComponent>;
  dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}


const dialogComponentList: DialogComponents = {
  dialogBuscarEmpleados: DialogBuscarEmpleadosFamiliaresComponent,
  dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

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
  viewInputs: boolean = false;
  campoObligatorio: string = '';
  observaciontexto: string = 'Observación';
  selectedDate: Date = new Date();
  datosAprobadores: DatosAprobadores = new DatosAprobadores();
  //buttonValue: string = '';

  buttonValue: string | null = 'aprobar';
  columnsDatosFamiliares = columnsDatosFamiliares.columns;
  dataTableDatosFamiliares: FamiliaresCandidatos[] = [];
  currentDate: Date = new Date();

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

  checkTipoSolicitud(): void { }
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
  public detalleSolicitudPropuestos = new DetalleSolicitud();
  public aprobacion: any;

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
  public justificacionCF: string = "";
  public mostrarRequisicion: boolean = false;
  public mostrarFormularioFamiliares: boolean = false;
  public mostrarFormularioReingreso: boolean = false;
  public mostrarAccionPersonal: boolean = false;
  public keySelected: any;
  public detalleSolicitudRG = new DetalleSolicitud();
  public remuneracion: number;
  public dataAprobadoresDinamicos: any[] = [];
  public dataAprobacionesPorPosicionAPS: any = [];
  public dataRuta: any[] = [];
  public dataTipoRuta: any[] = [];
  public detalleSolicitud = new DetalleSolicitud();
  public comentariosJefeInmediato: any = {};
  public comentarios: string = "";
  public comentariosRRHH: any = {};
  public Comentario_Jefe_Solicitante: any = {};

  public solicitudRG: any;


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

  public dataEmpleadoEvolution: any[] = [];

  public success: false;
  public params: any;
  public id_edit: undefined | string;
  public existeMatenedores: boolean = false;
  public existe: boolean = false;


  public id_solicitud_by_params: any;

  public dataNivelDireccion: any[] = [];
  public suggestions: string[] = [];

  public idDeInstancia: any;

  public loadingComplete = 0;

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];
  nombreCompletoCandidato: string = "";
  idSolicitudRP: string = "";
  causaSalida: string = "";

  public minDateValidation = new Date();
  public maxDateValidation = addDays(new Date(), 365);
  public tareasPorCompletar: any;


  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService,
    private seleccionCandidatoService: RegistrarCandidatoService,
    private comentarioSalidaJefeService: ComentarioSalidaJefeService,
    private starterService: StarterService,
    private modalService: NgbModal

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

    this.verifyData();
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

    modelRef.componentInstance.idParam = this.id_solicitud_by_params;
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

  indexedModal: Record<keyof DialogComponents, any> = {
    dialogBuscarEmpleados: () => this.openModalBuscarEmpleado(),
    dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
  };

  openModal(component: keyof DialogComponents) {
    this.indexedModal[component]();
  }
  private verifyData(): void {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    try {
      this.starterService.getUser(localStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
        next: (res) => {
          return this.consultaTareasService.getTareasUsuario(res.evType[0].subledger).subscribe({
            next: async (response) => {
              this.existe = response.solicitudes.some(({ idSolicitud, rootProcInstId }) => idSolicitud === this.id_solicitud_by_params && rootProcInstId === this.idDeInstancia);

              const permisos: Permiso[] = JSON.parse(localStorage.getItem(LocalStorageKeys.Permisos)!);

              this.existeMatenedores = permisos.some(permiso => permiso.codigo === PageCodes.AprobadorFijo);

              if (this.existe || this.existeMatenedores) {
                await this.loadDataCamunda();
                await this.obtenerServicioFamiliaresCandidatos({
                  idSolicitud: this.id_solicitud_by_params,
                });

                this.utilService.closeLoadingSpinner();
                this.checkTipoSolicitud();
              } else {
                this.utilService.closeLoadingSpinner();

                await Swal.fire({
                  text: "Usuario no asignado",
                  icon: "info",
                  confirmButtonColor: "rgb(227, 199, 22)"
                });

                this.router.navigate(["/solicitudes/consulta-solicitudes"]);
              }
            },
            error: (error: HttpErrorResponse) => {
              this.utilService.closeLoadingSpinner();

              this.utilService.modalResponse(error.error, "error");
            },
          });
        }
      });
    } catch (error) {
      this.utilService.modalResponse(error.error, "error");
    }
  }

  getCandidatoValues() {
    this.seleccionCandidatoService.getCandidatoById(this.id_solicitud_by_params).subscribe({
      next: (res) => {
        const candidatoValues = res.seleccionCandidatoType[0];

        this.nombreCompletoCandidato = res.seleccionCandidatoType[0].candidato;
        this.idSolicitudRP = res.seleccionCandidatoType[0].iD_SOLICITUD;

        if (this.id_solicitud_by_params.toUpperCase().includes("RG")) {
          this.getSolicitudById(this.idSolicitudRP);
          this.getSolicitudById(this.id_solicitud_by_params);
        } else {
          this.getSolicitudById(this.id_solicitud_by_params);
        }
      },
      error: (err) => {
        console.log(console.log(err));
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
        if (this.id_solicitud_by_params.toUpperCase().includes("RG") || this.id_solicitud_by_params.toUpperCase().includes("CF")) {

          this.getCandidatoValues();
        } else {
          this.getSolicitudById(this.id_solicitud_by_params);
        }
        if (this.nameTask !== "Registrar solicitud") {
          this.RegistrarsolicitudCompletada = false;
        }

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
  modelRemuneracion: number = 0;


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
    // this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    // try {
    //   await this.loadDataCamunda();
    //   await this.obtenerServicioFamiliaresCandidatos({
    //     idSolicitud: this.id_solicitud_by_params,
    //   });

    //   this.utilService.closeLoadingSpinner();
    //   this.checkTipoSolicitud();
    // } catch (error) {
    //   this.utilService.modalResponse(error.error, "error");
    // }
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
        if(id.includes("RG")){
          this.solicitudRG = response;
        }else{
          this.solicitud = response;
        }
        this.mostrarRequisicion = this.id_solicitud_by_params.includes("RP-");
        this.mostrarFormularioFamiliares = this.id_solicitud_by_params.includes("CF-");
        this.mostrarFormularioReingreso = this.id_solicitud_by_params.includes("RG-");
        this.mostrarAccionPersonal = this.id_solicitud_by_params.includes("AP-");
        this.loadingComplete += 2;
        this.getDetalleSolicitudById(id);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
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
  totalRegistrosDetallesolicitud: number = 0;

  getDetalleSolicitudById(id: any) {
    return this.solicitudes.getDetalleSolicitudById(id).subscribe({
      next: (response: any) => {

        this.viewInputs = response.detalleSolicitudType[0].codigo === "100" ? false : true;

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
          if (detalleActual.valor.includes("Solicitud en Espera")) {
            this.isFechaMaximaVisible = true;
            this.textareaContent = detalleActual.valor;
            this.selectedDate = detalleActual.fechaSalida;
          }

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
            if (detallePropuestos.valor.includes("Solicitud en Espera")) {
              this.isFechaMaximaVisible = true;
              this.textareaContent = detallePropuestos.valor;
              this.selectedDate = detallePropuestos.fechaSalida;
            }
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

            if (this.detalleSolicitud.valor.includes("Solicitud en Espera")) {
              this.isFechaMaximaVisible = true;
              this.textareaContent = this.detalleSolicitud.valor;
              this.selectedDate = new Date(this.detalleSolicitud.fechaSalida);
            }
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
              if (this.detalleSolicitudRG.valor.includes("Solicitud en Espera")) {
                this.isFechaMaximaVisible = true;
                this.textareaContent = this.detalleSolicitudRG.valor;
                this.selectedDate = new Date(this.detalleSolicitudRG.fechaSalida);
              }
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
                this.date = this.tareasPorCompletar[0].startTime;
                this.ObtenerNivelAprobadorTask();

              }
            }
          });

        }
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
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
    this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

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

    this.solicitudes.actualizarSolicitud(this.solicitud).subscribe(() => {
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
      this.detalleSolicitud.sueldoVariableMensual = this.model.sueldoMensual;
      this.detalleSolicitud.sueldoVariableTrimestral = this.model.sueldoTrimestral;
      this.detalleSolicitud.sueldoVariableSemestral = this.model.sueldoSemestral;
      this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
      this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
      this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

      this.detalleSolicitud.correo = this.model.correo;

      this.detalleSolicitud.supervisaA = this.model.supervisaA;

      this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo == "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;

      this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe((responseDetalle) => {
        this.utilService.closeLoadingSpinner();

        this.utilService.modalResponse("Datos ingresados correctamente", "success");

        setTimeout(() => {
          this.router.navigate(["/tareas/consulta-tareas"]);
        }, 1800);
      });
    });

    this.submitted = true;
  }

  async onCompletar() { //completar tarea mmunoz
    const { isConfirmed } = await Swal.fire({
      text: `¿Desea ${this.buttonValue === "esperar" ? `guardar la solicitud ${this.id_solicitud_by_params} en estado de espera` : `${this.buttonValue} la solicitud ${this.id_solicitud_by_params}`}?`,
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
          this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = this.buttonValue;
          this.solicitudes.modelDetalleAprobaciones.comentario = this.textareaContent;
          this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
            next: (res) => {
            }
          });
          if(this.id_solicitud_by_params.includes("RG")){
            this.solicitud = this.solicitudRG;
          }
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

            case 'enEspera':
              this.solicitud.estadoSolicitud = "2";//En espera
  
              break;

            default:
          }
          this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
            next: () => {
              setTimeout(() => {

                if(this.solicitud.estadoSolicitud.includes("4"))//ESTADO APROBADO
                {
                this.consultarNextTaskAprobador(this.solicitud.idInstancia);
                }else if(this.solicitud.estadoSolicitud.includes("2"))//ESTADO ESPERA
                {
                  this.solicitudes
                  .obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params)
                   .subscribe({
                    next: (responseAPS) => {

                      this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                      this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD"));
                      if(this.id_solicitud_by_params.includes("RG")){
                        const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} se cambio a estado en Espera con la fecha maxima {FECHA_MAXIMA_ESPERA}<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                       
                        const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace("{FECHA_MAXIMA_ESPERA}", this.selectedDate.toISOString()).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.id_solicitud_by_params}`);
            
                        this.emailVariables = {
                          de: "emisor",
                          para: this.aprobacion.aprobador.correo,
                          // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                          alias: "Notificación 1",
                          asunto: `Solicitud en Estado en Espera - ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
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
                      }else{
                        const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} se cambio a estado en Espera con la fecha maxima {FECHA_MAXIMA_ESPERA}<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                       
                        const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace("{FECHA_MAXIMA_ESPERA}", this.selectedDate.toISOString()).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.id_solicitud_by_params}`);
            
                        this.emailVariables = {
                          de: "emisor",
                          para: this.aprobacion.aprobador.correo,
                          // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                          alias: "Notificación 1",
                          asunto: `Solicitud en Estado en Espera - ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
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
                    }});
                 
                  }else if(this.solicitud.estadoSolicitud.includes("DV"))//ESTADO DEVUELTO
                  {
                    this.solicitudes
                    .obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params)
                     .subscribe({
                      next: (responseAPS) => {
                        this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                        this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD"));
                        if(this.id_solicitud_by_params.includes("RG")){
                          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>Se le informa que ha sido devuelta la solucitud {ID_SOLICITUD} - {TIPO_SOLICITUD} <\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                         
                          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
              
                          this.emailVariables = {
                            de: "emisor",
                            para: this.aprobacion.aprobador.correo,
                            // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                            alias: "Notificación 1",
                            asunto: `Notificación por devolución de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
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
                        }else{
                          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>Se le informa que ha sido devuelta la solucitud {ID_SOLICITUD} - {TIPO_SOLICITUD} <\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                         
                          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace("{FECHA_MAXIMA_ESPERA}", this.selectedDate.toISOString()).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
              
                          this.emailVariables = {
                            de: "emisor",
                            para: this.aprobacion.aprobador.correo,
                            // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                            alias: "Notificación 1",
                            asunto: `Notificación por devolución de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
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
                      }});
                   
                    }else if(this.solicitud.estadoSolicitud.includes("5"))//ESTADO CANCELADO
                    {
                     if(this.id_solicitud_by_params.includes("RG")||this.id_solicitud_by_params.includes("CF"))
                      {
                        this.seleccionCandidatoService.deleteCandidatoById(this.idSolicitudRP).subscribe({
                          next: (res) => {
                          }});
                      }
                        this.solicitudes
                      .obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params)
                       .subscribe({
                        next: (responseAPS) => {
                          this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                          this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes("REGISTRARSOLICITUD"));
                          if(this.id_solicitud_by_params.includes("RG")){
                            const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>Se le informa que ha sido rechazada la solucitud {ID_SOLICITUD} - {TIPO_SOLICITUD} <\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                           
                            const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
                
                            this.emailVariables = {
                              de: "emisor",
                              para: this.aprobacion.aprobador.correo,
                              // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                              alias: "Notificación 1",
                              asunto: `Notificación por rechazo de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
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
                          }else{
                            const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimados<\/h2>\r\n  <h3>APROBADORES<\/h3>\r\n\r\n  <P>Se le informa que ha sido rechazada la solucitud {ID_SOLICITUD} - {TIPO_SOLICITUD} <\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
                           
                            const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace("{FECHA_MAXIMA_ESPERA}", this.selectedDate.toISOString()).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
                
                            this.emailVariables = {
                              de: "emisor",
                              para: this.aprobacion.aprobador.correo,
                              // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                              alias: "Notificación 1",
                              asunto: `Notificación por rechazo de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
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
                        }});
                     
                      

                }
              }, 5000);
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

        let aprobadoractual = "";

        this.camundaRestService.getVariablesForTaskLevelAprove(this.uniqueTaskId).subscribe({
          next: (aprobador) => {
            aprobadoractual = aprobador.nivelAprobacion?.value;
            if(this.id_solicitud_by_params.includes("RG-")){
              this.solicitudes
                .obtenerNivelesAprobacionRegistrados(this.id_solicitud_by_params)
                 .subscribe({
                  next: (responseAPS) => {
                    this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));
                    if (aprobadoractual !== undefined) {
                      console.log( this.dataAprobacionesPorPosicionAPS);
                      console.log(this.aprobacion);
        
                      if (this.aprobacion.aprobador.nivelDireccion.trim() !== null) {
                        this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.solicitudRG.idSolicitud;
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
        
                      if (this.taskType_Activity == environment.taskType_RRHH
                        || this.taskType_Activity == environment.taskType_CF_RRHH
                        || this.taskType_Activity == environment.taskType_AP_RRHH
                        || this.taskType_Activity == environment.taskType_RG_RRHH
        
                      ) { //GERENTE RECURSOS HUMANOS
                        aprobadoractual="RRHH";
                      } else if (this.taskType_Activity == environment.taskType_CREM
                        || this.taskType_Activity == environment.taskType_AP_Remuneraciones
                        || this.taskType_Activity == environment.taskType_RG_Remuneraciones
                        || this.taskType_Activity == environment.taskType_CF_Remuneraciones)
                       {
                         aprobadoractual="REMUNERA";
                       } else{
                         aprobadoractual="Creado";
                       }
                      }

                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.aprobador.nivelDireccion.toUpperCase().includes(aprobadoractual));

                    const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";
        
                    const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.aprobacion.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitudRG.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitudRG.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitudRG.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);
        
                    this.emailVariables = {
                      de: "emisor",
                      para: this.aprobacion.aprobador.correo,
                      // alias: this.solicitudes.modelDetalleAprobaciones.correo,
                      alias: "Notificación 1",
                      asunto: `Autorización de Solicitud de ${this.solicitudRG.tipoSolicitud} ${this.solicitudRG.idSolicitud}`,
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
              else{
                this.solicitudes
                .obtenerNivelesAprobacionRegistrados(this.solicitud.idSolicitud)
                 .subscribe({
                  next: (responseAPS) => {
                    this.dataAprobacionesPorPosicionAPS = responseAPS.nivelAprobacionPosicionType;
                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes(aprobadoractual));
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
        
                      if (this.taskType_Activity == environment.taskType_RRHH
                        || this.taskType_Activity == environment.taskType_CF_RRHH
                        || this.taskType_Activity == environment.taskType_AP_RRHH
                        || this.taskType_Activity == environment.taskType_RG_RRHH
        
                      ) { //GERENTE RECURSOS HUMANOS
                        aprobadoractual="RRHH";
                      } else if (this.taskType_Activity == environment.taskType_CREM
                        || this.taskType_Activity == environment.taskType_AP_Remuneraciones
                        || this.taskType_Activity == environment.taskType_RG_Remuneraciones
                        || this.taskType_Activity == environment.taskType_CF_Remuneraciones)
                       {
                         aprobadoractual="REMUNERA";
                       } else{
                         aprobadoractual="REGISTRARSOLICITUD";
                       }
                    }
                    this.aprobacion = this.dataAprobacionesPorPosicionAPS.find(elemento => elemento.nivelAprobacionType.nivelAprobacionRuta.toUpperCase().includes(aprobadoractual));

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
          }
        });
      });
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

  override generateVariablesFromFormFields() {
    //console.log(this.aprobadorSiguiente.aprobador);

    let variables: any = {};

    //variables.codigo = { value: this.model.codigo };
    //variables.idEmpresa = { value: this.model.idEmpresa };
    if(this.buttonValue.toUpperCase().includes("ESPERAR")){
      this.buttonValue="enEspera";
    }
    if (this.taskType_Activity == environment.taskType_Revisar) { //APROBADORES DINAMICOS

      variables.atencionRevision = { value: this.buttonValue };
      variables.comentariosAtencion = { value: this.datosAprobadores.nivelDireccion + ': ' + this.textareaContent };

      //RQ_GRRHH_RevisarSolicitud

    } else if (this.taskType_Activity == environment.taskType_RRHH
      || this.taskType_Activity == environment.taskType_CF_RRHH
      || this.taskType_Activity == environment.taskType_AP_RRHH
      || this.taskType_Activity == environment.taskType_RG_RRHH

    ) { //GERENTE RECURSOS HUMANOS
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

    } else if (this.taskType_Activity == environment.taskType_CREM
      || this.taskType_Activity == environment.taskType_AP_Remuneraciones
      || this.taskType_Activity == environment.taskType_RG_Remuneraciones
      || this.taskType_Activity == environment.taskType_CF_Remuneraciones

    ) {// COMITE DE REMUNERACION



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
    //this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = this.buttonValue;
    this.solicitudes.modelDetalleAprobaciones.estadoAprobacion = null;
    this.solicitudes.modelDetalleAprobaciones.comentario = this.textareaContent;

    if (this.buttonValue.includes("esperar")) {
      this.detalleSolicitud.fechaSalida = this.selectedDate;
      this.detalleSolicitud.valor = `Solicitud en Espera: ${this.textareaContent}`;

      this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
        next: (response) => {
        }
      });
    } else {
      if (this.detalleSolicitud.valor.includes("Solicitud en Espera")) {
        this.detalleSolicitud.fechaSalida = new Date();
        this.detalleSolicitud.valor = null;

        this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
          next: (response) => {
          }
        });
      }
    }

    if (this.taskType_Activity == environment.taskType_CREM) {
      this.detalleSolicitud.valor = this.textareaContent;
      this.detalleSolicitud.unidad = this.detalleSolicitud.unidadNegocio;

      this.solicitudes.actualizarDetalleSolicitud(this.detalleSolicitud).subscribe({
        next: (response) => {
        }
      });
    }

    this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
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
              const aprobacionesObj = this.dataAprobacionesPorPosicion[key];
              for (const index in aprobacionesObj) {
                if (aprobacionesObj.hasOwnProperty(index)) {
                  const aprobacion = aprobacionesObj[index];
                  if (aprobacion.aprobador.nivelDireccion !== "") {
                    if (aprobadoractual !== undefined) {
                      if (aprobacion.aprobador.nivelDireccion.trim() == aprobadoractual) {
                        this.aprobadorActual = aprobacionesObj[index];

                        this.solicitudes.modelDetalleAprobaciones.id_Solicitud = this.id_solicitud_by_params;
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

                    if ((this.taskType_Activity == environment.taskType_RRHH
                      || this.taskType_Activity == environment.taskType_CF_RRHH
                      || this.taskType_Activity == environment.taskType_AP_RRHH
                      || this.taskType_Activity == environment.taskType_RG_RRHH)
                      && aprobadoractual === undefined) {

                      if (aprobacion.aprobador.nivelDireccion.trim().toUpperCase().indexOf('RRHH') > 0) {
                        if (aprobacionesObj[String(Number(index) + 1)] === undefined || aprobacionesObj[String(Number(index) + 1)] === null) {
                          this.aprobadorActual = aprobacionesObj[index];
                          this.apruebaRemuneraciones = "NO";
                          this.aprobadorFijo = "SI";
                        } else {
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
                        this.solicitudes.modelDetalleAprobaciones.nivelDirecion = aprobacion.nivelAprobacionType.nivelDirecion;
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


                    } else if ((this.taskType_Activity == environment.taskType_CREM
                      || this.taskType_Activity == environment.taskType_AP_Remuneraciones
                      || this.taskType_Activity == environment.taskType_RG_Remuneraciones
                      || this.taskType_Activity == environment.taskType_CF_Remuneraciones)
                      && aprobadoractual === undefined) {

                      if (aprobacion.aprobador.nivelDireccion.trim().toUpperCase().indexOf('REMUNERA') > 0) {
                        this.aprobadorActual = aprobacionesObj[index];
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

                    } else if (aprobadoractual === undefined) {

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
