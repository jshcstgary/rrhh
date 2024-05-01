import { CommonModule, NgFor } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgModel, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgSelectConfig, NgSelectModule } from "@ng-select/ng-select";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { UtilService } from "src/app/services/util/util.service";
import { CrearAprobadorFijoService } from "./crear-aprobador-fijo.service";
import Swal from "sweetalert2";
import { DatosNivelesAprobacion } from "src/app/eschemas/DatosNivelesAprobacion";
import { Subject, Observable, OperatorFunction } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { AprobadorFijo } from "src/app/eschemas/AprobadorFijo";

@Component({
  selector: "app-crear-aprobador-fijo",
  templateUrl: "./crear-aprobador-fijo.component.html",
  styleUrls: ["./crear-aprobador-fijo.component.scss"],
})
export class CrearAprobadorFijoComponent implements OnInit {
  public dataTipoSolicitudes: any[] = [];
  public dataTipoMotivo: any[] = [];
  public dataAccion: any[] = [];
  public dataRuta: any[] = [];
  public dataTipoRuta: any[] = [];
  public dataNivelDireccion: any[] = [];
  public dataNivelAprobacion: any[] = [];

  modeloSearch = { codigoPosicion: "", nombreCompleto: "", subledger: "" };

  modelo: AprobadorFijo = new AprobadorFijo();

  selected_tiposolicitud: number | string;
  selected_tipomotivo: number | string;
  selected_accion: number | string;
  selected_ruta: number | string;
  selected_tiporuta: number | string;
  selected_niveldir: number | string;
  selected_nivelaprob: number | string;
  public id_edit: undefined | number;

  public desactivarTipoMotivoYAccion = false;

  public restrictionsIds: any[] = ["3", "5", "6", 3, 5, 6];

  public tipoSolicitudSeleccionada: any;

  public tipoRutaSeleccionada: any;

  public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};
  public dataAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } = {};

  public dataRutasPorTipoRuta: { [idSolicitud: number]: any[] } = {};

  /*public dataEmpleadoEvolution: any[] = [
    {
      codigo: "CODIGO_1", //?
      idEmpresa: "ID_EMPRESA", //?
      compania: "Reybanpac", // Ok
      departamento: "Inventarios", //ok
      nombreCargo: "Jefatura", // ok
      nomCCosto: "Zona camarones", // ok
      codigoPosicion: "0425", //
      descrPosicion: "Analista de recursos humanos", //ok
      codigoPuesto: "CODIGO_PUESTO", //
      descrPuesto: "Gerencia media", //
      fechaIngresogrupo: "2024-04-15T12:08:34.473", //
      grupoPago: "GRUPO_PAGO", //
      reportaA: "Gerente RRHH", // ok
      localidad: "Hacienda", // ok
      nivelDir: "Tecnico/Asistencia", // ok
      descrNivelDir: "Tecnico descripcion", //
      nivelRepa: "Gerencia Medios", // Es esto nivel de reporte?
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO", //
      subledger: "60067579", // Ok
      sucursal: "SUSURSAL 1", //
      unidadNegocio: "UNIDAD NEGOCIO 1", //ok
      tipoContrato: "Eventual", // ok
      descripContrato: "Eventual con remuneracion mixta", //
      status: true,
    },
    {
      codigo: "CODIGO_2",
      idEmpresa: "ID_EMPRESA",
      compania: "Reybanpac",
      departamento: "Inventarios",
      nombreCargo: "Jefatura",
      nomCCosto: "Zona camarones",
      codigoPosicion: "0425",
      descrPosicion: "Analista de recursos humanos",
      codigoPuesto: "CODIGO_PUESTO",
      descrPuesto: "Gerencia media",
      fechaIngresogrupo: "2024-04-15T12:08:34.473",
      grupoPago: "GRUPO_PAGO",
      reportaA: "Gerente RRHH",
      localidad: "Hacienda",
      nivelDir: "Tecnico/Asistencia",
      descrNivelDir: "Tecnico descripcion",
      nivelRepa: "Gerencia Medios",
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
      subledger: "60067579",
      sucursal: "SUSURSAL 1",
      unidadNegocio: "UNIDAD NEGOCIO 1",
      tipoContrato: "Eventual",
      descripContrato: "Eventual con remuneracion mixta",
      status: true,
    },
    {
      codigo: "CODIGO_3",
      idEmpresa: "ID_EMPRESA",
      compania: "Reybanpac",
      departamento: "Inventarios",
      nombreCargo: "Jefatura",
      nomCCosto: "Zona camarones",
      codigoPosicion: "0425",
      descrPosicion: "Analista de recursos humanos",
      codigoPuesto: "CODIGO_PUESTO",
      descrPuesto: "Gerencia media",
      fechaIngresogrupo: "2024-04-15T12:08:34.473",
      grupoPago: "GRUPO_PAGO",
      reportaA: "Gerente RRHH",
      localidad: "Hacienda",
      nivelDir: "Tecnico/Asistencia",
      descrNivelDir: "Tecnico descripcion",
      nivelRepa: "Gerencia Medios",
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
      subledger: "60067579",
      sucursal: "SUSURSAL 1",
      unidadNegocio: "UNIDAD NEGOCIO 1",
      tipoContrato: "Eventual",
      descripContrato: "Eventual con remuneracion mixta",
      status: true,
    },
    {
      codigo: "CODIGO_4",
      idEmpresa: "ID_EMPRESA",
      compania: "Reybanpac",
      departamento: "Inventarios",
      nombreCargo: "Jefatura",
      nomCCosto: "Zona camarones",
      codigoPosicion: "0425",
      descrPosicion: "Analista de recursos humanos",
      codigoPuesto: "CODIGO_PUESTO",
      descrPuesto: "Gerencia media",
      fechaIngresogrupo: "2024-04-15T12:08:34.473",
      grupoPago: "GRUPO_PAGO",
      reportaA: "Gerente RRHH",
      localidad: "Hacienda",
      nivelDir: "Tecnico/Asistencia",
      descrNivelDir: "Tecnico descripcion",
      nivelRepa: "Gerencia Medios",
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
      subledger: "60067579",
      sucursal: "SUSURSAL 1",
      unidadNegocio: "UNIDAD NEGOCIO 1",
      tipoContrato: "Eventual",
      descripContrato: "Eventual con remuneracion mixta",
      status: true,
    },
    {
      codigo: "CODIGO_2",
      idEmpresa: "ID_EMPRESA",
      compania: "Reybanpac",
      departamento: "Inventarios",
      nombreCargo: "Gerencia de Proyectos",
      nomCCosto: "Zona camarones",
      codigoPosicion: "0426",
      descrPosicion: "Gerencia de Proyectos",
      codigoPuesto: "CODIGO_PUESTO",
      descrPuesto: "Gerencia media",
      fechaIngresogrupo: "2024-04-15T12:08:34.473",
      grupoPago: "GRUPO_PAGO",
      reportaA: "0427",
      localidad: "Hacienda",
      nivelDir: "Gerencia Media",
      descrNivelDir: "Gerencia Media",
      nivelRepa: "Gerencia Medios",
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
      subledger: "60067579",
      sucursal: "SUSURSAL 1",
      unidadNegocio: "UNIDAD NEGOCIO 1",
      tipoContrato: "Eventual",
      descripContrato: "Eventual con remuneracion mixta",
      status: true,
    },
  ];*/

  public dataEmpleadoEvolution: any[] = [];

  nombresEmpleados: string[] = [];

  subledgers: string[] = [];

  codigosPosicion: string[] = [];

  /*
  nombresEmpleados: string[] = [
    ...new Set(
      this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto)
    ),
  ];

  subledgers: string[] = [
    ...new Set(
      this.dataEmpleadoEvolution.map((empleado) => empleado.subledger)
    ),
  ];

  codigosPosicion: string[] = [
    ...new Set(
      this.dataEmpleadoEvolution.map((empleado) => empleado.codigoPosicion)
    ),
  ];
  */

  getDataEmpleadosEvolution() {
    return this.mantenimientoService.getDataEmpleadosEvolution().subscribe({
      next: (response) => {
        this.dataEmpleadoEvolution = response.evType;

        this.nombresEmpleados = [
          ...new Set(
            this.dataEmpleadoEvolution.map(
              (empleado) => empleado.nombreCompleto
            )
          ),
        ];

        this.subledgers = [
          ...new Set(
            this.dataEmpleadoEvolution.map((empleado) => empleado.subledger)
          ),
        ];

        this.codigosPosicion = [
          ...new Set(
            this.dataEmpleadoEvolution.map(
              (empleado) => empleado.codigoPosicion
            )
          ),
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  constructor(
    private config: NgSelectConfig,
    private router: Router,
    private route: ActivatedRoute,
    private mantenimientoService: MantenimientoService,
    private utilService: UtilService,
    private crearAprobadorFijoService: CrearAprobadorFijoService
  ) {
    this.config.notFoundText = "Custom not found";
    this.config.appendTo = "body";
    this.config.bindValue = "value";

    this.route.queryParams.subscribe((params) => {
      this.id_edit = params["id_edit"];
      console.log("ID editar: ", this.id_edit);
      // Utiliza el id_edit obtenido
    });
  }

  PageNivelesAprobacion() {
    this.router.navigate(["/mantenedores/aprobadores-fijos"]);
  }

  searchCodigoPosicion: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.codigosPosicion
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  searchNombreCompleto: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.nombresEmpleados
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  searchSubledger: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.subledgers
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  onSelectItem(campo: string, event) {
    let valor = event.item;
    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      console.log("Empleado iterando: ", empleado);
      console.log(
        "empleado[campo]: " + empleado[campo] + ", valor: ",
        valor + ", campo: ",
        campo
      );
      console.log("\n");
      return empleado[campo] === valor;
    });
    console.log("Valor de datosEmpleado: ", datosEmpleado);
    if (datosEmpleado) {
      console.log("Ingresa en el if: ", datosEmpleado);

      /*

      codigo: "CODIGO_2",
      idEmpresa: "ID_EMPRESA",
      compania: "Reybanpac",
      departamento: "Inventarios",
      nombreCargo: "Gerencia de Proyectos",
      nomCCosto: "Zona camarones",
      codigoPosicion: "0426",
      descrPosicion: "Gerencia de Proyectos",
      codigoPuesto: "CODIGO_PUESTO",
      descrPuesto: "Gerencia media",
      fechaIngresogrupo: "2024-04-15T12:08:34.473",
      grupoPago: "GRUPO_PAGO",
      reportaA: "0427",
      localidad: "Hacienda",
      nivelDir: "Gerencia Media",
      descrNivelDir: "Gerencia Media",
      nivelRepa: "Gerencia Medios",
      nombreCompleto: "MOROCHO VARGAS CAL ESTUARIO",
      subledger: "60067579",
      sucursal: "SUSURSAL 1",
      unidadNegocio: "UNIDAD NEGOCIO 1",
      tipoContrato: "Eventual",
      descripContrato: "Eventual con remuneracion mixta",
      status: true,

      */
      let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();
      // this.modelo.ID_APROBACION = ;
      this.modelo.iD_APROBADOR = 1;
      this.modelo.niveL_DIRECCION = datosEmpleado.nivelDir;
      this.modelo.codigO_POSICION = datosEmpleado.codigoPosicion;
      // let fechaActual = new Date();
      this.modelo.subleger = datosEmpleado.subledger;
      this.modelo.nombre = datosEmpleado.nombreCompleto;
      this.modelo.codigO_POSICION_REPORTA_A = "N/A";
      this.modelo.reportA_A = datosEmpleado.reportaA;
      this.modelo.estado = true;
      this.modelo.fechA_CREACION = fechaEnFormatoISO;
      this.modelo.fechA_MODIFICACION = fechaEnFormatoISO;
      this.modelo.usuariO_CREACION = fechaEnFormatoISO;
      this.modelo.usuariO_MODIFICACION = fechaEnFormatoISO;
      this.modelo.descripcioN_POSICION = datosEmpleado.descrPosicion;
      this.modelo.supervisA_A = "N/A";
      this.modelo.niveL_REPORTE = datosEmpleado.nivelReporte;

      // this.model = Object.assign({}, datosEmpleado);
      // console.log("ESTE MODELO SE ASIGNA: ", this.model);
      /*this.keySelected =
        this.solicitud.idTipoSolicitud +
        "_" +
        this.solicitud.idTipoMotivo +
        "_" +
        this.model.nivelDir;
      if (!this.dataNivelesDeAprobacion[this.keySelected]) {
        this.getNivelesAprobacion();
      }*/
    } else {
      // this.model.reset();
      let tempSearch = valor;
      this.modelo = new AprobadorFijo();
      if (campo == "codigoPosicion") {
        this.modelo.codigO_POSICION = tempSearch;
      } else if (campo == "subledger") {
        this.modelo.subleger = tempSearch;
      } else if (campo == "nombreCompleto") {
        this.modelo.nombre = tempSearch;
      }
    }
  }

  getNivelById() {
    this.utilService.openLoadingSpinner(
      "Cargando información, espere por favor..."
    );
    /*this.crearAprobadorFijoService
      .getNivelById(this.id_edit)
      .subscribe((data) => {
        console.log("GETBYID");
        this.modelo = { ...data, estado: data.estado === "A" };
        this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(
          this.modelo.idTipoSolicitud
        );
        this.onChangeTipoSolicitud(this.modelo.idTipoSolicitud);
        this.onChangeTipoRuta(this.modelo.idTipoRuta);
        this.utilService.closeLoadingSpinner();
        console.log("The model: ", this.modelo);
      });*/
  }

  ngOnInit() {
    this.getDataEmpleadosEvolution();
    /*this.ObtenerServicioTipoSolicitud();
    this.ObtenerServicioTipoMotivo();
    this.ObtenerServicioAccion();
    this.ObtenerServicioRuta();
    this.ObtenerServicioTipoRuta();
    this.ObtenerServicioNivelDireccion();
    this.ObtenerServicioNivelAprobacion();
    if (this.id_edit !== undefined) {
      this.getNivelById();
    }*/
  }

  onChangeTipoRuta(idTipoRuta: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.tipoRutaSeleccionada = idTipoRuta;
    if (!this.dataRutasPorTipoRuta[idTipoRuta]) {
      this.mantenimientoService.getRutasPorTipoRuta(idTipoRuta).subscribe({
        next: (response) => {
          this.dataRutasPorTipoRuta[idTipoRuta] = response;
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
    }
  }

  onChangeTipoSolicitud(idTipoSolicitud: number) {
    /*public dataTipoSolicitudes: any[] = [
        { id: 1, descripcion: "Requisición de Personal" },
        { id: 2, descripcion: "Contratación de Familiares" },
        { id: 3, descripcion: "Reingreso de personal" },
        { id: 4, descripcion: "Acción de Personal" },
      ];*/
    this.tipoSolicitudSeleccionada = idTipoSolicitud;
    this.desactivarTipoMotivoYAccion = this.restrictionsIds.includes(
      this.tipoSolicitudSeleccionada
    );
    if (this.desactivarTipoMotivoYAccion) {
      /*this.modelo.tipoMotivo = "";
      this.modelo.idTipoMotivo = 0;
      this.modelo.accion = "";
      this.modelo.idAccion = 0;*/
    }
    console.log(
      "this.tipoSolicitudSeleccionada = " +
        this.tipoSolicitudSeleccionada +
        ", restrictionsIds = ",
      this.restrictionsIds
    );
    console.log(
      "¿Está en restrictionsIds?",
      this.restrictionsIds.includes(this.tipoSolicitudSeleccionada)
    );
    if (!this.dataAccionesPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getAccionesPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataAccionesPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }

    if (!this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud]) {
      this.mantenimientoService
        .getTiposMotivosPorTipoSolicitud(idTipoSolicitud)
        .subscribe({
          next: (response) => {
            this.dataTiposMotivosPorTipoSolicitud[idTipoSolicitud] = response;
          },
          error: (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          },
        });
    }
  }

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

  ObtenerServicioAccion() {
    return this.mantenimientoService.getAccion().subscribe({
      next: (response) => {
        this.dataAccion = response.map((r) => ({
          id: r.id,
          descripcion: r.accion,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioRuta() {
    return this.mantenimientoService.getRuta().subscribe({
      next: (response) => {
        this.dataRuta = response.map((r) => ({
          id: r.id,
          descripcion: r.ruta,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioTipoRuta() {
    return this.mantenimientoService.getTipoRuta().subscribe({
      next: (response) => {
        this.dataTipoRuta = response.tipoRutaType.map((r) => ({
          id: r.id,
          descripcion: r.tipoRuta,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelDireccion() {
    console.log("Executing ObtenerServicioNivelDireccion() method");

    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
        console.log("Response = ", response);
        this.dataNivelDireccion = [
          ...new Set(
            response.evType.map((item) => {
              return item.nivelDir;
            })
          ),
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  ObtenerServicioNivelAprobacion() {
    console.log("Executing ObtenerServicioNivelAprobacion() method");

    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
        console.log("Response = ", response);
        this.dataNivelAprobacion = [
          ...new Set(
            response.evType.map((item) => {
              return item.nivelDir;
            })
          ),
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }

  // Cambio en el consumo del API comentado tveas
  /*ObtenerServicioNivelDireccion() {
    console.log("Executing ObtenerServicioNivelDireccion() method");
    return this.mantenimientoService.getCatalogo("RBPND").subscribe({
      // return this.mantenimientoService.getCatalogoRBPND().subscribe({
      next: (response) => {
        this.dataNivelDireccion = response.itemCatalogoTypes.map((r) => ({
          id: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
        this.utilService.closeLoadingSpinner();
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }*/

  // Cambio en el consumo del API comentado tveas
  /*ObtenerServicioNivelAprobacion() {
    console.log("Executing ObtenerServicioNivelAprobacion() method");
    return this.mantenimientoService.getCatalogo("RBPNA").subscribe({
      // return this.mantenimientoService.getCatalogoRBPNA().subscribe({
      next: (response) => {
        this.dataNivelAprobacion = response.itemCatalogoTypes.map((r) => ({
          id: r.codigo,
          descripcion: r.valor,
        })); //verificar la estructura mmunoz
      },
      error: (error: HttpErrorResponse) => {
        this.utilService.modalResponse(error.error, "error");
      },
    });
  }*/

  guardarAprobadorFijo() {
    this.utilService.openLoadingSpinner(
      "Guardando información, espere por favor..."
    );
    /*console.log("DATA A PROCESAR: ", {
      ...this.modelo,
      estado: this.modelo.estado ? "A" : "I",
    });*/
    console.log("Guardar nivel de solicitud: ", this.id_edit);
    console.log(
      "dataAccionesPorTipoSolicitud[tipoSolicitudSeleccionada]: ",
      this.dataAccionesPorTipoSolicitud[this.tipoSolicitudSeleccionada]
    );
    this.route.params.subscribe((params) => {
      this.crearAprobadorFijoService
        .guardarAprobadorFijo({
          ...this.modelo,
          estado: this.modelo.estado ? "A" : "I",
        })
        .subscribe(
          (response) => {
            // Inicio
            this.utilService.closeLoadingSpinner();
            console.log("Response al guardar: ", response);
            this.utilService.modalResponse(
              "Datos ingresados correctamente",
              "success"
            );
            setTimeout(() => {
              this.router.navigate(["/mantenedores/aprobadores-fijos"]);
            }, 1600);

            // Fin
          },
          (error: HttpErrorResponse) => {
            this.utilService.modalResponse(error.error, "error");
          }
        );
    });
    return;

    console.log("Editar nivel de solicitud");
  }
}
