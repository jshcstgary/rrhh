import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { ToastrModule } from "ngx-toastr";

import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { RegistrarSolicitudComponent } from "./solicitudes/registrar-solicitud/registrar-solicitud.component";
import { SolicitudesModule } from "./solicitudes/solicitudes.module";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RevisarSolicitudComponent } from "./solicitudes/revisar-solicitud/revisar-solicitud.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgScrollbarModule,
    FeatherModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    FeatherModule.pick(allIcons),
    RouterModule.forRoot(Approutes),
    ToastrModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    BrowserModule,
    BrowserAnimationsModule, // Importa BrowserAnimationsModule
    MatButtonModule,
    MatButtonToggleModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
