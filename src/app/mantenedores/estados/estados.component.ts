import { Component } from "@angular/core";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { EstadoData } from "./estados.data";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { IEstadoTable, IEstados } from "./estados.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { EstadosService } from "./estados.service";
import { TableService } from "src/app/component/table/table.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { UtilData } from "src/app/services/util/util.data";
import { ValidationsService } from "src/app/services/validations/validations.service";

@Component({
  selector: "app-estados",
  templateUrl: "./estados.component.html",
  styleUrls: ["./estados.component.scss"],
})
export class EstadosComponent {
  public columnsTable: IColumnsTable = EstadoData.columns;
  public tableInputsEditRow: IInputsComponent = EstadoData.tableInputsEditRow;
  public colsToFilterByText: string[] = EstadoData.colsToFilterByText;
  public IdRowToClone: string = null;
  public defaultEmptyRowTable: IEstadoTable = EstadoData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_ESTADOS;

  /*public dataTable: any[] = [
    { id: 0, codigo: 1, descripcion: "Aprobado" },
    { id: 1, codigo: 2, descripcion: "En espera" },
    { id: 2, codigo: 3, descripcion: "Creado" },
    { id: 3, codigo: 4, descripcion: "Enviado" },
    { id: 4, codigo: 5, descripcion: "Cancelado" },
  ];*/

  public dataTable: any[] = [];

  constructor(
    private utilService: UtilService,
    private tableService: TableService,
    private mantenimientoService: MantenimientoService,
    private validationsService: ValidationsService,

    private estadosService: EstadosService
  ) {}

  ngOnInit() {
    /*this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );*/
    this.getDataToTable();
  }

  private getDataToTable() {
    //this.utilService.closeLoadingSpinner();
    return this.estadosService.index().subscribe({
      next: (response) => {
        // this.dataTable = response.itemCatalogoTypes.map((r) => ({
        //   // id: r.id,
        //   codigo: r.codigo,
        //   descripcion: r.valor, // El valor es la descripción
        //   estado: r.estado,
        // }));

        this.dataTable = response.itemCatalogoTypes.map((r) => ({
          ...r,
          estado: r.estado === "A",
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
    /*this.tiporutaesService.delete(key).subscribe({
    next: (response) => {
      this.getDataToTable();
      this.utilService.modalResponse(response, "success");
    },
    error: (error: HttpErrorResponse) =>
      this.utilService.modalResponse(error.error, "error"),
  });*/
  }
  private onSaveRowTable(rowData: IEstadoTable, finishedClonningRow: boolean) {
    /*
    // Necesito todo esto
    {
      "id": 0,
      "codigo": "114", // Mandatory
      "catalogoId": "RBPEST", // Mandatory
      "valor": "Ejecución",
      "descripcion": "Estado ejecución",
      "estado": "A", // A por defecto en los otros
      "aplicativoId": "", // Empty en los otros
      "estacion": "", // Empty en los otros
      "menuId": "1",
      "usuarioCreacion": "WORKFLOW",
      "usuarioActualizacion": ""
    }

    // Pero estoy enviando esto

    {
    "codigo": "",
    "valor": "Estado200",
    "descripcion": "En Estado200",
    "estado": "A",
    "isEditingRow": true
}

    */

    rowData = {
      ...rowData,
      catalogoId: "RBPEST",
      aplicativoId: "", // Empty en los otros
      estacion: "", // Empty en los otros
      menuId: "1",
      usuarioCreacion: "WORKFLOW",
      usuarioActualizacion: "",
      estado: rowData.estado ? "A" : "I",
    };
    /*rowData.catalogoId = "RBPEST";
    rowData.aplicativoId = "";
    rowData.estacion = "";
    rowData.menuId = "1";
    rowData.usuarioCreacion = "WORKFLOW";
    rowData.usuarioActualizacion = "";
    rowData.estado = rowData.estado ? "A" : "I";
    rowData.codigo = rowData.codigo;

    rowData.valor = rowData.valor;
    rowData.descripcion = rowData.descripcion;
    rowData.estado = rowData.estado;
    rowData.isEditingRow = rowData.isEditingRow;*/

    if (rowData.key) {
      /* Actualizar */
      this.estadosService.update(rowData).subscribe({
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
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
    } else {
      rowData.id = 0;
      /* Crear */
      this.estadosService.store(rowData).subscribe({
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
    rowData: IEstados,
    finishedClonningRow: boolean
  ) {
    const descripcionNotEmpty =
      this.validationsService.isNotEmptyStringVariable(rowData.descripcion);
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
