import { Component, AfterViewInit } from '@angular/core';
import { StarterService } from './starter.service';
import { ActivatedRoute } from '@angular/router';
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

    localStorage.setItem("idUsuario", idUsuario);
  }
}
