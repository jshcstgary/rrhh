import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TimelineRoutes } from './timeline.routing';

@NgModule({
  imports: [RouterModule.forChild(TimelineRoutes)],
})
export class TimelineModule {}
