import { DataFilterNivelesAprobacion } from "./../../eschemas/DataFilterNivelesAprobacion";
import { NgIf, CommonModule, NgFor } from "@angular/common";
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
  NgbPaginationModule,
} from "@ng-bootstrap/ng-bootstrap";

import { SimpleDatepickerBasic } from "src/app/component/datepicker/simpledatepicker.component";
import { Custommonth } from "src/app/component/datepicker/customonth.component";
import { FeatherModule } from "angular-feather";
import { IConsultaNivelesAprobacionesTable } from "./niveles-aprobacion.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaSolicitudesData } from "./niveles-aprobacion.data";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ComponentsModule } from "src/app/component/component.module";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UtilService } from "src/app/services/util/util.service";
import { DatosNivelesAprobacion } from "src/app/eschemas/DatosNivelesAprobacion";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";
import { TableService } from "src/app/component/table/table.service";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { TableComponentData } from "src/app/component/table/table.data";
declare var require: any;
const data: any = require("./company.json");
interface Column {
  title: string;
  dataIndex: string;
  width?: string;
  type?: "checkbox" | "actions" | "";
  actions?: {
    id: string;
    label: string;
    icon?: string;
    buttonClass?: string;
    tooltip?: string;
  }[];
}

interface RowData {
  // Define the properties of your row data
  [key: string]: any;
  isEditingRow?: boolean;
}
const COUNTRIES: any[] = [
  {
    name: "Russia",
    flag: "f/f3/Flag_of_Russia.svg",
    area: 17075200,
    population: 146989754,
  },
  {
    name: "Canada",
    flag: "c/cf/Flag_of_Canada.svg",
    area: 9976140,
    population: 36624199,
  },
  {
    name: "United States",
    flag: "a/a4/Flag_of_the_United_States.svg",
    area: 9629091,
    population: 324459463,
  },
  {
    name: "China",
    flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
    area: 9596960,
    population: 1409517397,
  },
];
@Component({
  selector: "app-niveles-aprobacion",
  standalone: true,
  templateUrl: "./niveles-aprobacion.component.html",
  styleUrls: ["./niveles-aprobacion.component.scss"],
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
    NgbPaginationModule,
  ],
})
export class NivelesAprobacionComponent {
  //public dataTable: IConsultaNivelesAprobacionesTable = [];
  public dataTable: any[] = [];
  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public hasFiltered: boolean = true;
  public submitted: boolean = false;
  public errorMessage: string;
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];
  public dataTipoMotivo: any[] = [];
  public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
  private instanceCreated: DatosInstanciaProceso;
  consultaSolicitudesSelect!: string;
  isLoading = false;
  model: NgbDateStruct;
  disabled = true;
  today = this.calendar.getToday();

  @ViewChild("myModalSolicitudes", { static: false })
  myModalSolicitudes: TemplateRef<any>;

  //  basic navs
  active = 1;

  // vertical
  active2 = "top";

  // selecting navs
  active3: any;

  selected_hacienda: number;
  selected_tipo_motivo: number;
  selected_tipo_solicitud: number;
  selected_niveldireccion: number;

  data_empresas = [{ id: 10021, name: "Reybanpac" }];
  public inputsEditRow: IInputsComponent;
  /*data_productos = [
    { id: 1, name: 'Todos' },
  ];*/

  data_tipo_labor = [
    { id: 1, name: "Requisición de personal" },
    { id: 2, name: "Contratación de familiares" },
    { id: 3, name: "Reingreso de personal" },
    { id: 4, name: "Acción de personal" },
  ];

  data_estado = [{ id: 1, name: "Todos" }];

  editing: any = {};
  rows: any = new Array();
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  // columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];
  @ViewChild(NivelesAprobacionComponent) table:
    | NivelesAprobacionComponent
    | any;

  // columns: IColumnsTable = ConsultaSolicitudesData.columns;
  data: RowData[];
  isTableEmpty = false;
  countries = COUNTRIES;

  /*
    NUEVO
  */
  public tableWidth: string = "100%";
  public columns: IColumnsTable = ConsultaSolicitudesData.columns;
  public allowCloneButton: boolean = false;
  public contexto: any;
  public onCancelEditRowTable: string;
  public page: number = 1;
  public rowsPerPageValue: number = TableComponentData.defaultRowPerPage;
  public totalRows: number = 0;
  public onChangePagination: string;
  public rowsPerPageOptions: number[] = TableComponentData.rowsPerPage;

  constructor(
    private config: NgSelectConfig,
    private calendar: NgbCalendar,
    private router: Router,
    private modalService: NgbModal,
    private camundaRestService: CamundaRestService,
    private route: ActivatedRoute,
    private nivelesAprobacionService: NivelesAprobacionService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    public tableService: TableService
  ) {
    this.camundaRestService = camundaRestService;
    this.route = route;
    this.router = router;
    this.errorMessage = null;
    this.model = calendar.getToday();

    this.config.notFoundText = "Custom not found";
    this.config.appendTo = "body";
    this.config.bindValue = "value";

    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"], {
      queryParams: { id_edit },
    });
  }

  public getAttributesToInputCell(dataIndex: string): number {
    return this.inputsEditRow.findIndex((x) => x.id === dataIndex);
  }

  public onSaveRowDataToModified(finishedClonningRow: boolean = false) {
    this.inputsEditRow
      .filter((x) => x.required)
      .map((x) => x.id)
      .forEach((x) => {
        const element = document.getElementById(x);
        if (element) {
          element.focus();
          element.blur();
        }
      });
    /*this.contexto[this.onSaveRowTable](
      this.rowDataModified,
      finishedClonningRow
    );*/
  }

  public onCancelRow() {
    this.tableService.changeStateIsAnyEditRowActive(false);
    this.contexto[this.onCancelEditRowTable]();
  }

  public onChangePage(page: number) {
    this.contexto[this.onChangePagination](page, this.rowsPerPageValue);
  }

  public onChangeRowsPerPage(e: Event) {
    const selectValue = parseInt((e.target as HTMLSelectElement).value);
    this.rowsPerPageValue = selectValue;
    this.contexto[this.onChangePagination](1, selectValue);
    this.page = 1;
  }

  /*public onCheckHeaderCheckbox() {
    if (this.isChekedHeaderInput) {
      this.rowsChecked = [];
    } else {
      this.rowsChecked = this.data.map((x) => x.key);
    }
    this.tableService.onCheckTable(this.tableName, this.rowsChecked);
    if (this.onCheck !== undefined) {
      this.contexto[this.onCheck](this.rowsChecked);
    }
    this.validateHeaderInputState();
  }*/

  private getDataToTable() {
    this.utilService.openLoadingSpinner(
      "Cargando información. Espere por favor..."
    );
    return this.nivelesAprobacionService.obtenerNiveleAprobaciones().subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map(
          (nivelAprobacionResponse) => ({
            ...nivelAprobacionResponse,
            estado: nivelAprobacionResponse.estado === "A",
          })
        );
        this.utilService.closeLoadingSpinner();
        // console.log("Data de niveles de aprobacion: ", this.dataTable);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
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

  OpnenModal() {
    const modalDiv = document.getElementById("myModal");
    if (modalDiv != null) {
      modalDiv.style.display = "block";
    }
  }

  CloseModal() {
    const modalDiv = document.getElementById("myModal");
    if (modalDiv != null) {
      modalDiv.style.display = "none";
    }
  }

  PageCrear() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }

  PageEditar() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
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

  //fin crear Solicitud Integracion con camunda

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
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  toggleDisabled() {
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

  filterDataTable() {
    if (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
      this.utilService.modalResponse(
        "Por favor complete los campos del filtro",
        "info"
      );
    } else {
      this.utilService.openLoadingSpinner(
        "Cargando información, espero por favor..."
      );
      console.log("FILTER DATA: ", this.dataFilterNivelesAprobacion);
      this.nivelesAprobacionService
        .filterNivelesAprobaciones(
          this.dataFilterNivelesAprobacion.tipoSolicitud,
          this.dataFilterNivelesAprobacion.tipoMotivo,
          this.dataFilterNivelesAprobacion.nivelDireccion
        )
        .subscribe({
          next: (response) => {
            console.log("filerDataTable: ", response);
            this.dataTable = response.nivelAprobacionType.map(
              (nivelAprobacionResponse) => ({
                ...nivelAprobacionResponse,
                estado: nivelAprobacionResponse.estado === "A",
              })
            );
            this.utilService.closeLoadingSpinner();
            console.log("Data de niveles de aprobacion: ", this.dataTable);
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
    }
  }

  ngOnInit() {
    // this.filterDataTable();
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioTipoMotivo();
    this.getDataToTable();
  }
}
