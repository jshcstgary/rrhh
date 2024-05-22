import { NgModule } from '@angular/core';
import { AppsRoutes } from './apps.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service
import { ServicejobService } from './jobs/servicejob.service';
import { TicketService } from './ticketlist/tickets.service';
import { TimeAgoPipe } from './ticketlist/date-ago.pipe';
import { ContactService } from './contacts/contact.service';
import { NoteService } from './notes/note.service';
import { TodoService } from './todos/todo.service';
import { UserService } from './users/userService.service';
import { TasksService } from './tasks/tasks-service.service';
import { MailGlobalVariable } from './mail/mail.service';
import { MailService } from './mail/mailService';
import { UserRxjsServiceService } from './user-rxjs/user-rxjs-service.service';
import { ServiceContactrxjsService } from './contact-rxjs/service-contactrxjs.service';
import { ServiceContactlistRxjsService } from './contact-list-rxjs/service-contactlist-rxjs.service';
import { InvoiceService } from './invoice/invoice.service';
import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [TimeAgoPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AppsRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(), 
  ],

  providers: [
    ContactService,
    NoteService,
    TodoService,
    UserService,
    DatePipe,
    TicketService,
    DecimalPipe,
    TasksService,
    MailService,
    MailGlobalVariable,
    UserRxjsServiceService,
    ServiceContactrxjsService,
    ServiceContactlistRxjsService,
    InvoiceService,
    ServicejobService,
  ],
})
export class AppsModule {}
