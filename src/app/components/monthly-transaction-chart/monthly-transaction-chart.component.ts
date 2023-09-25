import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-monthly-transaction-chart',
  templateUrl: './monthly-transaction-chart.component.html',
  styleUrls: ['./monthly-transaction-chart.component.css'],
})
export class MonthlyTransactionChartComponent implements OnInit {
  @Input() transactions: any;
  public barChartLabels: Label[] = []; // Months
  public barChartType: ChartType = 'bar';
  public barChartData: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // Group transactions by month and calculate monthly total for each type
    const monthlyData: { [monthYear: string]: { [type: string]: number } } = {};

    this.transactions.forEach((transaction: any) => {
      const date = new Date(transaction.transaction_date);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }

      if (!monthlyData[monthYear][transaction.transaction_type]) {
        monthlyData[monthYear][transaction.transaction_type] = transaction.amount;
      } else {
        monthlyData[monthYear][transaction.transaction_type] += transaction.amount;
      }
    });

    // Extract months and corresponding total amounts for each type
    const sortedMonthYears = Object.keys(monthlyData).sort();
    const transactionTypes = [...new Set(this.transactions.map((transaction: any) => transaction.transaction_type))];

    this.barChartLabels = sortedMonthYears;
    this.barChartData = transactionTypes.map((type) => ({
      data: sortedMonthYears.map((monthYear) => monthlyData[monthYear][type as number] || 0),
      label: type,
    }));
  }

}
