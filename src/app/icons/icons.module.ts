import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconsRoutes } from './icons.routing';

@NgModule({
  imports: [RouterModule.forChild(IconsRoutes)],
})
export class IconsModule {}
