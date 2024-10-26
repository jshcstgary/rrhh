import { CommonModule, JsonPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
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
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { DirectivesModule } from "../directives/directives.module";
import { SolicitudHeaderDataComponent } from "../shared/solicitud-header-data/solicitud-header-data.component";
import { SolicitudSeccionDesplegableComponent } from "../shared/solicitud-seccion-desplegable/solicitud-seccion-desplegable.component";
import { BuscarEmpleadoComponent } from "./buscar-empleado/buscar-empleado.component";
import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { CompletarAccionPersonalComponent } from "./completar-accion-personal/completar-accion-personal.component";
import { RegistrarAccionPersonalComponent } from "./registrar-accion-personal/registrar-accion-personal.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { RegistrarComentarioReingresoComponent } from "./registrar-comentario-reingreso/registrar-comentario-reingreso.component";
import { RegistrarComentarioSalidaJefeComponent } from "./registrar-comentario-salida-jefe/registrar-comentario-salida-jefe.component";
import { RegistrarComentarioSalidaRRHHComponent } from "./registrar-comentario-salida-rrhh/registrar-comentario-salida-rrhh.component";
import { DialogBuscarEmpleadosFamiliaresComponent } from "./registrar-familiares/dialog-buscar-empleados-familiares/dialog-buscar-empleados-familiares.component";
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";
import { BuscarExempleadoComponent } from "./reingreso-personal/buscar-exempleado/buscar-exempleado.component";
import { DialogBuscarEmpleadosReingresoComponent } from "./reingreso-personal/dialog-buscar-empleados-reingreso/dialog-buscar-empleados-reingreso.component";
import { ReingresoPersonalComponent } from "./reingreso-personal/reingreso-personal.component";
import { TrazabilidadSolicitudComponent } from "./trazabilidad-solicitud/trazabilidad-solicitud.component";
import { ReporteSolicitudesComponent } from "./reporte-solicitudes/reporte-solicitudes.component";

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
	declarations: [
		RegistrarSolicitudComponent,
		ConsultaSolicitudesComponent,
		ReporteSolicitudesComponent,
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
		BuscarEmpleadoComponent,
		BuscarExempleadoComponent
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
		SolicitudSeccionDesplegableComponent,
		SolicitudHeaderDataComponent
	],
	exports: [
		RevisarSolicitudComponent,
		//Otros componentes que deseas exportar
	],
	providers: [
		TableService,
		provideNgxMask(),
		{
			provide: MAT_DATE_LOCALE,
			useValue: "es-ES"
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: MY_DATE_FORMATS
		}
	],
})
export class SolicitudesModule { }
