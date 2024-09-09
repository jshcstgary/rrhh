import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectConfig } from "@ng-select/ng-select";
import { format } from "date-fns";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { AprobadorFijo } from "src/app/eschemas/AprobadorFijo";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { BuscarAprobadorFijoComponent } from "../buscar-aprobador-fijo/buscar-aprobador-fijo.component";
import { EditarAprobadorFijoService } from "./editar-aprobador-fijo.service";

@Component({
	selector: "app-editar-aprobador-fijo",
	templateUrl: "./editar-aprobador-fijo.component.html",
	styleUrls: ["./editar-aprobador-fijo.component.scss"],
})
export class EditarAprobadorFijoComponent implements OnInit {
	modelo: AprobadorFijo = new AprobadorFijo();

	public id_edit: undefined | string;

	constructor(private config: NgSelectConfig, private router: Router, private route: ActivatedRoute, private utilService: UtilService, private editarAprobadorFijoService: EditarAprobadorFijoService, private modalService: NgbModal) {
		this.config.notFoundText = "Custom not found";
		this.config.appendTo = "body";
		this.config.bindValue = "value";

		this.route.paramMap.subscribe((params) => {
			this.id_edit = params.get("id");
		});

		// this.route.queryParams.subscribe((params) => {
		// 	this.id_edit = params["id_edit"];
		// 	// Utiliza el id_edit obtenido
		// });
	}

	ngOnInit() {
		this.getAprobadorFijoById();
	}

	public validateData(): boolean {
		return this.modelo.subleger === "" || this.modelo.nombre === "" || this.modelo.correo === "" || this.modelo.niveL_DIRECCION === "";
	}

	getAprobadorFijoById() {
		this.utilService.openLoadingSpinner("Obteniendo datos...");

		return this.editarAprobadorFijoService.obtenerAprobadorFijoById(this.id_edit).subscribe({
			next: (response) => {
				let fechaActual = new Date();
				let fechaEnFormatoISO = fechaActual.toISOString();
				// this.modelo.ID_APROBACION = ;
				this.modelo.iD_APROBADOR = this.id_edit;
				this.modelo.niveL_DIRECCION = response.niveL_DIRECCION;
				this.modelo.codigO_POSICION = response.codigO_POSICION;
				// let fechaActual = new Date();
				this.modelo.subleger = response.subleger;
				this.modelo.nombre = response.nombre;
				this.modelo.codigO_POSICION_REPORTA_A =
					response.codigO_POSICION_REPORTA_A;
				this.modelo.reportA_A = response.reportA_A;
				this.modelo.estado = response.estado === "A";
				this.modelo.fechA_CREACION = response.fechA_CREACION;
				this.modelo.fechA_MODIFICACION = response.fechA_MODIFICACION;
				this.modelo.usuariO_CREACION = response.usuariO_CREACION;
				this.modelo.usuariO_MODIFICACION = response.usuariO_MODIFICACION;
				this.modelo.descripcioN_POSICION = response.descripcioN_POSICION;
				this.modelo.supervisA_A = response.supervisA_A;
				this.modelo.niveL_REPORTE = response.niveL_REPORTE;
				this.modelo.correo = response.correo;

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	public openModal() {
		this.modalService
			.open(BuscarAprobadorFijoComponent, {
				backdrop: "static",
				keyboard: false
			})
			.result.then(
				(result) => {
					if (result?.action === "close") {
						return;
					}

					if (result?.data === undefined) {
						return;
					}

					console.log(result?.data);
					const epelado = result?.data;

					const currentdate: string = format(new Date(), "dd-MM-yyyy HH:mm:ss");

					this.modelo.iD_APROBADOR = 1;
					this.modelo.codigO_POSICION = epelado.codigoPosicion;
					this.modelo.subleger = epelado.subledger;
					this.modelo.nombre = epelado.nombreCompleto;
					this.modelo.codigO_POSICION_REPORTA_A = "N/A";
					this.modelo.reportA_A = epelado.reportaA;
					this.modelo.estado = true;
					this.modelo.fechA_CREACION = currentdate;
					this.modelo.fechA_MODIFICACION = currentdate;
					this.modelo.usuariO_CREACION = sessionStorage.getItem(LocalStorageKeys.IdLogin);;
					this.modelo.usuariO_MODIFICACION = sessionStorage.getItem(LocalStorageKeys.IdLogin);;
					this.modelo.descripcioN_POSICION = epelado.descrPosicion;
					this.modelo.supervisA_A = "N/A";
					this.modelo.niveL_REPORTE = epelado.nivelReporte;
					this.modelo.correo = epelado.correo
				},
				(reason) => {
					console.log(`Dismissed with: ${reason}`);
				}
			);
	}

	actualizarAprobadorFijo() {
		if (this.modelo.niveL_DIRECCION === "") {
			Swal.fire({
				text: "Seleccione un nivel de aprobación",
				icon: "warning",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok",
			});

			return;
		}

		this.utilService.openLoadingSpinner("Actualizando información, espere por favor...");

		this.route.params.subscribe((params) => {
			let fechaActual = new Date();
			let fechaEnFormatoISO = fechaActual.toISOString();

			this.modelo.iD_APROBADOR = this.id_edit;

			const model = {
				...this.modelo,
				fechA_CREACION: fechaEnFormatoISO,
				fechA_MODIFICACION: fechaEnFormatoISO,
				usuariO_MODIFICACION: sessionStorage.getItem(LocalStorageKeys.IdLogin),
				estado: this.modelo.estado ? "A" : "I",
			};

			this.editarAprobadorFijoService.actualizarAprobadorFijo(model).subscribe({
				next: () => {
					this.utilService.closeLoadingSpinner();

					this.utilService.modalResponse("Datos actualizados correctamente", "success");

					setTimeout(() => {
						this.router.navigate(["/mantenedores/aprobadores-fijos"]);
					}, 1600);
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse(`Ya existe un registro para el Nivel de Aprobación: ${model.niveL_DIRECCION}.`, "error");
				}
			});
		});
	}
}
