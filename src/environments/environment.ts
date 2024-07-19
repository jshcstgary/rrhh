// const baseC = "http://10.35.3.187:8188"; //base de camunda Local
const baseC = "http://10.35.3.162:8090"; //base de camunda Local
const base = "http://10.35.3.162"; //base de servicios local
const baseRBP = "http://192.168.44.180"; //base de servicios local
const baseG = "http://181.188.224.250:18043"; //base de servicios api gateway

export const portalWorkFlow: string = "http://10.35.3.162:4200/";

export const appCode: string = "46";
export const resourceCode: string = "PWFCAMUMET";

export const environment = {
  port: "4200",
  production: false,
  modalConfirmation: false,
  reporteUS: `${base}:8500/v1/us/reporte`,
  // reporteUS: `${baseG}/v1/us/reporte`,
  // reporteUS: `${baseRBP}:8500/v1/us/reporte`,

  // Angular UI app is associated with below BPMN process key
  procesName: "process_modelo",

  // Task type 1 - Register - the value maps to the id attribute 'Registrar Solicitud' from bpmn
  // taskType_Registrar: "Activity_1pkw55i",

  taskType_Registrar: "RP_RegistrarSolicitud",

  // Task type 2 - Review   - the value maps to the id attribute 'Revisar Solicitud' from bpmn
  // taskType_Revisar: "Activity_0wf5xb7",

  taskType_Revisar: "Dinamico_RevisarSolicitud",

  taskType_RRHH: "RQ_GRRHH_RevisarSolicitud",

  taskType_Notificar: "Activity_1bql112",

  taskType_CREM: "RQ_CREM_RevisarSolicitud",

  taskType_RegistrarCandidato: "RP_RegistrarSeleccionCandidato",

  taskType_CompletarRequisicion: "RP_CompletarRequisicion",

  taskType_CF: "CF_RegistrarSolicitud",

  taskType_CF_RRHH: "CF_RevisarSolicitudGerente",

  taskType_CF_Remuneraciones: "CF_RevisarSolicitudRemuneraciones",

  taskType_RG: "RG_RegistrarSolicitud",

  taskType_RGC_RRHH: "RG_ComentariosJefeRRHH",

  taskType_RGC_ULTIMO_JEFE: "RG_ComentariosUltimoJefe",

  taskType_RG_Jefe_Solicitante: "RG_ComentariosJefeSolicitante",

  taskType_RG_RRHH: "RG_RevisarSolicitudGerente",

  taskType_RG_Remuneraciones: "RG_RevisarSolicitudRemuneraciones",

  taskType_AP: "SB_RevisionSolicitudAP",

  taskType_AP_Registrar: "AP_RegistrarSolicitud",

  taskType_AP_RRHH: "AP_RevisarSolicitudGerente",

  taskType_AP_Remuneraciones: "AP_RevisarSolicitudRemuneraciones",

  //Servicios de workflow
  camundaUrl: `${baseC}/`,
  // camundaUrl: `${baseG}/`,
  // camundaUrl: `${baseRBP}:8290/`,
  // camundaUrl: `localhost:8080/`,

  exempleadoServiceEsJaff: `${base}:8078/v1/us/exempleadojaff`,
  // exempleadoServiceEsJaff: `${baseG}/v1/us/exempleadojaff`,
  // exempleadoServiceEsJaff: `${baseRBP}:8078/v1/us/exempleadojaff`,

  exempleadoServiceEsSpyral: `${base}:8079/v1/us/exempleadosp`,
  // exempleadoServiceEsSpyral: `${baseG}/v1/us/exempleadosp`,
  // exempleadoServiceEsSpyral: `${baseRBP}:8079/v1/us/exempleadosp`,


  exempleadoService: `${base}:8089/v1/us/exempleados_rbp`,
  // exempleadoService: `${baseG}/v1/us/exempleados_rbp`,
  // exempleadoService: `${baseRBP}:8089/v1/us/exempleados_rbp`,

  tipoSolicitudServiceES: `${base}:8068/v1/es/tiposolicitud`,
  // tipoSolicitudServiceES: `${baseG}/v1/es/tiposolicitud`,
  // tipoSolicitudServiceES: `${baseRBP}:8268/v1/es/tiposolicitud`,

  seleccionCandidatoServiceES: `${base}:8086/v1/es/seleccion_candidato`,
  // seleccionCandidatoServiceES: `${baseG}/v1/es/seleccion_candidato`,
  // seleccionCandidatoServiceES: `${baseRBP}:8286/v1/es/seleccion_candidato`,

  tipoRutaServiceES: `${base}:8069/v1/es/tiporuta`,
  // tipoRutaServiceES: `${baseG}/v1/es/tiporuta`,
  // tipoRutaServiceES: `${baseRBP}:8269/v1/es/tiporuta`,

  tipoProcesoServiceES: `${base}:8070/v1/es/tipoproceso`,
  // tipoProcesoServiceES: `${baseG}/v1/es/tipoproceso`,
  // tipoProcesoServiceES: `${baseRBP}:8270/v1/es/tipoproceso`,

  rutaServiceES: `${base}:8071/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
  // rutaServiceES: `${baseG}/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
  // rutaServiceES: `${baseRBP}:8271/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta

  tipoMotivoServiceES: `${base}:8072/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo
  // tipoMotivoServiceES: `${baseG}/v1/es/tipomotivo`,
  // tipoMotivoServiceES: `${baseRBP}:8272/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo

  accionServiceES: `${base}:8073/v1/es/accion`,
  // accionServiceES: `${baseG}/v1/es/accion`,
  // accionServiceES: `${baseRBP}:8273/v1/es/accion`,

  tipoAccionServiceES: `${base}:8074/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion
  // tipoAccionServiceES: `${baseG}/v1/es/tipoaccion`,
  // tipoAccionServiceES: `${baseRBP}:8274/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion

  CatalogoServiceES: `${base}:8065/v1/es/item-catalogo`,
  // CatalogoServiceES: `${baseG}/v1/es/item-catalogo`,
  // CatalogoServiceES: `${baseRBP}:8265/v1/es/item-catalogo`,

  nivelAprobacionServiceES: `${base}:8067/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion
  // nivelAprobacionServiceES: `${baseG}/v1/es/nivelesaprobacion`,
  // nivelAprobacionServiceES: `${baseRBP}:8267/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion

  empleadoServiceEs: `${base}:8078/v1/us/empleadoev`,
  // empleadoServiceEs: `${baseG}/v1/us/empleadoev`,
  // empleadoServiceEs: `${baseRBP}:8278/v1/us/empleadoev`,

  nivelAprobacionRefreshServiceES: `${base}:8075/v1/es/refresh_nivelesAprobacion`,
  // nivelAprobacionRefreshServiceES: `${baseG}/v1/es/refresh_nivelesAprobacion`,
  // nivelAprobacionRefreshServiceES: `${baseRBP}:8275/v1/es/refresh_nivelesAprobacion`,

  solicitudesServiceES: `${base}:8066/v1/es/solicitud`, // http://10.35.3.162:8066/v1/es/solicitud
  // solicitudesServiceES: `${baseG}/v1/es/solicitud`,
  // solicitudesServiceES: `${baseRBP}:8266/v1/es/solicitud`, // http://10.35.3.162:8066/v1/es/solicitud

  tareasServiceES: `${base}:8080/v1/es/solicitudcamunda`,
  // tareasServiceES: `${baseG}/v1/es/solicitudcamunda`,
  // tareasServiceES: `${baseRBP}:8280/v1/es/solicitudcamunda`,

  aprobadoresFijosServiceES: `${base}:8082/v1/es/aprobadores_fijos`,
  // aprobadoresFijosServiceES: `${baseG}/v1/es/aprobadores_fijos`,
  // aprobadoresFijosServiceES: `${baseRBP}:8282/v1/es/aprobadores_fijos`,

  historicaCamundaServiceEs: `${base}:8077/v1/es/historicacamunda`,
  // historicaCamundaServiceEs: `${baseG}/v1/es/historicacamunda`,
  // historicaCamundaServiceEs: `${baseRBP}:8277/v1/es/historicacamunda`,

  detalleAprobacionesServiceES: `${base}:8083/v1/es/detalles_aprobaciones_solicitudes`,
  // detalleAprobacionesServiceES: `${baseG}/v1/es/detalles_aprobaciones_solicitudes`,
  // detalleAprobacionesServiceES: `${baseRBP}:8283/v1/es/detalles_aprobaciones_solicitudes`,

  familiaresCandidatoServiceES: `${base}:8087/v1/es/familiarescandidato`,
  // familiaresCandidatoServiceES: `${baseG}/v1/es/familiarescandidato`,
  // familiaresCandidatoServiceES: `${baseRBP}:8287/v1/es/familiarescandidato`,

  senEmailService: `${base}:8084/v1/es/mail`,
  // senEmailService: `${baseG}/v1/es/mail`,
  // senEmailService: `${baseRBP}:8285/v1/es/mail`,

  comentarioServiceES: `${base}:8088/v1/es/comentarios`,
  // comentarioServiceES: `${baseG}/v1/es/comentarios`,
  // comentarioServiceES: `${baseRBP}:8288/v1/es/comentarios`,

  loginES: `${base}:8308/api/us/integracion-seguridad/iguana`,
  // loginES: `${baseG}/api/us/integracion-seguridad`,
  // loginES: `${baseRBP}:8292/api/us/integracion-seguridad`,

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
