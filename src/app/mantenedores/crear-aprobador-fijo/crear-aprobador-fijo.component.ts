import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgSelectConfig } from "@ng-select/ng-select";
import { AprobadorFijo } from "src/app/eschemas/AprobadorFijo";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { CrearAprobadorFijoService } from "./crear-aprobador-fijo.service";
import { BuscarAprobadorFijoComponent } from "../buscar-aprobador-fijo/buscar-aprobador-fijo.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { format } from "date-fns";

@Component({
	selector: "app-crear-aprobador-fijo",
	templateUrl: "./crear-aprobador-fijo.component.html",
	styleUrls: ["./crear-aprobador-fijo.component.scss"],
})
export class CrearAprobadorFijoComponent {
	modelo: AprobadorFijo = new AprobadorFijo();

	constructor(private config: NgSelectConfig, private router: Router, private route: ActivatedRoute, private mantenimientoService: MantenimientoService, private utilService: UtilService, private crearAprobadorFijoService: CrearAprobadorFijoService, private modalService: NgbModal) {
		this.config.notFoundText = "Custom not found";
		this.config.appendTo = "body";
		this.config.bindValue = "value";
	}

	public validateData(): boolean {
		return this.modelo.subleger === "" || this.modelo.nombre === "" || this.modelo.correo === "" || this.modelo.niveL_DIRECCION === "";
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
					this.modelo.usuariO_CREACION = currentdate;
					this.modelo.usuariO_MODIFICACION = currentdate;
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

	guardarAprobadorFijo() {
		if (this.modelo.niveL_DIRECCION === "") {
			Swal.fire({
				text: "Seleccione un nivel de aprobación",
				icon: "warning",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok",
			});

			return;
		}

		this.utilService.openLoadingSpinner("Guardando información, espere por favor...");

		const model = {
			...this.modelo,
			estado: this.modelo.estado ? "A" : "I",
		};

		this.route.params.subscribe((params) => {
			this.crearAprobadorFijoService.guardarAprobadorFijo(model).subscribe({
				next: (response) => {
					this.utilService.closeLoadingSpinner();

					this.utilService.modalResponse("Datos ingresados correctamente", "success");

					setTimeout(() => {
						this.router.navigate(["/mantenedores/aprobadores-fijos"]);
					}, 1600);
				},
				error: (error: HttpErrorResponse) => {
					this.utilService.modalResponse(error.error, "error");
				}
			});
		});
	}
}
