import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css'],
})
export class FundTransferComponent implements OnInit {
  fundTransferForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private _toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService // Inject the LoaderService here
  ) {}

  ngOnInit(): void {
    this.initFundTransferForm();
  }

  initFundTransferForm(): void {
    this.fundTransferForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]], // Validate that amount is a positive number
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      targetAccountNumber: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.fundTransferForm?.valid) {
      const amount = this.fundTransferForm.get('amount')?.value;
      const pin = this.fundTransferForm.get('pin')?.value;
      const targetAccountNumber = this.fundTransferForm.get(
        'targetAccountNumber'
      )?.value;

      if (amount !== null && pin !== null && targetAccountNumber !== null) {
        this.loader.show('Transferring funds...'); // Show the loader before making the API call
        this.apiService
          .fundTransfer(amount, pin, targetAccountNumber)
          .subscribe({
            next: (response: any) => {
              this.loader.hide(); // Hide the loader on successful fund transfer
              // Handle successful fund transfer if needed
              this.fundTransferForm.reset();
              this._toastService.success(response.msg);
              this.router.navigate(['/dashboard']);
              console.log('Fund transfer successful!', response);
            },
            error: (error: any) => {
              this.loader.hide(); // Hide the loader on fund transfer request failure
              // Handle error if the fund transfer request fails
              this._toastService.error(error.error);
              console.error('Fund transfer failed:', error);
            },
          });
      }
    }
  }
}
