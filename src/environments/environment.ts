const baseC = "http://10.35.3.180:8188/"; //base de camunda Local
const base = "http://10.35.3.162"; //base de servicios local
const baseG ="http://181.188.224.250:18043"; //base de servicios api gateway


export const environment = {
  port: "4200",
  production: false,
  modalConfirmation: false,
  reporteUS: `${base}:8500/v1/us/reporte`,

  // Angular UI app is associated with below BPMN process key
  procesName: "process_modelo",

  // Task type 1 - Register - the value maps to the id attribute 'Registrar Solicitud' from bpmn
  taskType_Registrar: "Activity_1pkw55i",

  // Task type 2 - Review   - the value maps to the id attribute 'Revisar Solicitud' from bpmn
  // taskType_Revisar: "Activity_0wf5xb7",

  taskType_Revisar: "Activity_1p9wq10",

  taskType_Notificar: "Activity_1bql112",

  //Servicios de workflow
  //camundaUrl: `${baseC}/`,
  camundaUrl: `${baseG}/`,
  // camundaUrl: `localhost:8080/`,
  //tipoSolicitudServiceES: `${base}:8068/v1/es/tiposolicitud`,
  tipoSolicitudServiceES: `${baseG}/v1/es/tiposolicitud`,
  //tipoRutaServiceES: `${base}:8069/v1/es/tiporuta`,
  tipoRutaServiceES: `${baseG}/v1/es/tiporuta`,
  //tipoProcesoServiceES: `${base}:8070/v1/es/tipoproceso`,
  tipoProcesoServiceES: `${baseG}/v1/es/tipoproceso`,
  //rutaServiceES: `${base}:8071/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
  rutaServiceES: `${baseG}/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
  //tipoMotivoServiceES: `${base}:8072/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo
  tipoMotivoServiceES: `${baseG}/v1/es/tipomotivo`,
  //accionServiceES: `${base}:8073/v1/es/accion`,
  accionServiceES: `${baseG}/v1/es/accion`,
  //tipoAccionServiceES: `${base}:8074/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion
  tipoAccionServiceES: `${baseG}/v1/es/tipoaccion`,
  //CatalogoServiceES: `${base}:8065/v1/es/item-catalogo`,
  CatalogoServiceES: `${baseG}/v1/es/item-catalogo`,
  //nivelAprobacionServiceES: `${base}:8067/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion
  nivelAprobacionServiceES: `${baseG}/v1/es/nivelesaprobacion`,

  //empleadoServiceEs: `${base}:8078/v1/us/empleadoev`,

  empleadoServiceEs: `${baseG}/v1/us/empleadoev`,

  //nivelAprobacionRefreshServiceES: `${base}:8075/v1/es/refresh_nivelesAprobacion`,

  nivelAprobacionRefreshServiceES: `${baseG}/v1/es/refresh_nivelesAprobacion`,

  //solicitudesServiceES: `${base}:8066/v1/es/solicitud`, // http://10.35.3.162:8001/v1/es/solicitud

  solicitudesServiceES: `${baseG}/v1/es/solicitud`,

  //tareasServiceES: `${base}:8080/v1/es/solicitudcamunda`,

  tareasServiceES: `${baseG}/v1/es/solicitudcamunda`,

  //aprobadoresFijosServiceES: `${base}:8082/v1/es/aprobadores_fijos`,
  aprobadoresFijosServiceES: `${baseG}/v1/es/aprobadores_fijos`,

  //historicaCamundaServiceEs: `${base}:8077/v1/es/historicacamunda`,

  historicaCamundaServiceEs: `${baseG}/v1/es/historicacamunda`,


  /*

  mantenedores
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


  servicio solicitud y detalle solicitud
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

};
