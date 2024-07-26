import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from "rxjs";
import { Solicitud } from "src/app/eschemas/Solicitud";
import {
	EvType,
	IEmpleadoData
} from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { SolicitudesService } from "src/app/solicitudes/registrar-solicitud/solicitudes.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-dialog-reasignar-usuario",
  templateUrl: "./reasignar-usuario.component.html",
  styleUrls: ["./reasignar-usuario.component.scss"],
  standalone: true,
  imports: [FormsModule, NgbTypeaheadModule],
})
export class DialogReasignarUsuarioComponent {
  activeModal = inject(NgbActiveModal);

  search: string;
  fields = <IEmpleadoData>{
    nombreCompleto: "",
    compania: "",
    codigo: "",
    unidadNegocio: "",
    comentarios: "",
    fechaIngresogrupo: null,
    nombreCargo: "",
    departamento: "",
    localidad: "",
  };
  public dataEmpleadoEvolution: any[];

  public nombresEmpleados: string[] = [];

	public modelo: { correo: string; } & EvType = {
	codigo: "",
	idEmpresa: "",
	compania: "",
	departamento: "",
	nombreCargo: "",
	nomCCosto: "",
	codigoPosicion: "",
	descrPosicion: "",
	codigoPuesto: "",
	descrPuesto: "",
	fechaIngresogrupo: new Date(),
	grupoPago: "",
	reportaA: "",
	localidad: "",
	nivelDir: "",
	descrNivelDir: "",
	nivelRepa: "",
	nombreCompleto: "",
	subledger: "",
	sucursal: "",
	unidadNegocio: "",
	tipoContrato: "",
	descripContrato: "",
	sueldo: "",
	sueldoVariableMensual: "",
	sueldoVariableTrimestral: "",
	sueldoVariableSemestral: "",
	sueldoVariableAnual: "",
	codigoPosicionReportaA: "",
	status: "",
	correo: ""
  };

  public solicitud = new Solicitud();

  public dataDetalleAprobadorSolicitud = [];

  public eventSearch = {
    item: ""
	};

	public mensaje: string = "";

	public dataAprobador: any;

  @Input("idParam")
  public idParam: string = "";

  @Input("taskId")
  public taskId: string = "";

  constructor(private mantenimientoService: MantenimientoService, private utilService: UtilService, private solicitudes: SolicitudesService) {
	this.utilService.openLoadingSpinner("Cargando información, espere por favor...");
  }

  ngOnInit() {
	  this.getNivelesAprobacion();
  }

  private getNivelesAprobacion(): void {
	console.log(this.idParam);
	console.log(this.taskId);

	if (this.solicitud === null) {
		return;
	}

	this.solicitudes.getDetalleAprobadoresSolicitudesById(this.idParam).subscribe({
		next: (response) => {
			this.dataDetalleAprobadorSolicitud = response.detalleAprobadorSolicitud;

			if (this.taskId === "Dinamico_RevisarSolicitud") {
				this.mensaje = "Se reasignó la tarea de revisión por aprobadores dinámicos";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase() === "PORREVISAR");
			} else if (this.taskId.toUpperCase().includes("RevisarSolicitudGerente") || this.taskId === "RQ_GRRHH_RevisarSolicitud") {
				this.mensaje = "Se reasignó la tarea de revisión por gerencia de recursos humanos";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("PORREVISARRRHH"));
			} else if (this.taskId.toUpperCase().includes("REMUNERACIONES") || this.taskId === "RQ_CREM_RevisarSolicitud") {
				this.mensaje = "Se reasignó la tarea de revisión por comité de remuneraciones";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("PORREVISAREMUNERACIONES"));
			} else if (this.taskId === "RP_RegistrarSeleccionCandidato") {
				this.mensaje = "Se reasignó la tarea de registrar selección de candidato";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("SELECCIONCANDIDATO"));
			} else if (this.taskId === environment.taskType_CF) {
				this.mensaje = "Se reasignó la tarea registrar solicitud de contratación de familiares";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
			} else if (this.taskId === environment.taskType_RG) {
				this.mensaje = "Se reasignó la tarea de registrar solicitud de reingreso de personal";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
			} else if (this.taskId === environment.taskType_RGC_RRHH) {
				this.mensaje = "Se reasignó la tarea de registrar comentario de gerente recursos humanos";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));

				this.dataAprobador.idNivelAprobacion =600000;
				this.dataAprobador.ruta = "Reasignación de Registro de Comentario de RRHH";
			} else if (this.taskId === environment.taskType_RGC_ULTIMO_JEFE) {
				this.mensaje = "Se reasignó la tarea de registrar comentario de último jefe";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));

				this.dataAprobador.idNivelAprobacion = 500000;
				this.dataAprobador.ruta = "Reasignación de Registro de Comentario Jefe";
			} else if (this.taskId === environment.taskType_AP_Registrar) {
				this.mensaje = "Se reasignó la tarea de registrar solicitud de acción de personal";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
			} else if (this.taskId === environment.taskType_Registrar) {
				this.mensaje = "Se reasignó la tarea de registrar solicitud de requisición de personal";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
			} else if (this.taskId === environment.taskType_AP_Completar) {
				this.mensaje = "Se reasignó la tarea de completar acción de personal";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));

				this.dataAprobador.idNivelAprobacion = 400000;
				this.dataAprobador.ruta = "Reasignación de Completar Solicitud";
			} else if (this.taskId === environment.taskType_CompletarRequisicion) {
				this.mensaje = "Se reasignó la tarea de completar requisición de personal";
				this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));

				this.dataAprobador.idNivelAprobacion = 310000;
				this.dataAprobador.ruta = "Reasignación de Completar Solicitud";
			} else {
				this.mensaje = "No existe tarea por reasignar";
			}

			this.utilService.closeLoadingSpinner();
		},
		error: (error: HttpErrorResponse) => {
			this.utilService.modalResponse("No existen niveles de aprobación para este empleado", "error");
		},
	});
  }

  onClose() {
    this.activeModal.close({
      action: "cerrar",
    });
  }

  onSave() {
	this.dataAprobador.nivelDirecion = this.modelo.nivelDir;
    this.dataAprobador.usuarioAprobador = this.modelo.nombreCompleto;
    this.dataAprobador.codigoPosicionAprobador = this.modelo.codigoPosicion;
    this.dataAprobador.descripcionPosicionAprobador = this.modelo.descrPosicion;
    this.dataAprobador.sudlegerAprobador = this.modelo.subledger;
    this.dataAprobador.nivelDireccionAprobador = this.modelo.nivelDir;
    this.dataAprobador.codigoPosicionReportaA = this.modelo.codigoPosicionReportaA;
    this.dataAprobador.correo = this.modelo.correo;
    this.dataAprobador.usuarioCreacion = this.modelo.nombreCompleto;
    this.dataAprobador.usuarioModificacion = this.modelo.nombreCompleto;
    this.dataAprobador.fechaCreacion = new Date().toISOString();
    this.dataAprobador.fechaModificacion = new Date().toISOString();

	this.solicitudes.guardarDetallesAprobacionesSolicitud(this.dataAprobador).subscribe({
		next: () => {
			this.activeModal.close({
				data: `${this.mensaje} a ${this.modelo.nombreCompleto}`
			});
		}
	});
  }

  onEnter(search: string): void {
    this.mantenimientoService
      .getDataEmpleadosEvolutionPorId(search)
      .subscribe({
        next: (data) => {
          this.dataEmpleadoEvolution = data.evType;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  searchNombreCompleto: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 1 ? [] : this.nombresEmpleados.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  getDataEmpleadosEvolution(tipo: string) {
    return this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.search).subscribe({
      next: (response) => {
        console.log(response);
        if (response.evType.length === 0) {
          Swal.fire({
            text: "No se encontró registro",
            icon: "info",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Sí",
          });

        //   this.clearModel();

          return;
        }

        this.dataEmpleadoEvolution = response.evType;

		this.eventSearch.item = this.dataEmpleadoEvolution[0].nombreCompleto;

        this.onSelectItem('nombreCompleto',this.eventSearch);

        this.nombresEmpleados = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  onSelectItem(campo: string, event) {
    let valor = event.item;

    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });

    if (datosEmpleado) {
      this.modelo = datosEmpleado;
      this.search = datosEmpleado.nombreCompleto;
    } else {
      let tempSearch = valor;

    //   this.clearModel();

	  if (campo == "codigoPosicion") {
        this.modelo.codigoPosicion = tempSearch;
      } else if (campo == "subledger") {
        this.modelo.subledger = tempSearch;
      } else if (campo == "nombreCompleto") {
        this.modelo.nombreCompleto = tempSearch;
      }
    }
  }
}
