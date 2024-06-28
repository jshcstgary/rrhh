import { DialogBuscarEmpleadosFamiliaresComponent } from "src/app/solicitudes/registrar-familiares/dialog-buscar-empleados-familiares/dialog-buscar-empleados-familiares.component";
import { DialogReasignarUsuarioComponent } from "../reasginar-usuario/reasignar-usuario.component";
import { Type } from "@angular/core";

export interface DialogComponents {
  dialogBuscarEmpleados: Type<DialogBuscarEmpleadosFamiliaresComponent>;
  dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

export const dialogComponentList: DialogComponents = {
  dialogBuscarEmpleados: DialogBuscarEmpleadosFamiliaresComponent,
  dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};
