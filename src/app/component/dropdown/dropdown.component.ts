import { Component, Input } from "@angular/core";
import { IDropdownOptions } from "./dropdown.interface";

@Component({
  selector: "dropdown-component",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownComponent {
  @Input() public options: IDropdownOptions;
  @Input() public textButton: string;
  @Input() public iconButton: string;
  @Input() public contexto: any;
  @Input() public buttonClasses: string[];
  @Input() public onDropDownClickFunction: string;
  /**
   * Función para ejecutar la funcion del dropdown
   *
   * @param id id de la opción
   */
  public onDropDownClick(id: string) {
    if (this.onDropDownClickFunction) {
      this.contexto[this.onDropDownClickFunction](id);
    }
  }
}
