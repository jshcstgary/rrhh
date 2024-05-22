import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";

export const VerticalNavigationData: IVerticalNavigationData = {
  userDropdownOptions: [{ id: "cerrar sesion", name: "Cerrar Sesión" }],
  dropdownButtonClasses: ["text-warning"],
};
interface IVerticalNavigationData {
  userDropdownOptions: IDropdownOptions;
  dropdownButtonClasses: string[];
}
