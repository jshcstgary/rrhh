import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SolicitudesRoutes } from './solicitudes.routing';
import { TableService } from './ngtable/ngtable.service';
import { ComponentsModule } from '../component/component.module';
import { ConsultaSolicitudesComponent } from './consulta_solicitudes/consulta-solicitudes.component';
import { RegistrarSolicitudComponent } from './registrar-solicitud/registrar-solicitud.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [

    RegistrarSolicitudComponent,
  ],
  imports: [RouterModule.forChild(SolicitudesRoutes),ComponentsModule,FormsModule],
  providers: [TableService],
})
export class SolicitudesModule {}
