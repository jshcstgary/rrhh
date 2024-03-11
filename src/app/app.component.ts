import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';




  @HostListener('window:keydown', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Verifica las teclas específicas que deseas activar
    if (event.altKey && event.key === 'l') {
      // Ejecuta la acción que deseas realizar
      this.activarOpcion();
    }
  }

  activarOpcion(): void {
    //const elemento = this.el.nativeElement.querySelector('#1');
    //if (elemento) {
    //  this.renderer.selectRootElement(elemento).click();
    //}
    // Lógica para activar la opción deseada
    
    console.log('Opción activada con Alt + L');
  }
}
