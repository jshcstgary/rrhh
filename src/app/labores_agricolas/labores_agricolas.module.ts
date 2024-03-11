import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LaboresAgricolasRoutes } from './labores_agricolas.routing';

import { TableService } from './ngtable/ngtable.service';

@NgModule({
  imports: [RouterModule.forChild(LaboresAgricolasRoutes)],
  providers: [TableService],
})
export class LaboresAgricolasModule {}
