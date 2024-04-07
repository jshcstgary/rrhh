import { NgIf, CommonModule, NgFor } from '@angular/common';
import { Component, ViewChild, OnInit, HostListener, AfterViewInit, ElementRef, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  NgbNavModule,
  NgbNavChangeEvent,
  NgbDropdownModule,
  NgbAlertModule,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

import { SimpleDatepickerBasic } from 'src/app/component/datepicker/simpledatepicker.component';
import { Custommonth } from 'src/app/component/datepicker/customonth.component';
import { FeatherModule } from 'angular-feather';
import {
  IConsultaSolicitudes,
  IConsultaSolicitudesTable,
} from "./niveles-aprobacion.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaSolicitudesData } from "./niveles-aprobacion.data";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ComponentsModule } from 'src/app/component/component.module';
import { CamundaRestService } from 'src/app/camunda-rest.service';
import { DatosInstanciaProceso } from 'src/app/eschemas/DatosInstanciaProceso';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilService } from 'src/app/services/util/util.service';
import { DatosNivelesAprobacion } from 'src/app/eschemas/DatosNivelesAprobacion';
declare var require: any;
const data: any = require('./company.json');
@Component({
  selector: 'app-niveles-aprobacion',
  standalone: true,
  templateUrl: './niveles-aprobacion.component.html',
  styleUrls: ['./niveles-aprobacion.component.scss'],
  imports: [
    NgbNavModule,
    NgbDropdownModule,
    NgFor,
    NgIf,
    NgbAlertModule,
    NgbDatepickerModule,
    SimpleDatepickerBasic,
    Custommonth,
    FeatherModule,
    NgSelectModule,
    NgxDatatableModule,
    NgIf,
    FormsModule,
    NgFor,
    CommonModule,
    ComponentsModule
    ],
})
export class NivelesAprobacionComponent {

  public dataTable: IConsultaSolicitudesTable = [];
  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public hasFiltered: boolean = true;
  public submitted: boolean = false;
  public errorMessage: string;
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];
  public dataTipoMotivo: any[] = [];
  private instanceCreated : DatosInstanciaProceso;
  consultaSolicitudesSelect!:string;
  isLoading = false;
  model: NgbDateStruct;
  disabled = true;
  today = this.calendar.getToday();

  @ViewChild("myModalSolicitudes", { static: false }) myModalSolicitudes: TemplateRef<any>;



     //  basic navs
     active = 1;

     // vertical
     active2 = 'top';

     // selecting navs
     active3: any;

  selected_hacienda: number;
  selected_tipo_motivo: number;
  selected_tipo_solicitud: number;
  selected_niveldireccion: number;

  data_empresas = [
    { id: 10021, name: 'Reybanpac' },
  ];

  /*data_productos = [
    { id: 1, name: 'Todos' },
  ];*/

  data_tipo_labor = [
    { id: 1, name: 'Requisición de personal' },
    { id: 2, name: 'Contratación de familiares' },
    { id: 3, name: 'Reingreso de personal' },
    { id: 4, name: 'Acción de personal' },
  ];

  data_estado = [
    { id: 1, name: 'Todos' },
  ];

  editing: any = {};
  rows: any = new Array;
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  @ViewChild(NivelesAprobacionComponent) table: NivelesAprobacionComponent | any;

  constructor(private config: NgSelectConfig,private calendar: NgbCalendar, private router: Router, private modalService: NgbModal
    ,private camundaRestService: CamundaRestService
    ,private route: ActivatedRoute
    ,private utilService: UtilService
    ,private mantenimientoService: MantenimientoService) {

    this.camundaRestService = camundaRestService;
    this.route = route;
    this.router = router;
    this.errorMessage = null;
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

  ngOnDestroy(): void {
    this.modalService.dismissAll();
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

  OpnenModal(){
    const modalDiv= document.getElementById('myModal');
    if(modalDiv!=null){
      modalDiv.style.display='block';
    }
  }

  CloseModal(){
    const modalDiv= document.getElementById('myModal');
    if(modalDiv!=null){
      modalDiv.style.display='none';
    }
  }

  PageCrear()
  {
    this.router.navigate(['/mantenedores/crear-niveles-aprobacion']);
  }
 //Crear Solicitud
  CrearSolicitud(){
    //this.router.navigate(['/mantenedores/crear-niveles-aprobacion']);
     /*console.log('Nuevo proceso iniciado con datos..');
     Swal.fire({
      text: '¿Desea crear la Solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        //Inicio de Solicitud
        this.route.params.subscribe(params =>{
          //const processDefinitionKey ="process_modelo";
          const processDefinitionKey ="RequisicionPersonal";
          //const processDefinitionKey = params['processdefinitionkey'];
          const variables = this.generatedVariablesFromFormFields();
          console.log(variables);
          this.camundaRestService.postProcessInstance(processDefinitionKey,variables)
          .subscribe(instanceOutput =>{

           this.lookForError(instanceOutput);

           console.log(instanceOutput);
           this.instanceCreated = new DatosInstanciaProceso(
             instanceOutput.businessKey,
             instanceOutput.definitionId,
             instanceOutput.id,
             instanceOutput.tenantId
           );
          });
          this.submitted = true;
         });

         if(this.submitted){

          this.router.navigate(['/solicitudes/registrar-solicitud']);
         }

        //Fin Solicitud
      }

    })*/

  }

  getCreatedId(): string
  {
    if(this.instanceCreated
      && this.instanceCreated.id != null
      && this.instanceCreated.id != ''){

        return this.instanceCreated.id;

    }

    return 'No se ha creado Id de Proceao';
  }

  lookForError(result: any): void {
    if(result.error !== undefined && result.error !== null)
    {
        this.errorMessage = result.message
                            ?(result.name + " " + result.message)
                            : result.error.message;
        console.log('routin to app error page', this.errorMessage);
        this.router.navigate([ 'error' ], {queryParams:{message: this.errorMessage}});
    }


  }



  //fin crear Solicitud Integracion con camunda


  mostrarModalCrearSolicitudes() {
    this.submitted=false;
    this.modalService.open(this.myModalSolicitudes, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        return true;
      },

    });
    this.isLoading = false;

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



   onNavChange(changeEvent: NgbNavChangeEvent) {
     if (changeEvent.nextId === 3) {
       changeEvent.preventDefault();
     }
   }

   toggleDisabled() {
     this.disabled = !this.disabled;
     if (this.disabled) {
       this.active = 1;
     }
   }

   // keep content
   active4 = 1;

   // dynamic tabs
   tabs = [1, 2, 3, 4, 5];
   counter = this.tabs.length + 1;
   active5: any;

   close(event: MouseEvent, toRemove: number) {
     this.tabs = this.tabs.filter((id) => id !== toRemove);
     event.preventDefault();
     event.stopImmediatePropagation();
   }

   add(event: MouseEvent) {
     this.tabs.push(this.counter++);
     event.preventDefault();
   }

   //metodos de prueba

   /* Hacer foco sobrehacienda cuando se renderiza la pantalla */
  @ViewChild("inputSelectHacienda") inputSelectHacienda!: NgSelectComponent;
  ngAfterViewInit() {
    //this.inputSelectHacienda.focus();
  }
  /* Funcion para hacer focus al select de producto */
  @ViewChild("inputSelectProducto") inputSelectProducto!: NgSelectComponent;
  public onChangeHacienda() {
    //this.inputSelectProducto.focus();
  }
  /* Funcion para hacer focus al input de fecha */
  @ViewChild("inputDateFecha") inputDateFecha!: ElementRef;
  public onChangeProducto() {
    //this.inputDateFecha.nativeElement.focus();
  }
  /* Funcion para hacer focus al select de Labor */
  @ViewChild("inputSelectLabor") inputSelectLabor!: NgSelectComponent;
  public onChangeFecha() {
    //this.inputSelectLabor.focus();
  }
  /* Funcion para hacer focus al select de trabajador */
  @ViewChild("inputSelectTrabajador") inputSelectTrabajador!: NgSelectComponent;
  public onChangeTipoLabor() {
    //this.inputSelectTrabajador.focus();
  }
  /* Funcion para hacer focus al input de fecha */
  @ViewChild("buttonSearch") buttonSearch!: ElementRef;
  public onChangeTrabajador() {
    //this.buttonSearch.nativeElement.focus();
  }

  //LLenar combo Tipo Solicitud
  ObtenerServicioTipoSolicitud(){

    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response) => {
        this.dataTipoSolicitudes = response.map((r)=>({
          id:r.id,
          descripcion: r.tipoSolicitud,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion(){

    return this.mantenimientoService.getCatalogo('RBPND').subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes.map((r)=>({
          id:r.id,
          descripcion: r.valor,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
//dataTipoMotivo

ObtenerServicioTipoMotivo(){

  return this.mantenimientoService.getTipoMotivo().subscribe({
    next: (response) => {
      this.dataTipoMotivo = response.map((r)=>({
        id:r.id,
        descripcion: r.tipoMotivo,
      }));//verificar la estructura mmunoz


    },
    error: (error: HttpErrorResponse) => {
      this.utilService.modalResponse(error.error, "error");
    },
  });
}

  ngOnInit() {
     this.ObtenerServicioTipoSolicitud();
     this.ObtenerServicioNivelDireccion();
     this.ObtenerServicioTipoMotivo();
  }
}

