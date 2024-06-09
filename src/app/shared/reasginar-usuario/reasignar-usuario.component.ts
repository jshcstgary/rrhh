import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

interface IFields {
  nameEmpRsg: string;
  company: string;
  codeEmpRsg: string;
  unBsRsg: string;
  userRsg: string;
}

@Component({
  selector: "app-dialog-reasignar-usuario",
  templateUrl: "./reasignar-usuario.component.html",
  styleUrls: ["./reasignar-usuario.component.scss"],
  standalone: true,
  imports: [FormsModule],
})
export class DialogReasignarUsuarioComponent {
  activeModal = inject(NgbActiveModal);

  searchRsg: string;
  fields = <IFields>{
    nameEmpRsg: "Juan Perez",
    company: "Prueba",
    codeEmpRsg: "12093323",
    unBsRsg: "Unidad Prueba",
    userRsg: "juanperez",
  };
}
