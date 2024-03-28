import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SamplePagesRoutes } from './sample-pages.routing';

@NgModule({
  imports: [RouterModule.forChild(SamplePagesRoutes)],
})
export class SamplePagesModule {}
