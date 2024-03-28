import { Component, ViewChild } from "@angular/core";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { IncomeCounterComponent } from "../dashboard-components/income-counter/income-counter.component";


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

export type incomecounterchartOptions = {
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

export type totalsitevisitschartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  labels: string[] | any;
};

export type salesdifferencechartOptions = {
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
  templateUrl: "./dashboard2.component.html",
  standalone: true,
  imports: [IncomeCounterComponent, NgbCarouselModule, NgApexchartsModule],
  styleUrls: ["./dashboard2.component.css"],
})
export class Dashboard2Component {

  @ViewChild("incomecounterchartOptions") chart: ChartComponent = Object.create(null);
  public incomecounterchartOptions: Partial<incomecounterchartOptions>;

  @ViewChild("yearlysaleschartOptions") chart2: ChartComponent = Object.create(null);
  public yearlysaleschartOptions: Partial<yearlysaleschartOptions>;

  @ViewChild("totalsitevisitschartOptions") chart3: ChartComponent = Object.create(null);
  public totalsitevisitschartOptions: Partial<totalsitevisitschartOptions>;

  @ViewChild("salesdifferencechartOptions") chart4: ChartComponent = Object.create(null);
  public salesdifferencechartOptions: Partial<salesdifferencechartOptions>;

  
  subtitle: string;
  constructor() {

    this.incomecounterchartOptions = {
      series: [
        {
        
          name: "iphone",
          data: [0, 50, 20, 60, 30, 25, 10]
        },
        {
          name: "ipad",
          data: [0, 15, 50, 12, 20, 80, 10]
        },
        {
          name: "itouch",
          data: [0, 5, 65, 7, 120, 40, 10]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['rgba(192,200,215,0.9)', 'rgba(1,192,200,0.5)', 'rgba(251,150,120,0.5)'],
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
        size: 3,
        strokeColors: 'transparant',
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
          show: true,
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

    this.yearlysaleschartOptions = {
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

    this.totalsitevisitschartOptions = {
      labels: ['Sales', 'Earning', 'Cost'],
      series: [300, 500, 100],
      colors:['#4c5667', '#fec107', '#cccccc'],
      chart: {
        width: 140,
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
        colors: ["#ffffff"]
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

    this.salesdifferencechartOptions = {
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

    this.subtitle = "This is some text within a card block.";
  }
 
}
