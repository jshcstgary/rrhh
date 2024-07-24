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
import { EditarAprobadorFijoService } from "./editar-aprobador-fijo.service";

@Component({
  selector: "app-editar-aprobador-fijo",
  templateUrl: "./editar-aprobador-fijo.component.html",
  styleUrls: ["./editar-aprobador-fijo.component.scss"],
})
export class EditarAprobadorFijoComponent implements OnInit {
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
  public id_edit: undefined | string;

  public desactivarTipoMotivoYAccion = false;

  public restrictionsIds: any[] = ["3", "5", "6", 3, 5, 6];

  public tipoSolicitudSeleccionada: any;

  public tipoRutaSeleccionada: any;

  public dataTiposMotivosPorTipoSolicitud: { [idSolicitud: number]: any[] } =
    {};
  public dataAccionesPorTipoSolicitud: { [idSolicitud: number]: any[] } = {};

  public dataRutasPorTipoRuta: { [idSolicitud: number]: any[] } = {};

  public disableButton: boolean = false;

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

  correosEmpleado: string[] = [];

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

  clearModel() {
    this.modelo.iD_APROBADOR = 0;
    this.modelo.niveL_DIRECCION = "";
    this.modelo.codigO_POSICION = "";
    this.modelo.subleger = "";
    this.modelo.nombre = "";
    this.modelo.codigO_POSICION_REPORTA_A = "";
    this.modelo.reportA_A = "";
    this.modelo.estado = false;
    this.modelo.fechA_CREACION = "";
    this.modelo.fechA_MODIFICACION = "";
    this.modelo.usuariO_CREACION = "";
    this.modelo.usuariO_MODIFICACION = "";
    this.modelo.descripcioN_POSICION = "";
    this.modelo.supervisA_A = "";
    this.modelo.niveL_REPORTE = "";
    this.modelo.correo = "";

    this.disableButton = true;
  }

  getDataEmpleadosEvolution(tipo: string) {
    let tipoValue: string = "";

    if (tipo === "correo") {
      tipoValue = this.modelo.correo;
    } else if (tipo === "subledger") {
      tipoValue = this.modelo.subleger;
    } else if (tipo === "nombreEmpleado") {
      tipoValue = this.modelo.nombre;
    }

    return this.mantenimientoService.getDataEmpleadosEvolutionPorId(tipoValue).subscribe({
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

        this.dataEmpleadoEvolution = response.evType;

        let fechaActual = new Date();
        let fechaEnFormatoISO = fechaActual.toISOString();

        this.modelo.iD_APROBADOR = 1;
        this.modelo.niveL_DIRECCION = "Gerente de RRHH Corporativo";
        this.modelo.codigO_POSICION = this.dataEmpleadoEvolution[0].codigoPosicion;
        this.modelo.subleger = this.dataEmpleadoEvolution[0].subledger;
        this.modelo.nombre = this.dataEmpleadoEvolution[0].nombreCompleto;
        this.modelo.codigO_POSICION_REPORTA_A = "N/A";
        this.modelo.reportA_A = this.dataEmpleadoEvolution[0].reportaA;
        this.modelo.estado = true;
        this.modelo.fechA_CREACION = fechaEnFormatoISO;
        this.modelo.fechA_MODIFICACION = fechaEnFormatoISO;
        this.modelo.usuariO_CREACION = fechaEnFormatoISO;
        this.modelo.usuariO_MODIFICACION = fechaEnFormatoISO;
        this.modelo.descripcioN_POSICION = this.dataEmpleadoEvolution[0].descrPosicion;
        this.modelo.supervisA_A = "N/A";
        this.modelo.niveL_REPORTE = this.dataEmpleadoEvolution[0].nivelReporte;
        this.modelo.correo = this.dataEmpleadoEvolution[0].correo

        if (tipo === "nombreEmpleado") {
          this.nombresEmpleados = [ ...new Set(this.dataEmpleadoEvolution.map((empleado) => empleado.nombreCompleto)) ];

          return;
        }

        this.disableButton = false;
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
    private editarAprobadorFijoService: EditarAprobadorFijoService
  ) {
    this.config.notFoundText = "Custom not found";
    this.config.appendTo = "body";
    this.config.bindValue = "value";
    this.route.paramMap.subscribe((params) => {
      this.id_edit = params.get("id");
    });
    this.route.queryParams.subscribe((params) => {
      // this.id_edit = params["id_edit"];
      // Utiliza el id_edit obtenido
    });
  }

  // searchCorreoEmpleado: OperatorFunction<string, readonly string[]> = (
  //   text$: Observable<string>
  // ) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 1
  //         ? []
  //         : this.correosEmpleado
  //             .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //             .slice(0, 10)
  //     )
  //   );

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

  // searchSubledger: OperatorFunction<string, readonly string[]> = (
  //   text$: Observable<string>
  // ) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 1
  //         ? []
  //         : this.subledgers
  //             .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //             .slice(0, 10)
  //     )
  //   );

  onSelectItem(campo: string, event) {
    let valor = event.item;
    const datosEmpleado = this.dataEmpleadoEvolution.find((empleado) => {
      return empleado[campo] === valor;
    });
    if (datosEmpleado) {
      let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();

      this.modelo.iD_APROBADOR = this.id_edit;
      this.modelo.niveL_DIRECCION = "";
      this.modelo.codigO_POSICION = datosEmpleado.codigoPosicion;
      this.modelo.subleger = datosEmpleado.subledger;
      this.modelo.nombre = datosEmpleado.nombreCompleto;
      this.modelo.codigO_POSICION_REPORTA_A = "N/A";
      this.modelo.reportA_A = datosEmpleado.reportaA;
      this.modelo.estado = datosEmpleado.estado;
      this.modelo.fechA_CREACION = this.modelo.fechA_CREACION;
      this.modelo.fechA_MODIFICACION = fechaEnFormatoISO;
      this.modelo.usuariO_CREACION = this.modelo.usuariO_CREACION;
      this.modelo.usuariO_MODIFICACION = fechaEnFormatoISO;
      this.modelo.descripcioN_POSICION = datosEmpleado.descrPosicion;
      this.modelo.supervisA_A = "N/A";
      this.modelo.niveL_REPORTE = datosEmpleado.nivelReporte;
      this.modelo.correo = datosEmpleado.correo
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

  getAprobadorFijoById() {
    return this.editarAprobadorFijoService
      .obtenerAprobadorFijoById(this.id_edit)
      .subscribe({
        next: (response) => {
          let fechaActual = new Date();
          let fechaEnFormatoISO = fechaActual.toISOString();
          // this.modelo.ID_APROBACION = ;
          this.modelo.iD_APROBADOR = this.id_edit;
          this.modelo.niveL_DIRECCION = response.niveL_DIRECCION;
          this.modelo.codigO_POSICION = response.codigO_POSICION;
          // let fechaActual = new Date();
          this.modelo.subleger = response.subleger;
          this.modelo.nombre = response.nombre;
          this.modelo.codigO_POSICION_REPORTA_A =
            response.codigO_POSICION_REPORTA_A;
          this.modelo.reportA_A = response.reportA_A;
          this.modelo.estado = response.estado === "A";
          this.modelo.fechA_CREACION = response.fechA_CREACION;
          this.modelo.fechA_MODIFICACION = response.fechA_MODIFICACION;
          this.modelo.usuariO_CREACION = response.usuariO_CREACION;
          this.modelo.usuariO_MODIFICACION = response.usuariO_MODIFICACION;
          this.modelo.descripcioN_POSICION = response.descripcioN_POSICION;
          this.modelo.supervisA_A = response.supervisA_A;
          this.modelo.niveL_REPORTE = response.niveL_REPORTE;
          this.modelo.correo = response.correo;
        },
        error: (error: HttpErrorResponse) => {
          this.utilService.modalResponse(error.error, "error");
        },
      });
  }

  ngOnInit() {
    // this.getDataEmpleadosEvolution();
    this.getAprobadorFijoById();
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
    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
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
    return this.mantenimientoService.getNiveles().subscribe({
      next: (response) => {
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

  actualizarAprobadorFijo() {
    if (this.modelo.niveL_DIRECCION === "") {
      Swal.fire({
        text: "Seleccione un nivel de aprobación",
        icon: "warning",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
      });

      return;
    }

    this.utilService.openLoadingSpinner(
      "Actualizando información, espere por favor..."
    );
    /*console.log("DATA A PROCESAR: ", {
      ...this.modelo,
      estado: this.modelo.estado ? "A" : "I",
    });*/

    this.route.params.subscribe((params) => {
      let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();
      /*let fechaActual = new Date();
      let fechaEnFormatoISO = fechaActual.toISOString();
      // this.modelo.ID_APROBACION = ;
      this.modelo.iD_APROBADOR = this.id_edit;
      this.modelo.niveL_DIRECCION = response.niveL_DIRECCION;
      this.modelo.codigO_POSICION = response.codigO_POSICION;
      // let fechaActual = new Date();
      this.modelo.subleger = response.subleger;
      this.modelo.nombre = response.nombre;
      this.modelo.codigO_POSICION_REPORTA_A =
        response.codigO_POSICION_REPORTA_A;
      this.modelo.reportA_A = response.reportA_A;
      this.modelo.estado = response.estado;
      this.modelo.fechA_CREACION = this.modelo.fechA_CREACION;
      this.modelo.fechA_MODIFICACION = this.modelo.fechA_MODIFICACION;
      this.modelo.usuariO_CREACION = this.modelo.usuariO_CREACION;
      this.modelo.usuariO_MODIFICACION = this.modelo.usuariO_MODIFICACION;
      this.modelo.descripcioN_POSICION = response.descripcioN_POSICION;
      this.modelo.supervisA_A = response.supervisA_A;
      this.modelo.niveL_REPORTE = response.niveL_REPORTE;*/
      this.modelo.iD_APROBADOR = this.id_edit;

      this.editarAprobadorFijoService
        .actualizarAprobadorFijo(
          {
            ...this.modelo,
            fechA_MODIFICACION: fechaEnFormatoISO,
            usuariO_MODIFICACION: fechaEnFormatoISO,
            estado: this.modelo.estado ? "A" : "I",
          },
          this.modelo.iD_APROBADOR
        )
        .subscribe(
          (response) => {
            // Inicio
            this.utilService.closeLoadingSpinner();
            this.utilService.modalResponse(
              "Datos actualizados correctamente",
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
  }
}
