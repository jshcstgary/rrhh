// const baseC = "http://10.35.3.187:8188"; //base de camunda Local
const baseC = "http://10.35.3.162:8090"; //base de camunda Local
const base = "http://10.35.3.162"; //base de servicios local
const baseRBP = "http://192.168.44.180"; //base de servicios RBP http://10.35.3.162
const baseG = "http://181.188.224.250:18043"; //base de servicios api gateway

const pruebas_locales: boolean = false; //Varialbe boleana para las pruebas locales y pruebas en el ambiente del cliente

// export const portalWorkFlow: string = "http://10.35.3.162:4200/";

export const portalWorkFlow: string = pruebas_locales ? "http://10.35.3.162:4200/" : "http://192.168.44.180:4200/";

export const appCode: string = "46";
export const resourceCode: string = "PWFCAMUMET";

export const environment = {
	port: "4200",
	production: false,
	modalConfirmation: false,
	reporteUS: pruebas_locales ? `${base}:8091/v1/us/reporte` : `${baseRBP}:50063/v1/us/reporte`,

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

	taskType_AP_RV: "SB_RevisionSolicitudAP",

	taskType_AP_Registrar: "AP_RegistrarSolicitud",

	taskType_AP_RRHH: "AP_RevisarSolicitudGerente",

	taskType_AP_Remuneraciones: "AP_RevisarSolicitudRemuneraciones",

	taskType_AP_Completar: "AP_CompletarSolicitud",


	//Servicios de workflow
	camundaUrl: pruebas_locales ? `${baseC}/` : `${baseRBP}:8290/`,
	// camundaUrl: `${baseG}/`,
	//camundaUrl: `${baseRBP}:8290/`,
	// camundaUrl: `localhost:8080/`,

	exempleadoServiceEsJaff: pruebas_locales ? `${base}:8076/v1/us/exempleadojaff` : `${baseRBP}:8279/v1/us/exempleadosp`,
	// exempleadoServiceEsJaff: `${baseG}/v1/us/exempleadojaff`,

	exempleadoServiceEsSpyral: `${base}:8079/v1/us/exempleadosp`,
	// exempleadoServiceEsSpyral: `${baseG}/v1/us/exempleadosp`,

	exempleadoService: pruebas_locales ? `${base}:8089/v1/us/exempleados_rbp` : `${baseRBP}:8268/v1/es/tiposolicitud`,
	// exempleadoService: `${baseG}/v1/us/exempleados_rbp`,

	tipoSolicitudServiceES: pruebas_locales ? `${base}:8068/v1/es/tiposolicitud` : `${baseRBP}:8268/v1/es/tiposolicitud`,
	// tipoSolicitudServiceES: `${baseG}/v1/es/tiposolicitud`,
	//tipoSolicitudServiceES: `${baseRBP}:8268/v1/es/tiposolicitud`,

	seleccionCandidatoServiceES: pruebas_locales ? `${base}:8086/v1/es/seleccion_candidato` : `${baseRBP}:8286/v1/es/seleccion_candidato`,
	// seleccionCandidatoServiceES: `${baseG}/v1/es/seleccion_candidato`,

	tipoRutaServiceES: pruebas_locales ? `${base}:8069/v1/es/tiporuta` : `${baseRBP}:8269/v1/es/tiporuta`,
	// tipoRutaServiceES: `${baseG}/v1/es/tiporuta`,

	tipoProcesoServiceES: pruebas_locales ? `${base}:8070/v1/es/tipoproceso` : `${baseRBP}:8270/v1/es/tipoproceso`,
	// tipoProcesoServiceES: `${baseG}/v1/es/tipoproceso`,

	rutaServiceES: pruebas_locales ? `${base}:8071/v1/es/ruta` : `${baseRBP}:8271/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
	// rutaServiceES: `${baseG}/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta

	tipoMotivoServiceES: pruebas_locales ? `${base}:8072/v1/es/tipomotivo` : `${baseRBP}:8272/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo
	// tipoMotivoServiceES: `${baseG}/v1/es/tipomotivo`,

	accionServiceES: pruebas_locales ? `${base}:8073/v1/es/accion` : `${baseRBP}:8273/v1/es/accion`,
	// accionServiceES: `${baseG}/v1/es/accion`,

	tipoAccionServiceES: pruebas_locales ? `${base}:8074/v1/es/tipoaccion` : `${baseRBP}:8274/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion
	// tipoAccionServiceES: `${baseG}/v1/es/tipoaccion`,

	CatalogoServiceES: pruebas_locales ? `${base}:8065/v1/es/item-catalogo` : `${baseRBP}:8265/v1/es/item-catalogo`,
	// CatalogoServiceES: `${baseG}/v1/es/item-catalogo`,

	nivelAprobacionServiceES: pruebas_locales ? `${base}:8067/v1/es/nivelesaprobacion` : `${baseRBP}:8267/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion
	// nivelAprobacionServiceES: `${baseG}/v1/es/nivelesaprobacion`,

	empleadoServiceEs: pruebas_locales ? `${base}:8078/v1/us/empleadoev` : `${baseRBP}:8278/v1/us/empleadoev`,
	// empleadoServiceEs: `${baseG}/v1/us/empleadoev`,

	nivelAprobacionRefreshServiceES: pruebas_locales ? `${base}:8075/v1/es/refresh_nivelesAprobacion` : `${baseRBP}:8275/v1/es/refresh_nivelesAprobacion`,
	// nivelAprobacionRefreshServiceES: `${baseG}/v1/es/refresh_nivelesAprobacion`,

	solicitudesServiceES: pruebas_locales ? `${base}:8066/v1/es/solicitud` : `${baseRBP}:8266/v1/es/solicitud`, // http://10.35.3.162:8066/v1/es/solicitud
	// solicitudesServiceES: `${baseG}/v1/es/solicitud`,

	tareasServiceES: pruebas_locales ? `${base}:8080/v1/es/solicitudcamunda` : `${baseRBP}:8280/v1/es/solicitudcamunda`,
	// tareasServiceES: `${baseG}/v1/es/solicitudcamunda`,

	aprobadoresFijosServiceES: pruebas_locales ? `${base}:8082/v1/es/aprobadores_fijos` : `${baseRBP}:8282/v1/es/aprobadores_fijos`,
	// aprobadoresFijosServiceES: `${baseG}/v1/es/aprobadores_fijos`,

	historicaCamundaServiceEs: pruebas_locales ? `${base}:8077/v1/es/historicacamunda` : `${baseRBP}:8277/v1/es/historicacamunda`,
	// historicaCamundaServiceEs: `${baseG}/v1/es/historicacamunda`,

	detalleAprobacionesServiceES: pruebas_locales ? `${base}:8083/v1/es/detalles_aprobaciones_solicitudes` : `${baseRBP}:8283/v1/es/detalles_aprobaciones_solicitudes`,
	// detalleAprobacionesServiceES: `${baseG}/v1/es/detalles_aprobaciones_solicitudes`,

	familiaresCandidatoServiceES: pruebas_locales ? `${base}:8087/v1/es/familiarescandidato` : `${baseRBP}:8287/v1/es/familiarescandidato`,
	// familiaresCandidatoServiceES: `${baseG}/v1/es/familiarescandidato`,

	senEmailService: pruebas_locales ? `${base}:8084/v1/es/mail` : `${baseRBP}:8285/v1/es/mail`,
	// senEmailService: `${baseG}/v1/es/mail`,

	comentarioServiceES: pruebas_locales ? `${base}:8088/v1/es/comentarios` : `${baseRBP}:8288/v1/es/comentarios`,
	// comentarioServiceES: `${baseG}/v1/es/comentarios`,

	loginES: pruebas_locales ? `${base}:8308/api/us/integracion-seguridad/iguana/obtenercredenciales` : `${baseRBP}:8308/api/us/integracion-seguridad/obtenercredenciales`,

	perfilUsuarioES: pruebas_locales ? `${base}:8308/api/us/integracion-seguridad/perfil-usuario` : `${baseRBP}:8308/api/us/integracion-seguridad/perfil-usuario`,
};
