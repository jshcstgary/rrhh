import { NgIf, CommonModule, NgFor } from "@angular/common";
import { forkJoin, map } from "rxjs";
import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  AfterViewInit,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgSelectConfig, NgSelectModule } from "@ng-select/ng-select";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
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

import { SimpleDatepickerBasic } from "src/app/component/datepicker/simpledatepicker.component";
import { Custommonth } from "src/app/component/datepicker/customonth.component";
import { FeatherModule } from "angular-feather";
import {
  IConsultaSolicitudes,
  IConsultaSolicitudesTable,
} from "./consulta-solicitudes.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaSolicitudesData } from "./consulta-solicitudes.data";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ComponentsModule } from "src/app/component/component.module";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { HttpErrorResponse } from "@angular/common/http";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import { TableComponentData } from "src/app/component/table/table.data";
import { Solicitud } from "../../eschemas/Solicitud";
import { DataFilterSolicitudes } from "src/app/eschemas/DataFilterSolicitudes";

declare var require: any;
const data: any = require("./company.json");

@Component({
  selector: "app-data-table",
  standalone: true,
  templateUrl: "./consulta-solicitudes.component.html",
  styleUrls: ["./consulta-solicitudes.css"],
  imports: [
    NgbNavModule,
    NgbDropdownModule,
    NgFor,
    NgIf,
    NgbAlertModule,
    NgbDatepickerModule,
    SimpleDatepickerBasic,
    Custommonth,
    FeatherModule,
    NgSelectModule,
    NgxDatatableModule,
    NgIf,
    FormsModule,
    NgFor,
    CommonModule,
    ComponentsModule,
  ],
})
export class ConsultaSolicitudesComponent implements AfterViewInit, OnInit {
  public dataTable: IConsultaSolicitudesTable = [];
  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public hasFiltered: boolean = true;
  public submitted: boolean = false;
  public errorMessage: string;
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

  selected_empresa: number;
  selected_producto: number;
  selected_tipo_solicitud: number;
  selected_estado: number;
  public dataFilterSolicitudes = new DataFilterSolicitudes();
  data_empresas = [{ idEmpresa: 1, name: "Reybanpac" }];

  data_productos = [{ idUnidadNegocio: 1, name: "Todos" }];

  data_tipo_solicitud = [
    { id: 1, name: "Requisición de personal" },
    { id: 2, name: "Contratación de familiares" },
    { id: 3, name: "Reingreso de personal" },
    { id: 4, name: "Acción de personal" },
  ];

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

  constructor(
    private config: NgSelectConfig,
    private calendar: NgbCalendar,
    private router: Router,
    private modalService: NgbModal,
    private camundaRestService: CamundaRestService,
    private route: ActivatedRoute,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService
  ) {
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

  PageCrear() {
    this.router.navigate(["/solicitudes/crear-tipo-solicitud"]);
  }
  //Crear Solicitud
  CrearSolicitud() {
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
      console.log("this.dataTipoSolicitudes: ", this.dataTipoSolicitudes);
      console.log("this.dataTipoMotivo: ", this.dataTipoMotivo);
      console.log("this.dataTipoAccion: ", this.dataTipoAccion);

      this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter(
        (data) => data.id == this.solicitud.idTipoSolicitud
      )[0].descripcion;

      this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
        (data) => data.id == this.solicitud.idTipoMotivo
      )[0].descripcion;

      this.solicitud.tipoAccion = this.dataTipoAccion.filter(
        (data) => data.id == this.solicitud.idTipoAccion
      )[0].descripcion;

      console.log("MODELO ACTUALIZADO: ", this.solicitud);

      if (result.isConfirmed) {
        // Inicio de Solicitud
        // Comentado tveas por error
        this.route.params.subscribe((params) => {
          //const processDefinitionKey ="process_modelo";
          const processDefinitionKey = "RequisicionPersonal";
          //const processDefinitionKey = params['processdefinitionkey'];
          const variables = this.generatedVariablesFromFormFields();
          console.log(variables);
          this.camundaRestService
            .postProcessInstance(processDefinitionKey, variables)
            .subscribe((instanceOutput) => {
              this.lookForError(instanceOutput);

              console.log("Instance (instanceOutput): ", instanceOutput);
              this.instanceCreated = new DatosInstanciaProceso(
                instanceOutput.businessKey,
                instanceOutput.definitionId,
                instanceOutput.id,
                instanceOutput.tenantId
              );
              this.solicitud.idInstancia = instanceOutput.id;

              this.solicitudes
                .guardarSolicitud(this.solicitud)
                .subscribe((response) => {
                  this.solicitud.idSolicitud = response.idSolicitud;
                  this.solicitud.fechaActualizacion =
                    response.fechaActualizacion;
                  this.solicitud.fechaCreacion = response.fechaCreacion;
                  console.log(
                    "THIS IS THE MODEL FORM SERVICE 1: ",
                    this.solicitud
                  );
                  console.log(
                    "THIS IS THE MODEL FORM SERVICE 2: ",
                    this.solicitudes.modelSolicitud
                  );
                  console.log(
                    "THIS IS THE RESPONSE OF SAVE SOLICITUD: ",
                    response
                  );
                  setTimeout(() => {
                    this.router.navigate(["/solicitudes/registrar-solicitud"], {
                      queryParams: { ...this.solicitud },
                    });
                  }, 1600);
                  this.utilService.modalResponse(
                    "Datos ingresados correctamente",
                    "success"
                  );
                });
            });
        });

        if (this.submitted) {
          console.log("INGRESA EN this.submitted");

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

  generatedVariablesFromFormFields() {
    return {
      variables: {
        tipo_solicitud: { value: this.solicitud.idTipoSolicitud },
        tipo_motivo: { value: this.solicitud.idTipoMotivo },
        tipo_cumplimiento: { value: this.solicitud.idTipoAccion },
      },
    };
  }

  //fin crear Solicitud Integracion con camunda
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

  filter() {
    console.log("Data filter (After): ", this.dataFilterSolicitudes);
    this.dataFilterSolicitudes.fechaDesde = this.formatFechaISO(
      this.dataFilterSolicitudes,
      "fechaDesde"
    );
    this.dataFilterSolicitudes.fechaHasta = this.formatFechaISO(
      this.dataFilterSolicitudes,
      "fechaHasta"
    );
    console.log("Data filter (Before): ", this.dataFilterSolicitudes);
  }

  formatFechaISO(date: any, fechaProp: string) {
    console.log("DATE QUE RECIBE: ", date);
    return new Date(
      date[fechaProp].year,
      date[fechaProp].month - 1,
      date[fechaProp].day
    ).toISOString();
  }

  ObtenerServicioEstado() {
    return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
      next: (response) => {
        this.data_estado = response.itemCatalogoTypes.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
        console.log("DATA DE ESTADO: ", this.data_estado);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  //mostrar modal de inicio de instancia de la solicitud

  private getDataToTable() {
    const combinedData$ = forkJoin(
      this.solicitudes.getSolicitudes(),
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

    combinedData$.subscribe((data) => {
      // Aquí tienes la data combinada y ordenada
      this.dataTable = data;
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

  ngOnInit() {
    this.getDataToTable();
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioTipoAccion();
    this.ObtenerServicioEstado();
  }
}
