import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
	subtitle: string;

	constructor(private _route: ActivatedRoute) {
		this.subtitle = 'This is some text within a card';
	}

	ngAfterViewInit() {
		const idUsuario = this._route.snapshot.queryParamMap.get("idUsuario");

		if (idUsuario !== undefined && idUsuario !== null) {
			sessionStorage.setItem(LocalStorageKeys.IdUsuario, idUsuario);
		}
	}
}
