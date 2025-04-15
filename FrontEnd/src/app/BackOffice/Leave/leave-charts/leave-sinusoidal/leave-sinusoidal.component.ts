import { Component, OnInit } from '@angular/core';
import { LeaveStatisticsService } from '../../../../Service/leave-statistics.service';

@Component({
  selector: 'app-leave-sinusoidal',
  templateUrl: './leave-sinusoidal.component.html',
  styleUrls: ['./leave-sinusoidal.component.css']
})
export class LeaveSinusoidalComponent implements OnInit {
  sinusoidalChartData: any = {
    labels: [],
    datasets: [{
      label: 'Average Duration (Days)',
      data: [],
      borderColor: '#3788d8',
      backgroundColor: 'rgba(55, 136, 216, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  sinusoidalChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Average Leave Duration by Type',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  constructor(private leaveStatsService: LeaveStatisticsService) { }

  ngOnInit() {
    this.loadSinusoidalChartData();
  }

  loadSinusoidalChartData() {
    this.leaveStatsService.getAverageLeaveDuration().subscribe(data => {
      this.sinusoidalChartData.labels = Object.keys(data);
      this.sinusoidalChartData.datasets[0].data = Object.values(data);
    });
  }
} 