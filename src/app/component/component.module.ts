import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ColorPickerModule } from "ngx-color-picker";
import { DirectivesModule } from "../directives/directives.module";
import { ComponentsRoutes } from "./component.routing";
import { DropdownComponent } from "./dropdown/dropdown.component";
import { FormComponent } from "./form/form.component";
import { InputComponent } from "./input/input.component";
import { TablaComponent } from "./table-personalized/table.component";
import { TableComponent } from "./table/table.component";
import { TooltipComponent } from "./tooltip/tooltip.component";

@NgModule({
  imports: [
    RouterModule.forChild(ComponentsRoutes),
    CommonModule,
    NgbModule,
    FormsModule,
    ColorPickerModule,
    NgSelectModule,
    DirectivesModule
  ],
  declarations: [
    TooltipComponent,
    TableComponent,
    InputComponent,
    DropdownComponent,
    FormComponent,
    TablaComponent
  ],
  exports: [
    TooltipComponent,
    InputComponent,
    FormComponent,
    TableComponent,
    DropdownComponent,
    TablaComponent
  ],
})
export class ComponentsModule {}
