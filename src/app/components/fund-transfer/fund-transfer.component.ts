import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent implements OnInit {
  fundTransferForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private _toastService: ToastService, private router : Router) {}

  ngOnInit(): void {
    this.initFundTransferForm();
  }

  initFundTransferForm(): void {
    this.fundTransferForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]], // Validate that amount is a positive number
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      targetAccountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.fundTransferForm?.valid) {
      const amount = this.fundTransferForm.get('amount')?.value;
      const pin = this.fundTransferForm.get('pin')?.value;
      const targetAccountNumber = this.fundTransferForm.get('targetAccountNumber')?.value;

      if (amount !== null && pin !== null && targetAccountNumber !== null) {
        this.apiService.fundTransfer(amount, pin, targetAccountNumber).subscribe(
          (response) => {
            // Handle successful fund transfer if needed
            this._toastService.success(response.msg)
            console.log('Fund transfer successful!', response);
            this.router.navigate(['/dashboard'])

          },
          (error) => {
            // Handle error if the fund transfer request fails
            this._toastService.error(error.error)
            console.error('Fund transfer failed:', error);
          }
        );
      }
    }
  }
}
