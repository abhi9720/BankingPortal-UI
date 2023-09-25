import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-transaction-linechart',
  templateUrl: './transaction-linechart.component.html',
  styleUrls: ['./transaction-linechart.component.css'],
})
export class TransactionLinechartComponent implements OnInit {
  @Input() transactions: any;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM DD',
            },
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Transaction Amount',
          },
        },
      ],
    },
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor() { }

  ngOnInit(): void {
    this.prepareChartData();
  }

  prepareChartData(): void {
    // Separate transactions by type
    const depositTransactions = this.transactions.filter((transaction: any) => transaction.transaction_type === 'Deposit');
    const fundTransferTransactions = this.transactions.filter((transaction: any) => transaction.transaction_type === 'Fund Transfer');
    const withdrawalTransactions = this.transactions.filter((transaction: any) => transaction.transaction_type === 'Withdrawal');

    // Prepare data for each line
    const depositDates = depositTransactions.map((transaction: any) => new Date(transaction.transaction_date));
    const depositAmounts = depositTransactions.map((transaction: any) => transaction.amount);

    const fundTransferDates = fundTransferTransactions.map((transaction: any) => new Date(transaction.transaction_date));
    const fundTransferAmounts = fundTransferTransactions.map((transaction: any) => transaction.amount);

    const withdrawalDates = withdrawalTransactions.map((transaction: any) => new Date(transaction.transaction_date));
    const withdrawalAmounts = withdrawalTransactions.map((transaction: any) => transaction.amount);

    this.lineChartData = [
      { data: depositAmounts, label: 'Deposit' },
      { data: fundTransferAmounts, label: 'Fund Transfer' },
      { data: withdrawalAmounts, label: 'Withdrawal' },
    ];

    this.lineChartLabels = depositDates;
  }
}
