import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.css'],
})
export class TransactionChartComponent implements OnInit {
  @Input() transactions: TransactionComponent[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Transaction Amount' }],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public lineChartType: any = 'line';

  // Your transaction data (replace with your actual data)

  constructor() {}

  ngOnInit(): void {
    this.updateChart();
  }

  updateChart(): void {
    // Prepare data for the line chart
    const transactionDates = this.transactions.map(
      (transaction: TransactionComponent) =>
        new Date(transaction.transactionDate)
    );
    const transactionAmounts = this.transactions.map(
      (transaction: TransactionComponent) => transaction.amount
    );

    this.lineChartData.labels = transactionDates;
    this.lineChartData.datasets[0].data = transactionAmounts;

    this.chart?.update();
  }
}
