import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TipomotivoData } from "./tipo-motivo.data";
import {
  ITipoSolcitud,
  ITipomotivo,
  ITipomotivoTable,
} from "./tipo-motivo.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { TipoMotivoService } from "./tipo-motivo.service";
import { UtilData } from "src/app/services/util/util.data";
import { InputService } from "src/app/component/input/input.service";
import { FormService } from "src/app/component/form/form.service";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";

@Component({
  templateUrl: "./tipo-motivo.component.html",
})
export class TipoMotivoComponent implements OnInit {
  public columnsTable: IColumnsTable = TipomotivoData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent =
    TipomotivoData.tableInputsEditRow;
  public colsToFilterByText: string[] = TipomotivoData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: ITipomotivoTable =
    TipomotivoData.defaultEmptyRowTable;
  public dataTipoSolicitudes: any[] = [];
  public codigoReporte: reportCodeEnum =
    reportCodeEnum.MANTENIMIENTO_TIPO_MOTIVO;
  constructor(
    private tipomotivosService: TipoMotivoService,
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
    return this.tipomotivosService.index().subscribe({
      next: (response) => {
        this.dataTable = response.map((motivoResponse) => ({
          ...motivoResponse,
          estado: motivoResponse.estado === "A",
          tipoSolicitudFormatted:
            this.formatTipoSolicitudEstaciones(motivoResponse),
        }));
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private formatTipoSolicitudEstaciones(motivoResponse: ITipomotivo): string {
    const tipoSolcicitud = this.dataTipoSolicitudes.find(
      (tipoSolcicitud) => tipoSolcicitud.id == motivoResponse.tipoSolicitudId
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
    this.tipomotivosService.delete(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private onSaveRowTable(
    rowData: ITipomotivoTable,
    finishedClonningRow: boolean
  ) {
    rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
    if (rowData.key) {
      /* Actualizar */
      this.tipomotivosService.update(rowData).subscribe({
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
      this.tipomotivosService.store(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.tipoMotivo.toString();
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
    rowData: ITipomotivo,
    finishedClonningRow: boolean
  ) {
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.tipoMotivo);
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
