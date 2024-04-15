import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TiporutaData } from "./tipo-ruta.data";
import { ITiporuta, ITiporutaTable } from "./tipo-ruta.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { TipoRutaService } from "./tipo-ruta.service";
import { UtilData } from "src/app/services/util/util.data";

@Component({
  templateUrl: "./tipo-ruta.component.html",
})
export class TipoRutaComponent implements OnInit {
  public columnsTable: IColumnsTable = TiporutaData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent = TiporutaData.tableInputsEditRow;
  public colsToFilterByText: string[] = TiporutaData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: ITiporutaTable =
    TiporutaData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  constructor(
    private tiporutaesService: TipoRutaService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    this.getDataToTable();
  }

  private getDataToTable() {
    return this.tiporutaesService.index().subscribe({
      //return this.tipoviviendasService.index().subscribe({
      next: (response) => {
        this.dataTable = response.tipoRutaType.map((tipoRutaResponse) => ({
          ...tipoRutaResponse,
          estado: tipoRutaResponse.estado === "A",
        }));
        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
  /**
   * Funcion para eliminar un registro
   *
   * @param key Id del registro
   */
  private onDelete(key: string) {
    this.tiporutaesService.delete(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private onSaveRowTable(
    rowData: ITiporutaTable,
    finishedClonningRow: boolean
  ) {
    rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };

    if (rowData.key) {
      /* Actualizar */
      this.tiporutaesService.update(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Campos actualizados correctamente",
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
      rowData.id = 0;
      /* Crear */
      this.tiporutaesService.store(rowData).subscribe({
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
    }
  }

  /**
   * Función para realizar validaciones antes de crear/actualizar
   *
   * @param rowData Objeto con la informacion de la fila
   * @param finishedClonningRow valida si al finalizar clona o no el ultimo registro
   */
  private async validateToSave(
    rowData: ITiporuta,
    finishedClonningRow: boolean
  ) {
    console.log("EJECUTANDO validateToSave()");
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.tipoRuta);
    if (!descripcionNotEmpty) {
      return;
    }
    if (
      !environment.modalConfirmation ||
      (await Swal.fire(UtilData.messageToSave)).isConfirmed
    ) {
      this.onSaveRowTable(rowData, finishedClonningRow);
    }
  }
}
