import { SweetAlertOptions } from "sweetalert2";

export const UtilData: IUtilData = {
  messageToSave: {
    title: "¿Desea ingresar los datos?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#004998",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  },
};
interface IUtilData {
  messageToSave: SweetAlertOptions;
}
