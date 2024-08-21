import { Directive, HostListener } from "@angular/core";

@Directive({
	selector: "[appValidateAlphanumeric]"
})
export class ValidateAlphanumericDirective {
	private regex: RegExp = new RegExp(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]*$/);
	private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home", "ArrowLeft", "ArrowRight", "Del", "Delete"];

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent) {
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}

		const current: string = (event.target as HTMLInputElement).value;
		const next: string = current.concat(event.key);

		if (!String(next).match(this.regex)) {
			event.preventDefault();
		}
	}

	@HostListener("input", ["$event"])
	onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const sanitizedValue = input.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "");

		if (sanitizedValue !== input.value) {
			input.value = sanitizedValue;
			event.preventDefault();
		}
	}
}
