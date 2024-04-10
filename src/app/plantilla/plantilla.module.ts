import { NgModule } from "@angular/core";
import { PlantillaAComponent } from "./plantillaA/plantillaA.component";
import { ComponentsModule } from "../component/component.module";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PlantillaBComponent } from "./plantillaB/plantillaB.component";

@NgModule({
  declarations: [PlantillaAComponent, PlantillaBComponent],
  exports: [PlantillaAComponent, PlantillaBComponent],
  imports: [ComponentsModule, CommonModule, NgbModule],
})
export class PlantillaModule {}
