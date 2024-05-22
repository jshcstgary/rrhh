import { Component, ViewChild } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

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

export type sitevisitschartOptions = {
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
  selector: 'app-site-visit',
  standalone: true,
  imports: [NgbProgressbarModule, NgApexchartsModule],
  templateUrl: './site-visit.component.html'
})
export class SiteVisitComponent {

  @ViewChild("sitevisitschartOptions") chart2: ChartComponent = Object.create(null);
  public sitevisitschartOptions: Partial<sitevisitschartOptions>;

  constructor() { 

    this.sitevisitschartOptions = {
      series: [
        {
          name: "site A",
          data: [30, 400, 100, 400, 150, 275, 135, 200, 218]
        },
        {
          name: "site B",
          data: [130, 340, 200, 350, 250, 130, 189, 153, 258]
        },
      ],
      dataLabels: {
        enabled: false
      },
      colors:['#2961ff', '#40c4ff'],
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
            show: false
          }
        },  
      },
      legend: {
        show: false,
      },
      stroke: {
        width: 1,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#6993ff"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 0.5,
          opacityTo: 0.5,
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
            '2013-01-01',
            '2013-01-02',
            '2013-01-03',
            '2013-01-04',
            '2013-01-05',
            '2013-01-06',
            '2013-01-07',
            '2013-01-08',
            '2013-01-09'
          ],
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        axisTicks: {
          show: true,
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

  }
  

  
}
