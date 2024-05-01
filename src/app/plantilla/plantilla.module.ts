import { NgModule } from "@angular/core";
import { PlantillaAComponent } from "./plantillaA/plantillaA.component";
import { PlantillaBComponent } from "./plantillaB/plantillaB.component";
import { PlantillaCComponent } from "./plantillaC/plantillaC.component";
import { ComponentsModule } from "../component/component.module";
import { CommonModule } from "@angular/common";
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { FeatherModule } from "angular-feather";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SimpleDatepickerBasic } from "../component/datepicker/simpledatepicker.component";
import { PlantillaDComponent } from "./plantillaD/plantillaD.component";
import { PlantillaEComponent } from "./plantillaE/plantillaE.component";

/*

    NgbNavModule,*
    NgbDropdownModule,*
    NgFor,
    NgIf,
    NgbAlertModule,*
    NgbDatepickerModule,*
    SimpleDatepickerBasic,
    Custommonth,
    FeatherModule,*
    NgSelectModule,*
    NgxDatatableModule*,
    NgIf,
    FormsModule*,
    NgFor,
    CommonModule*,
    ComponentsModule*,

*/

@NgModule({
  declarations: [
    PlantillaAComponent,
    PlantillaBComponent,
    PlantillaCComponent,
    PlantillaDComponent,
    PlantillaEComponent,
  ],
  exports: [
    PlantillaAComponent,
    PlantillaBComponent,
    PlantillaCComponent,
    PlantillaDComponent,
    PlantillaEComponent,
  ],
  imports: [
    ComponentsModule,
    NgbModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgxDatatableModule,
    NgbAlertModule,
    CommonModule,
    FeatherModule,
    NgSelectModule,
    FormsModule,
  ],
})
export class PlantillaModule {}
