import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { AprobadorFijoPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { AprobadoresFijosData } from "./aprobadores-fijos.data";
import { AprobadoresFijosService } from "./aprobadores-fijos.service";

@Component({
  selector: "app-aprobadores-fijos",
  templateUrl: "./aprobadores-fijos.component.html",
  styleUrls: ["./aprobadores-fijos.component.scss"],
})
export class AprobadoresFijosComponent implements OnInit {
  private pageCode: string = PageCodes.AprobadorFijo;
  public activeRecords: boolean = true;
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
  public dataTableActive: any[] = [];
  public dataTableInactive: any[] = [];

  public colsToFilterByText: string[] = AprobadoresFijosData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = AprobadoresFijosData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_APROBADORES_FIJOS;
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
    this.utilService.openLoadingSpinner("Cargando información. Espere por favor...");

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
    return this.aprobadoresFijosService.obtenerAprobadoresFijos().subscribe({
      next: (response) => {
        this.dataTable = response.aprobadoresFijos
          .map(
            (aprobadoresFijosResponse) => ({
              ...aprobadoresFijosResponse,
              id: aprobadoresFijosResponse.iD_APROBADOR,
              estado: aprobadoresFijosResponse.estado === "A",
            })
          )
          .sort((a, b) => a.niveL_DIRECCION.localeCompare(b.niveL_DIRECCION));

        this.dataTableActive = this.dataTable.filter(data => data.estado);
        this.dataTableInactive = this.dataTable.filter(data => !data.estado);

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.closeLoadingSpinner();

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
    this.router.navigate(["/mantenedores/editar-aprobador-fijo", id_edit]);
  }

  public onChangeActiveRecordsCheckbox(event: any): void {
    this.activeRecords = event;
  }
}
