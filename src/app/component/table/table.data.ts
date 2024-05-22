export const TableComponentData: ITableComponentData = {
  textEmptyTable: "Sin registros existentes",
  rowsPerPage: [5, 10, 15, 20, 25, 50, 100],
  defaultRowPerPage: 10,
};
interface ITableComponentData {
  textEmptyTable: string;
  rowsPerPage: number[];
  defaultRowPerPage: number;
}
