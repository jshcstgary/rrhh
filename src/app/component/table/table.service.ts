import { Injectable } from "@angular/core";
import { TableComponentData } from "./table.data";
import {
  IRowTableAttributes,
  colTypeTable,
  sortColOrderType,
} from "./table.interface";

@Injectable({
  providedIn: "root",
})
export class TableService {
  public isAnyEditRowActive: boolean = false;
  public textEmptyTable: string = TableComponentData.textEmptyTable;
  public rowsCheckedByTable = {};
  public isAnyEditRowDefault: boolean = true;

  /* Funcion para inicializar todos los valores vacios o por defecto */
  public initializeAll() {
    this.isAnyEditRowActive = false;
    this.textEmptyTable = TableComponentData.textEmptyTable;
  }
  /* Funcion para actualizar el valor en caso de haber alguna fila de formulario activa */
  public changeStateIsAnyEditRowActive(state: boolean) {
    this.isAnyEditRowActive = state;
  }
  /**
   * Función para guardar los ID de los registros checkeados en la tabla
   *
   * @param tableName nombre de la tabla
   * @param rowsChecked Array con los ID de los registros checkeados
   */
  public onCheckTable(tableName: string, rowsChecked: string[]) {
    this.rowsCheckedByTable = {
      ...this.rowsCheckedByTable,
      [tableName]: rowsChecked,
    };
  }
  /**
   * Función para paginar la data
   *
   * @param dataToPaginate data a segmentar
   * @param pageNumber numero de pagina
   * @param pagesize tamaño de registros por pagina
   * @returns
   */
  public paginateDataToTable(
    dataToPaginate: any[],
    pageNumber: number,
    pagesize: number
  ): any[] {
    const inicioPagina = (pageNumber - 1) * pagesize;
    const finPagina = inicioPagina + pagesize;
    return dataToPaginate.slice(inicioPagina, finPagina);
  }
  /**
   * Función para filtrar la data por el sting obtenido en las propiedades recibidas
   *
   * @param dataToFilter data a filtrar
   * @param propsToFilter propiedades a filtrar
   * @param textToFilter texto por el cual filtrar
   * @returns
   */
  public filterDataByProps(
    dataToFilter: any[],
    propsToFilter: string[],
    textToFilter: string
  ) {
    return dataToFilter.filter((row) =>
      propsToFilter.some((prop) => {
        const propValue = row[prop];

        if (propValue !== undefined && propValue !== null) {
          return propValue
            .toString()
            .toLowerCase()
            .includes(textToFilter.toLowerCase());
        }

        return false;
      })
    );
  }

  /**
   * Función para darle formato a la data del response para que se coloque en la tabla
   *
   * @param dataToFormat data a la cual darle formato de la tabla
   * @param keyName nombre de la columna la cual identificaremos como el key
   * @returns Data con el formato de la tabla
   */
  public formatDataToTable<T>(
    dataToFormat: any[],
    keyName: keyof T
  ): IRowTableAttributes[] {
    return dataToFormat.map((row) => ({
      ...row,
      key: row[keyName]?.toString(),
    }));
  }
  /**
   * Funciòn para validar el tipo de columna y el tipo de dato
   *
   * @param dataToFilter
   * @param colName
   * @param sortColOrder
   * @param sortColType
   * @returns
   */
  public filterBySortColType(
    dataTable: any[],
    colName: string,
    sortColOrder: sortColOrderType,
    sortColType: colTypeTable = "string"
  ): any[] {
    const dataToFilter = dataTable;
    let dataFiltered: any[];
    switch (sortColType) {
      case "string":
        if (sortColOrder === "asc") {
          dataFiltered = this.onShortAscString(dataToFilter, colName);
        } else if (sortColOrder === "desc") {
          dataFiltered = this.onShortDescString(dataToFilter, colName);
        }
        break;
      case "number":
        if (sortColOrder === "asc") {
          dataFiltered = this.onShortAscNumber(dataToFilter, colName);
        } else if (sortColOrder === "desc") {
          dataFiltered = this.onShortDescNumber(dataToFilter, colName);
        }
        break;

      default:
        break;
    }
    return dataFiltered;
  }
  /**
   * Funciòn para ordenar la data por columna de tipo numerico de forma ascendete
   *
   * @param array data de la tabla
   * @param propiedad nombre de la columna
   * @returns
   */
  private onShortDescNumber(array: any[], propiedad: string) {
    return array.slice().sort((a, b) => a[propiedad] - b[propiedad]);
  }
  /**
   * Funciòn para ordenar la data por columna de tipo numerico de forma descendente
   *
   * @param array data de la tabla
   * @param propiedad nombre de la columna
   * @returns
   */
  private onShortAscNumber(array: any[], propiedad: string) {
    return array.slice().sort((a, b) => b[propiedad] - a[propiedad]);
  }
  /**
   * Funciòn para ordenar la data por columna de tipo string de forma ascendete
   *
   * @param array data de la tabla
   * @param propiedad nombre de la columna
   * @returns
   */
  private onShortDescString(array: any[], propiedad: string) {
    return array
      .slice()
      .sort((a, b) => a[propiedad].localeCompare(b[propiedad]));
  }
  /**
   * Funciòn para ordenar la data por columna de tipo string de forma descendente
   *
   * @param array data de la tabla
   * @param propiedad nombre de la columna
   * @returns
   */
  private onShortAscString(array: any[], propiedad: string) {
    return array
      .slice()
      .sort((a, b) => b[propiedad].localeCompare(a[propiedad]));
  }
}
