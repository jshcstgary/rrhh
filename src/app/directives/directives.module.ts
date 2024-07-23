import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidateAlphanumericDirective } from './validate-alphanumeric/validate-alphanumeric.directive';



@NgModule({
  declarations: [
    ValidateAlphanumericDirective
  ],
  imports: [
    CommonModule
	],
	exports: [
	  ValidateAlphanumericDirective
  ]
})
export class DirectivesModule { }
