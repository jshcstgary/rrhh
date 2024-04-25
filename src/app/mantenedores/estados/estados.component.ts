import { Component } from "@angular/core";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { EstadoData } from "./estados.data";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { IEstadoTable } from "./estados.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";

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

  public dataTable: any[] = [
    { id: 0, codigo: 1, descripcion: "Aprobado" },
    { id: 1, codigo: 2, descripcion: "En espera" },
    { id: 2, codigo: 3, descripcion: "Creado" },
    { id: 3, codigo: 4, descripcion: "Enviado" },
    { id: 4, codigo: 5, descripcion: "Cancelado" },
  ];

  constructor(
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService
  ) {}

  ngOnInit() {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    this.getDataToTable();
  }

  private getDataToTable() {
    this.utilService.closeLoadingSpinner();
    /*return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
      next: (response) => {
        this.data_estado = response.itemCatalogoTypes.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          descripcion: r.valor,
        }));

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });*/
  }
}
