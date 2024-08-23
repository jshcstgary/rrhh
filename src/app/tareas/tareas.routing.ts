import { Routes } from "@angular/router";
import { ConsultaTareasComponent } from "./consulta-tareas/consulta-tareas.component";
import { routeAccessGuard } from "../guards/route-access.guard";
import { PageCodes } from "../enums/codes.enum";

export const TareasRoutes: Routes = [
	{
		path: "",
		children: [
			{
				path: "consulta-tareas",
				canActivate: [routeAccessGuard],
				component: ConsultaTareasComponent,
				data: {
					title: "Mis tareas",
					code: PageCodes.ConsultaTareas,
					urls: [
						{
							title: "Tareas"
						},
						{
							title: "Consulta Tarea"
						}
					],
				},
			},
		],
	},
];
