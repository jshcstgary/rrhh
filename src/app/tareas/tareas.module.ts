import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TareasRoutes } from "./tareas.routing";

import { TableService } from "./ngtable/ngtable.service";
import { ConsultaTareasComponent } from "./consulta-tareas/consulta-tareas.component";
import { PlantillaModule } from "../plantilla/plantilla.module";
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [RouterModule.forChild(TareasRoutes), PlantillaModule, CommonModule],
	providers: [TableService],
	declarations: [ConsultaTareasComponent],
})
export class TareasModule { }
