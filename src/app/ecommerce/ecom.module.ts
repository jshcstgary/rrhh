import { NgModule } from '@angular/core';
import {  RouterModule } from '@angular/router';

import { EcomRoutes } from './ecom.routing';

@NgModule({
  imports: [
    RouterModule.forChild(EcomRoutes),
  ],
})
export class EcomModule {}
