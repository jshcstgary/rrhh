import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import {
  IFormItems,
  ISearchButtonForm,
} from "src/app/component/form/form.interface";
import { FormService } from "src/app/component/form/form.service";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { TableComponentData } from "src/app/component/table/table.data";
import {
  IColumnsTable,
  IRowTableAttributes,
  idActionType,
  sortColOrderType,
} from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import {
  FormatoUtilReporte,
  reportCodeEnum,
} from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { PlantillaEData } from "./plantillaE.data";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
@Component({
  selector: "plantilla-e-component",
  templateUrl: "./plantillaE.component.html",
  styleUrls: ["./plantillaE.component.scss"],
})
export class PlantillaEComponent implements AfterViewInit, OnInit, OnChanges {
  @Input({ required: false }) public showFilterTipoSolicitud: boolean = true;
  @Input({ required: false }) public disabledFilterTipoSolicitud: boolean = false;
  @Input({ required: false }) public showButtonExportar: boolean = true
  @Input({ required: false }) public showCreateButton: boolean = true;

  @Input({ required: false }) public colIdToDisable: string | string[] = "";
  @Input({ required: false }) public keyNameTable: string = "";
  @Input({ required: false }) public dataFilterNivelesAprobacion =
    new DataFilterNivelesAprobacion();

  @Input({ required: false }) public dataTipoMotivo: any[] = [];
  @Input({ required: false }) public dataTipoSolicitudes: any[] = [];
  @Input({ required: false }) public dataNivelDireccion: any[] = [];

  selected_tipo_motivo: number;
  selected_tipo_solicitud: number;
  selected_niveldireccion: number;

  @Input({ required: true }) public columnsTable: IColumnsTable = [];
  @Input({ required: true }) public originalDataTable: any[] = [];
  @Input() public placeholderHeaderInputText: string = "";
  @Input({ required: true }) public contexto: any;
  @Input() public onSaveRowData: string = "validateToSave";
  @Input() public clickOnActionRow: string = "onRowActionClicked";
  @Input() public clickOnFilter: string = "filterDataTable";
  @Input() public clickOnPageCrear: string = "pageCrear";
  @Input() public onRowChange: string;
  @Input() public tableWidth: string = "100%";
  @Input() public tableInputsEditRow: IInputsComponent;
  @Input({ required: false }) public defaultEmptyRowTable: any;
  @Input() public filterFormInputs: IFormItems = [];
  @Input() public filterFormSearchButtonProps: ISearchButtonForm = null;
  @Input() public onChangeHeaderFilterForm: string;
  @Input() public colsToFilterByText: string[] = [];
  @Input() public onActionTableFunction: string = "clickOnActionTable";
  @Input() public onDeleteFunction: string = "onDelete";
  @Input({ required: false }) public IdRowToClone: string = null;
  @Input({ required: false }) public onCreateFunction: string = null;
  @Input({ required: false }) public allowCloneButtonOnTable: boolean = true;
  @Input() public titleReport: string = "";
  @Input({ required: false }) public codigoReport: reportCodeEnum;
  @Input({ required: false }) public onChangeEditRowTableFunctionName: string;

  public dropdownButtonClasses: string[] = ["btn-outline-info"];
  public filterFormContainsSearchButton: boolean = false;
  public textButtonDropdowm: string = "Exportar";
  public mainTableName: string = "mainTable";
  public pageNumberTable: number = 1;
  public rowsPerPageTable: number = TableComponentData.defaultRowPerPage;
  public dataToTable: any[] = [];
  public totalRowsInTable: number = 0;
  public dropdownOptionsExport: IDropdownOptions =
    PlantillaEData.dropdownOptionsExport;

  private textToFilter: string = "";
  private colIndexSorted: number;

  constructor(
    private tableService: TableService,
    private utilService: UtilService,
    private formService: FormService
  ) {}

  public ngAfterViewInit(): void {
    this.utilService.focusOnHtmlElement("searchInputFilter");
  }
  public ngOnInit(): void {
    this.setInitialColToTable();
    this.tableService.initializeAll();
    this.validatefilterFormContainsSearchButton();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    this.filterSortFormatAndPaginateData();
    this.originalDataTable = this.formatDataWithKeyNameTable(
      this.originalDataTable
    );
    if (typeof changes["IdRowToClone"]?.currentValue === "string") {
      this.cloneOnTable(this.IdRowToClone);
    }
  }
  /**
   * Función para añadir la columna de checkbox
   */
  private setInitialColToTable() {
    const tableCleaned = this.columnsTable.filter(
      (row) => row.type !== "checkbox"
    );
    this.columnsTable = tableCleaned;
    this.columnsTable.unshift(PlantillaEData.initialColumns);
  }
  /**
   * Función para validar si mi formulario mostrara el boton de buscar o no
   */
  private validatefilterFormContainsSearchButton() {
    this.filterFormContainsSearchButton =
      this.filterFormSearchButtonProps !== null &&
      this.filterFormSearchButtonProps !== undefined;
  }
  /**
   * Función para escuchar cada que presiono una tecla
   *
   * @param event
   */
  @HostListener("document:keydown", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent) {
    /* Nuevo */
    if (
      event.key.toString().toLowerCase() === "n" &&
      event.altKey &&
      !this.tableService.isAnyEditRowActive
    ) {
      this.onCreateRow();
    } /* Guardo el registro */ else if (
      event.key.toString().toLowerCase() === "a" &&
      event.altKey &&
      this.tableService.isAnyEditRowActive
    ) {
      this.tableService.changeStateIsAnyEditRowActive(false);
      document.getElementById("iconSaveEditRowTable").click();
    }
  }
  /**
   * Función para cuando se da click en una opción
   *
   * @param id
   */
  private isAnyRowCheckedInTable(formato: FormatoUtilReporte) {
    let rowsCheckedInTable: any[] =
      this.tableService.rowsCheckedByTable[this.mainTableName];
    if (rowsCheckedInTable.length === 0) {
      rowsCheckedInTable = this.originalDataTable.map((x) => {
        return x.key;
      });
    }
    const { headerTitles, dataIndexTitles } = this.columnsTable.reduce(
      (acc, col) => {
        if (col.title && col.title !== "Acciones") {
          acc.headerTitles.push(col.title);
          acc.dataIndexTitles.push({
            dataIndex: col.dataIndex,
            dataIndexesToJoin: col.dataIndexesToJoin,
          });
        }
        return acc;
      },
      { headerTitles: [], dataIndexTitles: [] }
    );

    const bodyReport = this.originalDataTable
      .filter((row) =>
        rowsCheckedInTable.some((keyChecked) => keyChecked === row.key)
      )
      .map((row) =>
        dataIndexTitles.map(
          (colDataIndex: {
            dataIndex: string;
            dataIndexesToJoin: string[];
          }) => {
            let value: string;

            if (
              colDataIndex.dataIndex === "otrasCausales" ||
              colDataIndex.dataIndex === "estado"
            ) {
              // Procesar solo la columna "otrasCausales"
              value = row[colDataIndex.dataIndex]?.toString() ?? "";

              if (value === "true" || value === "1") {
                value = "Activo";
              } else if (value === "false" || value === "0") {
                value = "Inactivo";
              }
            } else {
              // Mantener los valores de otras columnas sin cambios
              if (colDataIndex.dataIndexesToJoin) {
                value = colDataIndex.dataIndexesToJoin
                  .map((index) => row[index])
                  .join(" - ");
              } else {
                value = row[colDataIndex.dataIndex]?.toString() ?? "";
              }
            }

            return value;
          }
        )
      );
    this.utilService.generateReport(
      formato,
      this.codigoReport,
      this.titleReport,
      headerTitles,
      bodyReport
    );
  }
  private filterStringInTable(textToFilter: string) {
    this.filterSortFormatAndPaginateData(textToFilter);
  }
  /**
   * Función para Filtrar Ordenar Formatear y paginar la data de la tabla
   *
   * @param textToFilter texto a filtrar
   */
  private filterSortFormatAndPaginateData(
    textToFilter: string = this.textToFilter,
    clickOnSort: boolean = false
  ) {
    this.tableService.changeStateIsAnyEditRowActive(false);
    this.textToFilter = textToFilter;
    let data = [...this.originalDataTable].map((x: IRowTableAttributes) => {
      delete x.isEditingRow;
      return x;
    });
    /* Filtro */
    if (textToFilter.length > 0) {
      data = this.tableService.filterDataByProps(
        data,
        this.colsToFilterByText,
        textToFilter
      );
    }
    /* Ordeno */
    const rowIndexToSort = this.colIndexSorted;
    if (rowIndexToSort !== undefined) {
      const colProps = this.columnsTable[rowIndexToSort];
      const sortTypeOrder = colProps.sortTypeOrder;
      const sortColType = colProps.colType ?? "string";
      let sortTypeChanged: sortColOrderType;
      switch (sortTypeOrder) {
        case "asc":
          sortTypeChanged = clickOnSort ? "desc" : sortTypeOrder;
          break;
        case "desc":
          sortTypeChanged = clickOnSort ? undefined : sortTypeOrder;
          break;
        case undefined:
          sortTypeChanged = clickOnSort ? "asc" : sortTypeOrder;
          break;

        default:
          break;
      }
      this.columnsTable[rowIndexToSort].sortTypeOrder = sortTypeChanged;
      if (sortTypeChanged !== undefined) {
        data = this.tableService.filterBySortColType(
          data,
          colProps.dataIndex,
          sortTypeChanged,
          sortColType
        );
      }
    }
    /* Formateo */
    const dataFormatted = this.formatDataWithKeyNameTable(data);
    /* Pagino */
    const dataPaginated = this.tableService.paginateDataToTable(
      dataFormatted,
      this.pageNumberTable,
      this.rowsPerPageTable
    );
    this.totalRowsInTable = data.length;
    this.dataToTable = dataPaginated;
  }
  /**
   * Función para dar formato de tabla a los registro para su manipulación
   *
   * @param data registros a darle formato
   * @returns
   */
  private formatDataWithKeyNameTable(data: any[]): any[] {
    return this.tableService.formatDataToTable(data, this.keyNameTable);
  }
  /**
   * Función para actualizar los valores de la paginacion y actualizar la tabla
   *
   * @param page numero de página
   * @param perPage registros por página
   */
  private onChangePaginationTable(page: number, perPage: number) {
    this.pageNumberTable = page;
    this.rowsPerPageTable = perPage;
    this.filterSortFormatAndPaginateData();
    this.tableService.changeStateIsAnyEditRowActive(false);
  }

  public onCreateRow() {
    if (this.onCreateFunction === null) {
      if (!this.tableService.isAnyEditRowActive) {
        this.tableService.changeStateIsAnyEditRowActive(true);
        const tempDataTable = [...this.dataToTable];
        tempDataTable.unshift({
          ...this.defaultEmptyRowTable,
          isEditingRow: true,
        });
        if (tempDataTable.length > this.rowsPerPageTable) {
          tempDataTable.pop();
        }
        this.dataToTable = tempDataTable;
        this.utilService.focusOnHtmlElement(this.columnsTable[1].dataIndex);
        this.disableIdCol(false);
      }
    } else {
      this.contexto[this.onCreateFunction]();
    }
  }
  private disableIdCol(state: boolean) {
    if (typeof this.colIdToDisable === "string") {
      this.tableInputsEditRow = this.formService.changeValuePropFormById(
        this.colIdToDisable,
        this.tableInputsEditRow,
        "disabled",
        state
      );
    } else {
      this.colIdToDisable.map((x) => {
        this.tableInputsEditRow = this.formService.changeValuePropFormById(
          x,
          this.tableInputsEditRow,
          "disabled",
          state
        );
      });
    }
  }
  private onSaveRowTable(rowData: any, finishedClonningRow: boolean) {
    this.IdRowToClone = null;
    this.contexto[this.onSaveRowData](rowData, finishedClonningRow);
  }

  private onRowActionClicked(
    id: string,
    key: string,
    tooltip: string,
    id_edit
  ) {
    this.IdRowToClone = null;
    this.contexto[this.clickOnActionRow](id, key, tooltip, id_edit);
  }

  public filterDataTable() {
    this.IdRowToClone = null;
    this.contexto[this.clickOnFilter]();
  }

  public pageCrear() {
    // this.IdRowToClone = null;
    this.contexto[this.clickOnPageCrear]();
  }

  private onCancelEditRowTable() {
    this.filterSortFormatAndPaginateData();
  }
  private async clickOnActionTable(
    idAction: idActionType,
    key: string,
    tooltip: string
  ) {
    switch (idAction) {
      case "editOnTable":
        if (!this.tableService.isAnyEditRowActive) {
          this.tableService.changeStateIsAnyEditRowActive(true);
          const rowToEdit: IRowTableAttributes = this.originalDataTable.find(
            (x: IRowTableAttributes) => x.key === key
          );
          rowToEdit.isEditingRow = true;
          const newDataWithOutRowToEdit = this.dataToTable.filter(
            (x: IRowTableAttributes) => x.key !== key
          );
          newDataWithOutRowToEdit.unshift(rowToEdit);
          this.dataToTable = newDataWithOutRowToEdit;
          this.utilService.focusOnHtmlElement(this.columnsTable[2].dataIndex);
          this.disableIdCol(true);
        }
        break;
      case "cloneOnTable":
        this.cloneOnTable(key);
        break;
      case "delete":
        if (
          !environment.modalConfirmation ||
          (await Swal.fire(PlantillaEData.swalDeleteOptions)).isConfirmed
        ) {
          this.contexto[this.onDeleteFunction](key);
        }
        break;

      default:
        this.contexto[this.onActionTableFunction](key, idAction, tooltip);
        break;
    }
  }
  private cloneOnTable(key: string) {
    if (!this.tableService.isAnyEditRowActive) {
      this.tableService.changeStateIsAnyEditRowActive(true);
      const rowToEdit: IRowTableAttributes = this.originalDataTable.find(
        (x: IRowTableAttributes) => x.key === key
      );
      const tempDataTable = [...this.dataToTable];
      tempDataTable.unshift({
        ...rowToEdit,
        key: undefined,
        isEditingRow: true,
      });
      if (tempDataTable.length > this.rowsPerPageTable) {
        tempDataTable.pop();
      }
      this.dataToTable = tempDataTable;
      this.utilService.focusOnHtmlElement(this.columnsTable[1].dataIndex);
      this.disableIdCol(false);
    }
  }
  private onSortColTable(i: number) {
    this.colIndexSorted = i;
    this.filterSortFormatAndPaginateData(this.textToFilter, true);
  }
  private onChangeEditRowTableFunction(formValue: any) {
    if (this.onChangeEditRowTableFunctionName) {
      this.contexto[this.onChangeEditRowTableFunctionName](formValue);
    }
  }
}
