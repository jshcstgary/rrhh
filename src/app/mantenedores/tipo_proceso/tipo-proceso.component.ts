import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TipoprocesoData } from "./tipo-proceso.data";
import { ITipoproceso, ITipoprocesoTable } from "./tipo-proceso.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { TipoProcesoService } from "./tipo-proceso.service";
import { UtilData } from "src/app/services/util/util.data";
import { InputService } from "src/app/component/input/input.service";
import { FormService } from "src/app/component/form/form.service";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { TipoProcesoPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { Control } from "src/app/types/permiso.type";

@Component({
  templateUrl: "./tipo-proceso.component.html",
})
export class TipoProcesoComponent implements OnInit {
  private pageCode: string = PageCodes.TipoProceso;
  public pageControlPermission: typeof TipoProcesoPageControlPermission = TipoProcesoPageControlPermission;

  public controlsPermissions: PageControlPermiso = {
    [TipoProcesoPageControlPermission.FiltroTipoSolicitud]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoProcesoPageControlPermission.ButtonAgregar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoProcesoPageControlPermission.ButtonExportar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoProcesoPageControlPermission.ButtonEditar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoProcesoPageControlPermission.ButtonDuplicar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    }
  };

  public columnsTable: IColumnsTable = TipoprocesoData.columns;
  public dataTable: any[] = [];
  public tableInputsEditRow: IInputsComponent =
    TipoprocesoData.tableInputsEditRow;
  public colsToFilterByText: string[] = TipoprocesoData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: ITipoprocesoTable =
    TipoprocesoData.defaultEmptyRowTable;
  public dataTipoSolicitudes: any[] = [];
  public codigoReporte: reportCodeEnum =
    reportCodeEnum.MANTENIMIENTO_TIPO_PROCESO;
  constructor(
    private tipoprocesosService: TipoProcesoService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService,
    private formService: FormService,
    private inputService: InputService,
    private mantenimientoService: MantenimientoService,
    private permissionService: PermisoService
  ) {
    this.getPermissions();
  }

  ngOnInit(): void {
    this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
      if (action.id === "editOnTable") {
        action.showed = this.controlsPermissions[TipoProcesoPageControlPermission.ButtonEditar].visualizar
      } else if (action.id === "cloneOnTable") {
        action.showed = this.controlsPermissions[TipoProcesoPageControlPermission.ButtonDuplicar].visualizar
      }
    });

    this.getDataToCombo();
  }

  private getPermissions(): void {
    const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

    controlsPermission.forEach(controlPermission => {
      if (controlPermission.codigo_Control === "01") {
        this.controlsPermissions[TipoProcesoPageControlPermission.FiltroTipoSolicitud] = controlPermission;
      } else if (controlPermission.codigo_Control === "02") {
        this.controlsPermissions[TipoProcesoPageControlPermission.ButtonAgregar] = controlPermission;
      } else if (controlPermission.codigo_Control === "03") {
        this.controlsPermissions[TipoProcesoPageControlPermission.ButtonExportar] = controlPermission;
      } else if (controlPermission.codigo_Control === "04") {
        this.controlsPermissions[TipoProcesoPageControlPermission.ButtonEditar] = controlPermission;
      } else if (controlPermission.codigo_Control === "05") {
        this.controlsPermissions[TipoProcesoPageControlPermission.ButtonDuplicar] = controlPermission;
      }
    });
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
    return this.tipoprocesosService.index().subscribe({
      next: (response) => {
        this.dataTable = response.map((procesoResponse) => ({
          ...procesoResponse,
          estado: procesoResponse.estado === "A",
          tipoSolicitudFormatted:
            this.formatTipoSolicitudEstaciones(procesoResponse),
        }));
        //this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private formatTipoSolicitudEstaciones(procesoResponse: ITipoproceso): string {
    const tipoSolcicitud = this.dataTipoSolicitudes.find(
      (tipoSolcicitud) => tipoSolcicitud.id == procesoResponse.tipoSolicitudId
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
    this.tipoprocesosService.delete(key).subscribe({
      next: (response) => {
        this.getDataToTable();
        this.utilService.modalResponse(response, "success");
      },
      error: (error: HttpErrorResponse) =>
        this.utilService.modalResponse(error.error, "error"),
    });
  }
  private onSaveRowTable(
    rowData: ITipoprocesoTable,
    finishedClonningRow: boolean
  ) {
    rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
    if (rowData.key) {
      /* Actualizar */
      this.tipoprocesosService.update(rowData).subscribe({
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
      this.tipoprocesosService.store(rowData).subscribe({
        next: (response) => {
          this.tableService.changeStateIsAnyEditRowActive(false);
          this.utilService.modalResponse(
            "Datos ingresados correctamente",
            "success"
          );
          this.getDataToTable().add(() => {
            if (finishedClonningRow) {
              this.IdRowToClone = response.tipoProceso.toString();
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
    rowData: ITipoproceso,
    finishedClonningRow: boolean
  ) {
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.tipoProceso);
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
