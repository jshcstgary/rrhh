import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-solicitud-seccion-desplegable',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './solicitud-seccion-desplegable.component.html',
	styleUrls: ['./solicitud-seccion-desplegable.component.scss']
})
export class SolicitudSeccionDesplegableComponent {
	@Input()
	public titleSummary: string = "";

	@Input()
	public isOpen: boolean = false;
}
