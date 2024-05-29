import { Injectable, Type } from "@angular/core";
import { Observable, catchError, tap, of } from "rxjs";
import { DefinicionProceso } from "./eschemas/DefinicionProceso";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Task } from "./eschemas/Task";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class CamundaRestService {
  private engineRestUrl = environment.camundaUrl + "engine-rest/";

  constructor(private http: HttpClient) {}

  //metodos de registro y tareas
  getTasks(): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => this.log(`fetched tasks`)),
      catchError(this.handleError("getTasks", []))
    );
  }

  getTasksOfType(type: String): Observable<Task[]> {
    const endpoint =
      `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=50&taskDefinitionKey=` +
      type;
    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => this.log(`fetched tasks of type`)),
      catchError(this.handleError("getTasksOfType", []))
    );
  }

  // custom work - input has two params
  // task name from the BPMN process def
  // process instance id
  getTask(type: String, processInstanceId: String): Observable<Task[]> {
    const endpoint =
      `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=1` +
      `&processInstanceId=` +
      processInstanceId +
      `&taskDefinitionKey=` +
      type;

    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => this.log(`fetched tasks of type`)),
      catchError(this.handleError("getTask", []))
    );
  }

  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap((form) => this.log(`fetched taskform`)),
      catchError(this.handleError("getTaskFormKey", []))
    );
  }

  getVariablesForTask(taskId: String, variableNames: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables?variables=${variableNames}`;

    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => {
        this.log(`fetched variables`);
        this.log(form);
      }),
      catchError(this.handleError("getVariablesForTask", []))
    );
  }

  getVariablesForTaskLevelAprove(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables`;

    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => {
        this.log(`fetched variables`);
        this.log(form);
      }),
      catchError(this.handleError("getVariablesForTask", []))
    );
  }

  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;

    return this.http.post<any>(endpoint, variables, httpOptions).pipe(
      tap((tasks) => this.log(`posted complete task`)),
      catchError(this.handleError("postCompleteTask", []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey: any): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap((form) => this.log(`fetched formkey`)),
      catchError(this.handleError("getProcessDeifnitionFormKey", []))
    );
  }

  //fin de registro y tareas

  private ManejoErrores<T>(operacion = "operacion", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operacion} fallida: ${error.message}`);

      return of(error as T);
    };
  }

  public getUrl(): string {
    return this.engineRestUrl;
  }

  private log(message: string) {}

  //Definir los procesos que estan activos
  getProcessDefinitions(): Observable<DefinicionProceso[]> {
    return this.http
      .get<DefinicionProceso[]>(
        this.engineRestUrl + "process-definition?latestVersion=true",
        httpOptions
      )
      .pipe(
        tap((processDefinition) => this.log(`fetched processDefinitions`)),
        catchError(this.ManejoErrores(`getProcessDefinitions`, []))
      );
  }

  //Crea el proceso de Instancia
  postProcessInstance(
    processDefinitionKey: string,
    variables: any
  ): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables, httpOptions).pipe(
      tap((processDifinitions) => this.log(`posted process instance`)),
      catchError(this.ManejoErrores(`postProcessInstance`, []))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} fallida: ${error.message}`);
      return of(error as T);
    };
  }
}
