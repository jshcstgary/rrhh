import { NgIf, CommonModule, NgFor } from '@angular/common';
import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

import { SimpleDatepickerBasic } from 'src/app/component/datepicker/simpledatepicker.component';
import { Custommonth } from 'src/app/component/datepicker/customonth.component';
import { FeatherModule } from 'angular-feather';

declare var require: any;
const data: any = require('./company.json');

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    SimpleDatepickerBasic,
    Custommonth,
    FeatherModule,
    NgSelectModule,
    NgxDatatableModule,
    NgIf,
    FormsModule,
    NgFor,
    CommonModule],
  templateUrl: './crear-labores-realizadas.component.html',
  styleUrls: ['./crear-labores-realizadas.css']
})
export class CrearLaboresRealizadasComponent implements OnInit {
  model: NgbDateStruct;
  disabled = true;
  
  selected_lote: number;
  selected_labor: number;

  data_lote = [
    { id: 1, name: 'Lote 1' },
    { id: 2, name: 'Lote 2' },
    { id: 3, name: 'Lote 3' },
    { id: 4, name: 'Lote 4' },
  ];

  data_labor = [
    { id: 1, name: 'Labor 1' },
    { id: 2, name: 'Labor 2' },
    { id: 3, name: 'Labor 3' },
  ];

  editing: any = {};
  rows: any = new Array;
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  @ViewChild(CrearLaboresRealizadasComponent) table: CrearLaboresRealizadasComponent | any;

  constructor(private config: NgSelectConfig, private router: Router) {
    

    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';

    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }
 

  Guardar()
  {
    Swal.fire({
      text: '¿Estás seguro de realizar esta acción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0056B3',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        
            Swal.fire({
              text: 'Registro Creado.',
              icon: 'success',
              confirmButtonColor: '#0056B3',
            });

            this.PageLaboresRealizados();
         
      }
    })
  }

  PageLaboresRealizados()
  {
    this.router.navigate(['/labores-agricolas/labores-realizadas']);
  }

  ngOnInit() { }

  @HostListener('window:keydown', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Verifica las teclas específicas que deseas activar
    if (event.altKey && event.key === 'g') {
      // Ejecuta la acción que deseas realizar
      this.activarOpcion(event.key);
      this.Guardar();

    }
    if (event.altKey && event.key === 'r') {
      // Ejecuta la acción que deseas realizar
      this.activarOpcion(event.key);
      this.PageLaboresRealizados();
    }
  }

  activarOpcion(letra ): void {
    //const elemento = this.el.nativeElement.querySelector('#1');
    //if (elemento) {
    //  this.renderer.selectRootElement(elemento).click();
    //}
    // Lógica para activar la opción deseada
    
    console.log('Opción activada con Alt + ' +letra);
  }
}
