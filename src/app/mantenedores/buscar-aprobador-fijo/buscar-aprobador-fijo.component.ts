import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchApprover } from "src/app/eschemas/AprobadorFijo";
// import { AprobadoresFijosService } from "../aprobadores-fijos/aprobadores-fijos.service";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
	selector: "app-buscar-aprobador-fijo",
	templateUrl: "./buscar-aprobador-fijo.component.html",
	styleUrls: ["./buscar-aprobador-fijo.component.scss"]
})
export class BuscarAprobadorFijoComponent {
	public empleadoSeleccionado: any = null;

	public myForm: FormGroup = this.formBuilder.group({
		searchInput: ["", [Validators.required, Validators.minLength(1)]]
	});

	public empleados: any[] = [];

	constructor(private activeModal: NgbActiveModal, private mantenimientoService: MantenimientoService, private utilService: UtilService, private formBuilder: FormBuilder) { }

	public seleccionarUsuario(empleado: any): void {
		this.empleadoSeleccionado = empleado;
	}
	
	public onSubmit(): void {
		this.utilService.openLoadingSpinner("Obteniendo información, espere por favor...");

		this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.myForm.value.searchInput).subscribe({
			next: (response) => {
				if (response.totalRegistros === 0) {
					this.utilService.modalResponse("No existen registros.", "error");

					return;
				}

				this.empleados = response.evType.filter(({ status }) => status === "A");

				this.utilService.closeLoadingSpinner();
			},
			error: (err) => {
				console.error(err);

				this.utilService.modalResponse(err, "error");
			}
		});
	}

	onSeleccionar() {
		this.activeModal.close({
			data: this.empleadoSeleccionado,
			action: "select",
		});
	}

	public onClose(): void {
		this.empleadoSeleccionado = null;

		this.activeModal.close({
			action: "close",
		});
	}
}
