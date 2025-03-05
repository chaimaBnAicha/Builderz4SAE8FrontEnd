import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  constructor(private http: HttpClient) {
    // Register required Chart.js components
    Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  public barChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: '#36A2EB',
      hoverBackgroundColor: '#4BC0C0',
      label: 'Monthly Data'
    }]
  };

  public barChartType: ChartType = 'bar';

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<{ [key: string]: number }>('http://localhost:8081/BackendSyrine/advance/monthly')
      .subscribe({
        next: (response) => {
          console.log('Response:', response);
          
          // Define month order
          const monthOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          // Sort the data according to month order
          const sortedLabels = Object.keys(response).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
          );
          
          this.barChartData = {
            labels: sortedLabels,
            datasets: [{
              data: sortedLabels.map(month => response[month]),
              backgroundColor: '#36A2EB',
              hoverBackgroundColor: '#4BC0C0',
              label: 'Monthly Advances'
            }]
          };
        },
        error: (error) => {
          console.error('Error fetching chart data:', error);
        }
      });
  }
}
