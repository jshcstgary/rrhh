import { CommonModule, NgFor } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgModel, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgSelectConfig, NgSelectModule } from "@ng-select/ng-select";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { CrearNivelesAprobacionService } from "./crear-niveles-aprobacion.service";
import Swal from "sweetalert2";
import { DatosNivelesAprobacion } from "src/app/eschemas/DatosNivelesAprobacion";

@Component({
  standalone: true,
  selector: "app-crear-niveles-aprobacion",
  templateUrl: "./crear-niveles-aprobacion.component.html",
  styleUrls: ["./crear-niveles-aprobacion.component.scss"],
  imports: [NgFor, FormsModule, CommonModule],
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

  public desactivarTipoMotivoYAccion = false;

  public restrictionsIds: any[] = ["3", "5", "6", 3, 5, 6];

  public tipoSolicitudSeleccionada: any;

  public tipoRutaSeleccionada: any;

  public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};
  public dataAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } = {};

  public dataRutasPorTipoRuta: { [idSolicitud: number]: any[] } = {};

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
      // Utiliza el id_edit obtenido
    });
  }

  PageNivelesAprobacion() {
    this.router.navigate(["/mantenedores/niveles-aprobacion"]);
  }

  getNivelById() {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    this.serviceNivelesAprobacion
      .getNivelById(this.id_edit)
      .subscribe((data) => {
        this.modelo = { ...data, estado: data.estado === "A" };
        this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(
          this.modelo.idTipoSolicitud
        );
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
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.tipoSolicitudSeleccionada = idTipoSolicitud;
    this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(
      this.tipoSolicitudSeleccionada
    );
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
        this.dataTipoRuta = response.tipoRutaType.map((r) => ({
          id: r.id,
          descripcion: r.tipoRuta,
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

  ObtenerServicioNivelAprobacion() {
    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
        this.dataNivelAprobacion = [
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
  /*ObtenerServicioNivelAprobacion() {
    console.log("Executing ObtenerServicioNivelAprobacion() method");
    return this.mantenimientoService.getCatalogo("RBPNA").subscribe({
      // return this.mantenimientoService.getCatalogoRBPNA().subscribe({
      next: (response) => {
        this.dataNivelAprobacion = response.itemCatalogoTypes.map((r) => ({
          id: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }*/

  procesarNivelAprobacion() {
    this.utilService.openLoadingSpinner(
      "Guardando información, espere por favor..."
    );

    if (this.id_edit === undefined) {
      this.route.params.subscribe((params) => {
        this.serviceNivelesAprobacion
          .guardarNivelAprobacion({
            ...this.modelo,
            estado: this.modelo.estado ? "A" : "I",
          })
          .subscribe(
            (response) => {
              // Inicio
              this.serviceNivelesAprobacion
                .refrescarNivelesAprobaciones()
                .subscribe(
                  (response) => {
                    this.utilService.closeLoadingSpinner();
                    this.utilService.modalResponse(
                      "Datos ingresados correctamente",
                      "success"
                    );

                    setTimeout(() => {
                      this.router.navigate([
                        "/mantenedores/niveles-aprobacion",
                      ]);
                    }, 1600);
                  },
                  (error: HttpErrorResponse) => {
                    this.utilService.modalResponse(error.error, "error");
                  }
                );

              // Fin
            },
            (error: HttpErrorResponse) => {
              this.utilService.modalResponse(error.error, "error");
            }
          );
      });
      return;
    }
    this.serviceNivelesAprobacion
      .actualizarNivelAprobacion({
        ...this.modelo,
        estado: this.modelo.estado ? "A" : "I",
      })
      .subscribe(
        (response) => {
          this.serviceNivelesAprobacion
            .refrescarNivelesAprobaciones()
            .subscribe(
              (response) => {
                this.utilService.closeLoadingSpinner();
                console.log("RESPONSE REFRESH ACTUALIZAR: ", response);
                this.utilService.modalResponse(
                  "Datos actualizados correctamente",
                  "success"
                );

                setTimeout(() => {
                  this.router.navigate(["/mantenedores/niveles-aprobacion"]);
                }, 1600);
              },
              (error: HttpErrorResponse) => {
                this.utilService.modalResponse(error.error, "error");
              }
            );
        },
        (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        }
      );
    console.log("Editar nivel de solicitud");
  }
}
