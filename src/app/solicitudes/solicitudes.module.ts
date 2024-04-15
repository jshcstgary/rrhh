import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SolicitudesRoutes } from "./solicitudes.routing";
import { TableService } from "./ngtable/ngtable.service";
import { ComponentsModule } from "../component/component.module";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ConsultaComponent } from "./consulta/consulta.component";
import { PlantillaModule } from "../plantilla/plantilla.module";
import { FeatherModule } from "angular-feather";
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [RegistrarSolicitudComponent, ConsultaComponent],
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
    FormsModule,
    CommonModule,
    NgSelectModule,
  ],
  providers: [TableService],
})
export class SolicitudesModule {}
