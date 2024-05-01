import { NgIf, CommonModule, NgFor } from "@angular/common";
import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  AfterViewInit,
  ElementRef,
  TemplateRef,
  SimpleChanges,
} from "@angular/core";

import { FormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgSelectConfig, NgSelectModule } from "@ng-select/ng-select";
import { forkJoin, map } from "rxjs";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaSolicitudesData } from "./consulta-solicitudes.data";
import {
  NgbNavModule,
  NgbNavChangeEvent,
  NgbDropdownModule,
  NgbAlertModule,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import {
  IConsultaSolicitud,
  IConsultaSolicitudTable,
} from "./consulta-solicitudes.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { UtilData } from "src/app/services/util/util.data";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { SimpleDatepickerBasic } from "src/app/component/datepicker/simpledatepicker.component";
import { Custommonth } from "src/app/component/datepicker/customonth.component";
import { FeatherModule } from "angular-feather";
import {
  IConsultaSolicitudes,
  IConsultaSolicitudesTable,
} from "./consulta-solicitudes.interface";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";

import { NgSelectComponent } from "@ng-select/ng-select";
import { ComponentsModule } from "src/app/component/component.module";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { TableComponentData } from "src/app/component/table/table.data";
import { DataFilterSolicitudes } from "src/app/eschemas/DataFilterSolicitudes";
import { ConsultaSolicitudesService } from "./consulta-solicitudes.service";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
declare var require: any;
const data: any = require("./company.json");
@Component({
  selector: "app-data-table",
  templateUrl: "./consulta-solicitudes.component.html",
  styleUrls: ["./consulta-solicitudes.component.scss"],
})
export class ConsultaSolicitudesComponent implements AfterViewInit, OnInit {
  // public dataTable: IConsultaSolicitudesTable = [];

  public dataTable: IConsultaSolicitudesTable = [
    {
      idSolicitud: 1,
      tipoSolicitud: "Tipo 1",
      nombreEmpleado: "Empleado 1",
      estado: true,
    },
    {
      idSolicitud: 2,
      tipoSolicitud: "Tipo 2",
      nombreEmpleado: "Empleado 2",
      estado: false,
    },
    {
      idSolicitud: 3,
      tipoSolicitud: "Tipo 3",
      nombreEmpleado: "Empleado 3",
      estado: true,
    },
    {
      idSolicitud: 4,
      tipoSolicitud: "Tipo 4",
      nombreEmpleado: "Empleado 4",
      estado: false,
    },
    {
      idSolicitud: 5,
      tipoSolicitud: "Tipo 5",
      nombreEmpleado: "Empleado 5",
      estado: true,
    },
    {
      idSolicitud: 6,
      tipoSolicitud: "Tipo 6",
      nombreEmpleado: "Empleado 6",
      estado: false,
    },
    {
      idSolicitud: 7,
      tipoSolicitud: "Tipo 7",
      nombreEmpleado: "Empleado 7",
      estado: true,
    },
    {
      idSolicitud: 8,
      tipoSolicitud: "Tipo 8",
      nombreEmpleado: "Empleado 8",
      estado: false,
    },
    {
      idSolicitud: 9,
      tipoSolicitud: "Tipo 9",
      nombreEmpleado: "Empleado 9",
      estado: true,
    },
    {
      idSolicitud: 10,
      tipoSolicitud: "Tipo 10",
      nombreEmpleado: "Empleado 10",
      estado: false,
    },
    {
      idSolicitud: 11,
      tipoSolicitud: "Tipo 11",
      nombreEmpleado: "Empleado 11",
      estado: true,
    },
    {
      idSolicitud: 12,
      tipoSolicitud: "Tipo 12",
      nombreEmpleado: "Empleado 12",
      estado: false,
    },
    {
      idSolicitud: 13,
      tipoSolicitud: "Tipo 13",
      nombreEmpleado: "Empleado 13",
      estado: true,
    },
    {
      idSolicitud: 14,
      tipoSolicitud: "Tipo 14",
      nombreEmpleado: "Empleado 14",
      estado: false,
    },
    {
      idSolicitud: 15,
      tipoSolicitud: "Tipo 15",
      nombreEmpleado: "Empleado 15",
      estado: true,
    },
    {
      idSolicitud: 16,
      tipoSolicitud: "Tipo 16",
      nombreEmpleado: "Empleado 16",
      estado: false,
    },
    {
      idSolicitud: 17,
      tipoSolicitud: "Tipo 17",
      nombreEmpleado: "Empleado 17",
      estado: true,
    },
    {
      idSolicitud: 18,
      tipoSolicitud: "Tipo 18",
      nombreEmpleado: "Empleado 18",
      estado: false,
    },
    {
      idSolicitud: 19,
      tipoSolicitud: "Tipo 19",
      nombreEmpleado: "Empleado 19",
      estado: true,
    },
    {
      idSolicitud: 20,
      tipoSolicitud: "Tipo 20",
      nombreEmpleado: "Empleado 20",
      estado: false,
    },
  ];
  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public hasFiltered: boolean = true;
  public submitted: boolean = false;
  public errorMessage: string;
  public typeSolicitudSelected: any;
  public tipoSolicitudSeleccionada: any;

  // public dataTiposMotivosPorTipoSolicitud : any[] = [];

  public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};

  public dataTiposAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};

  /*
    Cuando es Acción Personal, Reingreso Personal y Contratación de Familiares
    se oculta el Tipo de Motivo, mostrar sólo Tipo de Acción
  */
  public idsOcultarTipoMotivo: any[] = ["3", "5", "6", 3, 5, 6];

  // No mostrar = false
  public desactivarTipoMotivo = false;

  /*
    Cuando es Requisión de personal se oculta Tipo de Acción, muestra sólo Tipo de Motivo
  */
  public idsOcultarTipoAccion: any[] = ["1", 1];

  // No mostrar = false
  public desactivarTipoAccion = false;

  modelo: DatosProcesoInicio = new DatosProcesoInicio();
  private instanceCreated: DatosInstanciaProceso;
  consultaSolicitudesSelect!: string;
  isLoading = false;
  model: NgbDateStruct;
  disabled = true;
  today = this.calendar.getToday();

  public dataTipoSolicitudes: any[] = [];
  public dataTipoMotivo: any[] = [];
  public dataTipoAccion: any[] = [];
  public data_estado: any[] = [];
  public rowsPerPageTable: number = TableComponentData.defaultRowPerPage;

  @ViewChild("myModalSolicitudes", { static: false })
  myModalSolicitudes: TemplateRef<any>;

  //  basic navs
  active = 1;

  // vertical
  active2 = "top";

  // selecting navs
  active3: any;

  // public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
  // public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
  public dataNivelDireccion: any[] = [];

  /*data_estado = [
    { id: 1, name: 'Aprobado' },
    { id: 2, name: 'En espera' },
    { id: 3, name: 'Creado' },
    { id: 4, name: 'Enviado' },
    { id: 5, name: 'Cancelado' },
  ];*/

  editing: any = {};
  rows: any = new Array();
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];

  @ViewChild(ConsultaSolicitudesComponent) table:
    | ConsultaSolicitudesComponent
    | any;

  public solicitud = new Solicitud();
  public detalleSolicitud = new DetalleSolicitud();

  selected_empresa: number;
  selected_producto: number;
  selected_tipo_solicitud: number;
  selected_estado: number;
  public dataFilterSolicitudes = new DataFilterSolicitudes();
  data_empresas = [{ idEmpresa: "01", name: "Reybanpac" }];

  dataUnidadesNegocio: string[] = [];
  dataEmpresa: string[] = [];

  data_tipo_solicitud = [
    { id: 1, name: "Requisición de personal" },
    { id: 2, name: "Contratación de familiares" },
    { id: 3, name: "Reingreso de personal" },
    { id: 4, name: "Acción de personal" },
  ];

  constructor(
    private config: NgSelectConfig,
    public consultaSolicitudesService: ConsultaSolicitudesService,

    private tableService: TableService,
    private route: ActivatedRoute,
    private validationsService: ValidationsService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private calendar: NgbCalendar,
    private camundaRestService: CamundaRestService,
    private modalService: NgbModal
  ) {
    this.model = calendar.getToday();

    /*this.solicitud.idTipoSolicitud = 1;
    this.solicitud.idTipoMotivo = 1;
    this.solicitud.idTipoAccion = 1;*/

    this.camundaRestService = camundaRestService;
    this.route = route;
    this.router = router;
    this.errorMessage = null;
    this.model = calendar.getToday();

    this.config.notFoundText = "Custom not found";
    this.config.appendTo = "body";
    this.config.bindValue = "value";
    this.solicitud = this.solicitudes.modelSolicitud;
    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = data;
  }
  updateValue(event: any, cell: any, rowIndex: number) {
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  ngDoCheck(): void {
    // console.log("EJECUTANDO NGONCHANGES");
    this.typeSolicitudSelected = this.dataTipoSolicitudes.filter(
      (data) => data.descripcion == "Acción de Personal"
    )[0]?.id;

    /*id: r.id,
          descripcion: r.tipoSolicitud*/

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  ngOnInit() {
    // this.solicitud.idTipoSolicitud = 1;
    // this.solicitud.idTipoMotivo = 1;
    // this.solicitud.idTipoAccion = 1;
    // console.log("MI MODELO INCIAL", this.solicitud);
    this.getDataToTable();
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioTipoAccion();

    this.obtenerEmpresaYUnidadNegocio();
  }

  PageCrear() {
    this.router.navigate(["/solicitudes/crear-tipo-solicitud"]);
  }

  //Crear Solicitud
  CrearInstanciaSolicitud() {
    console.log("Nuevo proceso iniciado con datos..");
    Swal.fire({
      text: "¿Desea crear la Solicitud?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(227, 199, 22)",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      console.log("DATA dataTipoSolicitudes: ", this.dataTipoSolicitudes);
      console.log("DATA tipoMotivo: ", this.dataTipoMotivo);
      console.log("DATA tipoAccion: ", this.dataTipoAccion);

      /*
      public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
      {};

      public dataTiposAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } =
      {};
      */

      console.log(
        "dataTiposMotivosPorTipoSolicitud: ",
        this.dataTiposMotivosPorTipoSolicitud
      );
      console.log("this.solicitud.idTipoMotivo: ", this.solicitud.idTipoMotivo);
      console.log(
        "dataTiposAccionesPorTipoSolicitud: ",
        this.dataTiposAccionesPorTipoSolicitud
      );
      console.log("this.solicitud.idTipoAccion: ", this.solicitud.idTipoAccion);

      this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter(
        (data) => data.id == this.solicitud.idTipoSolicitud
      )[0]?.descripcion;
      console.log(
        "SE COMPARA CON ESTE ID DE SOLICITUD = " +
          this.solicitud.idTipoSolicitud +
          " y con esta descripción de SOLICITUD" +
          this.solicitud.tipoSolicitud
      );
      this.solicitud.tipoMotivo = this.dataTiposMotivosPorTipoSolicitud[
        this.solicitud.idTipoSolicitud
      ].filter((data) => data.id == this.solicitud.idTipoMotivo)[0]?.tipoMotivo;

      this.solicitud.tipoAccion = this.dataTiposAccionesPorTipoSolicitud[
        this.solicitud.idTipoSolicitud
      ].filter((data) => data.id == this.solicitud.idTipoAccion)[0]?.tipoAccion;

      // Comentado tveas cambio
      /*
      this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
        (data) => data.id == this.solicitud.idTipoMotivo
      )[0]?.descripcion;

      this.solicitud.tipoAccion = this.dataTipoAccion.filter(
        (data) => data.id == this.solicitud.idTipoAccion
      )[0]?.descripcion;
      */

      if (result.isConfirmed) {
        this.utilService.openLoadingSpinner(
          "Creando solicitud, espere por favor."
        );
        // Inicio de Solicitud
        // Comentado tveas por error
        this.route.params.subscribe((params) => {
          //const processDefinitionKey ="process_modelo";
          const processDefinitionKey = "RequisicionPersonal";
          // const processDefinitionKey = "process_modelo";
          //const processDefinitionKey = params['processdefinitionkey'];
          const variables = this.generatedVariablesFromFormFields();
          console.log("THIS VARIABLES22222: ", variables);
          this.camundaRestService
            .postProcessInstance(processDefinitionKey, variables)
            .subscribe((instanceOutput) => {
              this.lookForError(instanceOutput);
              this.utilService.closeLoadingSpinner();
              console.log("Response instanceOutput = ", instanceOutput);
              this.instanceCreated = new DatosInstanciaProceso(
                instanceOutput.businessKey,
                instanceOutput.definitionId,
                instanceOutput.id,
                instanceOutput.tenantId
              );
              this.solicitud.idInstancia = instanceOutput.id;
              this.solicitud.estado = "Creado"; //tveas TODO improve [Activo]
              this.solicitud.estadoSolicitud = "3"; // tveas TODO improve [Creado]

              this.solicitudes
                .guardarSolicitud(this.solicitud)
                .subscribe((responseSolicitud) => {
                  console.log("Response solicitud = ", responseSolicitud);
                  console.log("Solicitud model = ", this.solicitud);
                  this.solicitud.idSolicitud = responseSolicitud.idSolicitud;
                  this.solicitud.fechaActualizacion =
                    responseSolicitud.fechaActualizacion;
                  this.solicitud.fechaCreacion =
                    responseSolicitud.fechaCreacion;
                  this.submitted = true;
                  // console.log("IDDDDD INSTANCIA: ", this.solicitud.idInstancia);
                  this.detalleSolicitud.idSolicitud =
                    responseSolicitud.idSolicitud;
                  this.detalleSolicitud.estado = "A";
                  console.log(
                    "Esto le mando como json a detalle solicitud: ",
                    this.detalleSolicitud
                  );
                  this.solicitudes
                    .guardarDetalleSolicitud(this.detalleSolicitud)
                    .subscribe((responseDetalle) => {
                      console.log("Response detalle = ", responseDetalle);
                      setTimeout(() => {
                        this.router.navigate(
                          [
                            "/solicitudes/registrar-solicitud",
                            this.solicitud.idInstancia,
                            this.solicitud.idSolicitud,
                          ],
                          {
                            queryParams: { ...this.solicitud },
                          }
                        );
                      }, 1800);
                    });
                });

              /*this.solicitudes
                .guardarSolicitud(this.solicitud)
                .subscribe((response) => {
                  console.log("MI MODELO AL ENVIAR ES ESTO: ", this.solicitud);
                  this.solicitud.idSolicitud = response.idSolicitud;
                  this.solicitud.fechaActualizacion =
                    response.fechaActualizacion;
                  this.solicitud.fechaCreacion = response.fechaCreacion;
                  this.submitted = true;
                  console.log("IDDDDD INSTANCIA: ", this.solicitud.idInstancia);
                  setTimeout(() => {
                    this.router.navigate(
                      [
                        "/solicitudes/registrar-solicitud",
                        this.solicitud.idInstancia,
                      ],
                      {
                        queryParams: { ...this.solicitud },
                      }
                    );
                  }, 1600);
                });*/
            });
        });

        if (this.submitted) {
          /*this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );*/
          // this.router.navigate(["/solicitudes/registrar-solicitud"]);
        }

        //Fin Solicitud
      }
    });
  }

  getCreatedId(): string {
    if (
      this.instanceCreated &&
      this.instanceCreated.id != null &&
      this.instanceCreated.id != ""
    ) {
      return this.instanceCreated.id;
    }

    return "No se ha creado Id de Proceao";
  }

  obtenerEmpresaYUnidadNegocio() {
    console.log("Executing ObtenerServicioNivelDireccion() method");

    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
        console.log("Response = ", response);
        this.dataUnidadesNegocio = [
          ...new Set(
            response.evType.map((item) => {
              return item.unidadNegocio;
            })
          ),
        ];
        this.dataEmpresa = [
          ...new Set(
            response.evType.map((item) => {
              return item.compania;
            })
          ),
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  generatedVariablesFromFormFields() {
    let variables: any = {};
    console.log("INGRESA AQUÍIIIIIIIIIIIIIIIII");
    console.log("this.solicitud.tipoAccion: ", this.solicitud.tipoAccion);
    console.log("this.solicitud.tipoMotivo: ", this.solicitud.tipoMotivo);
    console.log("this.solicitud.tipoSolicitud: ", this.solicitud.tipoSolicitud);
    variables.tipoSolicitud = { value: this.solicitud.tipoSolicitud };
    if (this.solicitud.idTipoSolicitud == this.typeSolicitudSelected) {
      variables.tipoAccion = { value: this.solicitud.tipoAccion };
    } else {
      variables.tipoMotivo = { value: this.solicitud.tipoMotivo };
    }

    return { variables };
  }

  // tipoSolicitud
  onChangeTipo(id: number, type: string, data: any[]) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    let descripcion = data.filter((item) => item.id == id)[0]?.descripcion;
    switch (type) {
      case "tipoSolicitud":
        this.solicitud.tipoSolicitud = descripcion;
        break;
      case "tipoMotivo":
        this.solicitud.tipoMotivo = descripcion;
        break;
      case "tipoAccion":
        this.solicitud.tipoAccion = descripcion;
        break;
    }
  }

  onChangeTipoSolicitud(idTipoSolicitud: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.tipoSolicitudSeleccionada = idTipoSolicitud;
    this.desactivarTipoMotivo =
      !this.idsOcultarTipoMotivo.includes(idTipoSolicitud);

    console.log("this.desactivarTipoMotivo: ", this.desactivarTipoMotivo);
    console.log("this.idsOcultarTipoMotivo: ", this.idsOcultarTipoMotivo);
    console.log("idTipoSolicitud: ", idTipoSolicitud);

    this.desactivarTipoAccion =
      !this.idsOcultarTipoAccion.includes(idTipoSolicitud);

    if (!this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getTiposMotivosPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }

    if (!this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getTiposAccionesPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataTiposAccionesPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }

    this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter(
      (data) => data.id == idTipoSolicitud
    )[0]?.descripcion;
  }

  onChangeTipoMotivo(idTipoMotivo: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
      (data) => data.id == idTipoMotivo
    )[0]?.descripcion;
  }

  onChangeTipoAccion(idTipoAccion: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.solicitud.tipoAccion = this.dataTipoAccion.filter(
      (data) => data.id == idTipoAccion
    )[0]?.descripcion;
  }

  //LLenar combo Tipo Solicitud
  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        this.dataTipoSolicitudes = response.tipoSolicitudType.map((r) => ({
          id: r.id,
          descripcion: r.tipoSolicitud,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  mostrarModalCrearSolicitudes() {
    this.submitted = false;
    this.modalService.open(this.myModalSolicitudes, {
      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        return true;
      },
    });
    this.isLoading = false;
  }

  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      this.errorMessage = result.message
        ? result.name + " " + result.message
        : result.error.message;
      console.log("routin to app error page", this.errorMessage);
      this.router.navigate(["error"], {
        queryParams: { message: this.errorMessage },
      });
    }
  }

  filterDataTable() {
    switch (this.dataFilterSolicitudes.verifyFilterFields()) {
      case "case1":
        this.getDataToTable();
        break;
      case "case2":
        this.getDataToTable();
        break;
      case "case3":
        this.getDataToTable();
        break;
      case "case4":
        this.utilService.modalResponse(
          "Por favor complete los campos del filtro",
          "info"
        );
        break;
      case "case5":
        let data = { ...this.dataFilterSolicitudes };
        data.fechaDesde = this.formatFecha(
          this.dataFilterSolicitudes,
          "fechaDesde"
        );
        data.fechaHasta = this.formatFecha(
          this.dataFilterSolicitudes,
          "fechaHasta"
        );
        this.getDataToTableFilter(data);
        break;
    }
  }

  clearFechaDesde(fechaProp: string) {
    // data[]
  }

  formatFecha(data: any, fechaProp: string) {
    return (
      data[fechaProp].year +
      "-" +
      data[fechaProp].month +
      "-" +
      data[fechaProp].day
    );
  }

  formatFechaISO(date: any, fechaProp: string) {
    return new Date(
      date[fechaProp].year,
      date[fechaProp].month - 1,
      date[fechaProp].day
    ).toISOString();
  }

  // keep content
  active4 = 1;

  // dynamic tabs
  tabs = [1, 2, 3, 4, 5];
  counter = this.tabs.length + 1;
  active5: any;

  close(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs.filter((id) => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  add(event: MouseEvent) {
    this.tabs.push(this.counter++);
    event.preventDefault();
  }

  //metodos de prueba

  /* Hacer foco sobrehacienda cuando se renderiza la pantalla */
  @ViewChild("inputSelectHacienda") inputSelectHacienda!: NgSelectComponent;
  ngAfterViewInit() {
    //this.inputSelectHacienda.focus();
  }
  /* Funcion para hacer focus al select de producto */
  @ViewChild("inputSelectProducto") inputSelectProducto!: NgSelectComponent;
  public onChangeHacienda() {
    //this.inputSelectProducto.focus();
  }
  /* Funcion para hacer focus al input de fecha */
  @ViewChild("inputDateFecha") inputDateFecha!: ElementRef;
  public onChangeProducto() {
    //this.inputDateFecha.nativeElement.focus();
  }
  /* Funcion para hacer focus al select de Labor */
  @ViewChild("inputSelectLabor") inputSelectLabor!: NgSelectComponent;
  public onChangeFecha() {
    //this.inputSelectLabor.focus();
  }
  /* Funcion para hacer focus al select de trabajador */
  @ViewChild("inputSelectTrabajador") inputSelectTrabajador!: NgSelectComponent;
  public onChangeTipoLabor() {
    //this.inputSelectTrabajador.focus();
  }
  /* Funcion para hacer focus al input de fecha */
  @ViewChild("buttonSearch") buttonSearch!: ElementRef;
  public onChangeTrabajador() {
    //this.buttonSearch.nativeElement.focus();
  }

  getDataToTableFilter(data: any) {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    const combinedData$ = forkJoin(
      this.consultaSolicitudesService.filterSolicitudes(
        data.empresa,
        data.unidadNegocio,
        data.idTipoSolicitud,
        data.estado,
        data.fechaDesde,
        data.fechaHasta
      ),
      this.solicitudes.getDetalleSolicitud()
    ).pipe(
      map(([solicitudes, detallesSolicitud]) => {
        // Combinar las solicitudes y los detalles de la solicitud
        const data = solicitudes.solicitudType.map((solicitud) => {
          const detalles = detallesSolicitud.detalleSolicitudType.find(
            (detalle) => detalle.idSolicitud === solicitud.idSolicitud
          );
          return { ...solicitud, ...detalles };
        });

        // Ordenar la data por fechaCreacion de forma descendente
        return data.sort((a, b) => {
          return b.idDetalleSolicitud - a.idDetalleSolicitud;
        });
      })
    );

    combinedData$.subscribe({
      next: (response) => {
        this.dataTable = response;

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        console.log("error: ", error);
        this.dataTable = [];
        this.utilService.modalResponse(
          "No existen registros para esta búsqueda",
          "error"
        );
      },
    });

    /*return this.solicitudes.getSolicitudes().subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse=>({
          ...nivelAprobacionResponse,
          estado: nivelAprobacionResponse.estado === "A",
        })));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });*/
  }

  ObtenerServicioEstado() {
    return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
      next: (response) => {
        this.data_estado = response.itemCatalogoTypes.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
        console.log("ESTADOSSSS: ", this.data_estado);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  private getDataToTable() {
    this.ObtenerServicioEstado();
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    const combinedData$ = forkJoin(
      this.solicitudes.getSolicitudes(),
      this.solicitudes.getDetalleSolicitud()
    ).pipe(
      map(([solicitudes, detallesSolicitud]) => {
        // Combinar las solicitudes y los detalles de la solicitud
        console.log("GET SOLICITUDES Y DETALLES: ", solicitudes);
        console.log("GET SOLICITUDES Y DETALLES: ", detallesSolicitud);
        const data = solicitudes.solicitudType.map((solicitud) => {
          const detalles = detallesSolicitud.detalleSolicitudType.find(
            (detalle) => detalle.idSolicitud === solicitud.idSolicitud
          );
          return { ...solicitud, ...detalles };
        });

        // Ordenar la data por fechaCreacion de forma descendente
        return data.sort((a, b) => {
          return b.idDetalleSolicitud - a.idDetalleSolicitud;
        });
      })
    );

    combinedData$.subscribe((data) => {
      this.utilService.closeLoadingSpinner();
      // this.data_estado.find(itemEstado => itemEstado.codigo == itemSolicitud.estadoSolicitud)
      console.log("ESTA ES LA DATA: ", data);
      console.log("MI DATA ESTADO AL ITERAR: ", this.data_estado);
      this.dataTable = data.map((itemSolicitud) => {
        let descripcionEstado = this.data_estado.find(
          (itemEstado) => itemEstado.codigo == itemSolicitud.estadoSolicitud
        );
        console.log("DESCRIPCION ESTADO: ", descripcionEstado);
        return {
          ...itemSolicitud,
          estado:
            descripcionEstado !== undefined
              ? descripcionEstado.descripcion
              : "N/A",
        };
      });
      // Aquí tienes la data combinada y ordenada
    });

    /*return this.solicitudes.getSolicitudes().subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse=>({
          ...nivelAprobacionResponse,
          estado: nivelAprobacionResponse.estado === "A",
        })));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });*/
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    this.router.navigate(["/solicitudes/detalle-solicitud", id_edit]);
  }

  mostrarModalCrearInstanciaSolicitud() {
    this.submitted = false;
    this.modalService.open(this.myModalSolicitudes, {
      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        return true;
      },
    });
    this.isLoading = false;
  }

  ObtenerServicioTipoAccion() {
    return this.mantenimientoService.getTipoAccion().subscribe({
      next: (response) => {
        this.dataTipoAccion = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoAccion,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes.map((r) => ({
          ...r,
          id: r.id,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
      },

      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
  //dataTipoMotivo

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        this.dataTipoMotivo = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoMotivo,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  Eliminar() {
    Swal.fire({
      text: "¿Estás seguro de realizar esta acción?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0056B3",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: "Registro Eliminado.",
          icon: "success",
          confirmButtonColor: "#0056B3",
        });
      }
    });
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyUp(event: KeyboardEvent): void {
    // Verifica las teclas específicas que deseas activar
    if (event.altKey && event.key === "c") {
      // Ejecuta la acción que deseas realizar
      this.activarOpcion(event.key);
      this.PageCrear();
    }
  }

  activarOpcion(letra): void {
    //const elemento = this.el.nativeElement.querySelector('#1');
    //if (elemento) {
    //  this.renderer.selectRootElement(elemento).click();
    //}
    // Lógica para activar la opción deseada

    console.log("Opción activada con Alt + " + letra);
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log("onNavChange");
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  toggleDisabled() {
    console.log("MY TOGGLE FUN");
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.active = 1;
    }
  }

  pageCrear() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }
}
