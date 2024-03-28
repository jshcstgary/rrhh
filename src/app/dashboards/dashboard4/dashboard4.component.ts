import { Component, ViewChild } from "@angular/core";
import { SiteTrafficComponent } from "../dashboard-components/site-traffic/site-traffic.component";
import { SiteVisitComponent } from "../dashboard-components/site-visit/site-visit.component";
import { BrowserComponent } from "../dashboard-components/browser/browser.component";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";

export type cpuloadchartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
  markers: ApexLegend | any;
  colors: string[] | any;
  labels: string[] | any;
};

@Component({
  templateUrl: "./dashboard4.component.html",
  standalone: true,
  imports: [SiteTrafficComponent, SiteVisitComponent, BrowserComponent, NgApexchartsModule],
  styleUrls: ["./dashboard4.component.css"],
})
export class Dashboard4Component {

  @ViewChild("cpuloadchartOptions") chart: ChartComponent = Object.create(null);
  public cpuloadchartOptions: Partial<cpuloadchartOptions>;

  constructor() {

    this.cpuloadchartOptions = {
      series: [45, 27, 15],
      labels: ["Usage", "Space", "CPU"],
      chart: {
        type: "donut",
        fontFamily: "Plus Jakarta Sans', sans-serif",
        foreColor: "#adb0bb",
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                color: '#686868',
                fontSize: '14px',
                fontWeight: "400",
                label: 'CPU',
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        show: true,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      colors: ["#fec107", "#00c292", "#03a9f3"],
      tooltip: {
        theme: "dark",
        fillSeriesColor: false,
      },
    };

  }


  
}
