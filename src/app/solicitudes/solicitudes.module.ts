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
import { CompletarSolicitudComponent } from "./completar-solicitud/completar-solicitud.component";
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

@NgModule({
  declarations: [
    RegistrarSolicitudComponent,
    ConsultaSolicitudesComponent,
    CompletarSolicitudComponent,
    DetalleSolicitudComponent,
    RevisarSolicitudComponent,
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
    ReactiveFormsModule

  ],
  exports: [
    RevisarSolicitudComponent
    // Otros componentes que deseas exportar
  ],
  providers: [TableService],
})
export class SolicitudesModule {}
