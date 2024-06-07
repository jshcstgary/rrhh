import { IColumnsTable } from "src/app/component/table/table.interface";

export const dataTableDatosFamiliares = [
  {
    name: "Nombre 1",
    dateIn: "01/01/2021",
    position: "Cargo 1",
    unit: "Unidad 1",
    departament: "Departamento 1",
    location: "Localidad 1",
    relationship: "Parentesco 1",
  },
  {
    name: "Nombre 2",
    dateIn: "02/02/2022",
    position: "Cargo 2",
    unit: "Unidad 2",
    departament: "Departamento 2",
    location: "Localidad 2",
    relationship: "Parentesco 2",
  },
  {
    name: "Nombre 3",
    dateIn: "03/03/2023",
    position: "Cargo 3",
    unit: "Unidad 3",
    departament: "Departamento 3",
    location: "Localidad 3",
    relationship: "Parentesco 3",
  },
  {
    name: "Nombre 4",
    dateIn: "04/04/2024",
    position: "Cargo 4",
    unit: "Unidad 4",
    departament: "Departamento 4",
    location: "Localidad 4",
    relationship: "Parentesco 4",
  },
  {
    name: "Nombre 5",
    dateIn: "05/05/2025",
    position: "Cargo 5",
    unit: "Unidad 5",
    departament: "Departamento 5",
    location: "Localidad 5",
    relationship: "Parentesco 5",
  },
];

export const columnsDatosFamiliares: IConsultaTareasData = {
  columns: [
    {
      title: "Nombre",
      dataIndex: "name",
      // align: "center",
      sortActive: true,
    },
    {
      title: "Fecha de Ingreso",
      dataIndex: "dateIn",
      sortActive: true,
    },
    {
      title: "Cargo",
      dataIndex: "position",
      sortActive: true,
    },
    {
      title: "Unidad",
      dataIndex: "unit",
      sortActive: true,
    },
    {
      title: "Departamento",
      dataIndex: "departament",
      sortActive: true,
    },
    {
      title: "Localidad",
      dataIndex: "location",
      sortActive: true,
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
      sortActive: true,
    },
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        { materialIcon: "info", id: "editOnTable", tooltip: "Acciones" },
        { materialIcon: "delete", id: "delete", tooltip: "Eliminar" },
        // {
        //   materialIcon: "content_copy",
        //   id: "cloneOnTable",
        //   tooltip: "Duplicar",
        // },
      ],
    },
  ],
  // colsToFilterByTextIdSolicitud: ["idSolicitud", "name"],
  colsToFilterByTextName: ["name"],
};

export interface IConsultaTareasData {
  columns: IColumnsTable;
  // colsToFilterByTextIdSolicitud: string[];
  colsToFilterByTextName: string[];
}