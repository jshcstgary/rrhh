import { Component } from "@angular/core";
import { LocalStorageKeys } from "./enums/local-storage-keys.enum";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent {
	title = "app";

	constructor() {
		const reloaded = sessionStorage.getItem(LocalStorageKeys.Reloaded);

		if (reloaded === undefined || reloaded === null || reloaded === "0") {
			sessionStorage.setItem(LocalStorageKeys.Reloaded, "0");
		}
	}
}
