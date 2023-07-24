import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  accountDetails: any;

  constructor(private apiService: ApiService , private _toastService: ToastService ) { }

  ngOnInit(): void {
    this.getAccountDetails();
  }

  getAccountDetails(): void {
    this.apiService.getAccountDetails().subscribe(
      (data: any) => {
        this.accountDetails = data;
      },
      (error: any) => {
         this._toastService.error("Error fetching account details")
        console.log('Error fetching account details:', error);
      }
    );
  }
}
