import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgSelectConfig } from "@ng-select/ng-select";
import { forkJoin } from "rxjs";
import { DatosNivelesAprobacion } from "src/app/eschemas/DatosNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { CrearNivelesAprobacionService } from "./crear-niveles-aprobacion.service";

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
	public dataRutaIndex: any[] = [];
	public dataTipoRuta: any[] = [];
	public dataNivelDireccion: any[] = [];
	public dataNivelAprobacion: any[] = [];
	// modelo: DatosNivelesAprobacion = new DatosNivelesAprobacion();
	selected_tiposolicitud: number | string;
	selected_tipomotivo: number | string;
	selected_accion: number | string;
	selected_ruta: number | string;
	selected_tiporuta: number | string;
	selected_niveldir: number | string;
	selected_nivelaprob: number | string;
	public id_edit: undefined | number;
	public aprobadorFijoTipoRuta: any = {};

	public modelHead = {
		idTipoSolicitud: null,
		idTipoMotivo: null,
		idAccion: null,
		idTipoRuta: null,
		idNivelDireccion: null
	};

	public idNivelesAprobacionRuta: {
		[key: string]: string;
	} = {};
	public idNivelesAprobacionRuta2: any[]=[];
	// public nivelesAprobacion = {
	//   nivelAprobacion1: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   },
	//   nivelAprobacion2: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   },
	//   nivelAprobacion3: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   },
	//   nivelAprobacion4: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   },
	//   nivelAprobacionRRHH: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   },
	//   nivelAprobacionComite: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: true
	//   }
	// };

	public desactivarTipoMotivoYAccion = false;

	// public restrictionsIds: any[] = ["3", "5", "6", 3, 5, 6];
	public restrictionsIds: any[] = ["RG", "CF", "AP"];

	public tipoSolicitudSeleccionada: any;

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

	// getNivelById() {
	//   this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

	//   this.serviceNivelesAprobacion.getNivelById(this.id_edit).subscribe((data) => {
	//     this.modelo = {
	//       ...data,
	//       estado: data.estado === "A"
	//     };

	//     this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(this.modelo.idTipoSolicitud);

	//     this.onChangeTipoSolicitud(this.modelo.idTipoSolicitud);

	//     this.onChangeTipoRuta(this.modelo.idTipoRuta);

	//     this.utilService.closeLoadingSpinner();
	//   });
	// }

	ngOnInit() {
		this.ObtenerServicioTipoSolicitud();
		// this.ObtenerServicioTipoMotivo();
		// this.ObtenerServicioAccion();
		// this.ObtenerServicioRuta();
		this.ObtenerServicioTipoRuta();
		this.ObtenerServicioNivelDireccion();
		this.ObtenerServicioNivelAprobacion();
		// if (this.id_edit !== undefined) {
		//   this.getNivelById();
		// }
	}

	onChangeTipoRuta() {
		if (!this.dataRutasPorTipoRuta[this.modelHead.idTipoRuta]) {
			this.mantenimientoService.getRutasPorTipoRuta(this.modelHead.idTipoRuta).subscribe({
				next: (response) => {
					this.dataRuta = response;

					this.mantenimientoService.getRutasPorTipoRuta(this.aprobadorFijoTipoRuta.id).subscribe({
						next: response => {
							this.dataRuta.push(...response);

							this.idNivelesAprobacionRuta = {};
							this.idNivelesAprobacionRuta2 = [];

							this.dataRuta.forEach((data, index) => {
								data.indice=index;
								this.idNivelesAprobacionRuta[data.id] = "";
								this.idNivelesAprobacionRuta2.push(data);
							});
						},
						error: (error: HttpErrorResponse) => {
							this.utilService.modalResponse(error.error, "error");
						}
					});
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse(error.error, "error");
				},
			});
		}
	}

	onChangeTipoSolicitud() {
		const codigoTipoSolicitud = this.dataTipoSolicitudes.find((data) => data.id == this.modelHead.idTipoSolicitud)!.codigoTipoSolicitud;

		this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(codigoTipoSolicitud);

		console.log(this.desactivarTipoMotivoYAccion);
		if (this.desactivarTipoMotivoYAccion) {
			this.modelHead.idTipoMotivo = 0;
			// this.modelHead.idTipoMotivo = 0;
			this.modelHead.idAccion = 0;
			// this.modelHead.idAccion = 0;
		}

		if (!this.desactivarTipoMotivoYAccion) {
			forkJoin([this.mantenimientoService.getTiposMotivosPorTipoSolicitud(this.modelHead.idTipoSolicitud), this.mantenimientoService.getAccionesPorTipoSolicitud(this.modelHead.idTipoSolicitud)]).subscribe({
				next: ([tipoMotivo, accion]) => {
					this.dataTipoMotivo = tipoMotivo
						.filter(data => data.estado === "A")
						.map((r) => ({
							id: r.id,
							descripcion: r.tipoMotivo,
						}));

					this.dataAccion = accion.map((r) => ({
						id: r.id,
						descripcion: r.accion,
					}));
				}
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

	// ObtenerServicioRuta() {
	//   return this.mantenimientoService.getRuta().subscribe({
	//     next: (response) => {
	//       this.dataRuta = response
	//         .filter(({ estado }) => estado === "A")
	//         .map((r) => ({
	//           id: r.id,
	//           descripcion: r.ruta,
	//         }));
	//     },
	//     error: (error: HttpErrorResponse) => {
	//       this.utilService.modalResponse(error.error, "error");
	//     },
	//   });
	// }

	ObtenerServicioTipoRuta() {
		return this.mantenimientoService.getTipoRuta().subscribe({
			next: (response) => {
				this.aprobadorFijoTipoRuta = response.tipoRutaType.find(data => data.tipoRuta.toUpperCase().includes("FIJ"));

				this.dataTipoRuta = response.tipoRutaType
					.filter(data => !data.tipoRuta.toUpperCase().includes("FIJ"))
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
				this.dataNivelAprobacion = res.itemCatalogoTypes
					.map((r) => ({
						id: r.codigo,
						descripcion: r.valor,
					}))
					.sort((a, b) => a.descripcion.toUpperCase().localeCompare(b.descripcion.toUpperCase()));
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
		const tipoSolicitud = this.dataTipoSolicitudes.find(data => data.id === this.modelHead.idTipoSolicitud);

		if (tipoSolicitud === undefined) {
			return true;
		}

		const codigoSolicitudIncluded = this.restrictionsIds.includes(tipoSolicitud.codigoTipoSolicitud);

		if (codigoSolicitudIncluded) {
			this.modelHead.idAccion = 0;
			this.modelHead.idTipoMotivo = 0;

			this.desactivarTipoMotivoYAccion = true;

			return !codigoSolicitudIncluded || this.modelHead.idNivelDireccion === null || this.modelHead.idTipoRuta === null || this.modelHead.idTipoSolicitud === null;
		}

		this.desactivarTipoMotivoYAccion = false;

		return this.modelHead.idAccion === null || this.modelHead.idNivelDireccion === null || this.modelHead.idTipoMotivo === null || this.modelHead.idTipoRuta === null || this.modelHead.idTipoSolicitud === null;
	}

	public validateNivelesAprobacion(): boolean {
		return Object.values(this.idNivelesAprobacionRuta).some((idNivelAprobacionRuta) => idNivelAprobacionRuta !== "");
	}

	procesarNivelAprobacion() {
		const nivelesAprobacion = Object.entries(this.idNivelesAprobacionRuta)
			//.filter(([_, value]) => value !== "")
			.map(([key, value]) => {
				let modelo: DatosNivelesAprobacion = new DatosNivelesAprobacion();
				modelo = {
					...modelo,
					...this.modelHead,
					idRuta: parseInt(key),
					tipoMotivo: this.idNivelesAprobacionRuta2.filter((x) => x.id===parseInt(key))[0].indice.toString(),
					idNivelAprobacionRuta: value,
					estado: "A"
				};
				return modelo;
			});
		this.serviceNivelesAprobacion.guardarNivelesAprobacion(nivelesAprobacion).subscribe({
			next: () => {
				this.utilService.closeLoadingSpinner();

				this.utilService.modalResponse("Datos ingresados correctamente", "success");

				setTimeout(() => {
					this.router.navigate(["/mantenedores/niveles-aprobacion"]);
				}, 2000);
			},
			error: (error: HttpErrorResponse) => {
				// this.utilService.modalResponse(error.error, "error");
				this.utilService.modalResponse("Ya existe un Nivel de Aprobación para esta configuración.", "error");
			}
		});

		// this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

		// const modelo = {
		//   ...this.modelo,
		//   estado: this.modelo.estado ? "A" : "I",
		// };

		// if (this.id_edit === undefined) {
		//   this.route.params.subscribe((params) => {
		//     this.serviceNivelesAprobacion.guardarNivelAprobacion(modelo).subscribe({
		//       next: (response) => {
		//         this.utilService.closeLoadingSpinner();

		//         this.utilService.modalResponse("Datos ingresados correctamente", "success");

		//         setTimeout(() => {
		//           this.router.navigate(["/mantenedores/niveles-aprobacion"]);
		//         }, 1600);
		//       },
		//       error: (error: HttpErrorResponse) => {
		//         this.utilService.modalResponse(error.error, "error");
		//       }
		//     });
		//   });

		//   return;
		// }

		// this.serviceNivelesAprobacion.actualizarNivelAprobacion(modelo).subscribe({
		//   next: (response) => {
		//     this.utilService.closeLoadingSpinner();

		//     this.utilService.modalResponse("Datos actualizados correctamente", "success");

		//     setTimeout(() => {
		//       this.router.navigate(["/mantenedores/niveles-aprobacion"]);
		//     }, 1600);
		//   },
		//   error: (error: HttpErrorResponse) => {
		//     this.utilService.modalResponse(error.error, "error");
		//   }
		// });
	}
}
