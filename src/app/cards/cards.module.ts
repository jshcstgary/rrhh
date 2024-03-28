import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardsRoutes } from './cards.routing';

@NgModule({
  imports: [RouterModule.forChild(CardsRoutes)],
})
export class CardsModule {}
