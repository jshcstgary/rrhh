import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, catchError } from "rxjs";
import {
  IEmpleadoData,
  IEmpleados,
} from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";

@Component({
  selector: "app-dialog-reasignar-usuario",
  templateUrl: "./reasignar-usuario.component.html",
  styleUrls: ["./reasignar-usuario.component.scss"],
  standalone: true,
  imports: [FormsModule],
})
export class DialogReasignarUsuarioComponent {
  activeModal = inject(NgbActiveModal);

  search: string;
  fields = <IEmpleadoData>{
    nombreCompleto: "",
    compania: "",
    codigo: "",
    unidadNegocio: "",
    comentarios: "",
    fechaIngresogrupo: null,
    nombreCargo: "",
    departamento: "",
    localidad: "",
  };
  public dataEmpleadoEvolution: any[];

  constructor(private mantenimientoService: MantenimientoService) {}

  onClose() {
    this.activeModal.close({
      action: "cerrar",
    });
  }

  onSave(fields: IEmpleadoData) {
    this.activeModal.close({
      data: fields,
      action: "seleccionar",
    });
  }

  onEnter(search: string): void {
    this.mantenimientoService
      .getDataEmpleadosEvolutionPorId(search)   
      .subscribe({
        next: (data) => {
          this.dataEmpleadoEvolution = data.evType;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  buscarValor = (search, type: "jaffType" | "evType", data: IEmpleados) => {
    const result = data?.[type].find((item) => {
      const regex = new RegExp(search, "i");
      return item.nombreCompleto.match(regex);
    });
    if (!result) {
      throw new Error("No se encontró el valor esperado");
    }
    return result;
  };
}
