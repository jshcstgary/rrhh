import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";
import {
  FormatoUtilReporte,
  IUtilReporte,
  IUtilReporteDetail,
} from "./util.interface";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  private apiReporteUrl = environment.reporteUS;

  constructor(private http: HttpClient) {}

  private modalTimeToHide: number = 3000;
  /**
   * Función para copiar el texto al clipboard
   *
   * @param text
   */
  public copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
  /**
   * Función para mostrar el spinner de cargando al realizar consumo de las APIs
   *
   * @param message
   * @param type
   */
  public openLoadingSpinner(message: string) {
    Swal.fire({
      title: message,
      showConfirmButton: false,
      showCancelButton: false,
    });
    Swal.showLoading();
    // setTimeout(() => {
    //   Swal.close();
    // }, 2000);
  }

  /**
   * Función para cerrar el spinner de cargando al realizar consumo de las APIs
   *
   * @param message
   * @param type
   */
  public closeLoadingSpinner() {
    Swal.close();
  }

  /**
   * Enfoca un elemento HTML específico después de un retraso de 500 milisegundos.
   * @param elementId El ID del elemento HTML que se va a enfocar.
   */
  public focusOnHtmlElement(elementId: string): void {
    setTimeout(() => {
      const elementHTML = document.getElementById(
        elementId
      ) as HTMLInputElement;
      elementHTML?.focus();
    }, 500);
  }
  public generateReport(
    formatoReporte: FormatoUtilReporte,
    codigoReporte: string,
    tituloReporte: string,
    columnas: string[],
    contenidoColumnas: string[][]
  ) {
    const reporteDetail: IUtilReporteDetail = {
      fechaReporte: new Date().toLocaleString(),
      codigoReporte: codigoReporte,
      compania: "pruebacompania",
      tituloReporte: tituloReporte,
      usuario: "pruebausuario",
      columnas: columnas,
      contenidoColumnas: contenidoColumnas,
    };
    const request: IUtilReporte = {
      formatoInforme: formatoReporte,
      reporteType: reporteDetail,
    };
    this.http
      .post(this.apiReporteUrl, request, {
        responseType: "blob",
        observe: "response",
      })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const contentType = response.headers.get("Content-Type");
          const formattContentType = contentType.split(";")[0];
          const blob = new Blob([response.body], {
            type: formattContentType,
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        },
        error: (error: HttpErrorResponse) =>
          this.modalResponse(error.error, "error"),
      });
  }

  public modalResponse(message: string, type: SweetAlertIcon) {
    Swal.fire({
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: this.modalTimeToHide,
    });
  }
}
