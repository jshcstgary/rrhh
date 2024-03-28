import { Component, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";

export type siteatrafficchartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  colors: string[] | any;
};

export type sitebtrafficchartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  colors: string[] | any;
};

export type sitectrafficchartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  colors: string[] | any;
};

@Component({
  selector: 'app-site-traffic',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './site-traffic.component.html'
})
export class SiteTrafficComponent {

  @ViewChild("siteatrafficchartOptions") chart: ChartComponent = Object.create(null);
  public siteatrafficchartOptions: Partial<siteatrafficchartOptions>;

  @ViewChild("sitebtrafficchartOptions") chart2: ChartComponent = Object.create(null);
  public sitebtrafficchartOptions: Partial<sitebtrafficchartOptions>;

  @ViewChild("sitectrafficchartOptions") chart3: ChartComponent = Object.create(null);
  public sitectrafficchartOptions: Partial<sitectrafficchartOptions>;

  constructor() {
    
    this.siteatrafficchartOptions = {
      series: [
        {
          name: "Site A Traffic",
          data: [22, 20, 26, 25, 19]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['#99d683'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#99d683",
        height: 60,
        type: "area",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 0,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "#99d683",
          gradientToColors: ["#99d683"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      tooltip: {
        theme: "dark",
        fillSeriesColor: true,
      },
    };

    this.sitebtrafficchartOptions = {
      series: [
        {
          name: "Site B Traffic",
          data: [22, 20, 26, 25, 19]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['#13dafe'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#13dafe",
        height: 60,
        type: "area",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 0,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "#13dafe",
          gradientToColors: ["#13dafe"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      tooltip: {
        theme: "dark",
        fillSeriesColor: true,
      },
    };

    this.sitectrafficchartOptions = {
      series: [
        {
          name: "Site C Traffic",
          data: [22, 20, 26, 25, 19]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['#ffdb4a'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#ffdb4a",
        height: 60,
        type: "area",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 0,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "#ffdb4a",
          gradientToColors: ["#ffdb4a"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      tooltip: {
        theme: "dark",
        fillSeriesColor: true,
      },
    };

  }


  
}
