import { NgModule } from "@angular/core";
import { PlantillaAComponent } from "./plantillaA/plantillaA.component";
import { ComponentsModule } from "../component/component.module";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    PlantillaAComponent

  ],
  exports: [
    PlantillaAComponent
  ],
  imports: [ComponentsModule, CommonModule, NgbModule],
})
export class PlantillaModule {}
