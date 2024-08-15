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
import { NivelesAprobacionData, NivelesAprobacionData2 } from "./niveles-aprobacion.data";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";
import Swal from "sweetalert2";
import { TableComponentData } from "src/app/component/table/table.data";
import { CrearNivelesAprobacionService } from "../crear-niveles-aprobacion/crear-niveles-aprobacion.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-niveles-aprobacion",
  templateUrl: "./niveles-aprobacion.component.html",
  styleUrls: ["./niveles-aprobacion.component.scss"],
})
export class NivelesAprobacionComponent implements OnInit {
  private pageCode: string = PageCodes.NivelesAprobacion;
  public activeRecords: boolean = true;
  public pageControlPermission: typeof NivelAprobacionPageControlPermission = NivelAprobacionPageControlPermission;

  public rowsPerPageTable: number = TableComponentData.defaultRowPerPage;
  public pageNumberTable: number = 1;

  tipoMotivoDeshablitado: boolean = false;

  public restrictionsIds: any[] = ["RG", "CF", "AP"];

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

  public columnsTable: IColumnsTable = NivelesAprobacionData.columns;
  public columnsTable2: IColumnsTable = NivelesAprobacionData2.columns;
  public dataTable: any[] = [];

  public rutasTableHeader: any[] = [];

  public idNivelesAprobacionRuta: {
    tipoRuta: string;
    tipoSolicitud: string;
    [key: string]: string;
  } = {
    tipoRuta: "",
    tipoSolicitud: ""
  };

  private nivelesAprobacion: any[] = [];
  public dataTableActive: any[] = [];
  public dataTableInactive: any[] = [];
  // public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
  // public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  public hasFiltered: boolean = true;
  public dataFilterNivelesAprobacion = {
    tipoMotivo: "",
    tipoSolicitud: "",
    nivelDireccion: "",
    tipoRuta: "",
    accion: ""
  };
  public dataTipoMotivo: any[] = [];
  public dataTipoRuta: any[] = [];
  public dataAccion: any[] = [];
  private dataRuta: any[] = [];
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];

  constructor(
    private nivelesAprobacionService: NivelesAprobacionService,
    private tableService: TableService,
    private validationsService: ValidationsService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private permissionService: PermisoService,
    private serviceNivelesAprobacion: CrearNivelesAprobacionService
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
    this.ObtenerServicioTipoRuta();
    this.ObtenerServicioAccion();
    this.ObtenerServicioRuta();
    // this.getDataToTable();
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

  // filterDataTable() {
  //   if (this.dataFilterNivelesAprobacion.tipoSolicitud === null || this.dataFilterNivelesAprobacion.tipoSolicitud === undefined || this.dataFilterNivelesAprobacion.nivelDireccion === null || this.dataFilterNivelesAprobacion.nivelDireccion === undefined) {
  //     Swal.fire({
  //       text: "Seleccione al menos un tipo de solicitud y un nivel de dirección",
  //       icon: "info",
  //       confirmButtonColor: "rgb(227, 199, 22)",
  //       confirmButtonText: "Ok"
  //     });

  //     return;
  //   }

  //   switch (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
  //     case "case1":
  //       this.getDataToTable();

  //       break;

  //     case "case2":
  //       this.getDataToTable();

  //       break;

  //     case "case3":
  //       this.utilService.modalResponse("Por favor seleccione el Tipo de Solicitud", "info");

  //       break;

  //     case "case4":
  //       this.getDataToTableFilter();

  //       break;
  //   }
  // }

  getDataToTableFilter() {
    if (this.dataFilterNivelesAprobacion.tipoSolicitud === "" || this.dataFilterNivelesAprobacion.nivelDireccion === "") {
      Swal.fire({
        text: "Seleccione al menos un tipo de solicitud y un nivel de dirección",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok"
      });

      return;
    }

    const tipoSolicitud = this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud.toString());

    if (tipoSolicitud === undefined) {
      return;
    }

    if (!this.restrictionsIds.includes(tipoSolicitud.codigoTipoSolicitud) && this.dataFilterNivelesAprobacion.tipoMotivo === "") {
      Swal.fire({
        text: "Requisición de Personal requiere Tipo Motivo",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok"
      });

      return;
    }

    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    this.nivelesAprobacionService.filterNivelesAprobaciones(this.dataFilterNivelesAprobacion.tipoSolicitud, this.dataFilterNivelesAprobacion.tipoMotivo, this.dataFilterNivelesAprobacion.nivelDireccion, this.dataFilterNivelesAprobacion.tipoRuta, this.dataFilterNivelesAprobacion.accion).subscribe({
      next: (response) => {
        if (response.totalRegistros === 0) {
          this.dataTable = [];

          this.utilService.closeLoadingSpinner();

          this.utilService.modalResponse("No existen registros para esta búsqueda", "error");

          return;
        }

        let tipoRutaColumn: string = "";

        const dataTable = {
          tipoRuta: "-",
          tipoSolicitud: "-",
          nivelAprobacion1: "-",
          nivelAprobacion2: "-",
          nivelAprobacion3: "-",
          nivelAprobacion4: "-",
          nivelAprobacionGerenteRRHH: "-",
          nivelAprobacionComiteRemuneracion: "-"
        };

        this.nivelesAprobacion = response.nivelAprobacionType.filter(data => data.estado === "A");

        const idTiposRutas = Array.from(new Set(this.nivelesAprobacion.map(({ idTipoRuta }) => idTipoRuta)));

        this.rutasTableHeader = this.dataRuta
          .filter(data => idTiposRutas.includes(data.idTipoRuta))
          .sort((a, b) => a.idTipoRuta - b.idTipoRuta);

        this.dataTable = this.nivelesAprobacion
          .reduce((acc, obj) => {
            const grupo = acc.find(g => g[0].idTipoRuta === obj.idTipoRuta);

            if (grupo) {
              grupo.push(obj);
            } else {
              acc.push([obj]);
            }

            return acc;
          }, [] as any[][])
          .map(data => (
            data.map(d => ({
              idNivelAprobacion: d.idNivelAprobacion,
              nivelAprobacionRuta: d.nivelAprobacionRuta,
              idRuta: d.idRuta
            }))
          ));

        // this.dataTable = this.rutasTableHeader.map(ruta => {
        //   console.log("=============================>");
        //   console.log(ruta);

        //   const newDataTable = this.dataTable.map(subarreglo => {
        //     console.log("=============================>");
        //     console.log(subarreglo);

        //     const found = subarreglo.find(sub => sub.idRuta === ruta.id);

        //     console.log(found);
        //     if (found) {
        //       return found;
        //     } else {
        //       return {
        //         id: 0,
        //         idTipoRuta: 0,
        //         descripcion: "-"
        //       };
        //     }
        //   });

        //   console.log(newDataTable);
        // });

        // this.dataTable = this.dataTable.map(subArreglo =>
        //   subArreglo.map(obj => {
        //     // Buscar si el idRuta está en el primer arreglo
        //     const encontrado = this.rutasTableHeader.find(item => item.id === obj.idRuta);

        //     // Devolver el objeto encontrado o un objeto con valores predeterminados
        //     return encontrado
        //       ? obj
        //       : {
        //         id: 0,
        //         descripcion: "-",
        //         idTipoRuta: 0
        //       };
        //   })
        // );
        console.log(this.dataTable);

        // this.nivelesAprobacion.forEach(({ idNivelAprobacionRuta, ruta, tipoRuta }) => {
        //   console.log(tipoRuta);

        //   if (ruta.includes("1")) {
        //     dataTable.nivelAprobacion1 = idNivelAprobacionRuta;
        //     tipoRutaColumn = tipoRuta;
        //   }

        //   if (ruta.includes("2")) {
        //     dataTable.nivelAprobacion2 = idNivelAprobacionRuta;
        //   }

        //   if (ruta.includes("3")) {
        //     dataTable.nivelAprobacion3 = idNivelAprobacionRuta;
        //   }

        //   if (ruta.includes("4")) {
        //     dataTable.nivelAprobacion4 = idNivelAprobacionRuta;
        //   }

        //   if (ruta.toUpperCase().includes("RRHH")) {
        //     dataTable.nivelAprobacionGerenteRRHH = idNivelAprobacionRuta;
        //   }

        //   if (ruta.toUpperCase().includes("REMUNER")) {
        //     dataTable.nivelAprobacionComiteRemuneracion = idNivelAprobacionRuta;
        //   }
        // });

        // this.dataTable = [
        //   {
        //     ...dataTable,
        //     tipoRuta: tipoRutaColumn,
        //     tipoSolicitud: this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud).descripcion
        //   }
        // ];

        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.closeLoadingSpinner();

        this.dataTable = [];

        this.utilService.modalResponse("No existen registros para esta búsqueda", "error");
      },
    });
  }

  public showData(data: any[], ruta: any) {
    const found = data.find(d => d.idRuta === ruta.id);

    return found !== undefined ? found.nivelAprobacionRuta : "-";
  }

  // private getDataToTable() {
  //   this.utilService.openLoadingSpinner("Cargando información. Espere por favor...");

  //   return this.nivelesAprobacionService.obtenerNiveleAprobaciones().subscribe({
  //     next: (response) => {
  //       this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse) => ({
  //         ...nivelAprobacionResponse,
  //         id: nivelAprobacionResponse.idNivelAprobacion,
  //         estado: nivelAprobacionResponse.estado === "A",
  //       }));

  //       this.dataTableActive = this.dataTable.filter(data => data.estado);
  //       this.dataTableInactive = this.dataTable.filter(data => !data.estado);

  //       this.utilService.closeLoadingSpinner();
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.utilService.closeLoadingSpinner();

  //       this.dataTable = [];

  //       this.utilService.modalResponse(error.error, "error");
  //     },
  //   });
  // }

  //LLenar combo Tipo Solicitud
  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        this.dataTipoSolicitudes = response.tipoSolicitudType
          .filter(({ estado }) => estado === "A")
          .map((r) => ({
            id: r.id,
            descripcion: r.tipoSolicitud,
            codigoTipoSolicitud: r.codigoTipoSolicitud
          }));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getNivelesPorTipo("ND").subscribe({
      next: (response) => {
        this.dataNivelDireccion = [...new Set(response.evType.map(({ nivelDir }) => nivelDir))];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        this.dataTipoMotivo = response
          .filter(({ estado }) => estado === "A")
          .map((r) => ({
            id: r.id,
            descripcion: r.tipoMotivo,
          }));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoRuta() {
    return this.mantenimientoService.getTipoRuta().subscribe({
      next: (response) => {
        this.dataTipoRuta = response.tipoRutaType
          .filter(({ estado }) => estado === "A")
          .map((r) => ({
            id: r.id,
            descripcion: r.tipoRuta,
          }));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioAccion() {
    return this.mantenimientoService.getAccion().subscribe({
      next: (response) => {
        this.dataAccion = response
          .filter(({ estado }) => estado === "A")
          .map((r) => ({
            id: r.id,
            descripcion: r.accion,
          }));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioRuta() {
    return this.mantenimientoService.getRuta().subscribe({
      next: (response) => {
        this.dataRuta = response
          .filter(({ estado }) => estado === "A")
          .map((r) => ({
            id: r.id,
            descripcion: r.ruta,
            idTipoRuta: r.idTipoRuta
          }));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  onChangeTipoSolicitud() {
    const tipoSolicitud = this.dataTipoSolicitudes.find(data => data.id.toString() === this.dataFilterNivelesAprobacion.tipoSolicitud.toString());

    if (tipoSolicitud === undefined) {
      return;
    }

    if (this.restrictionsIds.includes(tipoSolicitud.codigoTipoSolicitud)) {
      this.dataFilterNivelesAprobacion.tipoMotivo = "10000";

      this.tipoMotivoDeshablitado = true;
    } else {
      this.dataFilterNivelesAprobacion.tipoMotivo = "";

      this.tipoMotivoDeshablitado = false;
    }
  }

  pageCrear() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }

  // onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
  onRowActionClicked(index: number) {
    const idParam = this.dataTable[index]
      .map(data => data.idNivelAprobacion)
      .join("_");

    this.router.navigate(["/mantenedores/editar-niveles-aprobacion"], {
      queryParams: {
        id_edit: idParam
      }
    });
  }
}
