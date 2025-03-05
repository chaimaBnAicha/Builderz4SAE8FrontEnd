import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') lineChartCanvas!: ElementRef;
  
  statusData: any[] = [];
  typeData: any[] = [];
  labels: string[] = [];
  chartData: any = null;
  view: [number, number] = [400, 300];
  chart: Chart | null = null;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Diagramme circulaire (Statut des offres)
    this.http.get('http://localhost:8081/BackendZagrouba/offer/status-count').subscribe((data: any) => {
      this.statusData = Object.keys(data).map(key => ({ name: key, value: data[key] }));
    });

    // Diagramme à barres (Type des offres)
    this.http.get('http://localhost:8081/BackendZagrouba/offer/type-count').subscribe((data: any) => {
      this.typeData = Object.keys(data).map(key => ({ name: key, value: data[key] }));
    });

    // Graphique sinusoïdal (Offres par mois)
    this.http.get('http://localhost:8081/BackendZagrouba/offer/monthly-count').subscribe((data: any) => {
      this.labels = Object.keys(data);
      this.chartData = {
        labels: this.labels,
        datasets: [{
          label: 'Offres par Mois',
          data: Object.values(data),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
      this.initializeChart();
    });
  }

  ngAfterViewInit() {
    // The chart will be initialized when data is loaded
  }

  private initializeChart() {
    if (this.chartData && this.lineChartCanvas) {
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart
      this.chart = new Chart(this.lineChartCanvas.nativeElement, {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions
      });
    }
  }
}
