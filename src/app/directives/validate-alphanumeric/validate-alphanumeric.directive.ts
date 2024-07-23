import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidateAlphanumeric]'
})
export class ValidateAlphanumericDirective {
	private regex: RegExp = new RegExp(/^[a-zA-Z0-9]*$/);
	private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Do not allow invalid characters
    const current: string = (event.target as HTMLInputElement).value;
	const next: string = current.concat(event.key);

    if (!String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
