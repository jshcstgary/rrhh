import { DialogBuscarEmpleadosComponent } from "src/app/solicitudes/registrar-familiares/buscar-empleados/buscar-empleados.component";
import { DialogReasignarUsuarioComponent } from "../reasginar-usuario/reasignar-usuario.component";
import { Type } from "@angular/core";

export interface DialogComponents {
  dialogBuscarEmpleados: Type<DialogBuscarEmpleadosComponent>;
  dialogReasignarUsuario: Type<DialogReasignarUsuarioComponent>;
}

export const dialogComponentList: DialogComponents = {
  dialogBuscarEmpleados: DialogBuscarEmpleadosComponent,
  dialogReasignarUsuario: DialogReasignarUsuarioComponent,
};
