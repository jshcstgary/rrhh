import { Component, Input, OnInit } from "@angular/core";
import {
  CatalogoType,
  IItemCatalogoTable,
} from "src/app/services/catalogo/catalogo.interface";
import {
  IInputComponent,
  IInputsComponent,
} from "src/app/component/input/input.interface";
import { environment } from "src/environments/environment";
import {
  IActionsTable,
  IColumnsTable,
} from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { CatalogoData } from "./catalogo.data";
import { CatalogoService } from "./catalogo.service";
import { PlantillaModule } from "src/app/plantilla/plantilla.module";
import { UtilService } from "../util/util.service";
import { UtilData } from "../util/util.data";
import { reportCodeEnum } from "../util/util.interface";
@Component({
  selector: "catalogo-view-component",
  standalone: true,
  templateUrl: "./catalogo.component.html",
  imports: [PlantillaModule],
})
export class CatalogoViewComponent implements OnInit {
  @Input({ required: true }) public catalogoType: CatalogoType;
  @Input({ required: false }) public codigoInputForm: IInputComponent;
  @Input({ required: false }) public descripcionInputForm: IInputComponent;
  @Input({ required: false }) public hasStateColumn: boolean = false;
  @Input({ required: false }) public canDelete: boolean = true;
  @Input({ required: false }) public titleReport: string = "";
  @Input({ required: false }) public allowCloneButtonOnTable: boolean = true;
  @Input({ required: false }) public codigoReport: reportCodeEnum;
  public columnsTable: IColumnsTable = CatalogoData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent = CatalogoData.tableInputsEditRow;
  public colsToFilterByText: string[] = CatalogoData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: IItemCatalogoTable =
    CatalogoData.defaultEmptyRowTable;
  constructor(
    private catalogoService: CatalogoService,
    private tableService: TableService,
    private utilService: UtilService,
    private validationsService: ValidationsService
  ) {}
  ngOnInit(): void {
    this.getDataToTable();
    this.validateTableInputs();
    this.validateHasStateColumn();
    this.validateCanDelete();
  }
  private validateHasStateColumn() {
    const tableWithOutStateColumn = this.columnsTable.filter(
      (col) => col.dataIndex !== "estado"
    );
    if (this.hasStateColumn) {
      tableWithOutStateColumn.splice(2, 0, CatalogoData.stateInputEditTable);
    }
    this.columnsTable = tableWithOutStateColumn;
  }
  private validateCanDelete() {
    const defaultActions: IActionsTable = [
      { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
      {
        materialIcon: "content_copy",
        id: "cloneOnTable",
        tooltip: "Duplicar",
      },
    ];
    if (this.canDelete) {
      defaultActions.push({
        materialIcon: "delete_forever",
        id: "delete",
        tooltip: "Suprimir",
      });
    }
    this.columnsTable.push({
      title: "Acciones",
      type: "actions",
      width: "125px",
      actions: defaultActions,
    });
  }
  /**
   * Valido si hay modificaciones dentro del formulario de inputs de la tabla
   */
  private validateTableInputs() {
    const tableForm = [...this.tableInputsEditRow];
    if (this.codigoInputForm) {
      Object.assign(tableForm[0], this.codigoInputForm);
    }
    if (this.descripcionInputForm) {
      Object.assign(tableForm[1], this.descripcionInputForm);
    }
    this.tableInputsEditRow = tableForm;
  }
  /**
   * Función para obtener todos los datos de la tabla
   */
  private getDataToTable() {
    return this.catalogoService.indexItemCatalogo(this.catalogoType).subscribe({
      next: (response) => {
        this.dataTable = response.itemCatalogoTypes.map((x) => ({
          ...x,
          estado: x.estado === "A",
        }));
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  /**
   * Funcion para eliminar un registro
   *
   * @param key Id del registro
   */
  private onDelete(key: string) {
    this.catalogoService.deleteItemCatalogo(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  /**
   * Función para guardar la creacion o modificacion de la tabla
   *
   * @param rowData Objeto con la informacion de la fila
   * @param finishedClonningRow valida si al finalizar clona o no el ultimo registro
   */
  private onSaveRowTable(
    rowData: IItemCatalogoTable,
    finishedClonningRow: boolean
  ) {
    rowData.catalogoId = this.catalogoType;
    rowData.estado =
      rowData.estado === "A" || rowData.estado === true ? "A" : "I";
    if (rowData.key) {
      /* Actualizar */
      this.catalogoService.updateItemcatalogo(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.id.toString();
            }
          });
        },
        error: (error: HttpErrorResponse) =>
          this.utilService.modalResponse(error.error, "error"),
      });
    } else {
      /* Crear */
      this.catalogoService.storeItemCatalogo(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Registro creado exitosamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.id.toString();
            }
          });
        },
        error: (error: HttpErrorResponse) =>
          this.utilService.modalResponse(error.error, "error"),
      });
    }
  }
  /**
   * Función para realizar validaciones antes de crear/actualizar
   *
   * @param rowData Objeto con la informacion de la fila
   * @param finishedClonningRow valida si al finalizar clona o no el ultimo registro
   */
  private async validateToSave(
    rowData: IItemCatalogoTable,
    finishedClonningRow: boolean
  ) {
    let codigoNotEmpty = this.validationsService.isNotEmptyStringVariable(
      rowData.codigo
    );
    //validar si el campo codigo es generado secuencial
    const tableForm = [...this.tableInputsEditRow];
    if(tableForm[0].type=='visualization'){
      codigoNotEmpty=true;
    }

    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.descripcion);
    if (codigoNotEmpty && descripcionNotEmpty) {
      if (
        !environment.modalConfirmation ||
        (await Swal.fire(UtilData.messageToSave)).isConfirmed
      ) {
        this.onSaveRowTable(rowData, finishedClonningRow);
      }
    }
  }
}
