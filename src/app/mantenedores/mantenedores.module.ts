import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MantenedoresRoutes } from "./mantenedores.routing";
import { TableService } from "./ngtable/ngtable.service";
import { ComponentsModule } from "../component/component.module";
import { PlantillaModule } from "../plantilla/plantilla.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { CatalogoViewComponent } from "../services/catalogo/catalogo.component";
import { TipoSolicitudComponent } from "./tipo_solicitud/tipo-solicitud.component";
import { TipoProcesoComponent } from "./tipo_proceso/tipo-proceso.component";
import { TipoRutaComponent } from "./tipo_ruta/tipo-ruta.component";
import { AccionComponent } from "./accion/accion.component";
import { TipoMotivoComponent } from "./tipo_motivo/tipo-motivo.component";
import { TipoAccionComponent } from "./tipo_accion/tipo-accion.component";
import { RutaComponent } from "./ruta/ruta.component";

import { CrearNivelesAprobacionComponent } from "./crear-niveles-aprobacion/crear-niveles-aprobacion.component";
import { SpinnerComponent } from "../shared/spinner.component";
import { NivelesAprobacionComponent } from "./niveles-aprobacion/niveles-aprobacion.component";
import { EstadosComponent } from './estados/estados.component';

@NgModule({
  declarations: [
    TipoSolicitudComponent,
    TipoProcesoComponent,
    TipoRutaComponent,
    AccionComponent,
    TipoMotivoComponent,
    TipoAccionComponent,
    RutaComponent,
    NivelesAprobacionComponent,
    EstadosComponent,
    // SpinnerComponent,
    // NivelesAprobacionComponent,
    //CrearNivelesAprobacionComponent
  ],
  imports: [
    RouterModule.forChild(MantenedoresRoutes),
    PlantillaModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    NgIf,
    NgFor,
    CommonModule,
    CatalogoViewComponent,
  ],
  providers: [TableService],
})
export class MantenedoresModule {}
