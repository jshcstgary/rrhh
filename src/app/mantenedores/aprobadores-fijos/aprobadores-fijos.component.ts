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

@Component({
  selector: "app-aprobadores-fijos",
  templateUrl: "./aprobadores-fijos.component.html",
  styleUrls: ["./aprobadores-fijos.component.scss"],
})
export class AprobadoresFijosComponent implements OnInit {
  public columnsTable: IColumnsTable = AprobadoresFijosData.columns;
  public dataTable: any[] = [];

  /*public dataTable: any[] = [
    {
      ID_APROBACION: 1, // Este
      niveL_DIRECCION: "direccion1", // Este
      codigO_POSICION: "posicion1",
      subleger: "subleger1",
      nombre: "nombre1",
      codigO_POSICION_REPORTA_A: "reporta1",
      reportA_A: "reportaA1", // Este
      estado: true, // Este
      fechA_CREACION: "2024-04-29T14:32:01.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:01.103Z",
      usuariO_CREACION: "usuario1",
      usuariO_MODIFICACION: "usuario1",
      descripcionPosicion: "Líder de Proyectos", // Este
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 2,
      niveL_DIRECCION: "direccion2",
      codigO_POSICION: "posicion2",
      subleger: "subleger2",
      nombre: "nombre2",
      codigO_POSICION_REPORTA_A: "reporta2",
      reportA_A: "reportaA2",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:02.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:02.103Z",
      usuariO_CREACION: "usuario2",
      usuariO_MODIFICACION: "usuario2",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 3,
      niveL_DIRECCION: "direccion3",
      codigO_POSICION: "posicion3",
      subleger: "subleger3",
      nombre: "nombre3",
      codigO_POSICION_REPORTA_A: "reporta3",
      reportA_A: "reportaA3",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:03.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:03.103Z",
      usuariO_CREACION: "usuario3",
      usuariO_MODIFICACION: "usuario3",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 4,
      niveL_DIRECCION: "direccion4",
      codigO_POSICION: "posicion4",
      subleger: "subleger4",
      nombre: "nombre4",
      codigO_POSICION_REPORTA_A: "reporta4",
      reportA_A: "reportaA4",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:04.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:04.103Z",
      usuariO_CREACION: "usuario4",
      usuariO_MODIFICACION: "usuario4",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 5,
      niveL_DIRECCION: "direccion5",
      codigO_POSICION: "posicion5",
      subleger: "subleger5",
      nombre: "nombre5",
      codigO_POSICION_REPORTA_A: "reporta5",
      reportA_A: "reportaA5",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:05.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:05.103Z",
      usuariO_CREACION: "usuario5",
      usuariO_MODIFICACION: "usuario5",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 6,
      niveL_DIRECCION: "direccion6",
      codigO_POSICION: "posicion6",
      subleger: "subleger6",
      nombre: "nombre6",
      codigO_POSICION_REPORTA_A: "reporta6",
      reportA_A: "reportaA6",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:06.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:06.103Z",
      usuariO_CREACION: "usuario6",
      usuariO_MODIFICACION: "usuario6",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 7,
      niveL_DIRECCION: "direccion7",
      codigO_POSICION: "posicion7",
      subleger: "subleger7",
      nombre: "nombre7",
      codigO_POSICION_REPORTA_A: "reporta7",
      reportA_A: "reportaA7",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:07.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:07.103Z",
      usuariO_CREACION: "usuario7",
      usuariO_MODIFICACION: "usuario7",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 8,
      niveL_DIRECCION: "direccion8",
      codigO_POSICION: "posicion8",
      subleger: "subleger8",
      nombre: "nombre8",
      codigO_POSICION_REPORTA_A: "reporta8",
      reportA_A: "reportaA8",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:08.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:08.103Z",
      usuariO_CREACION: "usuario8",
      usuariO_MODIFICACION: "usuario8",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 9,
      niveL_DIRECCION: "direccion9",
      codigO_POSICION: "posicion9",
      subleger: "subleger9",
      nombre: "nombre9",
      codigO_POSICION_REPORTA_A: "reporta9",
      reportA_A: "reportaA9",
      estado: true,
      fechA_CREACION: "2024-04-29T14:32:09.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:09.103Z",
      usuariO_CREACION: "usuario9",
      usuariO_MODIFICACION: "usuario9",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 10,
      niveL_DIRECCION: "direccion10",
      codigO_POSICION: "posicion10",
      subleger: "subleger10",
      nombre: "nombre10",
      codigO_POSICION_REPORTA_A: "reporta10",
      reportA_A: "reportaA10",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:10.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:10.103Z",
      usuariO_CREACION: "usuario10",
      usuariO_MODIFICACION: "usuario10",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 11,
      niveL_DIRECCION: "direccion11",
      codigO_POSICION: "posicion11",
      subleger: "subleger11",
      nombre: "nombre11",
      codigO_POSICION_REPORTA_A: "reporta11",
      reportA_A: "reportaA11",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:11.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:11.103Z",
      usuariO_CREACION: "usuario11",
      usuariO_MODIFICACION: "usuario11",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 12,
      niveL_DIRECCION: "direccion12",
      codigO_POSICION: "posicion12",
      subleger: "subleger12",
      nombre: "nombre12",
      codigO_POSICION_REPORTA_A: "reporta12",
      reportA_A: "reportaA12",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:12.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:12.103Z",
      usuariO_CREACION: "usuario12",
      usuariO_MODIFICACION: "usuario12",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 13,
      niveL_DIRECCION: "direccion13",
      codigO_POSICION: "posicion13",
      subleger: "subleger13",
      nombre: "nombre13",
      codigO_POSICION_REPORTA_A: "reporta13",
      reportA_A: "reportaA13",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:13.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:13.103Z",
      usuariO_CREACION: "usuario13",
      usuariO_MODIFICACION: "usuario13",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 14,
      niveL_DIRECCION: "direccion14",
      codigO_POSICION: "posicion14",
      subleger: "subleger14",
      nombre: "nombre14",
      codigO_POSICION_REPORTA_A: "reporta14",
      reportA_A: "reportaA14",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:14.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:14.103Z",
      usuariO_CREACION: "usuario14",
      usuariO_MODIFICACION: "usuario14",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 15,
      niveL_DIRECCION: "direccion15",
      codigO_POSICION: "posicion15",
      subleger: "subleger15",
      nombre: "nombre15",
      codigO_POSICION_REPORTA_A: "reporta15",
      reportA_A: "reportaA15",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:15.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:15.103Z",
      usuariO_CREACION: "usuario15",
      usuariO_MODIFICACION: "usuario15",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 16,
      niveL_DIRECCION: "direccion16",
      codigO_POSICION: "posicion16",
      subleger: "subleger16",
      nombre: "nombre16",
      codigO_POSICION_REPORTA_A: "reporta16",
      reportA_A: "reportaA16",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:16.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:16.103Z",
      usuariO_CREACION: "usuario16",
      usuariO_MODIFICACION: "usuario16",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 17,
      niveL_DIRECCION: "direccion17",
      codigO_POSICION: "posicion17",
      subleger: "subleger17",
      nombre: "nombre17",
      codigO_POSICION_REPORTA_A: "reporta17",
      reportA_A: "reportaA17",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:17.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:17.103Z",
      usuariO_CREACION: "usuario17",
      usuariO_MODIFICACION: "usuario17",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 18,
      niveL_DIRECCION: "direccion18",
      codigO_POSICION: "posicion18",
      subleger: "subleger18",
      nombre: "nombre18",
      codigO_POSICION_REPORTA_A: "reporta18",
      reportA_A: "reportaA18",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:18.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:18.103Z",
      usuariO_CREACION: "usuario18",
      usuariO_MODIFICACION: "usuario18",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 19,
      niveL_DIRECCION: "direccion19",
      codigO_POSICION: "posicion19",
      subleger: "subleger19",
      nombre: "nombre19",
      codigO_POSICION_REPORTA_A: "reporta19",
      reportA_A: "reportaA19",
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:19.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:19.103Z",
      usuariO_CREACION: "usuario19",
      usuariO_MODIFICACION: "usuario19",
      descripcionPosicion: "Líder de Proyectos",
      supervisaA: "Desarrollador",
      nivelReporte: "Gerencia Media",
    },
    {
      ID_APROBACION: 20,
      niveL_DIRECCION: "direccion20", // OK
      codigO_POSICION: "posicion20", // OK
      subleger: "subleger20", // OK
      nombre: "nombre20",
      codigO_POSICION_REPORTA_A: "reporta20", // OK
      reportA_A: "reportaA20", // OK
      estado: false,
      fechA_CREACION: "2024-04-29T14:32:20.103Z",
      fechA_MODIFICACION: "2024-04-29T14:32:20.103Z",
      usuariO_CREACION: "usuario20",
      usuariO_MODIFICACION: "usuario20",
      descripcionPosicion: "Líder de Proyectos", // OK
      supervisaA: "Desarrollador", // OK
      nivelReporte: "Gerencia Media", // OK
    },
  ];*/

  // public tableInputsEditRow: IInputsComponent = AprobadoresFijosData.tableInputsEditRow;
  // public colsToFilterByText: string[] = AprobadoresFijosData.colsToFilterByText;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.ObtenerServicioTipoSolicitud();
    // this.ObtenerServicioNivelDireccion();
    // this.ObtenerServicioTipoMotivo();
    this.getDataToTable();
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
