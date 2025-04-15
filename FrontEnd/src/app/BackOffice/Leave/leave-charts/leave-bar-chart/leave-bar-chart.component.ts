import { Component, OnInit } from '@angular/core';
import { LeaveStatisticsService } from '../../../../Service/leave-statistics.service';

@Component({
  selector: 'app-leave-bar-chart',
  templateUrl: './leave-bar-chart.component.html',
  styleUrls: ['./leave-bar-chart.component.css']
})
export class LeaveBarChartComponent implements OnInit {
  barChartData: any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Approved Leaves',
      data: Array(12).fill(0),
      backgroundColor: 'rgba(55, 136, 216, 0.6)',
      borderColor: '#3788d8',
      borderWidth: 1
    }]
  };

  barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Approved Leaves by Month',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  constructor(private leaveStatsService: LeaveStatisticsService) { }

  ngOnInit() {
    this.loadBarChartData();
  }

  loadBarChartData() {
    this.leaveStatsService.getLeavesByMonth().subscribe(data => {
      const monthlyData = Array(12).fill(0);
      Object.entries(data).forEach(([month, count]) => {
        monthlyData[parseInt(month) - 1] = count;
      });
      this.barChartData.datasets[0].data = monthlyData;
    });
  }
} 