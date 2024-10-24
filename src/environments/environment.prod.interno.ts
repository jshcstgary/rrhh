const base = "http://10.35.3.175";
export const environment = {
  port: "4200",
  production: false,
  modalConfirmation: false,
  haciendaES: `${base}:8064/v1/es/hacienda`,
  homologacionHaciendaES: `${base}:8064/v1/es/homologacion-hacienda`,
  cintaColorES: `${base}:8062/v1/es/cintacolor` ,
  catalogoServiceES: `${base}:8053/v1/es`,
  tipoViviendaServiceES: `${base}:8041/v1/es/tipo-vivienda`,
  maquinariaServiceES:`${base}:8060/v1/es/maquinaria` ,
  zonaES: `${base}:8050/v1/es/zona`,
  subZonaES: `${base}:8042/v1/es/subzona` ,
  localizacionEs:`${base}:8080/v1/es/localizacion` ,
  tipoCajaES:`${base}:8054/v1/es/tipocaja` ,
  taraServiceES: `${base}:8049/v1/es/tara` ,
  puertosServiceES: `${base}:8052/v1/es/puerto`,
  hitoMuestreoServiceES:`${base}:8046/v1/es/hito-muestreo`,
  defectoCalidadES: `${base}:8063/v1/es/defectocalidad`,
  defectoES: `${base}:8079/v1/es/defecto` ,
  estacionalidadServiceES:`${base}:8065/v1/es/estacionalidad` ,
  tensiometroServiceES:`${base}:8066/v1/es/tensiometro` ,
  muestreoServiceES:`${base}:8046/v1/es/muestreo` ,
  semanaPeriodoES: `${base}:8047/v1/es/periodo`,
  embalajesServiceES:`${base}:8051/v1/es/embalaje` ,
  causalesServiceES: `${base}:8048/v1/es/causales` ,
  empacadoraServiceES:`${base}:8073/v1/es/empacadora`,
  transportistaES: `${base}:8077/v1/es/transportistas`,
  TransporteTransportistaES: `${base}:8077/v1/es/transportistas/transportistas`,
  controlCamionesServiceES: "",
  loteServicesES:"" ,
  tipoPlantacionEndPointES: `${base}:8082/v1/es/tipoplantacion`,
  productoFrutaEndPointES: `${base}:8053/v1/es/item-catalogo/codigo/PRODUCTO_FRUTA`,
  marcaEndPointES: `${base}:8053/v1/es/item-catalogo/codigo/MARCAS`,
  sectorES: `${base}:8040/v1/es/sector` ,
  tipoCanalES: `${base}:8090/v1/es/tipo-canal`,
  invFacUS: "" ,
  procesoES: "" ,
  optimomaterialesEs: "" ,
  parametropesajeEs:"" ,
  laboresgenericasEs:"" ,
  productoembarqueEs: "" ,
  reporteUS: "" ,
  tipocontabilizacionES:"" ,
  viviendaES:`${base}:8041/v1/es/vivienda`,
  controlCamionesEs: `${base}:8097/v1/es/control-camiones`,
  itemProductoEs: `${base}:8096/v1/es/ItemProducto`
};
