// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*export const environment = {
  production: false
};*/

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

const baseC = "http://10.35.3.180"; //base de camunda
const baseW = "http://10.35.3.162"; //base de servicios workflow
const base = "http://10.35.3.162"; //base de servicios local
export const environment = {
  port: "4200",
  production: false,
  modalConfirmation: false,

  // Angular UI app is associated with below BPMN process key
  procesName: "process_modelo",

  // Task type 1 - Register - the value maps to the id attribute 'Registrar Solicitud' from bpmn
  taskType_Registrar: "Activity_0jafldx",

  // Task type 2 - Review   - the value maps to the id attribute 'Revisar Solicitud' from bpmn
  taskType_Revisar: "Activity_0wf5xb7",

  //Servicios de workflow
  camundaUrl: `${baseC}:8188/`,
  tipoSolicitudServiceES: `${baseW}:8068/v1/es/tiposolicitud`,
  tipoRutaServiceES: `${baseW}:8069/v1/es/tiporuta`,
  tipoProcesoServiceES: `${baseW}:8070/v1/es/tipoproceso`,
  rutaServiceES: `${baseW}:8071/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
  tipoMotivoServiceES: `${baseW}:8072/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo
  accionServiceES: `${baseW}:8073/v1/es/accion`,
  tipoAccionServiceES: `${baseW}:8074/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion
  CatalogoServiceES: `${baseW}:8053/v1/es/item-catalogo/codigo`, //10.35.3.162:8074/v1/es/tipoaccion
  nivelAprobacionServiceES: `${baseW}:8000/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion

  solicitudesServiceES: `${base}:8001/v1/es/solicitud`, // http://10.35.3.162:8001/v1/es/solicitud
  // http://10.35.3.162:8001/swagger/index.html

  //http://10.35.3.162:8053/v1/es/item-catalogo/codigo/

  /*
  http://10.35.3.162:8068/v1/es/tiposolicitud  ok
  http://10.35.3.162:8069/v1/es/tiporuta       ok
  http://10.35.3.162:8070/v1/es/tipoproceso    no
  http://10.35.3.162:8071/v1/es/ruta
  http://10.35.3.162:8072/v1/es/tipomotivo
  http://10.35.3.162:8073/v1/es/accion         no
  http://10.35.3.162:8074/v1/es/tipoaccion

  niveles de aprobación
  http://10.35.3.162:8000/v1/es/nivelesaprobacion
  http://10.35.3.162:8000/swagger/index.html


  Buen día, servicio solicitud y detalle solicitud
  http://10.35.3.162:8001/swagger/index.html

  servicio tarea y variable de proceso histórico de camunda
  http://10.35.3.162:8002/swagger/index.html

  Api para consultar los catalogos de niveles de Aprobación
  http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPNA
  Api para consultar los catalogos de Niveles de Dirección
  http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND

  Api que devuelve empresas
  http://10.35.3.175:8506/swagger/index.html

  servicio de la vista
  exempleadojaff --> http://10.35.3.162:8400/swagger/index.html

  */

  //servicios locales
  reporteUS: `${base}:8500/v1/us/reporte`,
  catalogoServiceES: `${base}:8053/v1/es`,
  haciendaES: `${base}:8064/v1/es/hacienda`,
  homologacionHaciendaES: `${base}:8064/v1/es/homologacion-hacienda`,
  cintaColorES: `${base}:8062/v1/es/cintacolor`,
  tipoViviendaServiceES: `${base}:8041/v1/es/tipo-vivienda`,
  maquinariaServiceES: `${base}:8060/v1/es/maquinaria`,
  zonaES: `${base}:8050/v1/es/zona`,
  subZonaES: `${base}:8042/v1/es/subzona`,
  localizacionEs: `${base}:8080/v1/es/localizacion`,
  tipoCajaES: `${base}:8054/v1/es/TipoCaja/TipoCaja`,
  taraServiceES: `${base}:8049/v1/es/tara`,
  puertosServiceES: `${base}:8052/v1/es/puerto`,
  hitoMuestreoServiceES: `${base}:8046/v1/es/hito-muestreo`,
  defectoCalidadES: `${base}:8063/v1/es/defectocalidad`,
  defectoES: `${base}:8079/v1/es/defecto`,
  estacionalidadServiceES: `${base}:8065/v1/es/estacionalidad`,
  tensiometroServiceES: `${base}:8066/v1/es/tensiometro`,
  muestreoServiceES: `${base}:8046/v1/es/muestreo`,
  semanaPeriodoES: `${base}:8047/v1/es/periodo`,
  embalajesServiceES: `${base}:8051/v1/es/embalaje`,
  causalesServiceES: `${base}:8048/v1/es/causales`,
  empacadoraServiceES: `${base}:8073/v1/es/empacadora`,
  transportistaES: `${base}:8077/v1/es/transportistas`,
  controlCamionesServiceES: "",
  loteServicesES: `${base}:8069/v1/es/lote`,
  tipoPlantacionEndPointES: `${base}:8082/v1/es/tipoplantacion`,
  jefeSectorEndPointES: `${base}:8083/v1/es/jefesector`,
  productoFrutaEndPointES: `${base}:8053/v1/es/item-catalogo/codigo/PRODUCTO_FRUTA`,
  marcaEndPointES: `${base}:8053/v1/es/item-catalogo/codigo/MARCAS`,
  drenajeLoteES: `${base}:8090/v1/es/drenajelote`,
  equipoMaquinariaES: `${base}:8060/v1/es/maquinaria`,
  sectorES: `${base}:8040/v1/es/sector`,
  tipoCanalES: `${base}:8090/v1/es/tipo-canal`,
  invFacUS: `${base}:8499/v1/us/invfac`,
  procesoES: `${base}:8056/v1/es/proceso`,
  optimomaterialesEs: `${base}:8074/v1/es/optimomateriales`,
  parametropesajeEs: `${base}:8071/v1/es/parametropesaje`,
  laboresgenericasEs: `${base}:8068/v1/es/laboresgenericas`,
  productoembarqueEs: `${base}:8072/v1/es/productoembarque`,
  tipocontabilizacionES: `${base}:8075/v1/es/tipocontabilizacion`,
  transportetransportistaES: `${base}:8077/v1/es/transportistas/transportistas`,
  transportistacamionesES: "",
  viviendaES: `${base}:8041/v1/es/vivienda`,
  controlCamionesEs: `${base}:8097/v1/es/control-camiones`,
  quimicosMuestreoEs: `${base}:8089/v1/es/quimicosmuestreos`,
  parametrosGeneralesEs: `${base}:8067/v1/es/parametrosgenerales`,
  laborIncompatible: `${base}:8084/v1/es`,
  comedorEs: `${base}:8076/v1/es/comedor`,
  comedorTarifa: `${base}:8076/v1/es/comedorTarifa`,
  jawUS: `${base}:8400/v1/us/jaw`,
  itemProductoEs: `${base}:8096/v1/es/ItemProducto`,
};
