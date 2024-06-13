import { Component, AfterViewInit } from '@angular/core';
import { StarterService } from './starter.service';
@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
  subtitle: string;

  constructor(private _starter: StarterService) {
    this.subtitle = 'This is some text within a card';
  }

  ngAfterViewInit() {
    this.getUser();
  }

  getUser() {
    this._starter.getUser();
  }
}
