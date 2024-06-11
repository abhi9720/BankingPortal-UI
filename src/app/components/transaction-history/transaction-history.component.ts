// transaction-history.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
})
export class TransactionHistoryComponent implements OnInit {
  transactionHistory: any[] = [];
  userAccountNumber: string | null = null;
  filteredTransactionHistory: any[] = [];
  filterCriteria: string = ''; // Holds the filter criteria selected by the user

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTransactionHistory();
    console.log(this.transactionHistory);
  }

  loadTransactionHistory(): void {
    this.userAccountNumber = TransactionComponent.getAccountNumberFromToken(); // Get user's account number from the token

    this.apiService
      .getTransactions()
      .pipe(
        tap((data) => {
          this.transactionHistory = data; // Assign the received data to the transactionHistory property
          this.filterTransactions(); // Apply initial filtering based on the current filter criteria
          console.log(this.transactionHistory); // Now the data will be logged in the console
        }),
        catchError((error) => {
          console.error('Error fetching transaction history:', error);
          return EMPTY; // Return an empty observable to complete the observable chain
        })
      )
      .subscribe();
  }

  getTransactionStatus(transaction: TransactionComponent): string {
    let status = transaction.transactionType.slice(5).toLowerCase();

    if (
      status === 'transfer' &&
      transaction.targetAccountNumber === this.userAccountNumber
    ) {
      return 'Credit';
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  filterTransactions(): void {
    // Reset the filteredTransactionHistory array
    this.filteredTransactionHistory = this.transactionHistory.slice();

    if (this.filterCriteria === 'Deposit') {
      // Filter transactions for deposits
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(
        (transaction) => transaction.transactionType === 'CASH_DEPOSIT'
      );
    } else if (this.filterCriteria === 'Withdrawal') {
      // Filter transactions for withdrawals
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(
        (transaction) => transaction.transactionType === 'CASH_WITHDRAWAL'
      );
    } else if (this.filterCriteria === 'Transfer') {
      // Filter transactions for fund transfers
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(
        (transaction) => transaction.transactionType === 'CASH_TRANSFER'
      );
    }
  }

  // Function to handle filter criteria changes
  onFilterCriteriaChange(event: any): void {
    this.filterCriteria = event.target.value;
    this.filterTransactions(); // Apply filtering based on the selected filter criteria
  }
}
