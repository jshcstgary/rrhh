import { Directive, HostListener, Input } from "@angular/core";

@Directive({
	selector: "[appValidateAlphanumericCodigo]"
})
export class ValidateAlphanumericCodigoDirective {
	private regex: RegExp = new RegExp(/^[a-zA-Z0-9]*$/);
	private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home", "ArrowLeft", "ArrowRight", "Del", "Delete"];

	@Input("appValidateAlphanumeric")
	public isEnabled: boolean = true;

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent) {
		if (!this.isEnabled) {
			return;
		}

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
		if (!this.isEnabled) {
			return;
		}

		const input = event.target as HTMLInputElement;
		const sanitizedValue = input.value.replace(/[^a-zA-Z0-9]/g, "");

		if (sanitizedValue !== input.value) {
			input.value = sanitizedValue;
			event.preventDefault();
		}
	}
}
