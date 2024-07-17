import { Component, Input } from "@angular/core";
import { IDropdownOptions } from "./dropdown.interface";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {}
  
  /**
   * Función para ejecutar la funcion del dropdown
   *
   * @param id id de la opción
   */
  public onDropDownClick(id: string) {
    localStorage.removeItem(LocalStorageKeys.Permisos);
    localStorage.removeItem(LocalStorageKeys.IdLogin);
    localStorage.removeItem(LocalStorageKeys.IdUsuario);

    this.router.navigate(["/login"]);
    
    if (this.onDropDownClickFunction) {
      this.contexto[this.onDropDownClickFunction](id);
    }
  }
}
