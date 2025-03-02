import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType, ArcElement, Tooltip, Legend } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#fdbe33', '#28a745', '#dc3545'],
      hoverBackgroundColor: ['#fdd87d', '#218838', '#c82333']
    }]
  };

  public pieChartType: ChartType = 'pie';

  constructor(private http: HttpClient) {
    // Register required Chart.js components
    Chart.register(ArcElement, Tooltip, Legend);
    Chart.register(Annotation);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<{ [key: string]: number }>('http://localhost:8081/BackendSyrine/advance/status')
      .subscribe({
        next: (response) => {
          console.log('Response:', response); // Debug log
          
          // Update chart data
          this.pieChartData = {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
              data: [
                response['Pending'] || 0,
                response['Approved'] || 0,
                response['Rejected'] || 0
              ],
              backgroundColor: ['#fdbe33', '#28a745', '#dc3545'],
              hoverBackgroundColor: ['#fdd87d', '#218838', '#c82333']
            }]
          };
        },
        error: (error) => {
          console.error('Error fetching chart data:', error);
        }
      });
  }
}
