import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DatosNivelesAprobacion } from 'src/app/eschemas/DatosNivelesAprobacion';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { UtilService } from 'src/app/services/util/util.service';
import { CrearNivelesAprobacionService } from '../crear-niveles-aprobacion/crear-niveles-aprobacion.service';

@Component({
	selector: 'app-editar-niveles-aprobacion',
	templateUrl: './editar-niveles-aprobacion.component.html',
	styleUrls: ['./editar-niveles-aprobacion.component.scss']
})
export class EditarNivelesAprobacionComponent {
	public id_edit: string = "";
	public dataTipoSolicitudes: any[] = [];
	public dataTipoMotivo: any[] = [];
	public dataAccion: any[] = [];
	public dataRuta: any[] = [];
	public dataTipoRuta: any[] = [];
	public dataNivelesDireccion: any[] = [];
	public dataNivelAprobacion: any[] = [];
	public nivelesAprobacion: any[] = [];
	public aprobadorFijoTipoRuta: any = {};

	public desactivarTipoMotivoYAccion: boolean = false;

	public idNivelesAprobacionRuta: {
		[key: string]: string;
	} = {};

	public dataRutasPorTipoRuta: { [idSolicitud: number]: any[] } = {};
	// public nivelesAprobacion = {
	//   nivelAprobacion1: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   },
	//   nivelAprobacion2: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   },
	//   nivelAprobacion3: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   },
	//   nivelAprobacion4: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   },
	//   nivelAprobacionRRHH: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   },
	//   nivelAprobacionComite: {
	//     idNivelAprobacionRuta: "",
	//     idTipoRuta: 0,
	//     idRuta: 0,
	//     estado: false
	//   }
	// };

	public modelHead = {
		idTipoSolicitud: 0,
		idTipoMotivo: 0,
		idAccion: 0,
		idTipoRuta: 0,
		idNivelDireccion: ""
	};

	public restrictionsIds: any[] = ["RG", "CF", "AP"];

	constructor(private route: ActivatedRoute, private mantenimientoService: MantenimientoService, private utilService: UtilService, private serviceNivelesAprobacion: CrearNivelesAprobacionService, private router: Router) {
		this.route.queryParams.subscribe((params) => {
			this.id_edit = params["id_edit"];
		});
	}

	ngOnInit() {
		this.getSelectValues();
	}

	private getSelectValues(): void {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		forkJoin([this.mantenimientoService.getTipoSolicitud(), this.mantenimientoService.getTipoRuta(), this.mantenimientoService.getTipoMotivo(), this.mantenimientoService.getAccion(), this.mantenimientoService.getNivelesPorTipo("ND"), this.mantenimientoService.getCatalogo("RBPNA")]).subscribe({
			next: ([tipoSolicitud, tipoRuta, tipoMotivo, accion, nivelDireccion, nivelAprobacion]) => {
				this.dataTipoSolicitudes = tipoSolicitud.tipoSolicitudType
					.filter(data => data.estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoSolicitud,
						codigoTipoSolicitud: r.codigoTipoSolicitud
					}));

				this.dataTipoMotivo = tipoMotivo
					.filter(data => data.estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoMotivo,
					}));

				this.dataAccion = accion
					.filter(({ estado }) => estado === "A")
					.map((r) => ({
						id: r.id,
						descripcion: r.accion,
					}));

				this.aprobadorFijoTipoRuta = tipoRuta.tipoRutaType.find(data => data.tipoRuta.toUpperCase().includes("FIJ"));

				this.dataTipoRuta = tipoRuta.tipoRutaType
					.filter(({ estado }) => estado === "A")
					.filter(data => !data.tipoRuta.toUpperCase().includes("FIJ"))
					.map((r) => ({
						id: r.id,
						descripcion: r.tipoRuta,
					}));

				this.dataNivelesDireccion = [...new Set(nivelDireccion.evType.map(({ nivelDir }) => nivelDir))];

				this.dataNivelAprobacion = nivelAprobacion.itemCatalogoTypes.map((r) => ({
					id: r.codigo,
					descripcion: r.valor,
				}));

				this.getNivelesById();
			}
		})
	}

	private getNivelesById() {
		this.serviceNivelesAprobacion.getNivelesById(this.id_edit).subscribe(({ nivelAprobacionType }) => {
			this.nivelesAprobacion = nivelAprobacionType;

			this.modelHead.idTipoSolicitud = nivelAprobacionType[0].idTipoSolicitud;
			this.modelHead.idTipoRuta = nivelAprobacionType[0].idTipoRuta;
			this.modelHead.idNivelDireccion = nivelAprobacionType[0].idNivelDireccion;
			this.modelHead.idTipoMotivo = nivelAprobacionType[0].idTipoMotivo;
			this.modelHead.idAccion = nivelAprobacionType[0].idAccion;

			const codigoTipoSolicitud = this.dataTipoSolicitudes.find(data => data.id === this.modelHead.idTipoSolicitud)!.codigoTipoSolicitud;
			const restricted = this.restrictionsIds.includes(codigoTipoSolicitud);

			this.desactivarTipoMotivoYAccion = restricted;

			// if (!this.desactivarTipoMotivoYAccion) {
			//   forkJoin([this.mantenimientoService.getTipoMotivo(), this.mantenimientoService.getAccion()]).subscribe({
			//     next: ([tipoMotivo, accion]) => {
			//       this.dataTipoMotivo = tipoMotivo
			//         .filter(data => data.estado === "A")
			//         .map((r) => ({
			//           id: r.id,
			//           descripcion: r.tipoMotivo,
			//         }));

			//       this.dataAccion = accion.map((r) => ({
			//         id: r.id,
			//         descripcion: r.accion,
			//       }));

			//       this.fillTable(nivelAprobacionType);

			//       this.validateData();
			//     }
			//   });
			// } else {
			this.onChangeTipoRuta();

			this.fillTable(nivelAprobacionType);

			this.validateData();
			// }
		});
	}

	private fillTable(nivelesAprobaciones: any) {
		// nivelesAprobaciones.forEach(({ idNivelAprobacionRuta, ruta, tipoRuta }) => {
		//   if (ruta.includes("1")) {
		//     this.nivelesAprobacion.nivelAprobacion1.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacion1.estado = true;
		//     this.nivelesAprobacion.nivelAprobacion1.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacion1.idTipoRuta = tipoRuta;
		//   }

		//   if (ruta.includes("2")) {
		//     this.nivelesAprobacion.nivelAprobacion2.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacion2.estado = true;
		//     this.nivelesAprobacion.nivelAprobacion2.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacion2.idTipoRuta = tipoRuta;
		//   }

		//   if (ruta.includes("3")) {
		//     this.nivelesAprobacion.nivelAprobacion3.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacion3.estado = true;
		//     this.nivelesAprobacion.nivelAprobacion3.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacion3.idTipoRuta = tipoRuta;
		//   }

		//   if (ruta.includes("4")) {
		//     this.nivelesAprobacion.nivelAprobacion4.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacion4.estado = true;
		//     this.nivelesAprobacion.nivelAprobacion4.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacion4.idTipoRuta = tipoRuta;
		//   }

		//   if (ruta.toUpperCase().includes("RRHH")) {
		//     this.nivelesAprobacion.nivelAprobacionRRHH.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacionRRHH.estado = true;
		//     this.nivelesAprobacion.nivelAprobacionRRHH.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacionRRHH.idTipoRuta = tipoRuta;
		//   }

		//   if (ruta.toUpperCase().includes("REMUNER")) {
		//     this.nivelesAprobacion.nivelAprobacionComite.idNivelAprobacionRuta = idNivelAprobacionRuta;
		//     this.nivelesAprobacion.nivelAprobacionComite.estado = true;
		//     this.nivelesAprobacion.nivelAprobacionComite.idRuta = ruta;
		//     this.nivelesAprobacion.nivelAprobacionComite.idTipoRuta = tipoRuta;
		//   }
		// });

		this.utilService.closeLoadingSpinner();
	}

	// public onChangeTipoSolicitud() {
	//   const codigoTipoSolicitud = this.dataTipoSolicitudes.find(data => data.id.toString() === this.modelHead.idTipoSolicitud)!.codigoTipoSolicitud;
	//   const restricted = this.restrictionsIds.includes(codigoTipoSolicitud);

	//   this.desactivarTipoMotivoYAccion = restricted;

	//   if (!this.desactivarTipoMotivoYAccion) {
	//     forkJoin([this.mantenimientoService.getTipoMotivo(), this.mantenimientoService.getAccion()]).subscribe({
	//       next: ([tipoMotivo, accion]) => {
	//         this.dataTipoMotivo = tipoMotivo
	//           .filter(data => data.estado === "A")
	//           .map((r) => ({
	//             id: r.id,
	//             descripcion: r.tipoMotivo,
	//           }));

	//         this.dataAccion = accion.map((r) => ({
	//           id: r.id,
	//           descripcion: r.accion,
	//         }));
	//       }
	//     });
	//   }
	// }

	onChangeTipoSolicitud() {
		const codigoTipoSolicitud = this.dataTipoSolicitudes.find((data) => data.id == this.modelHead.idTipoSolicitud)!.codigoTipoSolicitud;

		// this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(this.tipoSolicitudSeleccionada);
		this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(codigoTipoSolicitud);

		this.modelHead = {
			...this.modelHead,
			idTipoMotivo: 0,
			idAccion: 0,
		}
		// if (this.desactivarTipoMotivoYAccion) {
		// }

		if (!this.desactivarTipoMotivoYAccion) {
			forkJoin([this.mantenimientoService.getTipoMotivo(), this.mantenimientoService.getAccion()]).subscribe({
				next: ([tipoMotivo, accion]) => {
					console.log(tipoMotivo);
					console.log(accion);
					this.dataTipoMotivo = tipoMotivo
						.filter(data => data.estado === "A")
						.map((r) => ({
							id: r.id,
							descripcion: r.tipoMotivo,
						}));

					this.dataAccion = accion
						.filter(data => data.estado === "A")
						.map((r) => ({
							id: r.id,
							descripcion: r.accion,
						}));
				}
			});
		}
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

							this.dataRuta.forEach(data => {
								this.idNivelesAprobacionRuta[data.id] = "";
							});

							this.nivelesAprobacion.forEach(data => {
								this.idNivelesAprobacionRuta[data.idRuta] = data.nivelAprobacionRuta;
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

	procesarNivelAprobacion() {
		const nivelesAprobacion = Object.entries(this.idNivelesAprobacionRuta)
			.filter(([_, value]) => value !== "")
			.map(([key, value]) => {
				let modelo: DatosNivelesAprobacion = new DatosNivelesAprobacion();

				modelo = {
					...modelo,
					// ...this.modelHead,
					idRuta: parseInt(key),
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
				this.utilService.modalResponse(error.error, "error");
			}
		});

		// this.serviceNivelesAprobacion.actualizarNivelAprobacion(nivelesAprobacion).subscribe({
		//   next: () => {
		//     this.utilService.closeLoadingSpinner();

		//     this.utilService.modalResponse("Datos actualizados correctamente", "success");

		//     setTimeout(() => {
		//       this.router.navigate(["/mantenedores/niveles-aprobacion"]);
		//     }, 2000);
		//   },
		//   error: (error: HttpErrorResponse) => {
		//     this.utilService.modalResponse(error.error, "error");
		//   }
		// });

		return;
	}

	public validateData(): boolean {
		const tipoSolicitud = this.dataTipoSolicitudes.find(data => data.id.toString() === this.modelHead.idTipoSolicitud.toString());

		if (tipoSolicitud === undefined) {
			return true;
		}

		const codigoSolicitudIncluded = this.restrictionsIds.includes(tipoSolicitud.codigoTipoSolicitud);

		if (codigoSolicitudIncluded) {
			this.modelHead.idAccion = 0;
			this.modelHead.idTipoMotivo = 0;

			this.desactivarTipoMotivoYAccion = true;

			return !codigoSolicitudIncluded || this.modelHead.idNivelDireccion === '' || this.modelHead.idTipoRuta === 0 || this.modelHead.idTipoSolicitud === 0;
		}

		this.desactivarTipoMotivoYAccion = false;

		return this.modelHead.idAccion === 0 || this.modelHead.idNivelDireccion === '' || this.modelHead.idTipoMotivo === 0 || this.modelHead.idTipoRuta === 0 || this.modelHead.idTipoSolicitud === 0;
	}

	public validateNivelesAprobacion(): boolean {
		return true;
		// return Object.values(this.nivelesAprobacion).some(({ idNivelAprobacionRuta }) => idNivelAprobacionRuta !== "");
	}
}
