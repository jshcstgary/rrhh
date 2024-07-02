import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, map } from "rxjs";
import { AprobadorFijo } from "src/app/eschemas/AprobadorFijo";
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
      let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();

      this.modelo = datosEmpleado;
      console.log(this.modelo);

      // this.model = {
      //   codigo
      //   idEmpresa
      //   compania
      //   departamento
      //   nombreCargo
      //   nomCCosto
      //   codigoPosicion
      //   descrPosicion
      //   codigoPuesto
      //   descrPuesto
      //   fechaIngresogrupo
      //   grupoPago
      //   reportaA
      //   localidad
      //   nivelDir
      //   descrNivelDir
      //   nivelRepa
      //   nombreCompleto
      //   subledger
      //   sucursal
      //   unidadNegocio
      //   tipoContrato
      //   descripContrato
      //   sueldo
      //   sueldoVariableMensual
      //   sueldoVariableTrimestral
      //   sueldoVariableSemestral
      //   sueldoVariableAnual
      //   codigoPosicionReportaA
      //   status
      // };

      // this.modelo.iD_APROBADOR = 1;
      // this.modelo.niveL_DIRECCION = "Gerente de RRHH Corporativo";
      // this.modelo.codigO_POSICION = datosEmpleado.codigoPosicion;
      // this.modelo.subleger = datosEmpleado.subledger;
      // this.modelo.nombre = datosEmpleado.nombreCompleto;
      // this.modelo.codigO_POSICION_REPORTA_A = "N/A";
      // this.modelo.reportA_A = datosEmpleado.reportaA;
      // this.modelo.estado = true;
      // this.modelo.fechA_CREACION = fechaEnFormatoISO;
      // this.modelo.fechA_MODIFICACION = fechaEnFormatoISO;
      // this.modelo.usuariO_CREACION = fechaEnFormatoISO;
      // this.modelo.usuariO_MODIFICACION = fechaEnFormatoISO;
      // this.modelo.descripcioN_POSICION = datosEmpleado.descrPosicion;
      // this.modelo.supervisA_A = "N/A";
      // this.modelo.niveL_REPORTE = datosEmpleado.nivelReporte;
      // this.modelo.correo = datosEmpleado.correo
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
        console.log(response.evType);

        this.dataEmpleadoEvolution = response.evType;
        console.log(this.dataEmpleadoEvolution);

        // let fechaActual = new Date();
        // let fechaEnFormatoISO = fechaActual.toISOString();

        // this.modelo = {
        //     codigo: response.evType.codigo,
        //     idEmpresa: response.evType.idEmpresa,
        //     compania: response.evType.compania,
        //     departamento: response.evType.departamento,
        //     nombreCargo: response.evType.nombreCargo,
        //     nomCCosto: response.evType.nomCCosto,
        //     codigoPosicion: response.evType.codigoPosicion,
        //     descrPosicion: response.evType.descrPosicion,
        //     codigoPuesto: response.evType.codigoPuesto,
        //     descrPuesto: response.evType.descrPuesto,
        //     fechaIngresogrupo: response.evType.fechaIngresogrupo,
        //     grupoPago: response.evType.grupoPago,
        //     reportaA: response.evType.reportaA,
        //     localidad: response.evType.localidad,
        //     nivelDir: response.evType.nivelDir,
        //     descrNivelDir: response.evType.descrNivelDir,
        //     nivelRepa: response.evType.nivelRepa,
        //     nombreCompleto: response.evType.nombreCompleto,
        //     subledger: response.evType.subledger,
        //     sucursal: response.evType.sucursal,
        //     unidadNegocio: response.evType.unidadNegocio,
        //     tipoContrato: response.evType.tipoContrato,
        //     descripContrato: response.evType.descripContrato,
        //     sueldo: response.evType.sueldo,
        //     sueldoVariableMensual: response.evType.sueldoVariableMensual,
        //     sueldoVariableTrimestral: response.evType.sueldoVariableTrimestral,
        //     sueldoVariableSemestral: response.evType.sueldoVariableSemestral,
        //     sueldoVariableAnual: response.evType.sueldoVariableAnual,
        //     codigoPosicionReportaA: response.evType.codigoPosicionReportaA,
        //     status: response.evType.status,
        // };

        // this.modelo.iD_APROBADOR = 1;
        // this.modelo.niveL_DIRECCION = "Gerente de RRHH Corporativo";
        // this.modelo.codigO_POSICION = this.dataEmpleadoEvolution[0].codigoPosicion;
        // this.modelo.subleger = this.dataEmpleadoEvolution[0].subledger;
        // this.modelo.nombre = this.dataEmpleadoEvolution[0].nombreCompleto;
        // this.modelo.codigO_POSICION_REPORTA_A = "N/A";
        // this.modelo.reportA_A = this.dataEmpleadoEvolution[0].reportaA;
        // this.modelo.estado = true;
        // this.modelo.fechA_CREACION = fechaEnFormatoISO;
        // this.modelo.fechA_MODIFICACION = fechaEnFormatoISO;
        // this.modelo.usuariO_CREACION = fechaEnFormatoISO;
        // this.modelo.usuariO_MODIFICACION = fechaEnFormatoISO;
        // this.modelo.descripcioN_POSICION = this.dataEmpleadoEvolution[0].descrPosicion;
        // this.modelo.supervisA_A = "N/A";
        // this.modelo.niveL_REPORTE = this.dataEmpleadoEvolution[0].nivelReporte;
        // this.modelo.correo = this.dataEmpleadoEvolution[0].correo

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
