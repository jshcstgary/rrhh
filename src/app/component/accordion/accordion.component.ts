import { Component, ViewEncapsulation  } from '@angular/core';
import { NgbAccordionModule, NgbAlertModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf, CommonModule  } from '@angular/common';

@Component({
    selector: 'app-ngbd-accordion-basic',
    standalone: true,
	imports: [NgbAccordionModule, NgFor, NgIf, CommonModule, NgbAlertModule  ],
    templateUrl: 'accordion.component.html',
    encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.custom-header::after {
				content: none;
			}
		`,
	],
})
export class NgbdAccordionBasicComponent {
//   open at a time
panels = ['First', 'Second', 'Third'];

// keep content
remove = true;
}
