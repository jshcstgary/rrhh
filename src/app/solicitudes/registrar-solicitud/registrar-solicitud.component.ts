import {
	HttpClientModule,
	HttpErrorResponse
} from "@angular/common/http";
import { Component } from "@angular/core";
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
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { DialogComponents } from "src/app/shared/dialogComponents/dialog.components";
import { DialogReasignarUsuarioComponent } from "src/app/shared/reasginar-usuario/reasignar-usuario.component";
import { StarterService } from "src/app/starter/starter.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { Permiso } from "src/app/types/permiso.type";
import Swal from "sweetalert2";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { SolicitudesService } from "./solicitudes.service";

const dialogComponentList: DialogComponents = {
  dialogBuscarEmpleados: undefined,
  dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};

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
  public codigoPosicionReportaA: string = 'NOAPLICA';
  public primerNivelAprobacion: string="";


  emailVariables = {
    de: "",
    password: "",
    alias: "",
    para: "",
    asunto: "",
    cuerpo: ""
  };
  eventSearch = {
    item: ""
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

  public sueldoEmpleado: {
    sueldo: string;
    variableMensual: string;
    variableTrimestral: string;
    variableSemestral: string;
    variableAnual: string;
  } = {
    sueldo: "0",
    variableMensual: "0",
    variableTrimestral: "0",
    variableSemestral: "0",
    variableAnual: "0"
  };
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

  public modelBase: DatosProcesoInicio;

  public modelSolicitud: DatosSolicitud;

  public dataSolicitudModel: any;

  public taskId: string = "";
  public date: any;

  public parentIdFlag: string | null = "false";

  public misParams: Solicitud;

  public dataTipoSolicitud: any = [];
  public dataTipoMotivo: any = [];

  private detalleNivelAprobacion: any[] = [];

  public dataTipoAccion: any = [];

  public dataNivelesDeAprobacion: { [key: string]: any[] } = {};

  public dataAprobacionesPorPosicion: { [key: string]: any[] } = {};

  public dataAprobacionesPorPosicionAPS: any = [];
  public dataAprobacionesPorPosicionAPD: any = [];

  public dataTipoRuta: any[] = [];

  public dataRuta: any[] = [];

  public existeMatenedores: boolean = false;
  public existe: boolean = false;


  public dataNivelDireccion: any[] = [];

  public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

  public dataNivelesAprobacion: any;

  public mostrarTipoJustificacionYMision = false;

  public RegistrarsolicitudCompletada = false;

  public restrictionsIds: any[] = ["1", "2", 1, 2];

  public restrictionsSubledgerIds: any[] = ["4", 4];

  public mostrarSubledger = false;

  public IsCodigoPosicion = false;

  public models: any[] = [];

  public dataEmpleadoEvolution: any[] = [];

  public success: false;
  public params: any;
  public id_edit: undefined | string;

  private id_solicitud_by_params: any;

  public dataAprobadoresDinamicos: any[] = [];
  public suggestions: string[] = [];

  public idDeInstancia: any;
  public tareasPorCompletar: any;


  public loadingComplete = 0;

	nombres: string[] = [];

	descripcionPosiciones: string[] = [];

  public codigoReportaA: string;
  public aprobacion: any;

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

  private verifyData(): void {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    try {
      this.starterService.getUser(localStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
        next: (res) => {
          return this.consultaTareasService.getTareasUsuario(res.evType[0].subledger).subscribe({
            next: async (response) => {
              this.existe = response.solicitudes.some(({ idSolicitud, rootProcInstId}) => idSolicitud === this.id_solicitud_by_params && rootProcInstId === this.idDeInstancia);

              const permisos: Permiso[] = JSON.parse(localStorage.getItem(LocalStorageKeys.Permisos)!);

              this.existeMatenedores = permisos.some(permiso => permiso.codigo === PageCodes.AprobadorFijo);

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
                  confirmButtonColor: "rgb(227, 199, 22)"
                });

                this.router.navigate(["/solicitudes/consulta-solicitudes"]);
              }
            },
            error: (error: HttpErrorResponse) => {
              this.utilService.modalResponse(error.error, "error");

              this.utilService.closeLoadingSpinner();
            },
          });
        }
      });
    } catch (error) {
      this.utilService.modalResponse(error.error, "error");
    }
  }

  onSelectionChange() {
    console.log(this.selectedOption);
  }

  // searchNombreCompleto: OperatorFunction<string, readonly string[]> = (
  //   text$: Observable<string>
  // ) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 1
  //         ? []
  //         : this.nombresEmpleados
  //           .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //           .slice(0, 10)
  //     )
  //   );

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
        this.uniqueTaskId = params["id"];
        this.taskId = params["id"];
        this.loadExistingVariables(this.uniqueTaskId ? this.uniqueTaskId : "", variableNames);
      }
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
          this.primerNivelAprobacion=response.nivelAprobacionPosicionType[0].aprobador.nivelDireccion;
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
    const valor = event.item;

    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });

    if (datosEmpleado) {
      this.sueldoEmpleado.sueldo = datosEmpleado.sueldo;
      this.sueldoEmpleado.variableMensual = datosEmpleado.sueldoVariableMensual;
      this.sueldoEmpleado.variableTrimestral = datosEmpleado.sueldoVariableTrimestral;
      this.sueldoEmpleado.variableSemestral = datosEmpleado.sueldoVariableSemestral;
      this.sueldoEmpleado.variableAnual  = datosEmpleado.sueldoVariableAnual;

      this.model = Object.assign(
        {},
        {
          ...datosEmpleado,
          sueldo: datosEmpleado.sueldo,
          sueldoMensual: datosEmpleado.sueldoVariableMensual,
          sueldoTrimestral: datosEmpleado.sueldoVariableTrimestral,
          sueldoSemestral: datosEmpleado.sueldoVariableSemestral,
          sueldoAnual: datosEmpleado.sueldoVariableAnual
        }
      );
      if(this.model.nivelDir.toUpperCase().includes("VICEPRESIDENCIA")||
      this.model.nivelDir.toUpperCase().includes("CORPORATIVO")||
      this.model.nivelDir.toUpperCase().includes("CORPORATIVA")){
        Swal.fire({
          text: "Nivel de Dirección no permitido: "+this.model.nivelDir,
          icon: "info",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Sí",
        });
        this.clearModel();
        this.keySelected = "";
        this.dataAprobacionesPorPosicion = {};
        return;
      }

      this.mantenimientoService.getDataEmpleadosEvolutionPorId(datosEmpleado.codigoPosicionReportaA).subscribe({
        next: (response) => {
          if (response.evType.length === 0) {

          this.model.jefeInmediatoSuperior =  "";
          this.model.puestoJefeInmediato =  "";
          this.codigoReportaA =  "";

            return;
          }
          this.model.jefeInmediatoSuperior =  response.evType[0].nombreCompleto;
          this.model.puestoJefeInmediato =  response.evType[0].descrPosicion;
          this.codigoReportaA =  response.evType[0].subledger;


        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });

      this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

      if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
        this.obtenerAprobacionesPorPosicion();
      }
    } else {
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

  searchCodigoPosicion: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => {
      if (term.length < 1) {
        return [];
      } else {
        return this.codigosPosicion.filter((codigoPosicion) => codigoPosicion.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
      }
    })
  );

  searchSubledger: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => {
      if (term.length < 1) {
        return [];
      } else {
        return this.subledgers.filter((subledger) => subledger.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
      }
    })
  );

  searchDescripcionPosicion: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => {
      if (term.length < 1) {
        return [];
      } else {
        return this.descripcionPosiciones.filter((descrPosicion) => descrPosicion.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
      }
    })
  );

  searchNombre: OperatorFunction<any, readonly any[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => {
      if (term.length < 1) {
        return [];
      } else {
        return this.nombres.filter((nombreCompleto) => nombreCompleto.toLowerCase().includes(term.toLowerCase())).slice(0, 10);
      }
    })
  );

  getDataEmpleadosEvolution(tipo: string) {
    let tipoValue: string = "";

    if (tipo === "codigoPosicion") {
		tipoValue = this.model.codigoPosicion;
    } else if (tipo === "subledger") {
		tipoValue = this.model.subledger;
    } else if (tipo === "nombreCompleto") {
		tipoValue = this.model.nombreCompleto;
    } else if (tipo === "descrPosicion"){
		tipoValue = this.model.descrPosicion;
	  } else {
      tipoValue = this.model.codigoPosicion;
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

        if (tipo === "codigoPosicion") {
          this.codigosPosicion = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.codigoPosicion))];
          this.descripcionPosiciones = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.descrPosicion))];
          this.eventSearch.item=this.dataEmpleadoEvolution[0].codigoPosicion;
          this.onSelectItem('codigoPosicion',this.eventSearch);
        } else if (tipo === "subledger") {
          this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];
          this.eventSearch.item=this.dataEmpleadoEvolution[0].subledger;
          this.onSelectItem('subledger',this.eventSearch);
        } else if (tipo === "nombreCompleto") {
          this.nombres = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
          this.eventSearch.item=this.dataEmpleadoEvolution[0].nombreCompleto;
          this.onSelectItem('nombreCompleto',this.eventSearch);
        } else if (tipo === "descrPosicion") {
          this.descripcionPosiciones = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.descrPosicion))];
          this.eventSearch.item=this.dataEmpleadoEvolution[0].descrPosicion;
          this.onSelectItem('descrPosicion',this.eventSearch);
        } else {
          this.codigosPosicion = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.codigoPosicion))];
          this.descripcionPosiciones = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.descrPosicion))];
          this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];
          this.nombres = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
          this.eventSearch.item=this.dataEmpleadoEvolution[0].codigoPosicion;
          this.onSelectItem('codigoPosicion',this.eventSearch);
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
          this.sueldoEmpleado.sueldo = this.detalleSolicitud.sueldo;
          this.sueldoEmpleado.variableMensual =this.detalleSolicitud.sueldoVariableMensual;
          this.sueldoEmpleado.variableTrimestral =this.detalleSolicitud.sueldoVariableTrimestral;
          this.sueldoEmpleado.variableSemestral = this.detalleSolicitud.sueldoVariableSemestral;
          this.sueldoEmpleado.variableAnual  = this.detalleSolicitud.sueldoVariableAnual;

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
          this.codigoReportaA = this.detalleSolicitud.jefeSolicitante;

          if(this.solicitud.estadoSolicitud === "DV") //Devuelto
          {
            this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.detalleSolicitud.codigoPosicion).subscribe({
              next: (response) => {
                if (response.evType.length === 0) {
      
                  this.sueldoEmpleado.sueldo = this.detalleSolicitud.sueldo;
                  this.sueldoEmpleado.variableMensual =this.detalleSolicitud.sueldoVariableMensual;
                  this.sueldoEmpleado.variableTrimestral =this.detalleSolicitud.sueldoVariableTrimestral;
                  this.sueldoEmpleado.variableSemestral = this.detalleSolicitud.sueldoVariableSemestral;
                  this.sueldoEmpleado.variableAnual  = this.detalleSolicitud.sueldoVariableAnual;

                  return;
                }
                this.sueldoEmpleado.sueldo = response.evType[0].sueldo;
                this.sueldoEmpleado.variableMensual =response.evType[0].sueldoVariableMensual;
                this.sueldoEmpleado.variableTrimestral =response.evType[0].sueldoVariableTrimestral;
                this.sueldoEmpleado.variableSemestral = response.evType[0].sueldoVariableSemestral;
                this.sueldoEmpleado.variableAnual  = response.evType[0].sueldoVariableAnual;

              },
              error: (error: HttpErrorResponse) => {
                this.utilService.modalResponse(error.error, "error");
              },
            });
          }
        }

        this.loadingComplete++;

        this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(this.solicitud.idTipoMotivo);

        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(this.solicitud.idTipoMotivo);

        this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.nivelDir}`;

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

  indexedModal: Record<keyof DialogComponents, any> = {
    dialogBuscarEmpleados: undefined,
    dialogReasignarUsuario: () => this.openModalReasignarUsuario()
  };

  openModal(component: keyof DialogComponents) {
    this.indexedModal[component]();
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
    const regexp = /^[0-9.,]+$/.test(this.model.sueldo);
    const regexp1 = /^[0-9.,]+$/.test(this.model.sueldoMensual);
    const regexp2 = /^[0-9.,]+$/.test(this.model.sueldoTrimestral);
    const regexp3 = /^[0-9.,]+$/.test(this.model.sueldoSemestral);
    const regexp4 = /^[0-9.,]+$/.test(this.model.sueldoAnual);

    if(!regexp || !regexp1 || !regexp2 || !regexp3 || !regexp4 ){
      Swal.fire({
        text: "Debe ingresar solo números en el sueldo y tipo variable",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "OK",
      });
      return;

    }

    if(parseFloat(this.sueldoEmpleado.sueldo) < parseFloat(this.model.sueldo)
      || parseFloat(this.sueldoEmpleado.variableMensual) < parseFloat(this.model.sueldoMensual)
      || parseFloat(this.sueldoEmpleado.variableTrimestral) < parseFloat(this.model.sueldoTrimestral)
      || parseFloat(this.sueldoEmpleado.variableSemestral) < parseFloat(this.model.sueldoSemestral)
      || parseFloat(this.sueldoEmpleado.variableAnual) < parseFloat(this.model.sueldoAnual)
    ){
      Swal.fire({
        text: "No se puede registrar valores variables mayores a los obtenidos del sistema",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "OK",
      });
      return;

    }
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
        this.detalleSolicitud.jefeInmediatoSuperior = this.model.jefeInmediatoSuperior;
        this.detalleSolicitud.puestoJefeInmediato = this.model.puestoJefeInmediato;
        this.detalleSolicitud.nombreJefeSolicitante = this.model.jefeInmediatoSuperior;
        this.detalleSolicitud.responsableRRHH = this.solicitud.usuarioCreacion;
        this.detalleSolicitud.jefeSolicitante = this.codigoReportaA;



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
          });
      }); //aqui debe crear los aprobadores
    this.submitted = true;
  }

  crearRegistradorSolicitud() {
    this.starterService.getUser(localStorage.getItem(LocalStorageKeys.IdUsuario)!).subscribe({
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

  onCompletar() {
    if (this.selectedOption === "No") {
      const regexp = /^[0-9.,]+$/.test(this.model.sueldo);
      const regexp1 = /^[0-9.,]+$/.test(this.model.sueldoMensual);
      const regexp2 = /^[0-9.,]+$/.test(this.model.sueldoTrimestral);
      const regexp3 = /^[0-9.,]+$/.test(this.model.sueldoSemestral);
      const regexp4 = /^[0-9.,]+$/.test(this.model.sueldoAnual);

      if(!regexp || !regexp1 || !regexp2 || !regexp3 || !regexp4 ){
        Swal.fire({
          text: "No se puede Enviar Solicitud: Debe ingresar solo números en el sueldo y tipo variable",
          icon: "info",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "OK",
        });
        return;

      }

      if(parseFloat(this.sueldoEmpleado.sueldo) < parseFloat(this.model.sueldo)
        || parseFloat(this.sueldoEmpleado.variableMensual) < parseFloat(this.model.sueldoMensual)
        || parseFloat(this.sueldoEmpleado.variableTrimestral) < parseFloat(this.model.sueldoTrimestral)
        || parseFloat(this.sueldoEmpleado.variableSemestral) < parseFloat(this.model.sueldoSemestral)
        || parseFloat(this.sueldoEmpleado.variableAnual) < parseFloat(this.model.sueldoAnual)
      ) {
        Swal.fire({
          text: "No se puede Enviar Solicitud: Valores variables mayores a los obtenidos del sistema",
          icon: "info",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "OK",
        });
        return;

      }
    }

    if (this.uniqueTaskId === null) {
      this.errorMessage = "Unique Task id is empty. Cannot initiate task complete.";

      return;
    }
    this.utilService.openLoadingSpinner("Completando Tarea, espere por favor...");

    let variables = this.generateVariablesFromFormFields();

    if(this.selectedOption.toUpperCase().includes("SI")){
      this.solicitud.estadoSolicitud = "AN";
    }else{
      this.solicitud.estadoSolicitud = "4";
    }

    if(!this.solicitud.estadoSolicitud.includes("AN") && this.detalleNivelAprobacion.length > 0){
    this.solicitudes.cargarDetalleAprobacionesArreglo(this.detalleNivelAprobacion).subscribe({
      next: (res) => {
        this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
          next: (res) => {
            this.solicitud.empresa = this.model.compania;
            this.solicitud.idEmpresa = this.model.compania;
            this.solicitud.unidadNegocio = this.model.unidadNegocio;
            this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

            this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
              next: (responseSolicitud) => {
                setTimeout(() => {
                  //this.consultarNextTaskAprobador(this.solicitud.idInstancia);

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

    this.submitted = true;
    }if(this.solicitud.estadoSolicitud.includes("AN")){
    const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} ha sido anulada.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

    const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.solicitud.usuarioCreacion).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}solicitudes/trazabilidad/${this.solicitud.idSolicitud}`);

    this.emailVariables = {
      de: "emisor",
      para: localStorage.getItem(LocalStorageKeys.IdUsuario),
      // alias: this.solicitudes.modelDetalleAprobaciones.correo,
      alias: "Notificación 1",
      asunto: `Notificación por Anulación de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
      cuerpo: modifiedHtmlString,
      password: "password"
    };
    this.solicitud.empresa = this.model.compania;
      this.solicitud.idEmpresa = this.model.compania;
      this.solicitud.unidadNegocio = this.model.unidadNegocio;
      this.solicitud.idUnidadNegocio = this.model.unidadNegocio;

      this.camundaRestService.postCompleteTask(this.uniqueTaskId, variables).subscribe({
        next: (res) => {
       this.solicitudes.actualizarSolicitud(this.solicitud).subscribe({
        next: (responseSolicitud) => {
          setTimeout(() => {
            //this.consultarNextTaskAprobador(this.solicitud.idInstancia);

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
                "/solicitudes/consulta-solicitudes",
              ]);
            }, 1800);
          }, 3000);
        },
        error: (error) => {
          console.error(error);
        }
      });
     }
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
  override generateVariablesFromFormFields() {
    let variables: any = {};

    if (this.taskType_Activity == environment.taskType_Registrar) {
      this.dataAprobacionesPorPosicionAPS.forEach((elemento, index) => {
        if (index === 0) {
          const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} para la posici\u00F3n de {DESCRIPCION_POSICION} est\u00E1 disponible para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

          const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", elemento.aprobador.usuario).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace("{DESCRIPCION_POSICION}", this.detalleSolicitud.descripcionPosicion).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);

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
            // alias: this.solicitudes.modelDetalleAprobaciones.correo,
            alias: "Notificación 1",
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

      variables.codigoPosicion = {
        value: this.model.codigoPosicion
      };
      variables.misionCargo = {
        value: this.model.misionCargo
      };
      variables.justificacionCargo = {
        value: this.model.justificacionCargo
      };
      variables.empresa = {
        value: this.model.compania
      };
      variables.unidadNegocio = {
        value: this.model.unidadNegocio
      };
      variables.descripcionPosicion = {
        value: this.model.descrPosicion
      };
      variables.areaDepartamento = {
        value: this.model.departamento
      };
      variables.localidadZona = {
        value: this.model.localidad
      };
      variables.centroCosto = {
        value: this.model.nomCCosto
      };
      variables.reportaa = {
        value: this.model.reportaA
      };
      variables.nivelReportea = {
        value: this.model.nivelRepa
      };
      variables.supervisa = {
        value: this.model.supervisaA
      };
      variables.tipoContrato = {
        value: this.model.tipoContrato
      };
      variables.sueldo = {
        value: this.model.sueldo
      };
      variables.sueldoMensual = {
        value: this.model.sueldoMensual
      };
      variables.sueldoTrimestral = {
        value: this.model.sueldoTrimestral
      };
      variables.sueldoSemestral = {
        value: this.model.sueldoSemestral
      };
      variables.sueldoAnual = {
        value: this.model.sueldoAnual
      };
      variables.anularSolicitud = {
        value: this.selectedOption
      };
      variables.comentariosAnulacion = {
        value: this.model.comentariosAnulacion
      };
      variables.nivelDireccion = {
        value: this.model.nivelDir
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
    if (this.detalleSolicitud.codigoPosicion !== "" && this.detalleSolicitud.codigoPosicion !== undefined && this.detalleSolicitud.codigoPosicion != null) {
      this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.detalleSolicitud.codigoPosicion, this.detalleSolicitud.nivelDireccion, 'A')
        .subscribe({
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
    this.solicitudes.guardarDetallesAprobacionesSolicitud(this.solicitudes.modelDetalleAprobaciones).subscribe({
      next: (res) => {
        console.log(res);
        /*this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
          setTimeout(() => {
          this.router.navigate(["/solicitudes/completar-solicitudes"]);
        }, 1600);*/
      },
      error: (err) => {
        console.error(err);
      }
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
