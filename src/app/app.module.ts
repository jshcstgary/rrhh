import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { ToastrModule } from "ngx-toastr";

import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { RegistrarSolicitudComponent } from "./solicitudes/registrar-solicitud/registrar-solicitud.component";
import { SolicitudesModule } from "./solicitudes/solicitudes.module";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RevisarSolicitudComponent } from "./solicitudes/revisar-solicitud/revisar-solicitud.component";
import { LocalStorageKeys } from "./enums/local-storage-keys.enum";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgScrollbarModule,
    FeatherModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    FeatherModule.pick(allIcons),
    RouterModule.forRoot(Approutes),
    ToastrModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    BrowserModule,
    BrowserAnimationsModule, // Importa BrowserAnimationsModule
    MatButtonModule,
    MatButtonToggleModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    this.localFn();
  }

  private localFn(): void {
    const locals = [localStorage.getItem(LocalStorageKeys.IdUsuario), localStorage.getItem(LocalStorageKeys.IdLogin), localStorage.getItem(LocalStorageKeys.Permisos)];

    const undefinedValues = locals.some(local => local === undefined);

    if (!undefinedValues) {
      return;
    }

    localStorage.setItem(LocalStorageKeys.IdUsuario, "cristhian.salcedo@iguanadigital.com.ec");
    localStorage.setItem(LocalStorageKeys.IdLogin, "csalcedo");
    localStorage.setItem(LocalStorageKeys.Permisos, JSON.stringify(
      [
        {
          "codigo": "wf_solicitudes",
          "nombre": "Solicitudes",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "",
              "habilitar": false,
              "modificar": false,
              "visualizar": false
            }
          ]
        },
        {
          "codigo": "wf_consulta_solicitudes",
          "nombre": "Consulta Solicitudes",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": false,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "09",
              "habilitar": false,
              "modificar": false,
              "visualizar": false
            },
            {
              "codigo_Control": "10",
              "habilitar": false,
              "modificar": false,
              "visualizar": false
            },
            {
              "codigo_Control": "11",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "12",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "13",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "14",
              "habilitar": false,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_detalle_solicitud",
          "nombre": "Detalle Solicitud",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tareas",
          "nombre": "Tareas",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "",
              "habilitar": false,
              "modificar": false,
              "visualizar": false
            }
          ]
        },
        {
          "codigo": "wf_mis_tareas",
          "nombre": "Tareas",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_mantenimiento",
          "nombre": "Mantenimiento",
          "visualizar": true,
          "nuevo": false,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "",
              "habilitar": false,
              "modificar": false,
              "visualizar": false
            }
          ]
        },
        {
          "codigo": "wf_niveles_aprobacion",
          "nombre": "Niveles de aprobación",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_crear_niveles_aprobacion",
          "nombre": "Crear Niveles de Aprobación",
          "visualizar": false,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": false,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "09",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "10",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tipo_solicitudes",
          "nombre": "Tipo de Solicitudes",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": false
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tipo_motivo",
          "nombre": "Tipo Motivo",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tipo_accion",
          "nombre": "Tipo Acción",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tipo_proceso",
          "nombre": "Tipo Proceso",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_tipo_ruta",
          "nombre": "Tipo Ruta",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_ruta",
          "nombre": "Ruta",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_accion",
          "nombre": "Acción",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "07",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "08",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_aprobadores_fijos",
          "nombre": "Aprobadores Fijos",
          "visualizar": true,
          "nuevo": true,
          "modificar": true,
          "eliminar": false,
          "exportar": true,
          "procesar": false,
          "consulta": true,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_crear_aprobador_fijo",
          "nombre": "Crear Aprobador Fijo",
          "visualizar": false,
          "nuevo": true,
          "modificar": false,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": false,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            }
          ]
        },
        {
          "codigo": "wf_editar_aprobador_fijo",
          "nombre": "Editar Aprobador Fijo",
          "visualizar": false,
          "nuevo": false,
          "modificar": true,
          "eliminar": false,
          "exportar": false,
          "procesar": false,
          "consulta": false,
          "controles": [
            {
              "codigo_Control": "01",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "02",
              "habilitar": true,
              "modificar": false,
              "visualizar": true
            },
            {
              "codigo_Control": "03",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "04",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "05",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            },
            {
              "codigo_Control": "06",
              "habilitar": true,
              "modificar": true,
              "visualizar": true
            }
          ]
        }
      ]
    ));
  }
}
