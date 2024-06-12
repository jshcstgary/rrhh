import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map } from "rxjs";
import {
  IEmpleadoData,
  IEmpleados,
} from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";

@Component({
  selector: "app-dialog-buscar-empleados",
  templateUrl: "./buscar-empleados.component.html",
  styleUrls: ["./buscar-empleados.component.scss"],
  standalone: true,
  imports: [FormsModule],
})
export class DialogBuscarEmpleadosComponent {
  activeModal = inject(NgbActiveModal);

  searchInp: string;
  fields = <IEmpleadoData>{
    nombreCompleto: "",
    subledger: "",
  };

  constructor(private mantenimientoService: MantenimientoService) {}

  onClose() {
    this.activeModal.close({
      action: "cerrar",
    });
  }

  onSeleccionar(fields: IEmpleadoData) {
    this.activeModal.close({
      data: fields,
      action: "seleccionar",
    });
  }

  onEnter(search: string): void {
    this.mantenimientoService
      .getDataEmpleadosEvolution("ev")
      .pipe(
        map(this.buscarValor.bind(this, search, "evType")),
        catchError((error) => {
          return this.mantenimientoService
            .getDataEmpleadosEvolution("jaff")
            .pipe(map(this.buscarValor.bind(this, search, "jaffType")));
        })
      )
      .subscribe({
        next: (data) => {
          this.fields = data as IEmpleadoData;
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
