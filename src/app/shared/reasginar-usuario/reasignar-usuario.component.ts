import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, catchError } from "rxjs";
import { IEmpleadoData, IEmpleados } from "src/app/services/mantenimiento/empleado.interface";
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

  constructor(private mantenimientoService: MantenimientoService) {}

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
