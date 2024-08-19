import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidateAlphanumericCodigoDirective } from './validate-alphanumeric-codigo/validate-alphanumeric-codigo.directive';
import { ValidateAlphanumericDirective } from './validate-alphanumeric/validate-alphanumeric.directive';

@NgModule({
	declarations: [
		ValidateAlphanumericDirective, ValidateAlphanumericCodigoDirective
	],
	imports: [
		CommonModule
	],
	exports: [
		ValidateAlphanumericDirective, ValidateAlphanumericCodigoDirective
	]
})
export class DirectivesModule { }
