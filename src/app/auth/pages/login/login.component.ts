import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Session } from "../../interfaces/session.interface";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// import { PermisoService } from "../../../../modules/util/services/permiso.service";
import { Subject, takeUntil } from "rxjs";
// import { UtilService } from "../../../../modules/util/services/util.service";
import { HttpErrorResponse } from "@angular/common/http";
import { StarterService } from "src/app/starter/starter.service";
import Swal from "sweetalert2";
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

  Session: Session;
  private unsubscribeService = new Subject<void>();
  constructor(
    private router: Router,
    private starterService: StarterService
    // private permisosService: PermisoService,
    // private utilService: UtilService
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
  }

  ngOnDestroy(): void {
    this.unsubscribeService.next();
    this.unsubscribeService.complete();
  }

  public login() {
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

    this.starterService.getUser(this.user).subscribe({
      next: (res) => {
        if (res.totalRegistros === 0) {
          Swal.fire({
            text: "No se encontró el usuario",
            icon: "info",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Ok",
          });

          this.isLoading = false;

          return;
        }

        this.isLoading = false;

        localStorage.setItem("idUsuario", this.user);

        this.router.navigate(["/tareas/consulta-tareas"]);
      },
      error: (err) => {
        Swal.fire({
          text: "No se encontró registro",
          icon: "info",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Sí",
        });
      }
    });

    // this.permisosService
    //   .post(this.Session.Usuario)
    //   .pipe(takeUntil(this.unsubscribeService))
    //   .subscribe({
    //     next: (response) => {
    //       this.Session.Programas = response;

    //       localStorage.setItem(
    //         "EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW",
    //         JSON.stringify(this.Session)
    //       );

    //       this.router.navigate(["/"]);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.utilService.modalResponse(error.error, "error");
    //     },
    //   });
  }
}
