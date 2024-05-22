import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import {
  IActionsTable,
  IColumnTable,
} from "src/app/component/table/table.interface";
import { SweetAlertOptions } from "sweetalert2";

const defaultActionsItems: IActionsTable = [
  { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
  {
    materialIcon: "content_copy",
    id: "cloneOnTable",
    tooltip: "Duplicar",
  },
  {
    materialIcon: "delete_forever",
    id: "delete",
    tooltip: "Suprimir",
  },
];

export const PlantillaAData: IPlantillaAData = {
  dropdownOptionsExport: [
    {
      id: "PDF",
      name: "PDF",
      icon: "fas fa-file-pdf",
    },
    {
      id: "EXCEL",
      name: "EXCEL",
      icon: "fas fa-file-excel",
    },
    {
      id: "CSV",
      name: "CSV",
      icon: "fas fa-file-alt",
    },
  ],
  initialColumns: {
    type: "checkbox",
    width: "65px",
  },
  swalDeleteOptions: {
    title: `¿Esta seguro que desea eliminar el siguiente registro?`,
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Eliminar",
  },
  defaultActions: {
    title: "Acciones",
    type: "actions",
    width: "125px",
    actions: defaultActionsItems,
  },
  defaultActionsItems: defaultActionsItems,
};
interface IPlantillaAData {
  dropdownOptionsExport: IDropdownOptions;
  initialColumns: IColumnTable;
  swalDeleteOptions: SweetAlertOptions;
  defaultActions: IColumnTable;
  defaultActionsItems: IActionsTable;
}
