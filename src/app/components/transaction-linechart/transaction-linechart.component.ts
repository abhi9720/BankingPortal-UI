import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { environment } from 'src/environment/environment';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-transaction-linechart',
  templateUrl: './transaction-linechart.component.html',
  styleUrls: ['./transaction-linechart.component.css'],
})
export class TransactionLinechartComponent implements OnInit {
  @Input() transactions: any;

  private authtokenNameName = environment.tokenName;

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

  public years: number[] = [];
  public months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public selectedYear: number | string = new Date().getFullYear();
  public selectedMonth: string = this.months[new Date().getMonth()];

  constructor() { }

  ngOnInit(): void {
    this.prepareChartData();
    this.initializeYearAndMonthLists();
  }

  initializeYearAndMonthLists() {
    this.years = Array.from(new Set(this.transactions.map((transaction: any) =>
      new Date(transaction.transactionDate).getFullYear())));
  }

  getAccountNumberFromToken(): string | null {
    const authTokenName = localStorage.getItem(this.authtokenNameName);
    if (authTokenName) {
      const decodedToken: any = jwt_decode(authTokenName);
      return decodedToken.sub;
    }
    return null;
  }

  prepareChartData(): void {

    const filteredTransactions = this.transactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.transactionDate);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth: string = this.months[transactionDate.getMonth()];

      return transactionYear === this.selectedYear &&
        transactionMonth === this.selectedMonth;
    });

    // Group transactions by date and type
    const groupedTransactions = filteredTransactions.reduce((acc: any, transaction: any) => {
      const transactionDate = new Date(transaction.transactionDate);
      const dateKey = transactionDate.toISOString().slice(0, 10); // YYYY-MM-DD format

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: transactionDate, amounts: {
            CASH_DEPOSIT: 0,
            CASH_WITHDRAWAL: 0,
            CASH_TRANSFER: 0,
            CASH_CREDIT: 0
          }
        };
      }

      if (transaction.transactionType === 'CASH_TRANSFER' &&
        transaction.targetAccountNumber === this.getAccountNumberFromToken()) {
        acc[dateKey].amounts.CASH_CREDIT += transaction.amount;
      } else {
        acc[dateKey].amounts[transaction.transactionType] += transaction.amount;
      }

      // Add other transaction types here
      return acc;
    }, {});

    // Convert grouped transactions to arrays for Chart.js
    const dates = Object.keys(groupedTransactions).map(date => new Date(date));
    const depositAmounts = Object.values(groupedTransactions).map((group: any) =>
      group.amounts.CASH_DEPOSIT);
    const fundTransferAmounts = Object.values(groupedTransactions).map((group: any) =>
      group.amounts.CASH_TRANSFER);
    const fundCreditAmounts = Object.values(groupedTransactions).map((group: any) =>
      group.amounts.CASH_CREDIT);
    const withdrawalAmounts = Object.values(groupedTransactions).map((group: any) =>
      group.amounts.CASH_WITHDRAWAL);

    this.lineChartData = [
      { data: depositAmounts, label: 'Deposit' },
      { data: withdrawalAmounts, label: 'Withdrawal' },
      { data: fundTransferAmounts, label: 'Fund Transfer' },
      { data: fundCreditAmounts, label: 'Fund Credit' },
    ];

    this.lineChartLabels = dates.map(date => date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }

  updateChartData(): void {
    this.prepareChartData();
  }
}
