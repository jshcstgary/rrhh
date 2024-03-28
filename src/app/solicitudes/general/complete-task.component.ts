import { CamundaRestService } from '../../camunda-rest.service';
import { ActivatedRoute, Router } from '@angular/router';

export class CompleteTaskComponent {
  model : any
  submitted : boolean = false
  uniqueTaskId : string | null
  errorMessage : string | null
  route: ActivatedRoute
  router: Router
  camundaRestService: CamundaRestService

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    ) {
      this.route = route;
      this.router = router;
      this.camundaRestService = camundaRestService;
      this.uniqueTaskId = null;
      this.errorMessage = null;
  }

  loadExistingVariables(taskId: String, variableNames: String) {
    this.camundaRestService.getVariablesForTask(taskId, variableNames).subscribe((result) => {
      this.generateModelFromVariables(result);
    });
  }
  generateModelFromVariables(variables: { [x: string]: { value: any; }; }) {
    Object.keys(variables).forEach((variableName) => {
      this.model[variableName] = variables[variableName].value;
    });
  }
  generateVariablesFromFormFields() {
    const variables = {
      variables:  {}
    };
    Object.keys(this.model).forEach((field) => {
      // TODO - need to change this logic. angular compiler is throwing an error
      // variables.variables[field] = {  value: this.model[field] };
    });

    return variables;
  }
}
