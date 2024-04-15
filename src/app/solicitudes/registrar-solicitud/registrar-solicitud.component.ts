import { SolicitudesService } from "./solicitudes.service";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import {
  HttpClientModule,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";
import { DatosSolicitud } from "src/app/eschemas/DatosSolicitud";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";

@Component({
  selector: "registrarSolicitud",
  templateUrl: "./registrar-solicitud.component.html",
  styleUrls: [],
  providers: [CamundaRestService, HttpClientModule],
  exportAs: "registrarSolicitud",
})
export class RegistrarSolicitudComponent extends CompleteTaskComponent {
  NgForm = NgForm;

  override model: RegistrarData = new RegistrarData(
    "123",
    "Description",
    0,
    "Observations"
  );

  public solicitud = new Solicitud();

  public detalleSolicitud = new DetalleSolicitud();

  public titulo: string = "Formulario De Registro";

  // Base model refers to the input at the beginning of BPMN
  // that is, Start Event
  public modelBase: DatosProcesoInicio;

  public modelSolicitud: DatosSolicitud;

  public dataSolicitudModel: any;

  // scenario-1: task id and date are handled via tasklist page.
  public taskId: string = "";
  public date: any; // task date handled as query param

  // scenario-2: User starts new process instance and directly comes to fill Registrar user task.
  // This is a more likely scenario.
  // In this case, parent flag is set to true. It requires additional handling to derive task id from process instance id.
  public parentIdFlag: string | null = "false"; // set to true if the id is for the process instance, instead of task-id

  public dataTipoSolicitud: any;
  public dataTipoMotivo: any;
  public dataTipoAccion: any;
  public success: false;
  public params: any;
  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    private mantenimientoService: MantenimientoService,
    private solicitudes: SolicitudesService,
    private utilService: UtilService
  ) {
    super(route, router, camundaRestService);

    this.modelBase = new DatosProcesoInicio();

    this.route.queryParams.subscribe((params: Solicitud) => {
      console.log("ESTOS SON LOS PARAMS: ", params);
      console.log(
        "ESTOS SON LOS PARMAS COMPARTIDOS: ",
        this.solicitudes.modelSolicitud
      );
      // this.solicitud = params;

      this.solicitud = this.solicitudes.modelSolicitud;
      this.detalleSolicitud = this.solicitudes.modelDetalleSolicitud;
      this.detalleSolicitud.idSolicitud = this.solicitud.idSolicitud;

      /*this.solicitud.infoGeneral.idTipoSolicitud = this.dataTipoSolicitud.id;
      this.solicitud.infoGeneral.tipoSolicitud =
        this.dataTipoSolicitud.tipoSolicitud;
      this.solicitud.request.idTipoSolicitud = this.dataTipoSolicitud.id;
      this.solicitud.request.tipoSolicitud =
        this.dataTipoSolicitud.tipoSolicitud;

      this.solicitud.infoGeneral.idTipoMotivo = this.dataTipoMotivo.id;
      this.solicitud.infoGeneral.tipoMotivo = this.dataTipoMotivo.tipoMotivo;
      this.solicitud.request.idTipoMotivo = this.dataTipoMotivo.id;

      this.solicitud.infoGeneral.idTipoAccion = this.dataTipoAccion.id;
      this.solicitud.infoGeneral.tipoAccion = this.dataTipoAccion.tipoAccion;
      this.solicitud.request.idTipoAccion = this.dataTipoAccion.id;
      this.solicitud.request.tipoAccion = this.dataTipoAccion.tipoAccion;*/
    });

    this.route.queryParamMap.subscribe((qParams) => {
      if (null !== qParams?.get("date")) {
        this.date = qParams.get("date");
      } else {
        this.date = "";
      }

      if (null !== qParams?.get("p")) {
        this.parentIdFlag = qParams.get("p");
      }
    });

    this.route.params.subscribe((params) => {
      const variableNames = Object.keys(this.model).join(",");

      if ("true" === this.parentIdFlag) {
        // id is parent process instance id. so handle it accordingly
        // we are looking for task id 'Registrar' in a recently started process instance 'id'
        // Comentado tveas por error
        /*this.camundaRestService
          .getTask(environment.taskType_Registrar, params["id"])
          .subscribe((result) => {
            this.lookForError(result); // if error, then control gets redirected to err page

            // if result is success - bingo, we got the task id
            this.uniqueTaskId = result[0].id;
            this.taskId = params["id"];
            this.date = result[0].created;
          });*/
      } else {
        // unique id is from the route params
        this.uniqueTaskId = params["id"];
        this.taskId = params["id"];
      }

      // ready to do the processing now
      // Comentado tveas por error
      /*this.loadExistingVariables(
        this.uniqueTaskId ? this.uniqueTaskId : "",
        variableNames
      );*/
    });
  }

  ngOnInit() {
    this.getSolicitudes();
    this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioTipoAccion();
  }

  ObtenerServicioTipoSolicitud() {
    return this.mantenimientoService.getTipoSolicitud().subscribe({
      next: (response: any) => {
        console.log(
          "AQUII ObtenerServicioTipoSolicitud: ",
          response.tipoSolicitudType
        );
        console.log(
          "AQUII this.solicitud.infoGeneral.idTipoSolicitud: ",
          this.solicitud.idTipoSolicitud
        );
        console.log("ES UNDEFINED?: ", this.solicitud);
        this.dataTipoSolicitud = response.tipoSolicitudType.filter(
          (data) => data.id == this.solicitud.idTipoSolicitud
        )[0];
        console.log("this.dataTipoSolicitud: ", this.dataTipoSolicitud);
        this.solicitud.idTipoSolicitud = this.dataTipoSolicitud.id;
        this.solicitud.tipoSolicitud = this.dataTipoSolicitud.tipoSolicitud;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoMotivo() {
    return this.mantenimientoService.getTipoMotivo().subscribe({
      next: (response) => {
        console.log("AQUII ObtenerServicioTipoMotivo: ", response);
        this.dataTipoMotivo = response.filter(
          (data) => data.id == this.solicitud.idTipoMotivo
        )[0];

        this.solicitud.idTipoMotivo = this.dataTipoMotivo.id;
        this.solicitud.tipoMotivo = this.dataTipoMotivo.tipoMotivo;
        // this.solicitud.request.tipoMotivo = this.dataTipoMotivo.tipoMotivo;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoAccion() {
    return this.mantenimientoService.getTipoAccion().subscribe({
      next: (response) => {
        console.log("AQUII ObtenerServicioTipoAccion: ", response);
        this.dataTipoAccion = response.filter(
          (data) => data.id == this.solicitud.idTipoAccion
        )[0];
        this.solicitud.idTipoAccion = this.dataTipoAccion.id;
        this.solicitud.tipoAccion = this.dataTipoAccion.tipoAccion;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  // Prueba servicio
  getSolicitudes() {
    this.solicitudes.getSolicitudes().subscribe((data) => {});
  }

  guardarSolicitud() {
    const id = Date.now().toString().slice(-6);

    let requestSolicitud = {
      idSolicitud: "RP-" + id,
      idInstancia: "InstanciaReybanpac",
      idEmpresa: "01",
      empresa: "Reybanpac",
      idUnidadNegocio: "02",
      unidadNegocio: "Banano",
      estadoSolicitud: "2",
      idTipoSolicitud: this.dataTipoSolicitud.id,
      tipoSolicitud: "string upt",
      idTipoMotivo: this.dataTipoMotivo.id,
      tipoMotivo: "TIPO MOTIVO 01",
      idTipoAccion: 1,
      tipoAccion: "Aumento",
      fechaActualizacion: "2024-03-27T20:48:24.177",
      fechaCreacion: "2024-03-27T20:48:24.177",
      usuarioCreacion: "lnmora",
      usuarioActualizacion: "lnmora",
      estado: "En Espera",
    };

    this.solicitudes
      .guardarSolicitud(requestSolicitud)
      .subscribe((response) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
      });
  }

  override loadExistingVariables(taskId: String, variableNames: String) {
    console.log("load existing variables ...", taskId);

    this.camundaRestService
      .getVariablesForTask(taskId, variableNames)
      .subscribe((result) => {
        this.lookForError(result);

        this.generateModelFromVariables(result);
      });
  }

  override generateModelFromVariables(variables: {
    [x: string]: { value: any };
  }) {
    Object.keys(variables).forEach((variableName) => {
      switch (variableName) {
        case "tipo_cumplimiento":
          console.log(
            "set tipo_cumplimiento = ",
            variables[variableName].value
          );
          this.modelBase.tipo_cumplimiento = variables[variableName].value;
          break;

        case "tipo_solicitud":
          console.log("set tipo_solicitud = ", variables[variableName].value);
          this.modelBase.tipo_solicitud = variables[variableName].value;
          break;

        case "tipo_motivo":
          console.log("set tipo_motivo = ", variables[variableName].value);
          this.modelBase.tipo_motivo = variables[variableName].value;
          break;
      }
    });
  }

  // Handle any errors that may be present.
  lookForError(result: any): void {
    if (result.error !== undefined && result.error !== null) {
      console.log("routing to app error page ", result.error.message);
      // error while loading task. handle it by redirecting to error page
      this.errorMessage = result.error.message;
      this.router.navigate(["error"], {
        queryParams: { message: result.error.message },
      });
    }
  }

  onSubmit() {
    Swal.fire({
      text: "¿Desea crear la Solicitud?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(227, 199, 22)",
      cancelButtonColor: "#77797a",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.save();

        if (this.submitted) {
          this.router.navigate(["/solicitudes/consulta-solicitudes"]);
        }

        //Fin Solicitud
      }
    });
  }

  save() {
    const id = Date.now().toString().slice(-6);
    /*this.solicitudes
      .guardarSolicitud(this.solicitud.request)
      .subscribe((response) => {
        let detalleSolicitud = {
          idDetalleSolicitud: id,
          idSolicitud: response.idSolicitud,
          codigo: "Prueba",
          valor: "Prueba",
          estado: "A",
          fechaRegistro: "2024-03-27T20:57:04.34",
          compania: "Prueba",
          unidadNegocio: "Prueba",
          codigoPosicion: "Prueba",
          descripcionPosicion: "Prueba",
          areaDepartamento: "Prueba",
          localidadZona: "Prueba",
          nivelDireccion: "Prueba",
          centroCosto: "Prueba",
          nombreEmpleado: "Morocho Vargas Gal Estuario",
          subledger: "Prueba",
          reportaA: "Prueba",
          nivelReporteA: "Prueba",
          supervisaA: "Prueba",
          tipoContrato: "Prueba",
          departamento: "Prueba",
          cargo: "Prueba",
          jefeSolicitante: "Prueba",
          responsableRRHH: "Prueba",
          localidad: "Prueba",
          fechaIngreso: "2024-03-27T20:57:04.34",
          unidad: "Prueba",
          puesto: "Prueba",
          jefeInmediatoSuperior: "Prueba",
          jefeReferencia: "Prueba",
          cargoReferencia: "Prueba",
          fechaSalida: "2024-03-27T20:57:04.34",
          puestoJefeInmediato: "Prueba",
          subledgerEmpleado: "Prueba",
          grupoDePago: "Prueba",
          sucursal: "Prueba",
          movilizacion: "Prueba",
          alimentacion: "Prueba",
          jefeAnteriorJefeReferencia: "Prueba",
          causaSalida: "Prueba",
          nombreJefeSolicitante: "Prueba",
          misionCargo: "Prueba",
          justificacion: "Prueba",
        };
        this.solicitudes
          .guardarDetalleSolicitud(detalleSolicitud)
          .subscribe((res) => {
            this.utilService.modalResponse(
              "Datos ingresados correctamente",
              "success"
            );
            setTimeout(() => {
              this.router.navigate(["/solicitudes/consulta-solicitudes"]);
            }, 1600);
          });
      });*/

    let detalleSolicitud = {
      idDetalleSolicitud: id,
      idSolicitud: this.solicitud.idSolicitud,
      codigo: "Prueba",
      valor: "Prueba",
      estado: "A",
      fechaRegistro: "2024-03-27T20:57:04.34",
      compania: "Prueba",
      unidadNegocio: "Prueba",
      codigoPosicion: "Prueba",
      descripcionPosicion: "Prueba",
      areaDepartamento: "Prueba",
      localidadZona: "Prueba",
      nivelDireccion: "Prueba",
      centroCosto: "Prueba",
      nombreEmpleado: "Morocho Vargas Gal Estuario",
      subledger: "Prueba",
      reportaA: "Prueba",
      nivelReporteA: "Prueba",
      supervisaA: "Prueba",
      tipoContrato: "Prueba",
      departamento: "Prueba",
      cargo: "Prueba",
      jefeSolicitante: "Prueba",
      responsableRRHH: "Prueba",
      localidad: "Prueba",
      fechaIngreso: "2024-03-27T20:57:04.34",
      unidad: "Prueba",
      puesto: "Prueba",
      jefeInmediatoSuperior: "Prueba",
      jefeReferencia: "Prueba",
      cargoReferencia: "Prueba",
      fechaSalida: "2024-03-27T20:57:04.34",
      puestoJefeInmediato: "Prueba",
      subledgerEmpleado: "Prueba",
      grupoDePago: "Prueba",
      sucursal: "Prueba",
      movilizacion: "Prueba",
      alimentacion: "Prueba",
      jefeAnteriorJefeReferencia: "Prueba",
      causaSalida: "Prueba",
      nombreJefeSolicitante: "Prueba",
      misionCargo: "Prueba",
      justificacion: "Prueba",
    };

    this.solicitudes
      .guardarDetalleSolicitud(this.solicitudes.modelDetalleSolicitud)
      .subscribe((res) => {
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
        setTimeout(() => {
          this.router.navigate(["/solicitudes/consulta-solicitudes"]);
        }, 1600);
      });

    /*const id = Date.now().toString().slice(-6);
    console.log(id);

    let requestSolicitud = {
      idSolicitud: "RP-" + id,
      idInstancia: "InstanciaReybanpac",
      idEmpresa: "01",
      empresa: "Reybanpac",
      idUnidadNegocio: "02",
      unidadNegocio: "Banano",
      estadoSolicitud: "2",
      idTipoSolicitud: this.dataTipoSolicitud.id,
      tipoSolicitud: "string upt",
      idTipoMotivo: this.dataTipoMotivo.id,
      tipoMotivo: "TIPO MOTIVO 01",
      idTipoAccion: 1,
      tipoAccion: "Aumento",
      fechaActualizacion: "2024-03-27T20:48:24.177",
      fechaCreacion: "2024-03-27T20:48:24.177",
      usuarioCreacion: "lnmora",
      usuarioActualizacion: "lnmora",
      estado: "En Espera",
    };
    console.log("SOLICITUD: ", requestSolicitud);
    console.log("MODEL: ", this.solicitud.request);

    this.solicitudes
      .guardarSolicitud(requestSolicitud)
      .subscribe((response) => {
        console.log("Ejecutando guardarSolicitud(): ", response);
        this.utilService.modalResponse(
          "Datos ingresados correctamente",
          "success"
        );
      });*/
  }

  // tveas comentando método mmunoz
  /*onSubmit() {
    if (this.uniqueTaskId === null) {
      //handle this as an error
      this.errorMessage =
        "Unique Task id is empty. Cannot initiate task complete.";
      console.error(this.errorMessage);
      return;
    }

    const variables = this.generateVariablesFromFormFields();
    // basis of completeing the task using the unique id
    this.camundaRestService
      .postCompleteTask(this.uniqueTaskId, variables)
      .subscribe();
    this.submitted = true;
  }*/

  onCancel() {
    console.log("User action cancel");
    // mmunoz
    // this.router.navigate(["tasklist/Registrar"], { queryParams: {} });
    this.router.navigate(["solicitudes/consulta-solicitudes"], {
      queryParams: {},
    });
  }

  override generateVariablesFromFormFields() {
    const variables = {
      variables: {
        codigo: { value: "" },
        description: { value: "" },
        importe: { value: 0 },
        observations: { value: new String() },
      },
    };

    variables.variables["codigo"].value = this.model.codigo;
    variables.variables["description"].value = this.model.description;
    variables.variables["importe"].value = this.model.importe;
    variables.variables["observations"].value = this.model.observations;

    return variables;
  }
}
