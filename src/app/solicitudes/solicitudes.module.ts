import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SolicitudesRoutes } from "./solicitudes.routing";
import { TableService } from "./ngtable/ngtable.service";
import { ComponentsModule } from "../component/component.module";
import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { FormsModule } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { PlantillaModule } from "../plantilla/plantilla.module";
import { FeatherModule } from "angular-feather";
import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { RevisarSolicitudComponent } from './revisar-solicitud/revisar-solicitud.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule ,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarCandidatoComponent } from './registrar-candidato/registrar-candidato.component';
import { CompletaSolicitudComponent } from './completa-solicitud/completa-solicitud.component';
import { ReingresoPersonalComponent } from './reingreso-personal/reingreso-personal.component';
import { RegistrarFamiliaresComponent } from './registrar-familiares/registrar-familiares.component';
import { RegistroComentariosComponent } from "./registro-comentarios (h17)/registro-comentarios.component";
import { RegistroComentariosComponent as h18} from "./registro-comentarios (h18)/registro-comentarios.component";
import { RegistrarComentariosComponent as h19 } from "./registrar-comentario (h19)/registrar-comentarios.component";
import { AccionComponent } from "./accion-personal (h20)/accion-personal.component";
import { AccionComponent as h21 } from "./accion-personal (h21)/accion-personal.component";


@NgModule({
  declarations: [
    RegistrarSolicitudComponent,
    ConsultaSolicitudesComponent,
    DetalleSolicitudComponent,
    RevisarSolicitudComponent,
    RegistrarCandidatoComponent,
    CompletaSolicitudComponent,
    ReingresoPersonalComponent,
    RegistrarFamiliaresComponent,
    RegistroComentariosComponent,
    h18,
    h19,
    AccionComponent,
    h21
  ],
  imports: [
    RouterModule.forChild(SolicitudesRoutes),
    NgbNavModule,
    PlantillaModule,
    ComponentsModule,
    NgbModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgxDatatableModule,
    NgbAlertModule,
    FeatherModule,
    NgbTypeaheadModule,
    NgbAccordionModule,
    JsonPipe,
    FormsModule,
    NgxChartsModule,
    CommonModule,
    NgSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  exports: [
    RevisarSolicitudComponent
    //Otros componentes que deseas exportar
  ],
  providers: [TableService],
})
export class SolicitudesModule {}
