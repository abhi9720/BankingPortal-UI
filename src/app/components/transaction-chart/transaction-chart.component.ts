import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.css'],
})
export class TransactionChartComponent implements OnInit {
  @Input() transactions: any;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Transaction Amount' },
  ];

  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [ // Use 'xAxes' instead of 'xAxis'
        {
          type: 'time',
          time: {
            unit: 'day', // Adjust as needed
            displayFormats: {
              day: 'MMM DD', // Adjust date format as needed
            },
          },
          scaleLabel: {
            display: true,
            labelString: 'Date', // Label for the x-axis
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Transaction Amount', // Label for the y-axis
          },
        },
      ],
    },
  };


  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  // Your transaction data (replace with your actual data)


  constructor() { }

  ngOnInit(): void {
    this.prepareChartData();
  }

  prepareChartData(): void {
    // Prepare data for the line chart
    const transactionDates = this.transactions.map((transaction: any) => new Date(transaction.transaction_date));
    const transactionAmounts = this.transactions.map((transaction: any) => transaction.amount);

    this.lineChartLabels = transactionDates;
    this.lineChartData[0].data = transactionAmounts;
  }
}
