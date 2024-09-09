import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { Session } from "../../interfaces/session.interface";
// import { PermisoService } from "../../../../modules/util/services/permiso.service";
import { Subject } from "rxjs";
// import { UtilService } from "../../../../modules/util/services/util.service";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { UtilService } from "src/app/services/util/util.service";
import { StarterService } from "src/app/starter/starter.service";
import { LoginRequest, Perfil, PerfilUsuario, PerfilUsuarioResponse } from "src/app/types/permiso.type";
import { appCode, environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { LoginServices } from "../../services/login.services";
@Component({
	selector: "app-login",
	standalone: true,
	imports: [CommonModule, NgSelectModule, FormsModule],
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
	public user: string = "";
	public password: string = "";

	public isLoading: boolean = false;
	public perfilCodigo: string = "";
	public perfilCodigoSeleccionado: PerfilUsuario;

	public isLoadingPerfil: boolean = false;
	public perfilUsuario: PerfilUsuarioResponse;
	public perfilUsuarioError: PerfilUsuarioResponse = [{
		scg_per_codigo: "",
		scg_per_descripcion: "",
		message: "",
	}, {
		scg_per_codigo: "",
		scg_per_descripcion: "",
		message: "",
	}, {
		scg_per_codigo: "",
		scg_per_descripcion: "",
		message: "",
	}, {
		scg_per_codigo: "",
		scg_per_descripcion: "",
		message: "",
	}];
	private perfilUrl: string = environment.loginES;

	// private searchSubject: Subject<string> = new Subject();

	Session: Session;
	private unsubscribeService = new Subject<void>();
	constructor(
		private router: Router,
		private starterService: StarterService,
		private loginService: LoginServices,
		// private permisosService: PermisoService,
		private utilService: UtilService
	) {
		this.Session = {
			Perfil: "",
			IdEmpresa: "",
			Localidad: "",
			Token: "",
			Usuario: "",
			Perfiles: [],
			// Programas: [],
			Perfile: [],
		};

		// this.searchSubject
		// 	.pipe(
		// 		debounceTime(5000) // 300 ms de retraso
		// 	)
		// 	.subscribe(value => {
		// 		// this.result = value;
		// 		// console.log('Valor después de debounce:', value);

		// 		this.getPerfilesUsuario();
		// 	});
	}

	ngOnDestroy(): void {
		this.unsubscribeService.next();
		this.unsubscribeService.complete();
	}

	public getPerfilesUsuario() {
		if (this.user === "") {
			Swal.fire({
				text: "Ingrese el Usuario",
				icon: "info",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok",
			});

			return;
		}

		this.isLoading = true;

		const getPerfileRequest: LoginRequest = {
			codigoAplicacion: appCode,
			codigoPerfil: "",
			codigoRecurso: "PWFCAMUMET",
			usuario: this.user,
			password: btoa(this.password),
			isAutenticacionLocal: false,
		};

		this.loginService.getPerfilesUsuario(getPerfileRequest).subscribe({
			next: (response) => {
				this.perfilUsuario = response;
				if (this.perfilUsuario.length === 0) {
					Swal.fire({
						text: "Usuario no encontrado",
						icon: "error",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Ok",
					});

					sessionStorage.removeItem(LocalStorageKeys.IdLogin);
					sessionStorage.removeItem(LocalStorageKeys.IdUsuario);
					sessionStorage.removeItem(LocalStorageKeys.Permisos);
					sessionStorage.removeItem(LocalStorageKeys.Reloaded);
					sessionStorage.removeItem(LocalStorageKeys.Perfiles);
					sessionStorage.removeItem(LocalStorageKeys.Perfil);

					this.isLoading = false;

					return;
				}

				sessionStorage.setItem(LocalStorageKeys.Perfiles, JSON.stringify(this.perfilUsuario));

				this.isLoading = false;
				this.isLoadingPerfil = true;
			},
			error: (err) => {
				if (this.perfilUrl.toUpperCase().includes("IGUANA")) {
					this.perfilUsuarioError[0].scg_per_codigo = "0001";
					this.perfilUsuarioError[0].scg_per_descripcion = "Admin";
					this.perfilUsuarioError[0].message = "Exito";

					this.perfilUsuarioError[1].scg_per_codigo = "0002";
					this.perfilUsuarioError[1].scg_per_descripcion = "Iniciador";
					this.perfilUsuarioError[1].message = "Exito";

					this.perfilUsuarioError[2].scg_per_codigo = "0003";
					this.perfilUsuarioError[2].scg_per_descripcion = "Aprobador";
					this.perfilUsuarioError[2].message = "Exito";

					this.perfilUsuarioError[3].scg_per_codigo = "0004";
					this.perfilUsuarioError[3].scg_per_descripcion = "Aprobador Fijo";
					this.perfilUsuarioError[3].message = "Exito";

					this.perfilUsuario = this.perfilUsuarioError;

					sessionStorage.setItem(LocalStorageKeys.Perfiles, JSON.stringify(this.perfilUsuario));

					this.isLoadingPerfil = true;
				} else {
					Swal.fire({
						text: "Usuario no es valido",
						icon: "error",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Ok",
					});

					sessionStorage.removeItem(LocalStorageKeys.Perfiles);
					sessionStorage.removeItem(LocalStorageKeys.Perfil);
				}

				console.log(this.perfilUsuario);
				console.error(err);

				sessionStorage.removeItem(LocalStorageKeys.IdLogin);
				sessionStorage.removeItem(LocalStorageKeys.IdUsuario);
				sessionStorage.removeItem(LocalStorageKeys.Permisos);
				sessionStorage.removeItem(LocalStorageKeys.Reloaded);

				this.isLoading = false;
			}
		});
	}

	public signIn() {
		if (this.user === "" || this.password === "") {
			Swal.fire({
				text: "Ingrese las credenciales",
				icon: "info",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok",
			});

			return;
		}

		this.isLoading = true;

		if (this.perfilCodigo === null || this.perfilCodigo === undefined || this.perfilCodigo === "") {
			Swal.fire({
				text: "Seleccione un Perfil de Usuario",
				icon: "info",
				confirmButtonColor: "rgb(227, 199, 22)",
				confirmButtonText: "Ok",
			});

			this.isLoading = false;

			return;
		}

		const loginRequest: LoginRequest = {
			codigoAplicacion: appCode,
			codigoPerfil: this.perfilCodigo,
			codigoRecurso: "PWFCAMUMET",
			usuario: this.user,
			password: btoa(this.password),
			isAutenticacionLocal: true,
		};

		this.perfilCodigoSeleccionado = JSON.parse(sessionStorage.getItem(LocalStorageKeys.Perfiles)).find(data => data.scg_per_codigo === this.perfilCodigo);
		sessionStorage.setItem(LocalStorageKeys.Perfil, this.perfilCodigoSeleccionado.scg_per_descripcion);

		this.loginService.login(loginRequest).subscribe({
			next: ({ codigo, nombres, apellidos, email, vistas }: Perfil) => {
				if (vistas.length === 0 || nombres === "" || apellidos === "" || email == "" || codigo === "") {
					Swal.fire({
						text: "Usuario o Contraseña Invalida",
						icon: "error",
						confirmButtonColor: "rgb(227, 199, 22)",
						confirmButtonText: "Ok",
					});

					sessionStorage.removeItem(LocalStorageKeys.IdLogin);
					sessionStorage.removeItem(LocalStorageKeys.IdUsuario);
					sessionStorage.removeItem(LocalStorageKeys.Permisos);
					sessionStorage.removeItem(LocalStorageKeys.Reloaded);
					sessionStorage.removeItem(LocalStorageKeys.Perfil);
					sessionStorage.removeItem(LocalStorageKeys.Perfiles);

					this.isLoading = false;

					return;
				}

				sessionStorage.setItem(LocalStorageKeys.IdLogin, codigo);
				sessionStorage.setItem(LocalStorageKeys.IdUsuario, email);
				sessionStorage.setItem(LocalStorageKeys.Permisos, JSON.stringify(vistas));

				this.isLoading = false;

				// const isTasksEnabled: boolean = vistas.some(vista => vista.codigo === PageCodes.Tareas);

				this.router.navigate(["/solicitudes/consulta-solicitudes"]);
			},
			error: (err) => {
				console.error(err);

				sessionStorage.removeItem(LocalStorageKeys.IdLogin);
				sessionStorage.removeItem(LocalStorageKeys.IdUsuario);
				sessionStorage.removeItem(LocalStorageKeys.Permisos);
				sessionStorage.removeItem(LocalStorageKeys.Reloaded);
				sessionStorage.removeItem(LocalStorageKeys.Perfil);
				sessionStorage.removeItem(LocalStorageKeys.Perfiles);

				this.isLoading = false;

				Swal.fire({
					text: "No se pudo obtener el usuario",
					icon: "error",
					confirmButtonColor: "rgb(227, 199, 22)",
					confirmButtonText: "Ok",
				});
			}
		});
	}
}
