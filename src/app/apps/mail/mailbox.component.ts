import { Component, OnInit } from '@angular/core';
import { MailGlobalVariable } from './mail.service';
import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';
import { ComposeComponent } from './compose/compose.component';

@Component({
    selector: 'app-mailbox',
    standalone: true,
    imports:[ListingComponent, DetailComponent, ComposeComponent],
    templateUrl: './mailbox.component.html',
    styleUrls: ['./mailbox.component.css']
})
export class MailboxComponent implements OnInit {


    constructor(public ms: MailGlobalVariable) { }

    ngOnInit(): void { }
}
