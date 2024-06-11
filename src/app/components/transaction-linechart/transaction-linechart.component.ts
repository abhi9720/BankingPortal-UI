import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-transaction-linechart',
  templateUrl: './transaction-linechart.component.html',
  styleUrls: ['./transaction-linechart.component.css'],
})
export class TransactionLinechartComponent implements OnInit {
  @Input() transactions: TransactionComponent[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Deposit' },
      { data: [], label: 'Withdrawal' },
      { data: [], label: 'Fund Transfer' },
      { data: [], label: 'Fund Credit' },
    ],
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

  public years: number[] = [];
  public months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  public selectedYear: number | string = new Date().getFullYear();
  public selectedMonth: string = this.months[new Date().getMonth()];

  constructor() {}

  ngOnInit(): void {
    this.updateChart();
    this.initializeYearAndMonthLists();
  }

  initializeYearAndMonthLists() {
    this.years = Array.from(
      new Set(
        this.transactions.map((transaction: TransactionComponent) =>
          new Date(transaction.transactionDate).getFullYear()
        )
      )
    );
  }

  /**
   * Updates the line chart data based on the selected year and month.
   * @returns void
   */
  updateChart(): void {
    const filteredTransactions: TransactionComponent[] =
      this.transactions.filter((transaction: TransactionComponent) => {
        const transactionDate: Date = new Date(transaction.transactionDate);
        return (
          transactionDate.getFullYear() === this.selectedYear &&
          this.months[transactionDate.getMonth()] === this.selectedMonth
        );
      });

    const groupedTransactions: {
      [date: string]: { date: Date; amounts: { [type: string]: number } };
    } = filteredTransactions.reduce(
      (
        acc: {
          [date: string]: { date: Date; amounts: { [type: string]: number } };
        },
        transaction: TransactionComponent
      ) => {
        const transactionDate: Date = new Date(transaction.transactionDate);
        const date: string = transactionDate.toISOString().split('T')[0];

        if (!acc[date]) {
          acc[date] = {
            date: transactionDate,
            amounts: {
              CASH_DEPOSIT: 0,
              CASH_WITHDRAWAL: 0,
              CASH_TRANSFER: 0,
              CASH_CREDIT: 0,
            },
          };
        }

        if (
          transaction.transactionType === 'CASH_TRANSFER' &&
          transaction.targetAccountNumber ===
            TransactionComponent.getAccountNumberFromToken()
        ) {
          acc[date].amounts.CASH_CREDIT += transaction.amount;
        } else {
          acc[date].amounts[transaction.transactionType] += transaction.amount;
        }

        return acc;
      },
      {}
    );

    const sortedTransactions: {
      date: Date;
      amounts: { [type: string]: number };
    }[] = Object.values(groupedTransactions).sort(
      (a: { date: Date }, b: { date: Date }) =>
        a.date.getTime() - b.date.getTime()
    );

    this.lineChartData.labels = sortedTransactions.map(
      (group: { date: Date }) =>
        group.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
    );

    this.lineChartData.datasets[0].data = sortedTransactions.map(
      (group: { amounts: { [type: string]: number } }) =>
        group.amounts.CASH_DEPOSIT
    );

    this.lineChartData.datasets[1].data = sortedTransactions.map(
      (group: { amounts: { [type: string]: number } }) =>
        group.amounts.CASH_WITHDRAWAL
    );

    this.lineChartData.datasets[2].data = sortedTransactions.map(
      (group: { amounts: { [type: string]: number } }) =>
        group.amounts.CASH_TRANSFER
    );

    this.lineChartData.datasets[3].data = sortedTransactions.map(
      (group: { amounts: { [type: string]: number } }) =>
        group.amounts.CASH_CREDIT
    );

    this.chart?.update();
  }
}
