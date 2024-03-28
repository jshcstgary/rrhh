import { IBackButtonComponent } from "./back-button.interface";

export const BackButtonComponentData: IBackButtonComponentData = {
  defaultConf: { mainText: "", onBackFunction: null },
};
interface IBackButtonComponentData {
  defaultConf: IBackButtonComponent;
}
