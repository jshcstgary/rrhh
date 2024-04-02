import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-crear-niveles-aprobacion',
  templateUrl: './crear-niveles-aprobacion.component.html',
  styleUrls: ['./crear-niveles-aprobacion.component.scss']
})
export class CrearNivelesAprobacionComponent implements OnInit{

  constructor(private config: NgSelectConfig, private router: Router) {


    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';


  }

  PageNivelesAprobacion()
  {
    this.router.navigate(['/mantenedores/niveles-aprobacion']);
  }

  ngOnInit() { }

}
