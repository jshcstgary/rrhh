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
import { PageCodes } from "src/app/enums/codes.enum";
import { TipoSolicitudPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { Control } from "src/app/types/permiso.type";

@Component({
  templateUrl: "./tipo-solicitud.component.html",
})
export class TipoSolicitudComponent implements OnInit {
  private pageCode: string = PageCodes.TipoSolicitud;
  public pageControlPermission: typeof TipoSolicitudPageControlPermission = TipoSolicitudPageControlPermission;

  public controlsPermissions: PageControlPermiso = {
    [TipoSolicitudPageControlPermission.FiltroTipoSolicitud]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoSolicitudPageControlPermission.ButtonAgregar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoSolicitudPageControlPermission.ButtonExportar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoSolicitudPageControlPermission.ButtonEditar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoSolicitudPageControlPermission.ButtonDuplicar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    }
  };

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
    private utilService: UtilService,
    private permissionService: PermisoService
  ) {
    this.getPermissions();
  }

  ngOnInit(): void {
    this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
      if (action.id === "editOnTable") {
        action.showed = this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonEditar].visualizar
      } else if (action.id === "cloneOnTable") {
        action.showed = this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonDuplicar].visualizar
      }
    });

    this.getDataToTable();
  }

  private getPermissions(): void {
    const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

    controlsPermission.forEach(controlPermission => {
      if (controlPermission.codigo_Control === "01") {
        this.controlsPermissions[TipoSolicitudPageControlPermission.FiltroTipoSolicitud] = controlPermission;
      } else if (controlPermission.codigo_Control === "02") {
        this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonAgregar] = controlPermission;
      } else if (controlPermission.codigo_Control === "03") {
        this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonExportar] = controlPermission;
      } else if (controlPermission.codigo_Control === "04") {
        this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonEditar] = controlPermission;
      } else if (controlPermission.codigo_Control === "05") {
        this.controlsPermissions[TipoSolicitudPageControlPermission.ButtonDuplicar] = controlPermission;
      }
    });
  }

  private getDataToTable() {
    return this.tiposolicitudesService.index().subscribe({
      next: (response) => {
        this.dataTable = response.tipoSolicitudType.map((r) => ({
          ...r,
          estado: r.estado === "A",
        })); //verificar la estructura mmunoz
        //this.utilService.closeLoadingSpinner();
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
    // this.utilService.openLoadingSpinner(
    //   "Guardando información, espere por favor..."
    // );
    //rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
    rowData.estado =
      rowData.estado === "A" || rowData.estado === true ? "A" : "I";
    if (rowData.key) {
      /* Actualizar */
      this.tiposolicitudesService.update(rowData).subscribe({
        next: (response) => {
          // Inicio
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
          // Inicio
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
    const codigoTipoSolicitudNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.codigoTipoSolicitud);
      if (descripcionNotEmpty && codigoTipoSolicitudNotEmpty) {
        if (
          !environment.modalConfirmation ||
          (await Swal.fire(UtilData.messageToSave)).isConfirmed
        ) {
          this.onSaveRowTable(rowData, finishedClonningRow);
        }
      }
   /* if (!descripcionNotEmpty) {
      return;
    }
    if (
      !environment.modalConfirmation ||
      (await Swal.fire(UtilData.messageToSave)).isConfirmed
    ) {
      this.onSaveRowTable(rowData, finishedClonningRow);
    }*/
  }
}
