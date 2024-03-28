import { Component, ViewChild } from '@angular/core';
import { FeedsComponent } from '../dashboard-components/feeds/feeds.component';
import { PageAnalyzerComponent } from '../dashboard-components/page-analyzer/pa.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

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

export type salesinchartOptions = {
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

@Component({
  templateUrl: './dashboard3.component.html',
  standalone: true,
  imports: [FeedsComponent, PageAnalyzerComponent, NgScrollbarModule, NgApexchartsModule],
  styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component {

  @ViewChild("salesinchartOptions") chart: ChartComponent = Object.create(null);
  public salesinchartOptions: Partial<salesinchartOptions>;
  
  subtitle: string;
  constructor() {

    this.salesinchartOptions = {
      series: [
        {
          name: "Iphone",
          data: [10, 1667, 4912, 3767, 6810, 5670, 4820, 15073, 8087, 10]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['#a5d9c7'],
      chart: {
        fontFamily: "Poppins, sans-serif",
        foreColor: "#a5d9c7",
        height: 250,
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
          shade: "#a5d9c7",
          gradientToColors: ["#a5d9c7"],
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
            "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"
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

    this.subtitle = "This is some text within a card block.";
  }


  
}
