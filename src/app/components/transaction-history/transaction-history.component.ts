// transaction-history.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environment/environment';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  private authtokenNameName = environment.tokenName;

  transactionHistory: any[] = [];
  userAccountNumber: string | null = null;
  filteredTransactionHistory: any[] = [];
  filterCriteria: string = ''; // Holds the filter criteria selected by the user

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTransactionHistory();
    console.log(this.transactionHistory);

  }

  loadTransactionHistory(): void {
    this.userAccountNumber = this.getAccountNumberFromToken(); // Get user's account number from the token

    this.apiService.getTransactions().subscribe(
      (data) => {
        this.transactionHistory = data; // Assign the received data to the transactionHistory property
        this.filterTransactions(); // Apply initial filtering based on the current filter criteria
        console.log(this.transactionHistory); // Now the data will be logged in the console
      },
      (error) => {
        console.error('Error fetching transaction history:', error);
      }
    );
  }

  getTransactionStatus(transaction: any): string {
    let status = transaction.transactionType.slice(5).toLowerCase();

    if (status === 'transfer' &&
        transaction.targetAccountNumber === this.userAccountNumber) {
      return 'Credit';
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getAccountNumberFromToken(): string | null {
    const authTokenName = localStorage.getItem(this.authtokenNameName);
    if (authTokenName) {
      const decodedToken: any = jwt_decode(authTokenName);
      return decodedToken.sub;
    }
    return null;
  }

  filterTransactions(): void {
    // Reset the filteredTransactionHistory array
    this.filteredTransactionHistory = this.transactionHistory.slice();

    if (this.filterCriteria === 'Deposit') {
      // Filter transactions for deposits
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(transaction =>
        transaction.transactionType === 'Deposit'
      );
    } else if (this.filterCriteria === 'Withdrawal') {
      // Filter transactions for withdrawals
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(transaction =>
        transaction.transactionType === 'Withdrawal'
      );
    } else if (this.filterCriteria === 'Transfer') {
      // Filter transactions for fund transfers
      this.filteredTransactionHistory = this.filteredTransactionHistory.filter(transaction =>
        transaction.transactionType === 'Fund Transfer'
      );
    }
  }

  // Function to handle filter criteria changes
  onFilterCriteriaChange(event: any): void {
    this.filterCriteria = event.target.value;
    this.filterTransactions(); // Apply filtering based on the selected filter criteria
  }
}
