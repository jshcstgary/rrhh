import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-project-counter',
  standalone: true,
  imports: [NgbProgressbarModule],
  templateUrl: './project-counter.component.html'
})
export class ProjectCounterComponent {
  constructor() {}
}
