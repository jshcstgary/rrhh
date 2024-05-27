import { Component } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Solicitud } from 'src/app/eschemas/Solicitud';

@Component({
  selector: 'app-reingreso-personal',
  templateUrl: './reingreso-personal.component.html',
  styleUrls: ['./reingreso-personal.component.scss']
})
export class ReingresoPersonalComponent {
  public solicitud = new Solicitud();
  public RegistrarsolicitudCompletada = true;

  public onSubmit(): void {

  }

  public pageSolicitudes(): void {

  }

  public onCompletar(): void {

  }

  public onCancel(): void {

  }

  public onSelectItem(codigoPosicion: string, event: NgbTypeaheadSelectItemEvent<any>): void {

  }
}
