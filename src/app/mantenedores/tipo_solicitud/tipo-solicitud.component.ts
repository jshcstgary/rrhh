import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TiposolicitudData } from "./tipo-solicitud.data";
import {
  ITiposolicitud,
  ITiposolicitudTable,
} from "./tipo-solicitud.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { TipoSolicitudService } from "./tipo-solicitud.service";
import { UtilData } from "src/app/services/util/util.data";

@Component({
  templateUrl: "./tipo-solicitud.component.html",
})
export class TipoSolicitudComponent implements OnInit {
  public columnsTable: IColumnsTable = TiposolicitudData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent =
    TiposolicitudData.tableInputsEditRow;
  public colsToFilterByText: string[] = TiposolicitudData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: ITiposolicitudTable =
    TiposolicitudData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum =
    reportCodeEnum.MANTENIMIENTO_TIPO_SOLICITUD;
  constructor(
    private tiposolicitudesService: TipoSolicitudService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.getDataToTable();
  }

  private getDataToTable() {
    return this.tiposolicitudesService.index().subscribe({
      next: (response) => {
        console.log("RESPONSE: ", response);
        this.dataTable = response.tipoSolicitudType.map((r) => ({
          ...r,
          estado: r.estado === "A",
        })); //verificar la estructura mmunoz
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
    this.tiposolicitudesService.delete(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private onSaveRowTable(
    rowData: ITiposolicitudTable,
    finishedClonningRow: boolean
  ) {
    console.log("SI GUARDO O EDITO (ANTES): ", rowData);
    rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
    console.log("SI GUARDO O EDITO (DESPUÉS): ", rowData);
    if (rowData.key) {
      /* Actualizar */
      this.tiposolicitudesService.update(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Campos actualizados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.codigoTipoSolicitud.toString();
            }
          });
        },
        error: (error: HttpErrorResponse) =>
          this.utilService.modalResponse(error.error, "error"),
      });
    } else {
      // rowData.codigoTipoSolicitud = "";
      /* Crear */
      this.tiposolicitudesService.store(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.codigoTipoSolicitud.toString();
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
    rowData: ITiposolicitud,
    finishedClonningRow: boolean
  ) {
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.tipoSolicitud);
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
