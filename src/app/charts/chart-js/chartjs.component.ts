import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  NgChartsModule,
  NgChartsConfiguration,
  BaseChartDirective,
} from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  templateUrl: './chartjs.component.html',
  imports: [NgChartsModule],
  standalone: true,
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
})
export class ChartjsComponent implements AfterViewInit {
  // bar chart
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }

  // Doughnut chart
  public doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [350, 450, 100] },
      { data: [50, 150, 120] },
      { data: [250, 130, 70] },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked2({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered2({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  // Radar
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public radarChartLabels: string[] = [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running',
  ];

  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' },
    ],
  };
  public radarChartType: ChartType = 'radar';

  // events
  public chartClicked3({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered3({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DataLabelsPlugin];

  // events
  public chartClicked4({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered4({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  changeLabels(): void {
    const words = [
      'hen',
      'variable',
      'embryo',
      'instal',
      'pleasant',
      'physical',
      'bomber',
      'army',
      'add',
      'film',
      'conductor',
      'comfortable',
      'flourish',
      'establish',
      'circumstance',
      'chimney',
      'crack',
      'hall',
      'energy',
      'treat',
      'window',
      'shareholder',
      'division',
      'disk',
      'temptation',
      'chord',
      'left',
      'hospital',
      'beef',
      'patrol',
      'satisfied',
      'academy',
      'acceptance',
      'ivory',
      'aquarium',
      'building',
      'store',
      'replace',
      'language',
      'redeem',
      'honest',
      'intention',
      'silk',
      'opera',
      'sleep',
      'innocent',
      'ignore',
      'suite',
      'applaud',
      'funny',
    ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartData.labels = new Array(3).map((_) => randomWord());

    this.chart?.update();
  }

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push(['Line 1', 'Line 2', 'Line 3']);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position =
        this.pieChartOptions.plugins.legend.position === 'left'
          ? 'top'
          : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display =
        !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }

  // PolarArea
  public polarAreaChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail Sales',
    'Telesales',
    'Corporate Sales',
  ];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [
      {
        data: [300, 500, 100, 40, 120],
        label: 'Series 1',
      },
    ],
  };
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  // events
  public chartClicked5({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered5({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  // scatter
  public scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public scatterChartLabels: string[] = [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running',
  ];

  public scatterChartData: ChartData<'scatter'> = {
    labels: this.scatterChartLabels,
    datasets: [
      {
        data: [
          { x: 1, y: 1 },
          { x: 2, y: 3 },
          { x: 3, y: -2 },
          { x: 4, y: 4 },
          { x: 5, y: -3 },
        ],
        label: 'Series A',
        pointRadius: 10,
      },
    ],
  };
  public scatterChartType: ChartType = 'scatter';

  // events
  public chartClicked6({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered6({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  constructor() {}

  ngAfterViewInit() {}
}
