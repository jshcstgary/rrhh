import { Component, ViewChild } from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexGrid,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";


export type visitstatisticschartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  axisBorder: string[] | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
};

export type totalpageviewschartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  axisBorder: string[] | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
};

export type uniquevisitorchartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  axisBorder: string[] | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
};

export type bounceratechartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  axisBorder: string[] | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
};


@Component({
  selector: "app-pa",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./pa.component.html",
})
export class PageAnalyzerComponent {

  @ViewChild("visitstatisticschartOptions") chart: ChartComponent = Object.create(null);
  public visitstatisticschartOptions: Partial<visitstatisticschartOptions>;

  @ViewChild("totalpageviewschartOptions") chart2: ChartComponent = Object.create(null);
  public totalpageviewschartOptions: Partial<totalpageviewschartOptions>;

  @ViewChild("uniquevisitorchartOptions") chart3: ChartComponent = Object.create(null);
  public uniquevisitorchartOptions: Partial<uniquevisitorchartOptions>;

  @ViewChild("bounceratechartOptions") chart4: ChartComponent = Object.create(null);
  public bounceratechartOptions: Partial<bounceratechartOptions>;

  constructor() {

    this.visitstatisticschartOptions = {
      series: [
        {
          name: "",
          data: [1.1, 1.4, 1.1, 0.9, 2.1, 1, 0.3],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 55,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#18c79c"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "15%",
          barHeight: "100%",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },      
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
        },
        x: {
          show: false,
        },
      },
    };

    this.totalpageviewschartOptions = {
      series: [
        {
          name: "",
          data: [1.1, 1.4, 1.1, 0.9, 2.1, 1, 0.3],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 55,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#b397e6"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "15%",
          barHeight: "100%",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },      
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
        },
        x: {
          show: false,
        },
      },
    };

    this.uniquevisitorchartOptions = {
      series: [
        {
          name: "",
          data: [1.1, 1.4, 1.1, 0.9, 2.1, 1, 0.3],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 55,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#1bb1f4"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "15%",
          barHeight: "100%",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },      
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
        },
        x: {
          show: false,
        },
      },
    };

    this.bounceratechartOptions = {
      series: [
        {
          name: "",
          data: [1.1, 1.4, 1.1, 0.9, 2.1, 1, 0.3],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 55,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#fba085"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "15%",
          barHeight: "100%",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },      
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
        },
        x: {
          show: false,
        },
      },
    };

  }


}
