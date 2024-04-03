import { CommonModule, NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModel,FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  standalone: true,
  selector: 'app-crear-niveles-aprobacion',
  templateUrl: './crear-niveles-aprobacion.component.html',
  styleUrls: ['./crear-niveles-aprobacion.component.scss'],
  imports: [ NgFor,FormsModule, CommonModule,]
})
export class CrearNivelesAprobacionComponent implements OnInit{

  public dataTipoSolicitudes: any[] = [];
  selected_tiposolicitud: number = 0;

  constructor(private config: NgSelectConfig,
              private router: Router,
              private mantenimientoService: MantenimientoService,
              private utilService: UtilService) {


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

}
