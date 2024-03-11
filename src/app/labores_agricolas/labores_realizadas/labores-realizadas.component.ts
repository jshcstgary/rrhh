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
  templateUrl: './labores-realizadas.component.html',
  styleUrls: ['./labores-realizadas.css']
})
export class LaboresRealizadasComponent implements OnInit {

  model: NgbDateStruct;
  disabled = true;
  today = this.calendar.getToday();
  
  selected_hacienda: number;
  selected_producto: number;
  selected_tipo_labor: number;
  selected_trabajador: number;

  data_haciendas = [
    { id: 10021, name: 'Poza de Naranjo' },
    { id: 10022, name: 'Paraiso' },
    { id: 10023, name: 'J.J.' },
    { id: 10024, name: 'San Francisco' },
  ];

  data_productos = [
    { id: 1, name: 'Banano' },
    { id: 2, name: 'Maduro' },
    { id: 3, name: 'Maracuyá' },
  ];

  data_tipo_labor = [
    { id: 1, name: 'Atención a plantación' }
  ];

  data_trabajador = [
    { id: 120313, name: 'Glorioso Vicente Fajardo' }
  ];

  editing: any = {};
  rows: any = new Array;
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  @ViewChild(LaboresRealizadasComponent) table: LaboresRealizadasComponent | any;

  constructor(private config: NgSelectConfig,private calendar: NgbCalendar, private router: Router) {
    this.model = calendar.getToday();

    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';

    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);

    
  }
 
  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = data;
  }
  updateValue(event: any, cell: any, rowIndex: number) {

    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];

  }

  PageCrear()
  {
    this.router.navigate(['/labores-agricolas/crear-labores-realizadas']);
  }

  Eliminar()
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
              text: 'Registro Eliminado.',
              icon: 'success',
              confirmButtonColor: '#0056B3',
            });
         
      }
    })
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Verifica las teclas específicas que deseas activar
    if (event.altKey && event.key === 'c') {
      // Ejecuta la acción que deseas realizar
      this.activarOpcion(event.key);
      this.PageCrear();
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
  ngOnInit() { }
}
