import { CommonModule, JsonPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import {
	NgbAccordionModule,
	NgbAlertModule,
	NgbDatepickerModule,
	NgbDropdownModule,
	NgbModule,
	NgbNavModule,
	NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FeatherModule } from "angular-feather";
import { ComponentsModule } from "../component/component.module";
import { PlantillaModule } from "../plantilla/plantilla.module";
import { ConsultaSolicitudesComponent } from "./consulta-solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { TableService } from "./ngtable/ngtable.service";
import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { RevisarSolicitudComponent } from "./revisar-solicitud/revisar-solicitud.component";
import { SolicitudesRoutes } from "./solicitudes.routing";

import { ReactiveFormsModule } from "@angular/forms";
import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { CompletarAccionPersonalComponent } from "./completar-accion-personal/completar-accion-personal.component";
import { RegistrarAccionPersonalComponent } from "./registrar-accion-personal/registrar-accion-personal.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { RegistrarComentarioReingresoComponent } from "./registrar-comentario-reingreso/registrar-comentario-reingreso.component";
import { RegistrarComentarioSalidaJefeComponent } from "./registrar-comentario-salida-jefe/registrar-comentario-salida-jefe.component";
import { RegistrarComentarioSalidaRRHHComponent } from "./registrar-comentario-salida-rrhh/registrar-comentario-salida-rrhh.component";
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";
import { ReingresoPersonalComponent } from "./reingreso-personal/reingreso-personal.component";
import { DialogBuscarEmpleadosFamiliaresComponent } from "./registrar-familiares/dialog-buscar-empleados-familiares/dialog-buscar-empleados-familiares.component";
import { DialogBuscarEmpleadosReingresoComponent } from "./reingreso-personal/dialog-buscar-empleados-reingreso/dialog-buscar-empleados-reingreso.component";
import { TrazabilidadSolicitudComponent } from "./trazabilidad-solicitud/trazabilidad-solicitud.component";
import { DirectivesModule } from "../directives/directives.module";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";

@NgModule({
	declarations: [
		RegistrarSolicitudComponent,
		ConsultaSolicitudesComponent,
		DetalleSolicitudComponent,
		RevisarSolicitudComponent,
		RegistrarCandidatoComponent,
		CompletaSolicitudComponent,
		ReingresoPersonalComponent,
		RegistrarFamiliaresComponent,
		RegistrarComentarioSalidaJefeComponent,
		RegistrarComentarioSalidaRRHHComponent,
		RegistrarComentarioReingresoComponent,
		RegistrarAccionPersonalComponent,
		CompletarAccionPersonalComponent,
		DialogBuscarEmpleadosFamiliaresComponent,
		DialogBuscarEmpleadosReingresoComponent,
		TrazabilidadSolicitudComponent,
	],
	imports: [
		RouterModule.forChild(SolicitudesRoutes),
		NgbNavModule,
		PlantillaModule,
		ComponentsModule,
		NgbModule,
		NgbDropdownModule,
		NgbDatepickerModule,
		NgxDatatableModule,
		NgbAlertModule,
		FeatherModule,
		NgbTypeaheadModule,
		NgbAccordionModule,
		JsonPipe,
		FormsModule,
		NgxChartsModule,
		CommonModule,
		NgSelectModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatInputModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		DirectivesModule,
		NgxMaskDirective,
		NgxMaskPipe,
	],
	exports: [
		RevisarSolicitudComponent,
		//Otros componentes que deseas exportar
	],
	providers: [TableService, provideNgxMask()],
})
export class SolicitudesModule { }
