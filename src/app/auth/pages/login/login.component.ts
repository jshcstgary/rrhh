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
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  Session: Session;
  private unsubscribeService = new Subject<void>();
  constructor(
    private router: Router,
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
