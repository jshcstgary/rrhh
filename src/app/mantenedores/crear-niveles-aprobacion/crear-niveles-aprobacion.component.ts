import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgSelectConfig } from "@ng-select/ng-select";
import { DatosNivelesAprobacion } from "src/app/eschemas/DatosNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { CrearNivelesAprobacionService } from "./crear-niveles-aprobacion.service";
import { compileNgModule } from "@angular/compiler";
import { NivelesAprobacionService } from "../niveles-aprobacion/niveles-aprobacion.service";

@Component({
  selector: "app-crear-niveles-aprobacion",
  templateUrl: "./crear-niveles-aprobacion.component.html",
  styleUrls: ["./crear-niveles-aprobacion.component.scss"]
})
export class CrearNivelesAprobacionComponent implements OnInit {
  public dataTipoSolicitudes: any[] = [];
  public dataTipoMotivo: any[] = [];
  public dataAccion: any[] = [];
  public dataRuta: any[] = [];
  public dataTipoRuta: any[] = [];
  public dataNivelDireccion: any[] = [];
  public dataNivelAprobacion: any[] = [];
  modelo: DatosNivelesAprobacion = new DatosNivelesAprobacion();
  selected_tiposolicitud: number | string;
  selected_tipomotivo: number | string;
  selected_accion: number | string;
  selected_ruta: number | string;
  selected_tiporuta: number | string;
  selected_niveldir: number | string;
  selected_nivelaprob: number | string;
  public id_edit: undefined | number;

  public modelHead = {
    idTipoSolicitud: 0,
    idTipoMotivo: 0,
    idAccion: 0,
    idTipoRuta: 0,
    idNivelDireccion: ""
  };

  public nivelesAprobacion = {
    nivelAprobacion1: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    },
    nivelAprobacion2: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    },
    nivelAprobacion3: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    },
    nivelAprobacion4: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    },
    nivelAprobacionRRHH: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    },
    nivelAprobacionComite: {
      idNivelAprobacionRuta: "",
      idTipoRuta: 0,
      idRuta: 0,
      estado: true
    }
  };

  public desactivarTipoMotivoYAccion = false;

  // public restrictionsIds: any[] = ["3", "5", "6", 3, 5, 6];
  public restrictionsIds: any[] = ["RG", "CF", "AP"];

  public tipoSolicitudSeleccionada: any;

  public tipoRutaSeleccionada: any;

  public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};
  public dataAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } = {};

  public dataRutasPorTipoRuta: { [idSolicitud: number]: any[] } = {};

  public codigoTipoSolicitud: string = "";

  constructor(
    private config: NgSelectConfig,
    private router: Router,
    private route: ActivatedRoute,
    private mantenimientoService: MantenimientoService,
    private utilService: UtilService,
    private serviceNivelesAprobacion: CrearNivelesAprobacionService
  ) {
    this.config.notFoundText = "Custom not found";
    this.config.appendTo = "body";
    this.config.bindValue = "value";

    this.route.queryParams.subscribe((params) => {
      this.id_edit = params["id_edit"];
    });
  }

  getNivelById() {
    this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

    this.serviceNivelesAprobacion.getNivelById(this.id_edit).subscribe((data) => {
      this.modelo = {
        ...data,
        estado: data.estado === "A"
      };

      this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(this.modelo.idTipoSolicitud);

      this.onChangeTipoSolicitud(this.modelo.idTipoSolicitud);

      this.onChangeTipoRuta(this.modelo.idTipoRuta);

      this.utilService.closeLoadingSpinner();
    });
  }

  ngOnInit() {
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioAccion();
    this.ObtenerServicioRuta();
    this.ObtenerServicioTipoRuta();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioNivelAprobacion();
    if (this.id_edit !== undefined) {
      this.getNivelById();
    }
  }

  onChangeTipoRuta(idTipoRuta: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.tipoRutaSeleccionada = idTipoRuta;
    if (!this.dataRutasPorTipoRuta[idTipoRuta]) {
      this.mantenimientoService.getRutasPorTipoRuta(idTipoRuta).subscribe({
        next: (response) => {
          this.dataRutasPorTipoRuta[idTipoRuta] = response;
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
    }
  }

  onChangeTipoSolicitud(idTipoSolicitud: number) {
    this.codigoTipoSolicitud = this.dataTipoSolicitudes.filter((data) => data.id == this.modelo.idTipoSolicitud)[0]?.codigoTipoSolicitud;

    this.tipoSolicitudSeleccionada = idTipoSolicitud;
    // this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(this.tipoSolicitudSeleccionada);
    this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(this.codigoTipoSolicitud);

    if (this.desactivarTipoMotivoYAccion) {
      this.modelo.tipoMotivo = "";
      this.modelo.idTipoMotivo = 0;
      this.modelo.accion = "";
      this.modelo.idAccion = 0;
    }

    if (!this.dataAccionesPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getAccionesPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataAccionesPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }

    if (!this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getTiposMotivosPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }
  }

  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        this.dataTipoSolicitudes = response.tipoSolicitudType
          .filter(data => data.estado === "A")
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

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        this.dataTipoMotivo = response
          .filter(data => data.estado === "A")
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

  ObtenerServicioAccion() {
    return this.mantenimientoService.getAccion().subscribe({
      next: (response) => {
        this.dataAccion = response.map((r) => ({
          id: r.id,
          descripcion: r.accion,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioRuta() {
    return this.mantenimientoService.getRuta().subscribe({
      next: (response) => {
        this.dataRuta = response.map((r) => ({
          id: r.id,
          descripcion: r.ruta,
        })); //verificar la estructura mmunoz
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

  // ObtenerServicioNivelAprobacion() {
  //   return this.mantenimientoService.getNivelesPorTipo("NA").subscribe({
  //     next: (response) => {
  //       this.dataNivelAprobacion = [
  //         ...new Set(
  //           response.evType.map((item) => {
  //             return item.nivelDir;
  //           })
  //         ),
  //       ];
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.utilService.modalResponse(error.error, "error");
  //     },
  //   });
  // }

  // Cambio en el consumo del API comentado tveas
  /*ObtenerServicioNivelDireccion() {
    console.log("Executing ObtenerServicioNivelDireccion() method");
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      // return this.mantenimientoService.getCatalogoRBPND().subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes.map((r) => ({
          id: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }*/

  // Cambio en el consumo del API comentado tveas
  ObtenerServicioNivelAprobacion() {
    console.log("Executing ObtenerServicioNivelAprobacion() method");
    return this.mantenimientoService.getCatalogo("RBPNA").subscribe({
      next: (res) => {
        this.dataNivelAprobacion = res.itemCatalogoTypes.map((r) => ({
          id: r.codigo,
          descripcion: r.valor,
        }));
      }
      // return this.mantenimientoService.getCatalogoRBPNA().subscribe({
      //   next: (response) => {
      //     this.dataNivelAprobacion = response.itemCatalogoTypes.map((r) => ({
      //       id: r.codigo,
      //       descripcion: r.valor,
      //     })); //verificar la estructura mmunoz
      //   },
      //   error: (error: HttpErrorResponse) => {
      //     this.utilService.modalResponse(error.error, "error");
      //   }
      // }),
    });
  }

  public validateData(): boolean {
    return this.modelHead.idAccion === 0 || this.modelHead.idNivelDireccion === '' || this.modelHead.idTipoMotivo === 0 || this.modelHead.idTipoRuta === 0 || this.modelHead.idTipoSolicitud === 0;
  }

  public validateNivelesAprobacion(): boolean {
    return Object.values(this.nivelesAprobacion).some(({ idNivelAprobacionRuta }) => idNivelAprobacionRuta !== "");
  }

  procesarNivelAprobacion() {
    const nivelesAprobacion = [];

    Object.values(this.nivelesAprobacion)
      .filter(({ idNivelAprobacionRuta }) => idNivelAprobacionRuta !== "")
      .forEach(nivelAprobacion => {
        let modelo: DatosNivelesAprobacion = new DatosNivelesAprobacion();

        // estado: "nivelAprobacion.estado ? "A" : "I""
        modelo = {
          ...modelo,
          ...this.modelHead,
          ...nivelAprobacion,
          estado: "A"
        };

        nivelesAprobacion.push(modelo);
      });

    console.log(nivelesAprobacion);

    return;

    this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

    const modelo = {
      ...this.modelo,
      estado: this.modelo.estado ? "A" : "I",
    };

    if (this.id_edit === undefined) {
      this.route.params.subscribe((params) => {
        this.serviceNivelesAprobacion.guardarNivelAprobacion(modelo).subscribe({
          next: (response) => {
            this.utilService.closeLoadingSpinner();

            this.utilService.modalResponse("Datos ingresados correctamente", "success");

            setTimeout(() => {
              this.router.navigate(["/mantenedores/niveles-aprobacion"]);
            }, 1600);
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          }
        });
      });

      return;
    }

    this.serviceNivelesAprobacion.actualizarNivelAprobacion(modelo).subscribe({
      next: (response) => {
        this.utilService.closeLoadingSpinner();

        this.utilService.modalResponse("Datos actualizados correctamente", "success");

        setTimeout(() => {
          this.router.navigate(["/mantenedores/niveles-aprobacion"]);
        }, 1600);
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      }
    });
  }

  public onChangeNivelAprobacion({ idRuta, idTipoRuta, nivelAprobacionProperty }: { nivelAprobacionProperty: string, idTipoRuta: number, idRuta: string }): void {
    this.nivelesAprobacion[nivelAprobacionProperty] = {
      ...this.nivelesAprobacion[nivelAprobacionProperty],
      idTipoRuta,
      idRuta
    }
  }
}
