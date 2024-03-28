//import atributos tabla
import { IRowTableAttributes } from "src/app/component/table/table.interface";


/*Labor Generica */

//Interface Entidad
export interface ILaborGenerica {
    aplicativoId?: string;
    estacion?: string;
    fechaActualizacion?: Date;
    fechaCreacion?: Date;
    horaCreacion?: Date;
    horaActualizacion?: Date;
    menuId?: string;
    usuarioCreacion?: string;
    usuarioActualizacion?: string;
    estado?: string;
    codigoProducto: number;
    producto?: string;
    codigoTipoLabor: number;
    tipoLabor?: string;
    codigoLaborGenerico: number;
    laborGenerico?: string;
    unidadMedida?: string;
    laborExcepcion?: string;
    codigoTipoCaja?: string;
    
  }
  
  //Interface table
  //export interface ILaborGenericaTable extends ILaborGenerica, IRowTableAttributes {}
  
  //Listas
  export type ILaboresGenericas = ILaborGenerica[];
  
  //Tablas
  //export type ILaboresGenericasTable= ILaborGenericaTable[];
  
  //Response Servicio
  export interface ILaborGenericaResponse {
    totalRegistros: number;
    laboresGenericasTypes: ILaboresGenericas;
  }
  