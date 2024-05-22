import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExtraComponentsRoutes } from './extra-component.routing';

@NgModule({
  imports: [RouterModule.forChild(ExtraComponentsRoutes)],
})
export class ExtraComponentModule {}
