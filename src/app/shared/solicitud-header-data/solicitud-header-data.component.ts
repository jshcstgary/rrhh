import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
	selector: "app-solicitud-header-data",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./solicitud-header-data.component.html",
	styleUrls: ["./solicitud-header-data.component.scss"]
})
export class SolicitudHeaderDataComponent {
	@Input()
	public usuarioCreacion: string = "";

	@Input()
	public fechaCreacion: Date = new Date("");

	@Input()
	public idSolicitud: string = "";
}
