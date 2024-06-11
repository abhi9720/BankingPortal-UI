import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-daily-transaction-chart',
  templateUrl: './daily-transaction-chart.component.html',
  styleUrls: ['./daily-transaction-chart.component.css'],
})
export class DailyTransactionChartComponent implements OnInit {
  @Input() transactions: TransactionComponent[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: any = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  constructor() {}

  ngOnInit(): void {
    // Group transactions by month and calculate monthly total for each type
    const monthlyData: { [monthYear: string]: { [type: string]: number } } = {};

    this.transactions.forEach((transaction: TransactionComponent) => {
      const date = new Date(transaction.transactionDate);
      const monthYear = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }

      if (!monthlyData[monthYear][transaction.transactionType]) {
        monthlyData[monthYear][transaction.transactionType] =
          transaction.amount;
      } else {
        monthlyData[monthYear][transaction.transactionType] +=
          transaction.amount;
      }
    });

    // Extract months and corresponding total amounts for each type
    const sortedMonthYears = Object.keys(monthlyData).sort();
    const transactionTypes = [
      ...new Set(
        this.transactions.map((transaction: any) => transaction.transactionType)
      ),
    ];

    this.barChartData.labels = sortedMonthYears;
    this.barChartData.datasets = transactionTypes.map((type) => ({
      data: sortedMonthYears.map(
        (monthYear) => monthlyData[monthYear][type as number] || 0
      ),
      label: type,
    }));

    this.chart?.update();
  }
}
