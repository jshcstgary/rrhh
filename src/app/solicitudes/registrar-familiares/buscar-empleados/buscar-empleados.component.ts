import { Component, Inject, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

interface BuscarEmpleadosFields {
  name: string;
  fechaIngreso: string;
  cargo: string;
  unidad: string;
  departamento: string;
  localidad: string;
  parentesco: string;
}

@Component({
  selector: "app-buscar-empleados",
  templateUrl: "./buscar-empleados.component.html",
  styleUrls: ["./buscar-empleados.component.scss"],
  standalone: true,
  imports: [FormsModule],
})
export class BuscarEmpleadosComponent {
  activeModal = inject(NgbActiveModal);

  searchInp: string;
  fields: BuscarEmpleadosFields = {
    name: "",
    fechaIngreso: "",
    cargo: "",
    unidad: "",
    departamento: "",
    localidad: "",
    parentesco: "",
  };

  ngOnInit(): void {}

  onSeleccionar(){
    this.activeModal.close(this.fields);
  }

  onEnter(): void {
    // this.myService.miMetodo(this.searchInp).subscribe(
    //   (response) => {
    //     // Maneja la respuesta del servicio aquí
    //   },
    //   (error) => {
    //     // Maneja el error aquí
    //   }
    // );
  }
}
