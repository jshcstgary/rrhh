import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ComponentsRoutes } from "./component.routing";
import { TooltipComponent } from "./tooltip/tooltip.component";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { TableComponent } from "./table/table.component";
import { InputComponent } from "./input/input.component";
import { ColorPickerModule } from "ngx-color-picker";
import { NgSelectModule } from "@ng-select/ng-select";
import { DropdownComponent } from "./dropdown/dropdown.component";
import { FormComponent } from "./form/form.component";

@NgModule({
  imports: [
    RouterModule.forChild(ComponentsRoutes),
    CommonModule,
    NgbModule,
    FormsModule,
    ColorPickerModule,
    NgSelectModule,
  ],
  declarations: [
    TooltipComponent,
    TableComponent,
    InputComponent,
    DropdownComponent,
    FormComponent,
  ],
  exports: [
    TooltipComponent,
    InputComponent,
    FormComponent,
    TableComponent,
    DropdownComponent,
  ],
})
export class ComponentsModule {}
