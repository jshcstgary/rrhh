import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from "rxjs";
import {
	EvType,
	IEmpleadoData,
	IEmpleados,
} from "src/app/services/mantenimiento/empleado.interface";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-dialog-buscar-empleados-familiares",
  templateUrl: "./dialog-buscar-empleados-familiares.component.html",
  styleUrls: ["./dialog-buscar-empleados-familiares.component.scss"]
})
export class DialogBuscarEmpleadosFamiliaresComponent {
  activeModal = inject(NgbActiveModal);

  searchInp: string;
  fields = <IEmpleadoData>{
    nombreCompleto: "",
    fechaIngresogrupo: null,
    nombreCargo: "",
    unidadNegocio: "",
    departamento: "",
    localidad: "",
  };

  modelo: EvType;

  disableButton: boolean = true;

  public dataEmpleadoEvolution: any[] = [];

  nombresEmpleados: string[] = [];
  eventSearch = {
    item: ""
  };

  constructor(private mantenimientoService: MantenimientoService, private utilService: UtilService) { }

  ngOnInit() {
    this.clearModel();
  }

  getFormattedDate(dateValue: Date): string {
    const date: Date = new Date(dateValue);

    const day = date.getDate().toString().padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  onClose() {
    this.activeModal.close({
      action: "cerrar",
    });
  }

  onSeleccionar(fields: IEmpleadoData) {
    this.activeModal.close({
      data: fields,
      action: "seleccionar",
    });
  }

  // onEnter(search: string): void {
  //   this.mantenimientoService.getDataEmpleadosEvolution("ev")
  //     .pipe(
  //       map(this.buscarValor.bind(this, search, "evType")),
  //       catchError((error) => {
  //         return this.mantenimientoService
  //           .getDataEmpleadosEvolution("jaff")
  //           .pipe(map(this.buscarValor.bind(this, search, "jaffType")));
  //       })
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.fields = data as IEmpleadoData;
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  onSelectItem(campo: string, event) {
    let valor = event.item;

    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });

    if (datosEmpleado) {
      this.modelo = datosEmpleado;
      this.searchInp = datosEmpleado.nombreCompleto;
    } else {
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

  searchNombreCompleto: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 1 ? [] : this.nombresEmpleados.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

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

  getDataEmpleadosEvolution(tipo: string) {
    return this.mantenimientoService.getDataEmpleadosEvolutionPorId(this.searchInp).subscribe({
      next: (response) => {
        console.log(response);
        if (response.evType.length === 0) {
          Swal.fire({
            text: "No se encontró registro",
            icon: "info",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Sí",
          });

          this.clearModel();

          return;
        }

        this.dataEmpleadoEvolution = response.evType;
        this.eventSearch.item=this.dataEmpleadoEvolution[0].nombreCompleto;
        this.onSelectItem('nombreCompleto',this.eventSearch);

        this.nombresEmpleados = [...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto))];

        this.disableButton = false;
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

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
}
