import { Component, ViewChild } from "@angular/core";
import { ProjectCounterComponent } from "../dashboard-components/project-counter/project-counter.component";
import { RecentcommentComponent } from "../dashboard-components/recent-comment/recent-comment.component";
import { TodoComponent } from "../dashboard-components/to-do/todo.component";
import { RecentmessageComponent } from "../dashboard-components/recent-message/recent-message.component";
import { FeedsComponent } from "../dashboard-components/feeds/feeds.component";
import { EarningComponent } from "../dashboard-components/earning-report/earning-report.component";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";

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

export type yearlysaleschartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  grid: ApexGrid | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
  markers: ApexLegend | any;
  colors: string[] | any;
};


export type salesanalysischartOptions = {
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

export type yearlysaleschartOptions2 = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  grid: ApexGrid | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
  markers: ApexLegend | any;
  colors: string[] | any;
};

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

export type salesanalysischartOptions2 = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  labels: string[] | any;
};



@Component({
  templateUrl: "./dashboard1.component.html",
  standalone: true,
  imports: [ProjectCounterComponent, RecentcommentComponent, TodoComponent, RecentmessageComponent, FeedsComponent, EarningComponent, NgbCarouselModule, NgApexchartsModule],
  styleUrls: ["./dashboard1.component.css"],
})
export class Dashboard1Component {

  @ViewChild("yearlysaleschartOptions") chart: ChartComponent = Object.create(null);
  public yearlysaleschartOptions: Partial<yearlysaleschartOptions>;

  @ViewChild("salesanalysischartOptions") chart1: ChartComponent = Object.create(null);
  public salesanalysischartOptions: Partial<salesanalysischartOptions>;

  @ViewChild("yearlysaleschartOptions2") chart2: ChartComponent = Object.create(null);
  public yearlysaleschartOptions2: Partial<yearlysaleschartOptions2>;

  @ViewChild("visitstatisticschartOptions") chart3: ChartComponent = Object.create(null);
  public visitstatisticschartOptions: Partial<visitstatisticschartOptions>;

  @ViewChild("salesanalysischartOptions2") chart4: ChartComponent = Object.create(null);
  public salesanalysischartOptions2: Partial<salesanalysischartOptions2>;


  subtitle: string;
  constructor() {

    this.yearlysaleschartOptions = {
      series: [
        {
        
          name: "iphone",
          data: [50, 130, 80, 70, 180, 105, 250]
        },
        {
          name: "ipad",
          data: [80, 100, 60, 200, 150, 100, 150]
        },
        {
          name: "itouch",
          data: [20, 80, 70, 140, 140, 80, 200]
        },
      ],
      colors:['#7460ee', '#03a9f3', '#fb9678'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 315,
        type: "line",
        toolbar: {
          show: false,
        },
        stacked: false
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },   
        yaxis: {
          lines: {
            show: true
          }
        },  
      },
      legend: {
        show: false,
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#6993ff"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        labels: {
          show: true,
        },
        type: 'category',
          categories: [
            "2010", "2011", "2012", "2013", "2014", "2015", "2016"
          ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
       
      },
      yaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
        },
      },
      tooltip: {
        theme: "dark",
        fillSeriesColor: true,
      },
    };

    this.salesanalysischartOptions = {
      series: [
        {
          name: "",
          data: [1.1, 1.4, 1.1, 0.9, 1.7, 1, 0.3, 1.1, 1.4, 1.1, 0.9, 1.7],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 135,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["rgba(255, 255, 255, 0.5)"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "45%",
          barHeight: "100%",
          // endingShape: "rounded",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2.5,
        colors: ["rgba(0,0,0,0.01)"],
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

    this.yearlysaleschartOptions2 = {
      series: [
        {
        
          name: "site A",
          data: [0, 130, 80, 70, 180, 105, 250]
        },
        {
          name: "site B",
          data: [0, 100, 60, 200, 150, 100, 150]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['rgba(3,169,243,0.1)', 'rgba(171,140,228,0.1)'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#adb0bb",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        stacked: false
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },   
        yaxis: {
          lines: {
            show: true
          }
        },  
      },
      legend: {
        show: false,
      },
      stroke: {
        width: 0,
        curve: "straight",
      },
      fill: {
        type: "solid",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        labels: {
          show: true,
        },
        type: 'category',
          categories: [
            "2010", "2011", "2012", "2013", "2014", "2015", "2016"
          ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
       
      },
      yaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
        },
      },
      tooltip: {
        theme: "dark",
        fillSeriesColor: true,
      },
    };

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
        height: 160,
  
        resize: true,
        barColor: "#fff",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#03a9f3"],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: "flat",
          endingShape: "flat",
          columnWidth: "20%",
          barHeight: "100%",
          // endingShape: "rounded",
          distributed: true,
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      // stroke: {
      //   show: true,
      //   width: 3,
      //   colors: ["rgba(0,0,0,0.01)"],
      // },
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

    this.salesanalysischartOptions2 = {
      labels: ['Sales', 'Earning', 'Cost'],
      series: [300, 500, 100],
      colors:['#03a9f3', '#4c5667', '#ffffff'],
      chart: {
        width: 160,
        type: 'pie',
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#ab8ce4"]
      },
      grid: {
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },  
      }
    }; 



    this.subtitle = "This is some text within a card block.";
  }
  
}
