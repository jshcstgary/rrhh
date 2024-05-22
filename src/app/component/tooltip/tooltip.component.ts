import { Component, Input } from "@angular/core";

@Component({
  selector: "tooltip-component",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
})
export class TooltipComponent {
  @Input() public text: string = "";
  @Input() public position: string = "top";
}
