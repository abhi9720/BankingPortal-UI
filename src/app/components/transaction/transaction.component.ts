import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent {
  id: number = 0;
  amount: number = 0;
  transactionDate: Date = new Date();
  transactionType: string = '';
  targetAccountNumber: string = '';
  sourceAccountNumber: string = '';

  private static tokenName = environment.tokenName;

  constructor() {}

  static getAccountNumberFromToken(): string | null {
    const authTokenName = localStorage.getItem(this.tokenName);
    if (authTokenName) {
      const decodedToken: any = jwtDecode(authTokenName);
      return decodedToken.sub;
    }
    return null;
  }
}
