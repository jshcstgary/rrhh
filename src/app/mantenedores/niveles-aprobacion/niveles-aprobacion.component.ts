import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { NivelAprobacionPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { ConsultaSolicitudesData } from "./niveles-aprobacion.data";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";

@Component({
  selector: "app-niveles-aprobacion",
  templateUrl: "./niveles-aprobacion.component.html",
  styleUrls: ["./niveles-aprobacion.component.scss"],
})
export class NivelesAprobacionComponent implements OnInit {
  private pageCode: string = PageCodes.NivelesAprobacion;
  public activeRecords: boolean = true;
  public pageControlPermission: typeof NivelAprobacionPageControlPermission = NivelAprobacionPageControlPermission;

  public controlsPermissions: PageControlPermiso = {
    [NivelAprobacionPageControlPermission.FiltroTipoSolicitud]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.FiltroTipoMotivo]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.FiltroNivelDireccion]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.ButtonBuscar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.ButtonAgregar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.ButtonExportar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.ButtonEditar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    },
    [NivelAprobacionPageControlPermission.ButtonDuplicar]: {
      "codigo_Control": "",
      "habilitar": false,
      "modificar": false,
      "visualizar": false
    }
  };

  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public dataTable: any[] = [];
  public dataTableActive: any[] = [];
  public dataTableInactive: any[] = [];
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
    private nivelesAprobacionService: NivelesAprobacionService,
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
        action.showed = this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonEditar].visualizar
      } else if (action.id === "cloneOnTable") {
        action.showed = this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonDuplicar].visualizar
      }
    });

    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioTipoMotivo();
    this.getDataToTable();
  }

  private getPermissions(): void {
    const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

    controlsPermission.forEach(controlPermission => {
      if (controlPermission.codigo_Control === "01") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroTipoSolicitud] = controlPermission;
      } else if (controlPermission.codigo_Control === "02") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroTipoMotivo] = controlPermission;
      } else if (controlPermission.codigo_Control === "03") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.FiltroNivelDireccion] = controlPermission;
      } else if (controlPermission.codigo_Control === "04") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonBuscar] = controlPermission;
      } else if (controlPermission.codigo_Control === "05") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonAgregar] = controlPermission;
      } else if (controlPermission.codigo_Control === "06") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonExportar] = controlPermission;
      } else if (controlPermission.codigo_Control === "07") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonEditar] = controlPermission;
      } else if (controlPermission.codigo_Control === "08") {
        this.controlsPermissions[NivelAprobacionPageControlPermission.ButtonDuplicar] = controlPermission;
      }
    });
  }

  filterDataTable() {
    console.log(this.dataFilterNivelesAprobacion);
    switch (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
      case "case1":
        this.getDataToTable();
        break;
      case "case2":
        this.getDataToTable();
        break;
      case "case3":
        this.utilService.modalResponse(
          "Por favor seleccione el Tipo de Solicitud",
          "info"
        );
        break;
      case "case4":
        this.getDataToTableFilter();
        break;
    }
  }

  getDataToTableFilter() {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    this.nivelesAprobacionService.filterNivelesAprobaciones(this.dataFilterNivelesAprobacion.tipoSolicitud, this.dataFilterNivelesAprobacion.tipoMotivo, this.dataFilterNivelesAprobacion.nivelDireccion).subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse) => ({
          ...nivelAprobacionResponse,
          estado: nivelAprobacionResponse.estado === "A",
        }));

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.closeLoadingSpinner();

        this.dataTable = [];

        this.utilService.modalResponse("No existen registros para esta búsqueda", "error");
      },
    });
  }

  private getDataToTable() {
    this.utilService.openLoadingSpinner("Cargando información. Espere por favor...");

    return this.nivelesAprobacionService.obtenerNiveleAprobaciones().subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse) => ({
          ...nivelAprobacionResponse,
          id: nivelAprobacionResponse.idNivelAprobacion,
          estado: nivelAprobacionResponse.estado === "A",
        }));

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
    return this.mantenimientoService.getNivelesPorTipo("ND").subscribe({
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
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"], {
      queryParams: { id_edit },
    });
  }

  public onChangeActiveRecordsCheckbox(event: any): void {
    this.activeRecords = event;
  }
}
