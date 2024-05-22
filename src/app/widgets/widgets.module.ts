import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WidgetRoutes } from './widgets.routing';

@NgModule({
  imports: [RouterModule.forChild(WidgetRoutes)],
})
export class WidgetsModule { }
