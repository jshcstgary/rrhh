import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TipoaccionData } from "./tipo-accion.data";
import {
  ITipoSolcitud,
  ITipoaccion,
  ITipoaccionTable,
} from "./tipo-accion.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { TipoAccionService } from "./tipo-accion.service";
import { UtilData } from "src/app/services/util/util.data";
import { InputService } from "src/app/component/input/input.service";
import { FormService } from "src/app/component/form/form.service";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";

@Component({
  templateUrl: "./tipo-accion.component.html",
})
export class TipoAccionComponent implements OnInit {
  public columnsTable: IColumnsTable = TipoaccionData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent =
    TipoaccionData.tableInputsEditRow;
  public colsToFilterByText: string[] = TipoaccionData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: ITipoaccionTable =
    TipoaccionData.defaultEmptyRowTable;
  public dataTipoSolicitudes: any[] = [];
  public codigoReporte: reportCodeEnum =
    reportCodeEnum.MANTENIMIENTO_TIPO_ACCION;
  constructor(
    private tipoaccionsService: TipoAccionService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService,
    private formService: FormService,
    private inputService: InputService,
    private mantenimientoService: MantenimientoService
  ) {}

  ngOnInit(): void {
    this.getDataToCombo();
    // this.getDataToTable();
  }

  private getDataToCombo() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        const comboTipoSolicitud =
          this.inputService.formatDataToOptionsValueInLabel(
            response.tipoSolicitudType,
            "tipoSolicitud",
            "id"
          );
        this.dataTipoSolicitudes = response.tipoSolicitudType;
        this.tableInputsEditRow = this.formService.changeValuePropFormById(
          "tipoSolicitudId",
          this.tableInputsEditRow,
          "options",
          comboTipoSolicitud
        );
        this.getDataToTable();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.utilService.modalResponse(error.error, "error");
        }
      },
    });
  }

  private getDataToTable() {
    return this.tipoaccionsService.index().subscribe({
      next: (response) => {
        this.dataTable = response.map((accionResponse) => ({
          ...accionResponse,
          estado: accionResponse.estado === "A",
          tipoSolicitudFormatted:
            this.formatTipoSolicitudEstaciones(accionResponse),
        }));
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private formatTipoSolicitudEstaciones(accionResponse: ITipoaccion): string {
    const tipoSolcicitud = this.dataTipoSolicitudes.find(
      (tipoSolcicitud) => tipoSolcicitud.id == accionResponse.tipoSolicitudId
    );
    if (tipoSolcicitud) {
      return tipoSolcicitud.tipoSolicitud;
    }
    return " ";
  }
  /**
   * Funcion para eliminar un registro
   *
   * @param key Id del registro
   */
  private onDelete(key: string) {
    this.tipoaccionsService.delete(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private onSaveRowTable(
    rowData: ITipoaccionTable,
    finishedClonningRow: boolean
  ) {
    if (rowData.key) {
      /* Actualizar */
      this.tipoaccionsService.update(rowData).subscribe({
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
      this.tipoaccionsService.store(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.tipoAccion.toString();
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
    rowData: ITipoaccion,
    finishedClonningRow: boolean
  ) {
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.tipoAccion);
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
