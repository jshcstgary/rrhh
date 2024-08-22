import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-buscar-aprobador-fijo',
	templateUrl: './buscar-aprobador-fijo.component.html',
	styleUrls: ['./buscar-aprobador-fijo.component.scss']
})
export class BuscarAprobadorFijoComponent {
	@Input()
	public textPlaceholder: string = "";

	constructor(private activeModal: NgbActiveModal) {}

	public seleccionarUsuario(id: number) {
		console.log(id);
	}

	onClose() {
		this.activeModal.close({
			action: "cerrar",
		});
	}
}
