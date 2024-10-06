import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { format } from "date-fns";
import { Validators } from "ngx-editor";
import { LoginServices } from "src/app/auth/services/login.services";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { EvType } from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { SolicitudesService } from "src/app/solicitudes/registrar-solicitud/solicitudes.service";
import { environment, portalWorkFlow } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
	selector: "app-dialog-reasignar-usuario",
	templateUrl: "./reasignar-usuario.component.html",
	styleUrls: ["./reasignar-usuario.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbTypeaheadModule],
})
export class DialogReasignarUsuarioComponent {
	public myForm: FormGroup = this.formBuilder.group({
		searchInput: ["", [Validators.required, Validators.minLength(1)]]
	});

	emailVariables = {
		de: "",
		password: "",
		alias: "",
		para: "",
		asunto: "",
		cuerpo: ""
	};

	textareaContent: string = "";

	public dataEmpleadoEvolution: any[] = [];

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

	public dataAprobador: any = null;
	public usuarioAprobador: string = "";

	@Input("idParam")
	public idParam: string = "";

	@Input("taskId")
	public taskId: string = "";

	constructor(private activeModal: NgbActiveModal, private mantenimientoService: MantenimientoService, private utilService: UtilService, private solicitudes: SolicitudesService, private formBuilder: FormBuilder, private camundaRestService: CamundaRestService) {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");
	}

	ngOnInit() {
		this.getNivelesAprobacion();
	}

	private getNivelesAprobacion(): void {
		this.solicitudes.getSolicitudById(this.idParam).subscribe({
			next: (response: any) => {
				this.solicitud = response;
			},
		});

		this.solicitudes.getDetalleAprobadoresSolicitudesById(this.idParam).subscribe({
			next: (response) => {
				this.dataDetalleAprobadorSolicitud = response.detalleAprobadorSolicitud;
				if (this.taskId === environment.taskType_Revisar) {
					this.mensaje = "Se reasignó la tarea de revisión por aprobadores dinámicos";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase() === "PORREVISAR");

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("ESPERA"));

						if (this.dataAprobador === undefined || this.dataAprobador === null) {
							this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("DEVOLVER"));
						}
					}
				} else if (this.taskId.toUpperCase().includes("REVISARSOLICITUDGERENTE") || this.taskId === environment.taskType_RRHH) {
					this.mensaje = "Se reasignó la tarea de revisión por gerencia de recursos humanos";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("PORREVISARRRHH"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("ESPERA"));

						if (this.dataAprobador === undefined || this.dataAprobador === null) {
							this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("DEVOLVER"));
						}
					}
				} else if (this.taskId.toUpperCase().includes("REMUNERACIONES") || this.taskId === environment.taskType_CREM) {
					this.mensaje = "Se reasignó la tarea de revisión por comité de remuneraciones";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("PORREVISARREMUNERA"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("ESPERA"));

						if (this.dataAprobador === undefined || this.dataAprobador === null) {
							this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("DEVOLVER"));
						}
					}
				} else if (this.taskId === environment.taskType_RegistrarCandidato) {
					this.mensaje = "Se reasignó la tarea de registrar selección de candidato";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.idNivelAprobacion = 900000;
					this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					this.dataAprobador.ruta = "Reasignación de Selección de Candidato";
					this.dataAprobador.nivelAprobacionRuta = "Selección de Candidato";
					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_CF) {
					this.mensaje = "Se reasignó la tarea registrar solicitud de contratación de familiares";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}
					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_RG) {
					this.mensaje = "Se reasignó la tarea de registrar solicitud de reingreso de personal";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_RGC_RRHH) {
					this.mensaje = "Se reasignó la tarea de registrar comentario de gerente recursos humanos";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REGISTRARCOMENTARIORRHH"));
					// this.dataAprobador.idNivelAprobacion = 600000;
					// this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					// this.dataAprobador.ruta = "Reasignación de Registro de Comentario de RRHH";
					// this.dataAprobador.nivelAprobacionRuta = "Registro de Comentario de RRHH";
				} else if (this.taskId === environment.taskType_RGC_ULTIMO_JEFE) {
					this.mensaje = "Se reasignó la tarea de registrar comentario de último jefe";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REGISTRARCOMENTARIOJEFE"));
					// this.dataAprobador.idNivelAprobacion = 500000;
					// this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					// this.dataAprobador.ruta = "Reasignación de Registro de Comentario Ultimo Jefe";
					// this.dataAprobador.nivelAprobacionRuta = "Registro de Comentario Ultimo Jefe";
				} else if (this.taskId === environment.taskType_RG_Jefe_Solicitante) {
					this.mensaje = "Se reasignó la tarea de registrar comentario de Jefe Solicitante";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REGISTRARCOMENTARIOSOLICITANTE"));
					// this.dataAprobador.idNivelAprobacion = 700000;
					// this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					// this.dataAprobador.ruta = "Reasignación de Registro de Comentario Solicitante";
					// this.dataAprobador.nivelAprobacionRuta = "Registro de Comentario Jefe Solicitante";
				} else if (this.taskId === environment.taskType_AP_Registrar) {
					this.mensaje = "Se reasignó la tarea de registrar solicitud de acción de personal";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_Registrar) {
					this.mensaje = "Se reasignó la tarea de registrar solicitud de requisición de personal";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_AP_Completar) {
					this.mensaje = "Se reasignó la tarea de completar acción de personal";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.idNivelAprobacion = 400000;
					this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					this.dataAprobador.ruta = "Reasignación de Completar Solicitud";
					this.dataAprobador.nivelAprobacionRuta = "Completar Solicitud";
					this.dataAprobador.estadoAprobacion = "Reasignado";
				} else if (this.taskId === environment.taskType_CompletarRequisicion) {
					this.mensaje = "Se reasignó la tarea de completar requisición de personal";
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.dataAprobador.idNivelAprobacion = 310000;
					this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					this.dataAprobador.ruta = "Reasignación de Completar Solicitud";
					this.dataAprobador.nivelAprobacionRuta = "Completar Solicitud";
				} else {
					this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("REASIGNADO"));

					if (this.dataAprobador === undefined || this.dataAprobador === null) {
						this.dataAprobador = this.dataDetalleAprobadorSolicitud.find(data => data.estadoAprobacion.toUpperCase().includes("CREADO"));
					}

					this.usuarioAprobador = this.dataAprobador.usuarioAprobador;
					this.dataAprobador.idNivelAprobacion = 800000;
					this.dataAprobador.id_NivelAprobacion = this.dataAprobador.idNivelAprobacion;
					this.dataAprobador.ruta = "Reasignación de Tarea";
					this.dataAprobador.nivelAprobacionRuta = "Reasignación de Tarea";
					this.dataAprobador.estadoAprobacion = "Reasignado";
				}

				this.usuarioAprobador = this.dataAprobador.usuarioAprobador;

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
		if (this.taskId === environment.taskType_Revisar && this.dataAprobador.nivelDireccionAprobador !== this.modelo.nivelDir) {
			Swal.fire({
				text: "Empleado a Reasignar no tiene el mismo nivel de Dirección: " + this.dataAprobador.nivelDireccionAprobador,
				icon: "error",
				showCancelButton: false,
				confirmButtonColor: "rgb(227, 199, 22)",
				cancelButtonColor: "#77797a",
				confirmButtonText: "OK"
			});

			return;
		}

		this.dataAprobador.usuarioAprobador = this.modelo.nombreCompleto;
		this.dataAprobador.codigoPosicionAprobador = this.modelo.codigoPosicion;
		this.dataAprobador.descripcionPosicionAprobador = this.modelo.descrPosicion;
		this.dataAprobador.sudlegerAprobador = this.modelo.subledger;
		this.dataAprobador.codigoPosicionReportaA = this.modelo.codigoPosicionReportaA;
		this.dataAprobador.correo = this.modelo.correo;
		this.dataAprobador.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		this.dataAprobador.comentario = "Tarea Reasignada: " + this.textareaContent;
		this.dataAprobador.usuarioModificacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		this.dataAprobador.fechaCreacion = new Date().toISOString();
		this.dataAprobador.fechaModificacion = new Date().toISOString();
		const htmlString = "<!DOCTYPE html>\r\n<html lang=\"es\">\r\n\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Document<\/title>\r\n<\/head>\r\n\r\n<body>\r\n  <h2>Estimado(a)<\/h2>\r\n  <h3>{NOMBRE_APROBADOR}<\/h3>\r\n\r\n  <P>La Solicitud de {TIPO_SOLICITUD} {ID_SOLICITUD} le ha sido reasignada para su\r\n    revisi\u00F3n y aprobaci\u00F3n.<\/P>\r\n\r\n  <p>\r\n    <b>\r\n      Favor ingresar al siguiente enlace: <a href=\"{URL_APROBACION}\">{URL_APROBACION}<\/a>\r\n      <br>\r\n      <br>\r\n      Gracias por su atenci\u00F3n.\r\n    <\/b>\r\n  <\/p>\r\n<\/body>\r\n\r\n<\/html>\r\n";

		const modifiedHtmlString = htmlString.replace("{NOMBRE_APROBADOR}", this.modelo.nombreCompleto).replace("{TIPO_SOLICITUD}", this.solicitud.tipoSolicitud).replace("{ID_SOLICITUD}", this.solicitud.idSolicitud).replace(new RegExp("{URL_APROBACION}", "g"), `${portalWorkFlow}tareas/consulta-tareas`);


		this.emailVariables = {
			de: "prueba",
			para: this.modelo.correo,
			// alias: this.solicitudes.modelDetalleAprobaciones.correo,
			alias: "Notificación 1",
			asunto: `Reasignación de Autorización de Solicitud de ${this.solicitud.tipoSolicitud} ${this.solicitud.idSolicitud}`,
			cuerpo: modifiedHtmlString,
			password: "p"
		};

		this.solicitudes.guardarDetallesAprobacionesSolicitud(this.dataAprobador).subscribe({
			next: () => {
				this.solicitud.estadoSolicitud = "RA";
				this.solicitud.fechaActualizacion = new Date();

				this.activeModal.close({
					data: `${this.mensaje} a ${this.modelo.nombreCompleto}`
				});

				this.solicitudes.actualizarSolicitud(this.solicitud).subscribe((responseSolicitud) => {
					const key: string = `usuario_logged_reasignado-${this.dataAprobador.nivelAprobacionRuta}`;

					const request = {
						processInstanceIds: [this.solicitud.idInstancia],
						variables: {
							[key]: {
								value: `Usuario{IGUAL}${sessionStorage.getItem(LocalStorageKeys.NombreUsuario)}{SEPARA}Accion{IGUAL}Solicitud Reasiganda por ${sessionStorage.getItem(LocalStorageKeys.NivelDireccion)}. Usuario Asignado: ${this.usuarioAprobador} - Usuario Reasignado: ${this.modelo.nombreCompleto}{SEPARA}Fecha{IGUAL}${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`
							}
						}
					};

					this.camundaRestService.registrarVariable(request).subscribe({
						next: () => { }
					});
					
					this.solicitudes.sendEmail(this.emailVariables).subscribe({
						next: () => {
						},
						error: (error) => {
							console.error(error);
						}
					});
				});
			}
		});
	}

	// onEnter(search: string): void {
	// 	this.mantenimientoService
	// 		.getDataEmpleadosEvolutionPorId(search)
	// 		.subscribe({
	// 			next: (data) => {
	// 				this.dataEmpleadoEvolution = data.evType;
	// 			},
	// 			error: (error) => {
	// 				console.error(error);
	// 			},
	// 		});
	// }

	// searchNombreCompleto: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
	// 	debounceTime(200),
	// 	distinctUntilChanged(),
	// 	map((term) => term.length < 1 ? [] : this.nombresEmpleados.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
	// );

	getDataEmpleadosEvolution() {
		this.utilService.openLoadingSpinner("Obteniendo información, espere por favor...");

		return this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.myForm.value.searchInput).subscribe({
			next: (response) => {
				if (response.evType.length === 0) {
					Swal.fire({
						text: "No se encontró registro",
						icon: "info",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Sí",
					});

					this.dataEmpleadoEvolution = [];

					return;
				}

				this.dataEmpleadoEvolution = response.evType;

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.dataEmpleadoEvolution = [];

				this.utilService.modalResponse(error.error, "error");
			},
		});
	}

	public seleccionarUsuario(empleado: any): void {
		// this.empleadoSeleccionado = empleado;
		this.modelo = empleado;
	}

	// onSelectItem(campo: string, event) {
	// 	let valor = event.item;

	// 	const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
	// 		return empleado[campo] === valor;
	// 	});

	// 	if (datosEmpleado) {
	// 		this.modelo = datosEmpleado;
	// 		this.search = datosEmpleado.nombreCompleto;
	// 	} else {
	// 		let tempSearch = valor;

	// 		//   this.clearModel();

	// 		if (campo == "codigoPosicion") {
	// 			this.modelo.codigoPosicion = tempSearch;
	// 		} else if (campo == "subledger") {
	// 			this.modelo.subledger = tempSearch;
	// 		} else if (campo == "nombreCompleto") {
	// 			this.modelo.nombreCompleto = tempSearch;
	// 		}
	// 	}
	// }
}
