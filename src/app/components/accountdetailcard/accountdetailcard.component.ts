import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accountdetailcard',
  templateUrl: './accountdetailcard.component.html',
  styleUrls: ['./accountdetailcard.component.css'],
})
export class AccountdetailcardComponent implements OnInit {
  accountDetails: any;

  constructor(
    private apiService: ApiService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAccountDetails();
  }

  getAccountDetails(): void {
    this.apiService.getAccountDetails().subscribe({
      next: (data: any) => {
        this.accountDetails = data;
      },
      error: (error: any) => {
        this._toastService.error('Error fetching account details');
        console.log('Error fetching account details:', error);
      },
    });
  }
}
