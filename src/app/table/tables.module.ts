import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablesRoutes } from './tables.routing';

import { TableService } from './ngtable/ngtable.service';

@NgModule({
  imports: [RouterModule.forChild(TablesRoutes)],
  providers: [TableService],
})
export class TablesModule {}
