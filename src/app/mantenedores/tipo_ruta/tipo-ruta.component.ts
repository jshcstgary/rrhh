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
import { PageCodes } from "src/app/enums/codes.enum";
import { TipoRutaPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { Control } from "src/app/types/permiso.type";

@Component({
  templateUrl: "./tipo-ruta.component.html",
})
export class TipoRutaComponent implements OnInit {
  private pageCode: string = PageCodes.TipoRuta;
  public pageControlPermission: typeof TipoRutaPageControlPermission = TipoRutaPageControlPermission;

  public controlsPermissions: PageControlPermiso = {
    [TipoRutaPageControlPermission.FiltroTipoSolicitud]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoRutaPageControlPermission.ButtonAgregar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoRutaPageControlPermission.ButtonExportar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoRutaPageControlPermission.ButtonEditar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [TipoRutaPageControlPermission.ButtonDuplicar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    }
  };

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
    private utilService: UtilService,
    private permissionService: PermisoService
  ) {
    this.getPermissions();
  }

  ngOnInit(): void {
    this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
      if (action.id === "editOnTable") {
        action.showed = this.controlsPermissions[TipoRutaPageControlPermission.ButtonEditar].visualizar
      } else if (action.id === "cloneOnTable") {
        action.showed = this.controlsPermissions[TipoRutaPageControlPermission.ButtonDuplicar].visualizar
      }
    });

    this.getDataToTable();
  }

  private getPermissions(): void {
    const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

    controlsPermission.forEach(controlPermission => {
      if (controlPermission.codigo_Control === "01") {
        this.controlsPermissions[TipoRutaPageControlPermission.FiltroTipoSolicitud] = controlPermission;
      } else if (controlPermission.codigo_Control === "02") {
        this.controlsPermissions[TipoRutaPageControlPermission.ButtonAgregar] = controlPermission;
      } else if (controlPermission.codigo_Control === "03") {
        this.controlsPermissions[TipoRutaPageControlPermission.ButtonExportar] = controlPermission;
      } else if (controlPermission.codigo_Control === "04") {
        this.controlsPermissions[TipoRutaPageControlPermission.ButtonEditar] = controlPermission;
      } else if (controlPermission.codigo_Control === "05") {
        this.controlsPermissions[TipoRutaPageControlPermission.ButtonDuplicar] = controlPermission;
      }
    });
  }

  private getDataToTable() {
    return this.tiporutaesService.index().subscribe({
      //return this.tipoviviendasService.index().subscribe({
      next: (response) => {
        this.dataTable = response.tipoRutaType.map((tipoRutaResponse) => ({
          ...tipoRutaResponse,
          estado: tipoRutaResponse.estado === "A",
        }));
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
