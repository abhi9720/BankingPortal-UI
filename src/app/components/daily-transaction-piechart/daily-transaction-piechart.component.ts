import { Component, Input, ViewChild } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-daily-transaction-piechart',
  templateUrl: './daily-transaction-piechart.component.html',
  styleUrls: ['./daily-transaction-piechart.component.css']
})
export class DailyTransactionPiechartComponent {
  @Input() transactions: any;
  @ViewChild(BaseChartDirective)
  public chart!: BaseChartDirective;

  public pieChartLabels: Label[] = []; // Transaction types
  public pieChartData: SingleDataSet = []; // Transaction amounts
  public pieChartType: ChartType = 'pie';

  public selectedDate: string | null = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.updateChart()
  }


  clearDate() {
    this.selectedDate = '';
    this.updateChart();
  }
  updateChart() {

    this.pieChartLabels = [];
    this.pieChartData = [];

    if (this.selectedDate) {

      const selectedDateObject = new Date(this.selectedDate);
      const selectedDateTransactions = this.transactions.filter((transaction: any) => {
        const transactionDate = new Date(transaction.transaction_date);

        selectedDateObject.setHours(0, 0, 0, 0);
        transactionDate.setHours(0, 0, 0, 0);

        return selectedDateObject.getTime() === transactionDate.getTime();
      });
      const typeData: { [type: string]: number } = {};

      selectedDateTransactions.forEach((transaction: any) => {
        const type = transaction.transaction_type;
        if (typeData[type]) {
          typeData[type] += transaction.amount;
        } else {
          typeData[type] = transaction.amount;
        }
      });

      const transactionTypes = Object.keys(typeData);
      const totalAmounts = transactionTypes.map((type) => typeData[type]);

      this.pieChartLabels = transactionTypes as Label[];
      this.pieChartData = totalAmounts;
    } else {

      const typeData: { [type: string]: number } = {};

      this.transactions.forEach((transaction: any) => {
        const type = transaction.transaction_type;
        if (typeData[type]) {
          typeData[type] += transaction.amount;
        } else {
          typeData[type] = transaction.amount;
        }
      });

      // Extract transaction types and corresponding total amounts
      const transactionTypes = Object.keys(typeData);
      const totalAmounts = transactionTypes.map((type) => typeData[type]);

      this.pieChartLabels = transactionTypes as Label[];
      this.pieChartData = totalAmounts;



    }

    this.chart.chart.update()
  }
}
