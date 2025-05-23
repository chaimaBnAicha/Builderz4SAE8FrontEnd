import {Component, Input, OnInit, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import * as Chartist from 'chartist';
import { LineChart, PieChart, BarChart } from 'chartist';

export interface LegendItem {
  title: string;
  imageClass: string;
}

export enum ChartType {
  Pie,
  Line,
  Bar
}

@Component({
  selector: 'lbd-chart',
  templateUrl: './lbd-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdChartComponent implements OnInit, AfterViewInit {
  static currentId = 1;

  @Input()
  public title!: string;

  @Input()
  public subtitle: string = '';

  @Input()
  public chartClass!: string;

  @Input()
  public chartType: ChartType = ChartType.Line;

  @Input()
  public chartData: any;

  @Input()
  public chartOptions: any;

  @Input()
  public chartResponsive: any[] = [];

  @Input()
  public footerIconClass!: string;

  @Input()
  public footerText!: string;

  @Input()
  public legendItems!: LegendItem[];

  @Input()
  public withHr!: boolean;

  public chartId!: string;

  constructor() {
  }

  public ngOnInit(): void {
    this.chartId = `lbd-chart-${LbdChartComponent.currentId++}`;
  }

  public ngAfterViewInit(): void {
    console.log(this.chartData, this.chartOptions);  // Check data
    switch (this.chartType) {
      case ChartType.Pie:
        new Chartist.PieChart(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
        break;
      case ChartType.Line:
        new Chartist.LineChart(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
        break;
      case ChartType.Bar:
        new Chartist.BarChart(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
        break;
    }
  }}