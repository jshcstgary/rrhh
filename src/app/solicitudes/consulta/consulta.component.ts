import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { forkJoin, map } from "rxjs";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ConsultaSolicitudesData } from "./niveles-aprobacion.data";
import {
  IConsultaSolicitud,
  IConsultaSolicitudTable,
} from "./niveles-aprobacion.interface";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { TableService } from "src/app/component/table/table.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/services/util/util.service";
import { UtilData } from "src/app/services/util/util.data";
import { NivelesAprobacionService } from "./niveles-aprobacion.service";
import { DataFilterNivelesAprobacion } from "src/app/eschemas/DataFilterNivelesAprobacion";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SolicitudesService } from "../registrar-solicitud/solicitudes.service";
import {
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { CamundaRestService } from "src/app/camunda-rest.service";
import { DatosInstanciaProceso } from "src/app/eschemas/DatosInstanciaProceso";

@Component({
  selector: "app-consulta",
  templateUrl: "./consulta.component.html",
  styleUrls: ["./consulta.component.scss"],
})
export class ConsultaComponent implements OnInit {
  public columnsTable: IColumnsTable = ConsultaSolicitudesData.columns;
  public dataTable: any[] = [];
  // public tableInputsEditRow: IInputsComponent = ConsultaSolicitudesData.tableInputsEditRow;
  // public colsToFilterByText: string[] = ConsultaSolicitudesData.colsToFilterByText;
  public IdRowToClone: string = null;
  // public defaultEmptyRowTable: ITiporutaTable = ConsultaSolicitudesData.defaultEmptyRowTable;
  public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
  public hasFiltered: boolean = true;
  public dataFilterNivelesAprobacion = new DataFilterNivelesAprobacion();
  public dataTipoMotivo: any[] = [];
  public dataTipoSolicitudes: any[] = [];
  public dataNivelDireccion: any[] = [];
  active = 1;
  disabled = true;

  selected_empresa: number;
  selected_producto: number;
  selected_tipo_solicitud: number;
  selected_estado: number;

  data_empresas = [{ id: 1, name: "Reybanpac" }];

  data_productos = [{ id: 1, name: "Todos" }];

  model: NgbDateStruct;

  public data_estado: any[] = [];

  @ViewChild("myModalSolicitudes", { static: false })
  myModalSolicitudes: TemplateRef<any>;

  public submitted: boolean = false;

  isLoading = false;
  public solicitud = new Solicitud();
  public dataTipoAccion: any[] = [];
  public errorMessage: string;
  private instanceCreated: DatosInstanciaProceso;
  constructor(
    private nivelesAprobacionService: NivelesAprobacionService,
    private tableService: TableService,
    private route: ActivatedRoute,
    private validationsService: ValidationsService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService,
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private calendar: NgbCalendar,
    private camundaRestService: CamundaRestService,
    private modalService: NgbModal
  ) {
    this.model = calendar.getToday();
  }

  ngOnInit(): void {
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioTipoAccion();
    this.ObtenerServicioTipoMotivo();
    this.getDataToTable();
  }
  PageCrear() {
    this.router.navigate(["/solicitudes/crear-tipo-solicitud"]);
  }
  CrearSolicitud() {
    console.log("Nuevo proceso iniciado con datos..");
    Swal.fire({
      text: "¿Desea crear la Solicitud?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(227, 199, 22)",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      console.log("this.dataTipoSolicitudes: ", this.dataTipoSolicitudes);
      console.log("this.dataTipoMotivo: ", this.dataTipoMotivo);
      console.log("this.dataTipoAccion: ", this.dataTipoAccion);

      this.solicitud.tipoSolicitud = this.dataTipoSolicitudes.filter(
        (data) => data.id == this.solicitud.idTipoSolicitud
      )[0].descripcion;

      this.solicitud.tipoMotivo = this.dataTipoMotivo.filter(
        (data) => data.id == this.solicitud.idTipoMotivo
      )[0].descripcion;

      this.solicitud.tipoAccion = this.dataTipoAccion.filter(
        (data) => data.id == this.solicitud.idTipoAccion
      )[0].descripcion;

      console.log("MODELO ACTUALIZADO: ", this.solicitud);

      if (result.isConfirmed) {
        // Inicio de Solicitud
        // Comentado tveas por error
        this.route.params.subscribe((params) => {
          //const processDefinitionKey ="process_modelo";
          const processDefinitionKey = "RequisicionPersonal";
          //const processDefinitionKey = params['processdefinitionkey'];
          const variables = this.generatedVariablesFromFormFields();
          console.log(variables);
          this.camundaRestService
            .postProcessInstance(processDefinitionKey, variables)
            .subscribe((instanceOutput) => {
              this.lookForError(instanceOutput);

              console.log("Instance (instanceOutput): ", instanceOutput);
              this.instanceCreated = new DatosInstanciaProceso(
                instanceOutput.businessKey,
                instanceOutput.definitionId,
                instanceOutput.id,
                instanceOutput.tenantId
              );
              this.solicitud.idInstancia = instanceOutput.id;

              this.solicitudes
                .guardarSolicitud(this.solicitud)
                .subscribe((response) => {
                  this.solicitud.idSolicitud = response.idSolicitud;
                  this.solicitud.fechaActualizacion =
                    response.fechaActualizacion;
                  this.solicitud.fechaCreacion = response.fechaCreacion;
                  console.log(
                    "THIS IS THE MODEL FORM SERVICE 1: ",
                    this.solicitud
                  );
                  console.log(
                    "THIS IS THE MODEL FORM SERVICE 2: ",
                    this.solicitudes.modelSolicitud
                  );
                  console.log(
                    "THIS IS THE RESPONSE OF SAVE SOLICITUD: ",
                    response
                  );
                  setTimeout(() => {
                    this.router.navigate(["/solicitudes/registrar-solicitud"], {
                      queryParams: { ...this.solicitud },
                    });
                  }, 1600);
                  this.utilService.modalResponse(
                    "Datos ingresados correctamente",
                    "success"
                  );
                });
            });
        });

        if (this.submitted) {
          console.log("INGRESA EN this.submitted");

          // this.router.navigate(["/solicitudes/registrar-solicitud"]);
        }

        //Fin Solicitud
      }
    });
  }
  @HostListener("window:keydown", ["$event"])
  handleKeyUp(event: KeyboardEvent): void {
    // Verifica las teclas específicas que deseas activar
    if (event.altKey && event.key === "c") {
      // Ejecuta la acción que deseas realizar
      // this.activarOpcion(event.key);
      // this.PageCrear();
    }
  }
  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      this.errorMessage = result.message
        ? result.name + " " + result.message
        : result.error.message;
      console.log("routin to app error page", this.errorMessage);
      this.router.navigate(["error"], {
        queryParams: { message: this.errorMessage },
      });
    }
  }
  generatedVariablesFromFormFields() {
    return {
      variables: {
        tipo_solicitud: { value: this.solicitud.idTipoSolicitud },
        tipo_motivo: { value: this.solicitud.idTipoMotivo },
        tipo_cumplimiento: { value: this.solicitud.idTipoAccion },
      },
    };
  }
  ObtenerServicioEstado() {
    return this.mantenimientoService.getCatalogo("RBPEST").subscribe({
      next: (response) => {
        this.data_estado = response.itemCatalogoTypes.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  mostrarModalCrearSolicitudes() {
    this.submitted = false;
    this.modalService.open(this.myModalSolicitudes, {
      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        return true;
      },
    });
    this.isLoading = false;
  }

  getCreatedId() {
    /* if (
      this.instanceCreated &&
      this.instanceCreated.id != null &&
      this.instanceCreated.id != ""
    ) {
      return this.instanceCreated.id;
    }

    return "No se ha creado Id de Proceao";*/
  }

  filterDataTable() {
    console.log("EXECUTING filterDataTable()");
    console.log(
      "verifyFilterFields: ",
      this.dataFilterNivelesAprobacion.verifyFilterFields()
    );

    switch (this.dataFilterNivelesAprobacion.verifyFilterFields()) {
      case "case1":
        this.getDataToTable();
        break;
      case "case2":
        this.getDataToTable();
        break;
      case "case3":
        this.utilService.modalResponse(
          "Por favor complete los campos del filtro",
          "info"
        );
        break;
      case "case4":
        this.getDataToTableFilter();
        break;
    }
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.active = 1;
    }
  }

  getDataToTableFilter() {
    /*this.utilService.openLoadingSpinner(
      "Cargando información, espero por favor..."
    );
    console.log("FILTER DATA: ", this.dataFilterNivelesAprobacion);
    this.nivelesAprobacionService
      .filterNivelesAprobaciones(
        this.dataFilterNivelesAprobacion.tipoSolicitud,
        this.dataFilterNivelesAprobacion.tipoMotivo,
        this.dataFilterNivelesAprobacion.nivelDireccion
      )
      .subscribe({
        next: (response) => {
          console.log("filerDataTable: ", response);
          this.dataTable = response.nivelAprobacionType.map(
            (nivelAprobacionResponse) => ({
              ...nivelAprobacionResponse,
              estado: nivelAprobacionResponse.estado === "A",
            })
          );
          this.utilService.closeLoadingSpinner();
          console.log("Data de niveles de aprobacion: ", this.dataTable);
        },
        error: (error: HttpErrorResponse) => {
          console.log("error: ", error);
          this.dataTable = [];
          this.utilService.modalResponse(
            "No existen registros para esta búsqueda",
            "error"
          );
        },
      });*/
  }

  private getDataToTable() {
    const combinedData$ = forkJoin(
      this.solicitudes.getSolicitudes(),
      this.solicitudes.getDetalleSolicitud()
    ).pipe(
      map(([solicitudes, detallesSolicitud]) => {
        // Combinar las solicitudes y los detalles de la solicitud
        const data = solicitudes.solicitudType.map((solicitud) => {
          const detalles = detallesSolicitud.detalleSolicitudType.find(
            (detalle) => detalle.idSolicitud === solicitud.idSolicitud
          );
          return { ...solicitud, ...detalles };
        });

        // Ordenar la data por fechaCreacion de forma descendente
        return data.sort((a, b) => {
          return b.idDetalleSolicitud - a.idDetalleSolicitud;
        });
      })
    );

    combinedData$.subscribe((data) => {
      // Aquí tienes la data combinada y ordenada
      this.dataTable = data;
    });

    /*return this.solicitudes.getSolicitudes().subscribe({
      next: (response) => {
        this.dataTable = response.nivelAprobacionType.map((nivelAprobacionResponse=>({
          ...nivelAprobacionResponse,
          estado: nivelAprobacionResponse.estado === "A",
        })));
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });*/
  }

  ObtenerServicioTipoAccion() {
    return this.mantenimientoService.getTipoAccion().subscribe({
      next: (response) => {
        this.dataTipoAccion = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoAccion,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  //LLenar combo Tipo Solicitud
  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        this.dataTipoSolicitudes = response.tipoSolicitudType.map((r) => ({
          id: r.id,
          descripcion: r.tipoSolicitud,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion() {
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes.map((r) => ({
          ...r,
          id: r.id,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
      },

      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
  //dataTipoMotivo

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        this.dataTipoMotivo = response.map((r) => ({
          id: r.id,
          descripcion: r.tipoMotivo,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  pageCrear() {
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"]);
  }

  onRowActionClicked(id: string, key: string, tooltip: string, id_edit) {
    // Lógica cuando se da click en una acción de la fila
    console.log("EDTTTT: ", id_edit);
    this.router.navigate(["/mantenedores/crear-niveles-aprobacion"], {
      queryParams: { id_edit },
    });
  }
}
