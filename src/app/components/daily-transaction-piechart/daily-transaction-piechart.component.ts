import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-daily-transaction-piechart',
  templateUrl: './daily-transaction-piechart.component.html',
  styleUrls: ['./daily-transaction-piechart.component.css'],
})
export class DailyTransactionPiechartComponent implements OnInit {
  @Input() transactions: TransactionComponent[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [], // Transaction amounts
      },
    ],
  };
  public pieChartType: any = 'pie';
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public selectedDate!: string;

  ngOnInit() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    this.selectedDate = `${year}-${month}-${day}`;

    this.updateChart();
  }

  updateChart() {
    console.log(this.selectedDate);

    this.pieChartData.datasets[0].data = [];

    const sourceAccountNumber =
      TransactionComponent.getAccountNumberFromToken();
    const selectedDateObject = new Date(this.selectedDate);
    const selectedDateTransactions = this.transactions.filter(
      (transaction: TransactionComponent) => {
        const transactionDate = new Date(transaction.transactionDate);
        selectedDateObject.setHours(0, 0, 0, 0);
        transactionDate.setHours(0, 0, 0, 0);
        return selectedDateObject.getTime() === transactionDate.getTime();
      }
    );

    const typeData: { [type: string]: number } = {
      Deposit: 0,
      Withdrawal: 0,
      Transfer: 0,
      Credit: 0,
    };

    selectedDateTransactions.forEach((transaction: TransactionComponent) => {
      let type = transaction.transactionType.slice(5);
      type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      if (
        type === 'Transfer' &&
        transaction.targetAccountNumber === sourceAccountNumber
      ) {
        typeData.Credit += transaction.amount;
      } else {
        typeData[type] += transaction.amount;
      }
    });

    this.pieChartData.labels = Object.keys(typeData);
    this.pieChartData.datasets[0].data = Object.values(typeData);

    this.chart?.update();
  }
}
