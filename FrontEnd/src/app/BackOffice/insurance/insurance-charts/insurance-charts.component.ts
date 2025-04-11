import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-insurance-charts',
  templateUrl: './insurance-charts.component.html',
  styleUrls: ['./insurance-charts.component.css']
})
export class InsuranceChartsComponent implements OnInit {
  @ViewChild('statusChart') statusChartCanvas!: ElementRef;
  
  statusData: any[] = [];
  chart: Chart | null = null;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadStatusData();
  }

  loadStatusData(): void {
    this.http.get('http://localhost:8081/Insurance/status-count').subscribe((data: any) => {
      this.statusData = Object.keys(data).map(key => ({
        name: key,
        value: data[key]
      }));
      this.initializeChart();
    });
  }

  private initializeChart(): void {
    if (this.statusChartCanvas) {
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      const chartData = {
        labels: this.statusData.map(item => item.name),
        datasets: [{
          data: this.statusData.map(item => item.value),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)', // Valid
            'rgba(255, 99, 132, 0.6)'  // Expired
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      };

      // Create new chart
      this.chart = new Chart(this.statusChartCanvas.nativeElement, {
        type: 'pie',
        data: chartData,
        options: this.chartOptions
      });
    }
  }
} 