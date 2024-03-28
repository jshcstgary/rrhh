import { Component, Input } from "@angular/core";

@Component({
  selector: "back-button-component",
  templateUrl: "./back-button.component.html",
  styleUrls: ["./back-button.component.scss"],
})
export class BackButtonComponent {
  @Input() public mainText: string = "";
  @Input() public textDetails: string[] = [];
  @Input() public onBackFunction: string = null;
  @Input() public contexto: any;

  /**
   * Función que se ejecutara cuado le de click en el icono de regresar
   */
  public onBack() {
    if (this.contexto && this.onBackFunction !== null) {
      this.contexto[this.onBackFunction]();
    }
  }
}
