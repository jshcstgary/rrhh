import { CommonModule, NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModel,FormsModule  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { UtilService } from 'src/app/services/util/util.service';
import { CrearNivelesAprobacionService } from './crear-niveles-aprobacion.service';
import Swal from 'sweetalert2';
import { DatosNivelesAprobacion } from 'src/app/eschemas/DatosNivelesAprobacion';

@Component({
  standalone: true,
  selector: 'app-crear-niveles-aprobacion',
  templateUrl: './crear-niveles-aprobacion.component.html',
  styleUrls: ['./crear-niveles-aprobacion.component.scss'],
  imports: [ NgFor,FormsModule, CommonModule,]
})
export class CrearNivelesAprobacionComponent implements OnInit{

  public dataTipoSolicitudes: any[] = [];
  public dataTipoMotivo: any[] = [];
  public dataAccion: any[] = [];
  public dataRuta: any[] = [];
  public dataTipoRuta: any[] = [];
  public dataNivelDireccion: any[] = [];
  public dataNivelAprobacion: any[] = [];
  modelo : DatosNivelesAprobacion = new DatosNivelesAprobacion();
  selected_tiposolicitud: number | string;
  selected_tipomotivo: number | string;
  selected_accion: number | string;
  selected_ruta: number | string;
  selected_tiporuta: number | string;
  selected_niveldir: number | string;
  selected_nivelaprob: number | string;

  constructor(private config: NgSelectConfig,
              private router: Router,
              private route: ActivatedRoute,
              private mantenimientoService: MantenimientoService,
              private utilService: UtilService,
              private serviceNivelesAprobacion: CrearNivelesAprobacionService) {


    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';


  }

  PageNivelesAprobacion()
  {
    this.router.navigate(['/mantenedores/niveles-aprobacion']);
  }

  ngOnInit() {
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioAccion();
    this.ObtenerServicioRuta();
    this.ObtenerServicioTipoRuta();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioNivelAprobacion();
  }

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

  ObtenerServicioAccion(){

    return this.mantenimientoService.getAccion().subscribe({
      next: (response) => {
        this.dataAccion = response.map((r)=>({
          id:r.id,
          descripcion: r.accion,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioRuta(){

    return this.mantenimientoService.getRuta().subscribe({
      next: (response) => {
        this.dataRuta = response.map((r)=>({
          id:r.id,
          descripcion: r.ruta,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoRuta(){

    return this.mantenimientoService.getTipoRuta().subscribe({
      next: (response) => {
        this.dataTipoRuta = response.tipoRutaType.map((r)=>({
          id:r.id,
          descripcion: r.tipoRuta,
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
          id:r.codigo,
          descripcion: r.valor,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelAprobacion(){

    return this.mantenimientoService.getCatalogo('RBPNA').subscribe({
      next: (response) => {
        this.dataNivelAprobacion = response.itemCatalogoTypes.map((r)=>({
          id:r.codigo,
          descripcion: r.valor,
        }));//verificar la estructura mmunoz


      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }


  GuardarnivelAprobacion(){

    this.route.params.subscribe(params =>{
      //const variables = this.generatedVariablesFromFormFields();
      console.log(this.modelo);
      this.serviceNivelesAprobacion.guardarNivelAprobacion(this.modelo).subscribe(response =>{
        console.log(response);
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
         );

        },
        (error: HttpErrorResponse) =>{
          this.utilService.modalResponse(error.error, "error");
        }
    );

  });

  }

  /*generatedVariablesFromFormFields(){

    return {
              {
              fechaActualizacion: { value : this.modelo.fechaActualizacion},
              fechaCreacion: { value : this.modelo.fechaCreacion},
              usuarioCreacion: { value : this.modelo.usuarioCreacion},
              usuarioActualizacion: { value : this.modelo.usuarioActualizacion},
              estado: { value : this.modelo.estado},
              idNivelAprobacion: { value : this.modelo.idNivelAprobacion},
              idNivelAprobacionRuta: { value : this.modelo.idNivelAprobacionRuta},
              nivelAprobacionRuta: { value : this.modelo.nivelAprobacionRuta},
              idTipoSolicitud: { value : this.modelo.idTipoSolicitud},
              tipoSolicitud: { value : this.modelo.tipoSolicitud},
              idAccion: { value : this.modelo.idAccion},
              accion: { value : this.modelo.accion},
              idNivelDireccion: { value : this.modelo.idNivelDireccion},
              nivelDireccion: { value : this.modelo.nivelDireccion},
              idRuta: { value : this.modelo.idRuta},
              ruta: { value : this.modelo.ruta},
              idTipoMotivo: { value : this.modelo.idTipoMotivo},
              tipoMotivo: { value : this.modelo.tipoMotivo},
              idTipoRuta: { value : this.modelo.idTipoRuta},
              tipoRuta: { value : this.modelo.tipoRuta}
             }
    }
  }*/


}
