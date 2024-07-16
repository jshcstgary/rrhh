import { Component, OnInit } from "@angular/core";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { AprobadoresFijosData } from "./aprobadores-fijos.data";
import {
  IConsultaAprobadoresFijos,
  IConsultaAprobadoresFijoTable,
} from "./aprobadores-fijos.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { UtilData } from "src/app/services/util/util.data";
import { AprobadoresFijosService } from "./aprobadores-fijos.service";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { Router } from "@angular/router";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { Control } from "src/app/types/permiso.type";
import { PageCodes } from "src/app/enums/codes.enum";
import { AprobadorFijoPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";

@Component({
  selector: "app-aprobadores-fijos",
  templateUrl: "./aprobadores-fijos.component.html",
  styleUrls: ["./aprobadores-fijos.component.scss"],
})
export class AprobadoresFijosComponent implements OnInit {
  private pageCode: string = PageCodes.AprobadorFijo;
  public pageControlPermission: typeof AprobadorFijoPageControlPermission = AprobadorFijoPageControlPermission;

  public controlsPermissions: PageControlPermiso = {
    [AprobadorFijoPageControlPermission.FiltroTipoSolicitud]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [AprobadorFijoPageControlPermission.ButtonAgregar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [AprobadorFijoPageControlPermission.ButtonExportar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [AprobadorFijoPageControlPermission.ButtonEditar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    }
  };

  public columnsTable: IColumnsTable = AprobadoresFijosData.columns;
  public dataTable: any[] = [];

  public colsToFilterByText: string[] = AprobadoresFijosData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = AprobadoresFijosData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  public hasFiltered: boolean = true;
  public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
  public dataTipoMotivo: any[] = [];
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];
  constructor(
    private aprobadoresFijosService: AprobadoresFijosService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private permissionService: PermisoService
  ) {
    this.getPermissions();
  }

  ngOnInit(): void {
    this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
      if (action.id === "editOnTable") {
        action.showed = this.controlsPermissions[AprobadorFijoPageControlPermission.ButtonEditar].visualizar
      }
    });

    this.getDataToTable();
  }

  private getPermissions(): void {
    const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

    controlsPermission.forEach(controlPermission => {
      if (controlPermission.codigo_Control === "01") {
        this.controlsPermissions[AprobadorFijoPageControlPermission.FiltroTipoSolicitud] = controlPermission;
      } else if (controlPermission.codigo_Control === "02") {
        this.controlsPermissions[AprobadorFijoPageControlPermission.ButtonAgregar] = controlPermission;
      } else if (controlPermission.codigo_Control === "03") {
        this.controlsPermissions[AprobadorFijoPageControlPermission.ButtonExportar] = controlPermission;
      } else if (controlPermission.codigo_Control === "04") {
        this.controlsPermissions[AprobadorFijoPageControlPermission.ButtonEditar] = controlPermission;
      }
    });
  }

  filterDataTable() {
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
    this.aprobadoresFijosService
      .filterNivelesAprobaciones(
        this.dataFilterNivelesAprobacion.tipoSolicitud,
        this.dataFilterNivelesAprobacion.tipoMotivo,
        this.dataFilterNivelesAprobacion.nivelDireccion
      )
      .subscribe({
        next: (response) => {
          this.dataTable = response.aprobadoresFijos.map(
            (nivelAprobacionResponse) => ({
              ...nivelAprobacionResponse,
              estado: nivelAprobacionResponse.estado === "A",
            })
          );
          this.utilService.closeLoadingSpinner();
        },
        error: (error: HttpErrorResponse) => {
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
    return this.aprobadoresFijosService.obtenerAprobadoresFijos().subscribe({
      next: (response) => {
        this.dataTable = response.aprobadoresFijos.map(
          (aprobadoresFijosResponse) => ({
            ...aprobadoresFijosResponse,
            estado: aprobadoresFijosResponse.estado === "A",
          })
        );
        this.utilService.closeLoadingSpinner();
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
    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
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
    this.router.navigate(["/mantenedores/crear-aprobador-fijo"]);
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    this.router.navigate(["/mantenedores/editar-aprobador-fijo", id_edit]);
  }
}
