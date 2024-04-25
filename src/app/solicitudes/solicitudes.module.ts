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

@NgModule({
  declarations: [
    RegistrarSolicitudComponent,
    ConsultaSolicitudesComponent,
    CompletarSolicitudComponent,
    DetalleSolicitudComponent,
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

    CommonModule,
    NgSelectModule,
  ],
  providers: [TableService],
})
export class SolicitudesModule {}
