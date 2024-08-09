import { HttpErrorResponse } from "@angular/common/http";
import { Component, Type } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { ConsultaTareasService } from "src/app/tareas/consulta-tareas/consulta-tareas.service";
import { environment, portalWorkFlow } from "../../../environments/environment";
import { CompleteTaskComponent } from "../general/complete-task.component";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";

import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import {
  IEmpleadoData,
  IEmpleados,
} from "src/app/services/mantenimiento/empleado.interface";
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
  selector: "app-registrar-accion-personal",
  templateUrl: "./registrar-accion-personal.component.html",
  styleUrls: ["./registrar-accion-personal.component.scss"],
})
export class RegistrarAccionPersonalComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  selectedOptionAnulacion: string = "No";
  selected_tipo_accion: number;
  selectedOption: string = "No";
  empleadoSearch: string = "";
  nivelDireccionDatoPropuesto: string = "";

  public existeMatenedores: boolean = false;
  public existe: boolean = false;
  public codigoReportaA: string = "";
  public primerNivelAprobacion: string="";
  public RegistrarsolicitudCompletada = false;



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

  modelPropuestos: RegistrarData = new RegistrarData();

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

  public detalleSolicitudPropuestos = new DetalleSolicitud();

  public solicitud = new Solicitud();

  taskKey: string = "";

  public titulo: string = "Formulario De Registro";

  // Base model refers to the input at the beginning of BPMN
  // that is, Start Event
  public modelBase: DatosProcesoInicio;

  public modelSolicitud: DatosSolicitud;

  public dataSolicitudModel: any;

  // scenario-1: task id and date are handled via tasklist page.
  public taskId: string = "";
  public tareasPorCompletar: any;

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
  public dataAprobacionesPorPosicionAPD: any = [];

  public dataTipoRuta: any[] = [];

  public dataRuta: any[] = [];

  public dataNivelDireccion: any[] = [];

  // getDataNivelesAprobacionPorCodigoPosicion
  public dataNivelesAprobacionPorCodigoPosicion: { [key: string]: any[] } = {};

  public dataNivelesAprobacion: any;

  public mostrarTipoJustificacionYMision = false;

  public restrictionsIds: any[] = ["1", "2", 1, 2];

  public restrictionsSubledgerIds: any[] = ["4", 4];

  public mostrarSubledger = false;

  eventSearch = {
    item: ""
  };

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
  private detalleNivelAprobacion: any[] = [];

  public suggestions: string[] = [];

  public idDeInstancia: any;
  public aprobacion: any;

  public loadingComplete = 0;
  public viewInputs: boolean = false;


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

  nombres: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];
  jsonResult: string;

  emailVariables = {
    de: "",
    password: "",
    alias: "",
    para: "",
    asunto: "",
    cuerpo: ""
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private consultaTareasService: ConsultaTareasService,
    private modalService: NgbModal,
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

    this.verifyData();
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

  async ngOnInit() {
    // this.utilService.openLoadingSpinner(
    //   "Cargando información, espere por favor..."
    // );
    // console.log("this.id_solicitud_by_params: ", this.id_solicitud_by_params);
    // try {
    // 	await this.loadDataCamunda();

    //   this.utilService.closeLoadingSpinner();
    // } catch (error) {
    //   this.utilService.modalResponse(error.error, "error");
    // }
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
        this.solicitud = response;

        this.model.codigo = this.solicitud.idSolicitud;
        this.model.idEmpresa = this.solicitud.idEmpresa;
        this.model.compania = this.solicitud.empresa;
        this.model.unidadNegocio = this.solicitud.unidadNegocio;

        this.loadingComplete += 2;
        this.getDetalleSolicitudById(this.id_edit);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

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
    } else {
      tipoValue = this.model.descrPosicion;
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

        if (tipo === "subledger") {
          this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];
          this.nombres = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
          this.eventSearch.item = this.dataEmpleadoEvolution[0].codigoPosicion;
          this.onSelectItem('subledger', this.subledger);
        } else if (tipo === "nombreCompleto") {
          this.subledgers = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.subledger))];
          this.nombres = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
          this.eventSearch.item = this.dataEmpleadoEvolution[0].nombreCompleto;
          this.onSelectItem('nombreCompleto', this.eventSearch);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  onSelectItem(campo: string, event) {
    const valor = event.item;

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

      if (this.model.nivelDir.toUpperCase().includes("VICEPRESIDENCIA") ||
        this.model.nivelDir.toUpperCase().includes("CORPORATIVO") ||
        this.model.nivelDir.toUpperCase().includes("CORPORATIVA")) {
        Swal.fire({
          text: "Nivel de Dirección no permitido: " + this.model.nivelDir,
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
          this.model.jefeInmediatoSuperior = response.evType[0].nombreCompleto;
          this.model.puestoJefeInmediato = response.evType[0].descrPosicion;
          this.codigoReportaA = response.evType[0].subledger;


        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
      this.modelPropuestos = structuredClone(this.model);
      this.modelPropuestos.fechaIngreso = structuredClone(this.model.fechaIngresogrupo);

      this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.codigoPosicion}_${this.model.nivelDir}`;

      console.log(!this.dataAprobacionesPorPosicion[this.keySelected]);
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
      this.misParams = params
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
        this.loadExistingVariables(
          this.uniqueTaskId ? this.uniqueTaskId : "",
          variableNames
        );
      }
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

  totalRegistrosDetallesolicitud: number = 0;

  getDetalleSolicitudById(id: any) {
    return this.solicitudes.getDetalleSolicitudById(id).subscribe({
      next: (response: any) => {
        this.totalRegistrosDetallesolicitud = response.totalRegistros;
        if (response.detalleSolicitudType.codigoPosicion.length > 0) {
        this.RegistrarsolicitudCompletada=true;
        }

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
        this.codigoReportaA = detalleActual.jefeSolicitante;
        this.nivelDireccionDatoPropuesto = detalleActual.nivelDireccion;
        this.viewInputs = detalleActual.codigo === "100" ? true : false;

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
          this.codigoReportaA = detallePropuestos.jefeSolicitante;

        }

        this.loadingComplete++;

        this.mostrarTipoJustificacionYMision = this.restrictionsIds.includes(
          this.solicitud.idTipoMotivo
        );

        this.mostrarSubledger = this.restrictionsSubledgerIds.includes(
          this.solicitud.idTipoMotivo
        );

        this.keySelected = `${this.solicitud.idTipoSolicitud}_${this.solicitud.idTipoMotivo}_${this.model.nivelDir}`;

        if (!this.dataAprobacionesPorPosicion[this.keySelected]) {
          this.getNivelesAprobacion();

          if (this.model.codigoPosicion.trim().length > 0) {
            this.obtenerAprobacionesPorPosicionAPS();
            this.obtenerAprobacionesPorPosicionAPD();
            console.log("SI LLEGA");
          }

          let variables = this.generateVariablesFromFormFields();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
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

  getNivelesAprobacion() {
    if (this.model.codigoPosicion !== "" && this.model.codigoPosicion !== undefined && this.model.codigoPosicion != null) {
      this.solicitudes.obtenerAprobacionesPorPosicion(this.solicitud.idTipoSolicitud, this.solicitud.idTipoMotivo, this.model.codigoPosicion, this.nivelDireccionDatoPropuesto, 'A')
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
          this.dataAprobacionesPorPosicionAPS =
            response.nivelAprobacionPosicionType || [];
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

  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      console.log("routing to app error page ", result.error.message);
      this.errorMessage = result.error.message;
      this.utilService.modalResponse(this.errorMessage, "error");
    }
  }

  async onSubmit() {
    const { isConfirmed } = await Swal.fire({
      text: "¿Desea guardar la Solicitud?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(227, 199, 22)",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",

    });

    if (isConfirmed) {
      this.save();

      if (this.submitted) {
      }
    }
  }

  override generateVariablesFromFormFields() {
    let variables: any = {};

    if (this.taskType_Activity == environment.taskType_AP_Registrar) {
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
      if (this.solicitud.tipoAccion.toUpperCase().includes("TEMPORAL")) {
        variables.tipoAccion = { value: "asignacionTemporal" };
      } else {
        variables.tipoAccion = { value: this.solicitud.tipoAccion };
      }

      variables.transferenciaCompania = {
        value: !this.viewInputs
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

    if(this.selectedOption.toUpperCase().includes("SI")){
      this.solicitud.estadoSolicitud = "AN";
    }else{
      this.solicitud.estadoSolicitud === "No" ? "4" : "AN";
    }

    if(!this.solicitud.estadoSolicitud.includes("AN")){
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

  public onCancel(): void { }

  save() {
    this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

    this.submitted = true;
    let idInstancia = this.solicitudDataInicial.idInstancia;

    console.log("this.solicitudDataInicial.idInstancia: ", this.solicitudDataInicial.idInstancia);

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
        this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

        this.detalleSolicitud.areaDepartamento = this.model.departamento;

        this.detalleSolicitud.cargo = this.model.nombreCargo;
        this.detalleSolicitud.centroCosto = this.model.nomCCosto;
        this.detalleSolicitud.codigoPosicion = this.model.codigoPosicion;
        this.detalleSolicitud.compania = this.model.compania;
        this.detalleSolicitud.departamento = this.model.departamento;
        this.detalleSolicitud.descripcionPosicion = this.model.descrPuesto;

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

        this.detalleSolicitud.grupoDePago = this.model.grupoPago;

        this.detalleSolicitud.misionCargo = this.model.misionCargo === "" || this.model.misionCargo === undefined || this.model.misionCargo === null ? "" : this.model.misionCargo;
        this.detalleSolicitud.justificacion = this.model.justificacionCargo === "" || this.model.justificacionCargo === undefined || this.model.justificacionCargo === null ? "" : this.model.justificacionCargo;
        this.detalleSolicitud.sueldo = this.model.sueldo;
        this.detalleSolicitud.sueldoVariableMensual = this.model.sueldoMensual;
        this.detalleSolicitud.sueldoVariableTrimestral = this.model.sueldoTrimestral;
        this.detalleSolicitud.sueldoVariableSemestral = this.model.sueldoSemestral;
        this.detalleSolicitud.sueldoVariableAnual = this.model.sueldoAnual;
        this.detalleSolicitud.tipoContrato = this.model.tipoContrato;
        this.detalleSolicitud.unidadNegocio = this.model.unidadNegocio;

        this.detalleSolicitud.correo = this.model.correo;

        this.detalleSolicitud.supervisaA = this.model.supervisaA;
        this.detalleSolicitud.codigo = this.viewInputs ? "100" : "1";

        this.detalleSolicitud.fechaIngreso = this.model.fechaIngresogrupo === "" ? this.model.fechaIngreso : this.model.fechaIngresogrupo;

        this.solicitudes
          .actualizarDetalleSolicitud(this.detalleSolicitud)
          .subscribe((responseDetalle) => {
            this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

            this.detalleSolicitud.areaDepartamento = this.modelPropuestos.departamento === "" ? this.model.departamento : this.modelPropuestos.departamento;

            this.detalleSolicitud.cargo = this.modelPropuestos.nombreCargo === "" ? this.model.nombreCargo : this.modelPropuestos.nombreCargo;
            this.detalleSolicitud.centroCosto = this.modelPropuestos.nomCCosto === "" ? this.model.nomCCosto : this.modelPropuestos.nomCCosto;
            this.detalleSolicitud.codigoPosicion = this.modelPropuestos.codigoPosicion === "" ? this.model.codigoPosicion : this.modelPropuestos.codigoPosicion;
            this.detalleSolicitud.compania = this.viewInputs ? this.model.compania : this.modelPropuestos.compania;
            this.detalleSolicitud.departamento = this.modelPropuestos.departamento === "" ? this.model.departamento : this.modelPropuestos.departamento;
            this.detalleSolicitud.descripcionPosicion = this.modelPropuestos.descrPuesto === "" ? this.model.descrPuesto : this.modelPropuestos.descrPuesto;

            this.detalleSolicitud.localidad = this.modelPropuestos.localidad === "" ? this.model.localidad : this.modelPropuestos.localidad;
            this.detalleSolicitud.localidadZona = this.modelPropuestos.localidad === "" ? this.model.localidad : this.modelPropuestos.localidad;

            this.detalleSolicitud.misionCargo = this.modelPropuestos.misionCargo === "" ? this.model.misionCargo : this.modelPropuestos.misionCargo;
            this.detalleSolicitud.nivelDireccion = this.modelPropuestos.nivelDir === "" ? this.model.nivelDir : this.modelPropuestos.nivelDir;
            this.detalleSolicitud.nivelReporteA = this.modelPropuestos.nivelRepa === "" ? this.model.nivelRepa : this.modelPropuestos.nivelRepa;

            this.detalleSolicitud.nombreEmpleado = this.modelPropuestos.nombreCompleto === "" ? this.model.nombreCompleto : this.modelPropuestos.nombreCompleto;

            this.detalleSolicitud.reportaA = this.modelPropuestos.reportaA === "" ? this.model.reportaA : this.modelPropuestos.reportaA;

            this.detalleSolicitud.subledger = this.modelPropuestos.subledger === "" ? this.model.subledger : this.modelPropuestos.subledger;

            this.detalleSolicitud.subledgerEmpleado = this.modelPropuestos.subledger === "" ? this.model.subledger : this.modelPropuestos.subledger;

            this.detalleSolicitud.sucursal = this.modelPropuestos.sucursal === "" ? this.model.sucursal : this.modelPropuestos.sucursal;

            this.detalleSolicitud.grupoDePago = this.modelPropuestos.grupoPago === "" ? this.model.grupoPago : this.modelPropuestos.grupoPago;

            this.detalleSolicitud.misionCargo = this.modelPropuestos.misionCargo === "" || this.modelPropuestos.misionCargo === undefined || this.modelPropuestos.misionCargo === null ? "" : this.modelPropuestos.misionCargo;
            this.detalleSolicitud.justificacion = this.modelPropuestos.justificacionCargo === "" || this.modelPropuestos.justificacionCargo === undefined || this.modelPropuestos.justificacionCargo === null ? "" : this.modelPropuestos.justificacionCargo;
            this.detalleSolicitud.sueldo = this.modelPropuestos.sueldo === "" ? this.model.sueldo : this.modelPropuestos.sueldo;
            this.detalleSolicitud.sueldoVariableMensual = this.modelPropuestos.sueldoMensual === "" ? this.model.sueldoMensual : this.modelPropuestos.sueldoMensual;
            this.detalleSolicitud.sueldoVariableTrimestral = this.modelPropuestos.sueldoTrimestral === "" ? this.model.sueldoTrimestral : this.modelPropuestos.sueldoTrimestral;
            this.detalleSolicitud.sueldoVariableSemestral = this.modelPropuestos.sueldoSemestral === "" ? this.model.sueldoSemestral : this.modelPropuestos.sueldoSemestral;
            this.detalleSolicitud.sueldoVariableAnual = this.modelPropuestos.sueldoAnual === "" ? this.model.sueldoAnual : this.modelPropuestos.sueldoAnual;
            this.detalleSolicitud.tipoContrato = this.modelPropuestos.tipoContrato === "" ? this.model.tipoContrato : this.modelPropuestos.tipoContrato;
            this.detalleSolicitud.unidadNegocio = this.viewInputs ? this.model.unidadNegocio : this.modelPropuestos.unidadNegocio;

            this.detalleSolicitud.correo = this.modelPropuestos.correo === "" ? this.model.correo : this.modelPropuestos.correo;

            this.detalleSolicitud.supervisaA = this.modelPropuestos.supervisaA === "" ? this.model.supervisaA : this.modelPropuestos.supervisaA;

            this.detalleSolicitud.fechaIngreso = this.modelPropuestos.fechaIngreso === "" ? this.model.fechaIngreso : this.modelPropuestos.fechaIngreso;

            this.detalleSolicitud.alimentacion = this.detalleSolicitudPropuestos.alimentacion;
            this.detalleSolicitud.movilizacion = this.detalleSolicitudPropuestos.movilizacion;

            if (this.totalRegistrosDetallesolicitud === 2) {

              this.detalleSolicitud.idDetalleSolicitud = 2;
              this.solicitudes
                .actualizarDetalleSolicitud(this.detalleSolicitud)
                .subscribe((responseDetalle) => {
                  this.utilService.closeLoadingSpinner(); //comentado mmunoz
                  this.utilService.modalResponse("Datos ingresados correctamente", "success");

                  setTimeout(() => {
                    window.location.reload();
                  }, 1800);
                });
            } else {
              this.detalleSolicitud.idDetalleSolicitud = 100;

              this.solicitudes
                .guardarDetalleSolicitud(this.detalleSolicitud)
                .subscribe((responseDetalle) => {
                  this.utilService.closeLoadingSpinner(); //comentado mmunoz
                  this.utilService.modalResponse("Datos ingresados correctamente", "success");

                  setTimeout(() => {
                    window.location.reload();
                  }, 1800);
                });
            }
          });
      });
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
    console.log(this.selectedOption);
  }

  empleado: string = '';
  isDisabledEmpleado: boolean = false;
  subledger: string = '';
  isDisabledSubledger: boolean = false;

  search = (value: string, propSearch: 'nombreCompleto' | 'subledger', setEmpleadoData: (data: IEmpleadoData) => void): void => {
    this.mantenimientoService
      .getDataEmpleadosEvolution("ev")
      .pipe(
        map(this.buscarValor.bind(this, value, "evType", propSearch)), // Asegúrate de pasar propSearch aquí
        catchError((error) => {
          return this.mantenimientoService
            .getDataEmpleadosEvolution("jaff")
            .pipe(map(this.buscarValor.bind(this, value, "jaffType", propSearch)));
        }),
        catchError(error => {
          return this.mantenimientoService
            .getDataEmpleadosEvolution('spyral')
            .pipe(map(this.buscarValor.bind(this, value, 'spyralType', propSearch)))
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Encontro', data);
          setEmpleadoData(data as IEmpleadoData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  buscarValor = (search, type: "jaffType" | "evType" | 'spyralType', propSearch: 'nombreCompleto' | 'subledger', data: IEmpleados) => {
    const result = data?.[type].find((item) => {
      const regex = new RegExp(search, "i");
      return item[propSearch]?.match(regex); // Asegúrate de que item[propSearch] exista
    });
    if (!result) {
      throw new Error("No se encontró el valor esperado");
    }
    return result;
  };


  onCheckedComp = (event: Event): void => {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.viewInputs = !isChecked;
    console.log(this.viewInputs)
  }


  fechaCambio: string = '';
  isDisabledFechaCambio: boolean = false;

  validateFechaCambio = (value: string) => {
    const fechaReferencia = this.formatter(this.detalleSolicitud.fechaIngreso);

    if (value.length !== 10) {
      return;
    }

    this.isDisabledFechaCambio = true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      this.errorFechaCambio(`El formato ingresado no es valido`);
      this.isDisabledFechaCambio = false;
      return;
    }

    const fechaIngresada = new Date(value);

    if (isNaN(fechaIngresada.getTime())) {
      this.errorFechaCambio(`La fecha ingresada no es valida, por favor verifique`);
      this.isDisabledFechaCambio = false;
      return;
    }

    const diferenciaMeses = this.calcularDiferenciaMeses(fechaReferencia, fechaIngresada);

    if (diferenciaMeses > 1) {
      this.errorFechaCambio(`La fecha de estar dentro del mes en el que se genero esta solicitud`);
      this.isDisabledFechaCambio = false;
      return;
    }

  }

  errorFechaCambio = (msg: string) => {
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  calcularDiferenciaMeses = (fechaDesde: Date, fechaHasta: Date) => {
    const year1 = fechaDesde.getFullYear();
    const year2 = fechaHasta.getFullYear();
    const month1 = fechaDesde.getMonth();
    const month2 = fechaHasta.getMonth();
    const diferencia = (year2 - year1) * 12 + (month2 - month1);
    return diferencia;
  }

  formatter = (timestamp: any): Date => {
    const fecha = new Date(timestamp);

    const fechaFormateada = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(fecha);

    return new Date(fechaFormateada);

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
    dialogReasignarUsuario: () => this.openModalReasignarUsuario(),
  };

  openModal(component: keyof DialogComponents) {
    this.indexedModal[component]();
  }
}
