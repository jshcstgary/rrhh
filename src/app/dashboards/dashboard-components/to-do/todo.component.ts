import { Component } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [NgScrollbarModule],
  templateUrl: './todo.component.html'
})
export class TodoComponent {

  constructor() {}
}
