import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Solicitud } from 'src/app/eschemas/Solicitud';
import { UtilService } from 'src/app/services/util/util.service';
import { SolicitudesService } from '../registrar-solicitud/solicitudes.service';
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Component({
	selector: 'app-trazabilidad-solicitud',
	templateUrl: './trazabilidad-solicitud.component.html',
	styleUrls: ['./trazabilidad-solicitud.component.scss']
})
export class TrazabilidadSolicitudComponent {
	public solicitud = new Solicitud();

	public dataDetalleAprobadorSolicitud = [];

	public idSolicitudParam: string = "";

	public indexToShow: number = -1;

	constructor(private route: ActivatedRoute, private solicitudes: SolicitudesService, private utilService: UtilService) {
		this.route.paramMap.subscribe((params) => {
			this.idSolicitudParam = params.get("idSolicitud");
		});
	}

	public async ngOnInit(): Promise<void> {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		try {
			const solicitudResponse = await lastValueFrom(this.solicitudes.getSolicitudById(this.idSolicitudParam));

			this.solicitud = solicitudResponse

			if (this.solicitud !== null) {
				const nivelesAprobacionResponse = await lastValueFrom(this.solicitudes.getDetalleAprobadoresSolicitudesById(this.solicitud.idSolicitud));

				this.indexToShow = nivelesAprobacionResponse.detalleAprobadorSolicitud.findIndex(({ estadoAprobacion, codigoPosicionAprobador, comentario }) => (!estadoAprobacion.toUpperCase().includes("APROBA") && !estadoAprobacion.toUpperCase().includes("CREADO") && codigoPosicionAprobador !== "" && !estadoAprobacion.toUpperCase().includes("COMENTARIO") && !estadoAprobacion.toUpperCase().includes("CANDIDATO") ) 
				||(estadoAprobacion.toUpperCase().includes("COMENTARIO") && (comentario === null || comentario === ""))
			||(estadoAprobacion.toUpperCase().includes("CANDIDATO") && (comentario === null || comentario === "")));
				this.dataDetalleAprobadorSolicitud = nivelesAprobacionResponse.detalleAprobadorSolicitud;
			}

			this.utilService.closeLoadingSpinner();
		} catch (error) {
			console.error(error);

			this.utilService.modalResponse(error.error, "error");
		}
	}

	public getPerfil(): string {
		return localStorage.getItem(LocalStorageKeys.Perfil);
	}
}
