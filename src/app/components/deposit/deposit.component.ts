import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  depositForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private _toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService // Inject the LoaderService here
  ) {}

  ngOnInit(): void {
    this.initDepositForm();
  }

  initDepositForm(): void {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]], // Validate that amount is a positive number
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  onSubmit(): void {
    if (this.depositForm?.valid) {
      const amount = this.depositForm.get('amount')?.value;
      const pin = this.depositForm.get('pin')?.value;

      if (amount !== null && pin !== null) {
        this.loader.show('Depositing...'); // Show the loader before making the API call
        this.apiService.deposit(amount, pin).subscribe({
          next: (response: any) => {
            this.loader.hide(); // Hide the loader on successful deposit
            // Handle successful deposit if needed
            this._toastService.success(response.msg);
            this.depositForm.reset();
            this.router.navigate(['/dashboard']);
            console.log('Deposit successful!', response);
          },
          error: (error: any) => {
            this.loader.hide(); // Hide the loader on deposit request failure
            // Handle error if the deposit request fails
            this._toastService.error(error.error || 'Deposit failed');
            console.error('Deposit failed:', error);
          },
        });
      }
    }

    this.initDepositForm();
  }
}
