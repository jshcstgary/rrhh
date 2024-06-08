import { Component, Inject, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map } from "rxjs";
import { IEmpleados } from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";

type Empleados = IEmpleados["evType"];
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
  fields = <Empleados[0]>{
    nombreCompleto: "",
    fechaIngresogrupo: null,
    nombreCargo: "",
    unidadNegocio: "",
    departamento: "",
    localidad: "",
  };

  constructor(private mantenimientoService: MantenimientoService) {}

  ngOnInit(): void {}

  onSeleccionar() {
    this.activeModal.close(this.fields);
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
          this.fields = data as Empleados[0];
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
