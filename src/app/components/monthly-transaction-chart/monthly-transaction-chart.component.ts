import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-monthly-transaction-chart',
  templateUrl: './monthly-transaction-chart.component.html',
  styleUrls: ['./monthly-transaction-chart.component.css'],
})
export class MonthlyTransactionChartComponent implements OnInit {
  @Input() transactions: TransactionComponent[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: any = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Deposit' },
      { data: [], label: 'Withdrawal' },
      { data: [], label: 'Transfer' },
      { data: [], label: 'Credit' },
    ],
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
    const monthlyData: {
      [monthYear: string]: { [type: string]: number };
    } = {};

    this.transactions.forEach((transaction: TransactionComponent) => {
      const date = new Date(transaction.transactionDate);
      const monthYear = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          CASH_DEPOSIT: 0,
          CASH_WITHDRAWAL: 0,
          CASH_TRANSFER: 0,
          CASH_CREDIT: 0,
        };
      }

      if (
        transaction.transactionType === 'CASH_TRANSFER' &&
        transaction.targetAccountNumber ===
          TransactionComponent.getAccountNumberFromToken()
      ) {
        monthlyData[monthYear].CASH_CREDIT += transaction.amount;
      } else {
        monthlyData[monthYear][transaction.transactionType] +=
          transaction.amount;
      }
    });

    const sortedMonthYears = Object.keys(monthlyData).sort();

    this.barChartData.labels = sortedMonthYears;
    this.barChartData.datasets[0].data = sortedMonthYears.map(
      (monthYear) => monthlyData[monthYear].CASH_DEPOSIT
    );
    this.barChartData.datasets[1].data = sortedMonthYears.map(
      (monthYear) => monthlyData[monthYear].CASH_WITHDRAWAL
    );
    this.barChartData.datasets[2].data = sortedMonthYears.map(
      (monthYear) => monthlyData[monthYear].CASH_TRANSFER
    );
    this.barChartData.datasets[3].data = sortedMonthYears.map(
      (monthYear) => monthlyData[monthYear].CASH_CREDIT
    );

    this.chart?.update();
  }
}
