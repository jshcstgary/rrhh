// const baseC = "http://10.35.3.187:8188"; //base de camunda Local
const baseC = "http://10.35.3.162:8090"; //base de camunda Local
// const baseC = "http://172.20.91.148:8090"; // CAMBIOS DE LUIS
const base = "http://10.35.3.162"; //base de servicios local
// const base = "http://172.20.91.148"; // CAMBIOS DE LUIS
const baseRBP = "http://192.168.44.180"; //base de servicios RBP http://10.35.3.162
const baseG = "http://181.188.224.250:18043"; //base de servicios api gateway

export const pruebasLocales: boolean = true; //Varialbe boleana para las pruebas locales y pruebas en el ambiente del cliente, true para locales, false para RBP

// export const portalWorkFlow: string = "http://10.35.3.162:4200/";

export const codigoPerfilAprobadorFijo: string = "0004";

export const portalWorkFlow: string = pruebasLocales ? "http://10.35.3.162:4200/" : "http://192.168.44.180:4200/";
// export const portalWorkFlow: string = pruebas_locales ? "http://172.20.91.148:4200/" : "http://192.168.44.180:4200/"; // CAMBIOS DE LUIS

export const appCode: string = "46";
export const resourceCode: string = "PWFCAMUMET";
export const codigosPerfilReporte: string[] = ["0001", "0002"];
export const codigoPerfilDelegado: string = "0002";

export const codigosSolicitudReporte = {
	requisicionPersonal: "RRH PR 01 01",
	accionPersonal: "RRH PR 05 03",
	contratacionFamiliares: "RRH PR 01 04",
	reingresoPersonal: "RRH PR 01 03"
} as const;

export const environment = {
	port: "4200",
	production: false,
	modalConfirmation: false,
	reporteUS: pruebasLocales ? `${base}:8091/v1/us/reporte` : `${baseRBP}:8291/v1/us/reporte`,

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
	camundaUrl: pruebasLocales ? `${baseC}/` : `${baseRBP}:8290/`,
	// camundaUrl: `${baseG}/`,
	//camundaUrl: `${baseRBP}:8290/`,
	// camundaUrl: `localhost:8080/`,

	exempleadoServiceEsJaff: pruebasLocales ? `${base}:8076/v1/us/exempleadojaff` : `${baseRBP}:8279/v1/us/exempleadosp`,
	// exempleadoServiceEsJaff: `${baseG}/v1/us/exempleadojaff`,

	exempleadoServiceEsSpyral: `${base}:8079/v1/us/exempleadosp`,
	// exempleadoServiceEsSpyral: `${baseG}/v1/us/exempleadosp`,

	exempleadoService: pruebasLocales ? `${base}:8089/v1/us/exempleados_rbp` : `${baseRBP}:8289/v1/us/exempleados_rbp`,
	// exempleadoService: `${baseG}/v1/us/exempleados_rbp`,

	tipoSolicitudServiceES: pruebasLocales ? `${base}:8068/v1/es/tiposolicitud` : `${baseRBP}:8268/v1/es/tiposolicitud`,
	// tipoSolicitudServiceES: `${baseG}/v1/es/tiposolicitud`,
	//tipoSolicitudServiceES: `${baseRBP}:8268/v1/es/tiposolicitud`,

	seleccionCandidatoServiceES: pruebasLocales ? `${base}:8086/v1/es/seleccion_candidato` : `${baseRBP}:8286/v1/es/seleccion_candidato`,
	// seleccionCandidatoServiceES: `${baseG}/v1/es/seleccion_candidato`,

	tipoRutaServiceES: pruebasLocales ? `${base}:8069/v1/es/tiporuta` : `${baseRBP}:8269/v1/es/tiporuta`,
	// tipoRutaServiceES: `${baseG}/v1/es/tiporuta`,

	tipoProcesoServiceES: pruebasLocales ? `${base}:8070/v1/es/tipoproceso` : `${baseRBP}:8270/v1/es/tipoproceso`,
	// tipoProcesoServiceES: `${baseG}/v1/es/tipoproceso`,

	rutaServiceES: pruebasLocales ? `${base}:8071/v1/es/ruta` : `${baseRBP}:8271/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta
	// rutaServiceES: `${baseG}/v1/es/ruta`, //10.35.3.162:8071/v1/es/ruta

	tipoMotivoServiceES: pruebasLocales ? `${base}:8072/v1/es/tipomotivo` : `${baseRBP}:8272/v1/es/tipomotivo`, //10.35.3.162:8072/v1/es/tipomotivo
	// tipoMotivoServiceES: `${baseG}/v1/es/tipomotivo`,

	accionServiceES: pruebasLocales ? `${base}:8073/v1/es/accion` : `${baseRBP}:8273/v1/es/accion`,
	// accionServiceES: `${baseG}/v1/es/accion`,

	tipoAccionServiceES: pruebasLocales ? `${base}:8074/v1/es/tipoaccion` : `${baseRBP}:8274/v1/es/tipoaccion`, //10.35.3.162:8074/v1/es/tipoaccion
	// tipoAccionServiceES: `${baseG}/v1/es/tipoaccion`,

	CatalogoServiceES: pruebasLocales ? `${base}:8065/v1/es/item-catalogo` : `${baseRBP}:8265/v1/es/item-catalogo`,
	// CatalogoServiceES: `${baseG}/v1/es/item-catalogo`,

	nivelAprobacionServiceES: pruebasLocales ? `${base}:8067/v1/es/nivelesaprobacion` : `${baseRBP}:8267/v1/es/nivelesaprobacion`, //http://10.35.3.162:8000/v1/es/nivelesaprobacion
	// nivelAprobacionServiceES: `${baseG}/v1/es/nivelesaprobacion`,

	empleadoServiceEs: pruebasLocales ? `${base}:8078/v1/us/empleadoev` : `${baseRBP}:8278/v1/us/empleadoev`,
	// empleadoServiceEs: `${baseG}/v1/us/empleadoev`,

	nivelAprobacionRefreshServiceES: pruebasLocales ? `${base}:8075/v1/es/refresh_nivelesAprobacion` : `${baseRBP}:8275/v1/es/refresh_nivelesAprobacion`,
	// nivelAprobacionRefreshServiceES: `${baseG}/v1/es/refresh_nivelesAprobacion`,

	solicitudesServiceES: pruebasLocales ? `${base}:8066/v1/es/solicitud` : `${baseRBP}:8266/v1/es/solicitud`, // http://10.35.3.162:8066/v1/es/solicitud
	// solicitudesServiceES: `${baseG}/v1/es/solicitud`,

	tareasServiceES: pruebasLocales ? `${base}:8080/v1/es/solicitudcamunda` : `${baseRBP}:8280/v1/es/solicitudcamunda`,
	// tareasServiceES: `${baseG}/v1/es/solicitudcamunda`,

	aprobadoresFijosServiceES: pruebasLocales ? `${base}:8082/v1/es/aprobadores_fijos` : `${baseRBP}:8282/v1/es/aprobadores_fijos`,
	// aprobadoresFijosServiceES: `${baseG}/v1/es/aprobadores_fijos`,

	historicaCamundaServiceEs: pruebasLocales ? `${base}:8077/v1/es/historicacamunda` : `${baseRBP}:8277/v1/es/historicacamunda`,
	// historicaCamundaServiceEs: `${baseG}/v1/es/historicacamunda`,

	detalleAprobacionesServiceES: pruebasLocales ? `${base}:8083/v1/es/detalles_aprobaciones_solicitudes` : `${baseRBP}:8283/v1/es/detalles_aprobaciones_solicitudes`,
	// detalleAprobacionesServiceES: `${baseG}/v1/es/detalles_aprobaciones_solicitudes`,

	familiaresCandidatoServiceES: pruebasLocales ? `${base}:8087/v1/es/familiarescandidato` : `${baseRBP}:8287/v1/es/familiarescandidato`,
	// familiaresCandidatoServiceES: `${baseG}/v1/es/familiarescandidato`,

	senEmailService: pruebasLocales ? `${base}:8084/v1/es/mail` : `${baseRBP}:8285/v1/es/mail`,
	// senEmailService: `${baseG}/v1/es/mail`,

	comentarioServiceES: pruebasLocales ? `${base}:8088/v1/es/comentarios` : `${baseRBP}:8288/v1/es/comentarios`,
	// comentarioServiceES: `${baseG}/v1/es/comentarios`,

	// loginES: pruebas_locales ? `${base}:8308/api/us/integracion-seguridad/iguana/obtenercredenciales` : `${baseRBP}:8308/api/us/integracion-seguridad/obtenercredenciales`,
	loginES: pruebasLocales ? `${base}:8308/api/us/integracion-seguridad` : `${baseRBP}:8308/api/us/integracion-seguridad`

	// perfilUsuarioES: pruebasLocales ? `${base}:8308/api/us/integracion-seguridad/perfil-usuario` : `${baseRBP}:8308/api/us/integracion-seguridad/perfil-usuario`
};
