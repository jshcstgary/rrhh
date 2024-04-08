import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CamundaRestService } from "../../camunda-rest.service";
import { CompleteTaskComponent } from "../general/complete-task.component";
import {
  HttpClientModule,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { RegistrarData } from "src/app/eschemas/RegistrarData";
import { DatosProcesoInicio } from "src/app/eschemas/DatosProcesoInicio";

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

  public titulo: string = "Formulario De Registro";

  // Base model refers to the input at the beginning of BPMN
  // that is, Start Event
  public modelBase: DatosProcesoInicio;

  // scenario-1: task id and date are handled via tasklist page.
  public taskId: string = "";
  public date: any; // task date handled as query param

  // scenario-2: User starts new process instance and directly comes to fill Registrar user task.
  // This is a more likely scenario.
  // In this case, parent flag is set to true. It requires additional handling to derive task id from process instance id.
  public parentIdFlag: string | null = "false"; // set to true if the id is for the process instance, instead of task-id

  constructor(
    route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService
  ) {
    super(route, router, camundaRestService);

    this.modelBase = new DatosProcesoInicio();

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
      console.log();
      const variableNames = Object.keys(this.model).join(",");

      if ("true" === this.parentIdFlag) {
        // id is parent process instance id. so handle it accordingly
        // we are looking for task id 'Registrar' in a recently started process instance 'id'
        // Comentado tveas por error CORS
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
      // Comentado tveas por error CORS
      /*this.loadExistingVariables(
        this.uniqueTaskId ? this.uniqueTaskId : "",
        variableNames
      );*/
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
  }

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
