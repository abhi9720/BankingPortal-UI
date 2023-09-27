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

  public selectedYear: number | string = "";
  public selectedMonth: string = "";

  public years: number[] = [];
  public months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor() { }

  ngOnInit(): void {
    this.prepareChartData();
    this.initializeYearAndMonthLists();

  }
  initializeYearAndMonthLists() {
    this.years = Array.from(new Set(this.transactions.map((transaction: any) => new Date(transaction.transaction_date).getFullYear())));

  }

  prepareChartData(): void {

    const filteredTransactions = this.transactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.transaction_date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth: string = this.months[transactionDate.getMonth()];

      console.log(this.selectedYear, this.selectedMonth, transactionYear, transactionMonth);

      console.log(typeof this.selectedYear, typeof this.selectedMonth, typeof transactionYear, typeof transactionMonth);

      // Check if the transaction matches the selected year (if selected)
      if (this.selectedYear && this.selectedYear != transactionYear) {
        return false;
      }

      // Check if the transaction matches the selected month (if selected)
      if (this.selectedMonth && this.selectedMonth != transactionMonth) {
        return false;
      }

      console.log("return true");

      return true;
    });

    console.log(filteredTransactions);


    // Separate filtered transactions by type
    const depositTransactions = filteredTransactions.filter((transaction: any) => transaction.transaction_type === 'Deposit');
    const fundTransferTransactions = filteredTransactions.filter((transaction: any) => transaction.transaction_type === 'Fund Transfer');
    const withdrawalTransactions = filteredTransactions.filter((transaction: any) => transaction.transaction_type === 'Withdrawal');

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

  updateChartData(): void {

    console.log(typeof this.selectedMonth, typeof this.selectedYear);
    if (this.selectedYear == "") {
      this.selectedMonth = "";
    }

    console.log(this.selectedMonth, this.selectedYear);

    this.prepareChartData();
  }
}
