import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, map } from "rxjs";
import {
  EvType,
  IEmpleadoData,
  IEmpleados,
} from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-dialog-buscar-empleados-reingreso",
  templateUrl: "./dialog-buscar-empleados-reingreso.component.html",
  styleUrls: ["./dialog-buscar-empleados-reingreso.component.scss"]
})
export class DialogBuscarEmpleadosReingresoComponent {
  activeModal = inject(NgbActiveModal);

  // modelo: EvType;
  modelo: EvType = {
    codigo: "",
    idEmpresa: "",
    compania: "",
    departamento: "",
    nombreCargo: "",
    nomCCosto: "",
    codigoPosicion: "",
    descrPosicion: "",
    codigoPuesto: "",
    descrPuesto: "",
    fechaIngresogrupo: new Date(),
    grupoPago: "",
    reportaA: "",
    localidad: "",
    nivelDir: "",
    descrNivelDir: "",
    nivelRepa: "",
    nombreCompleto: "",
    subledger: "",
    sucursal: "",
    unidadNegocio: "",
    tipoContrato: "",
    descripContrato: "",
    sueldo: "",
    sueldoVariableMensual: "",
    sueldoVariableTrimestral: "",
    sueldoVariableSemestral: "",
    sueldoVariableAnual: "",
    codigoPosicionReportaA: "",
    status: ""
  };


  disableButton: boolean = true;

  searchInp: string;
  fields = <IEmpleadoData>{
    nombreCompleto: "",
    subledger: "",
  };

  nombresEmpleados: string[] = [];
  eventSearch = {
    item: ""
  };

  public dataEmpleadoEvolution: any[] = [];

  constructor(private mantenimientoService: MantenimientoService, private utilService: UtilService) {}

  onClose() {
    this.activeModal.close({
      action: "cerrar",
    });
  }

  clearModel() {
    this.modelo = {
      codigo: "",
      idEmpresa: "",
      compania: "",
      departamento: "",
      nombreCargo: "",
      nomCCosto: "",
      codigoPosicion: "",
      descrPosicion: "",
      codigoPuesto: "",
      descrPuesto: "",
      fechaIngresogrupo: new Date(),
      grupoPago: "",
      reportaA: "",
      localidad: "",
      nivelDir: "",
      descrNivelDir: "",
      nivelRepa: "",
      nombreCompleto: "",
      subledger: "",
      sucursal: "",
      unidadNegocio: "",
      tipoContrato: "",
      descripContrato: "",
      sueldo: "",
      sueldoVariableMensual: "",
      sueldoVariableTrimestral: "",
      sueldoVariableSemestral: "",
      sueldoVariableAnual: "",
      codigoPosicionReportaA: "",
      status: ""
    };

    this.disableButton = true;
  }

  onSelectItem(campo: string, event) {
    let valor = event.item;

    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });

    if (datosEmpleado) {
      let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();

      this.modelo = datosEmpleado;
      this.searchInp = datosEmpleado.nombreCompleto;
    } else {
      // this.model.reset();
      let tempSearch = valor;
      this.clearModel();
      if (campo == "codigoPosicion") {
        this.modelo.codigoPosicion = tempSearch;
      } else if (campo == "subledger") {
        this.modelo.subledger = tempSearch;
      } else if (campo == "nombreCompleto") {
        this.modelo.nombreCompleto = tempSearch;
      }
    }
  }

  onSeleccionar(fields: IEmpleadoData) {
    this.activeModal.close({
      data: fields,
      action: "seleccionar",
    });
  }

  onEnter(search: string): void {
    this.mantenimientoService
      .getDataEmpleadosEvolution("ev")
      .pipe(
        map(this.buscarValor.bind(this, search, "evType")),
        catchError((error) => {
          return this.mantenimientoService
            .getDataEmpleadosEvolution("jaff")
            .pipe(map(this.buscarValor.bind(this, search, "jaffType")));
        })
      )
      .subscribe({
        next: (data) => {
          this.fields = data as IEmpleadoData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  searchNombreCompleto: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 1 ? [] : this.nombresEmpleados.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  buscarValor = (search, type: "jaffType" | "evType", data: IEmpleados) => {
    const result = data?.[type].find((item) => {
      const regex = new RegExp(search, "i");
      return item.nombreCompleto.match(regex);
    });
    if (!result) {
      throw new Error("No se encontró el valor esperado");
    }
    return result;
  };

  getDataEmpleadosEvolution() {
    return this.mantenimientoService.getDataExEmpleadosEvolution(this.searchInp, "E").subscribe({
      next: (response) => {
        if (response.empleadosRBP.length === 0) {
          Swal.fire({
            text: "No se encontró registro",
            icon: "info",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Sí",
          });

          this.clearModel();

          return;
        }

        // this.dataEmpleadoEvolution = response.evType;
        this.dataEmpleadoEvolution = response.empleadosRBP;

        this.nombresEmpleados = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];
        this.eventSearch.item=this.dataEmpleadoEvolution[0].nombreCompleto;
        this.onSelectItem('nombreCompleto',this.eventSearch);
        this.disableButton = false;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }
}
