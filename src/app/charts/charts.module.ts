import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChartsRoutes } from './charts.routing';

@NgModule({
  imports: [
    RouterModule.forChild(ChartsRoutes),
  ],
})
export class ChartModule {}
