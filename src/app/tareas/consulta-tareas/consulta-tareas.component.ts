import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaTareasData } from "./consulta-tareas.data";
import {
  IConsultaTarea,
  IConsultaTareaTable,
} from "./consulta-tareas.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { UtilData } from "src/app/services/util/util.data";
import { ConsultaTareasService } from "./consulta-tareas.service";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-consulta-tareas",
  templateUrl: "./consulta-tareas.component.html",
  styleUrls: ["./consulta-tareas.component.scss"],
})
export class ConsultaTareasComponent implements OnInit {
  public columnsTable: IColumnsTable = ConsultaTareasData.columns;
  fecha = new Date();
  fechaFormateada = this.fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  //

  public dataTable: any[] = [];

  // public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
  // public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  public hasFiltered: boolean = true;
  public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
  public dataTipoMotivo: any[] = [];
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];
  constructor(
    private consultaTareasService: ConsultaTareasService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioTipoMotivo();
    this.getDataToTable();
  }

  filterDataTable() {
    console.log("EXECUTING filterDataTable()");
    console.log(
      "verifyFilterFields: ",
      this.dataFilterNivelesAprobacion.verifyFilterFields()
    );

    switch (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
      case "case1":
        this.getDataToTable();
        break;
      case "case2":
        this.getDataToTable();
        break;
      case "case3":
        this.utilService.modalResponse(
          "Por favor complete los campos del filtro",
          "info"
        );
        break;
      case "case4":
        this.getDataToTableFilter();
        break;
    }
  }

  getDataToTableFilter() {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    console.log("FILTER DATA: ", this.dataFilterNivelesAprobacion);
    this.consultaTareasService
      .filterNivelesAprobaciones(
        this.dataFilterNivelesAprobacion.tipoSolicitud,
        this.dataFilterNivelesAprobacion.tipoMotivo,
        this.dataFilterNivelesAprobacion.nivelDireccion
      )
      .subscribe({
        next: (response) => {
          console.log("filerDataTable: ", response);
          this.dataTable = response.nivelAprobacionType.map(
            (nivelAprobacionResponse) => ({
              ...nivelAprobacionResponse,
              // estado: nivelAprobacionResponse.estado === "A",
            })
          );
          this.utilService.closeLoadingSpinner();
          console.log("Data de niveles de aprobacion: ", this.dataTable);
        },
        error: (error: HttpErrorResponse) => {
          console.log("error: ", error);
          this.dataTable = [];
          this.utilService.modalResponse(
            "No existen registros para esta búsqueda",
            "error"
          );
        },
      });
  }

  private getDataToTable() {
    this.utilService.openLoadingSpinner(
      "Cargando información. Espere por favor..."
    );
    return this.consultaTareasService.getTareas().subscribe({
      next: (response) => {
        this.dataTable = response.solicitudes.map(
          /*{
            "idSolicitud": "RP-11",
            "rootProcInstId": "8152d497-f9b5-11ee-a25d-005056906706",
            "startTime": "2024-04-13T18:47:24.918",
            "name": "Registrar solicitud",
            "tipoSolicitud": "requisicionPersonal"
          }*/

          (item) => ({
            idSolicitud: item.idSolicitud,
            startTime: item.startTime,
            name: item.name,
            tipoSolicitud: item.tipoSolicitud,
          })
        );
        console.log("this.dataTable: ", this.dataTable);
        console.log("RESPONSE: ", response);
        /*this.dataTable = response.nivelAprobacionType.map(
          (nivelAprobacionResponse) => ({
            ...nivelAprobacionResponse,
            // estado: nivelAprobacionResponse.estado === "A",
          })
        );*/
        this.utilService.closeLoadingSpinner();
        // console.log("Data de niveles de aprobacion: ", this.dataTable);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  //LLenar combo Tipo Solicitud
  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        this.dataTipoSolicitudes = response.tipoSolicitudType.map((r) => ({
          id: r.id,
          descripcion: r.tipoSolicitud,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion() {
    console.log("Executing ObtenerServicioNivelDireccion() method");

    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
        console.log("Response = ", response);
        this.dataNivelDireccion = [
          ...new Set(
            response.evType.map((item) => {
              return item.nivelDir;
            })
          ),
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        this.dataTipoMotivo = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoMotivo,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  pageCrear() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    console.log("EDTTTT: ", id_edit);
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"], {
      queryParams: { id_edit },
    });
  }
}
