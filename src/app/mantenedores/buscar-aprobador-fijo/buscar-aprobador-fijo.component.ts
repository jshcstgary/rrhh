import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchApprover } from 'src/app/eschemas/AprobadorFijo';
// import { AprobadoresFijosService } from '../aprobadores-fijos/aprobadores-fijos.service';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';

@Component({
	selector: 'app-buscar-aprobador-fijo',
	templateUrl: './buscar-aprobador-fijo.component.html',
	styleUrls: ['./buscar-aprobador-fijo.component.scss']
})
export class BuscarAprobadorFijoComponent {
	@Input()
	public textPlaceholder: string = "";

	public empleadoSeleccionado: any = null;

	public myForm: FormGroup = this.formBuilder.group({
		searchInput: ["", [Validators.required, Validators.minLength(1)]]
	});

	public empleados: any[] = [];

	// constructor(private activeModal: NgbActiveModal, private aprobadoresFijosService: AprobadoresFijosService, private formBuilder: FormBuilder) { }
	constructor(private activeModal: NgbActiveModal, private mantenimientoService: MantenimientoService, private formBuilder: FormBuilder) { }

	public seleccionarUsuario(empleado: any): void {
		this.empleadoSeleccionado = empleado;
	}
	
	public onSubmit(): void {
		// const approverToSearch: SearchApprover = {
		// 	correo: null,
		// 	nombres: null,
		// 	subledger: null
		// };

		// if (this.textPlaceholder.toLowerCase() === "subledger") {
		// 	approverToSearch.subledger = this.myForm.value.searchInput;
		// } else if (this.textPlaceholder.toLowerCase() === "nombre") {
			// 	approverToSearch.nombres = this.myForm.value.searchInput;
			// } else if (this.textPlaceholder.toLowerCase() === "correo") {
				// 	approverToSearch.correo = this.myForm.value.searchInput;
				// }

				this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.myForm.value.searchInput).subscribe({
			next: (response) => {
				console.log(response);

				this.empleados = response.evType.filter(({ status }) => status === "A");
			},
			error: (err) => {
				console.error(err);
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
