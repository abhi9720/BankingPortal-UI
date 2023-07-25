import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  depositForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService,private _toastService: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.initDepositForm();
  }

  initDepositForm(): void {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]], // Validate that amount is a positive number
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.depositForm?.valid) {
      const amount = this.depositForm.get('amount')?.value;
      const pin = this.depositForm.get('pin')?.value;

      if (amount !== null && pin !== null) {
        this.apiService.deposit(amount, pin).subscribe(
          (response) => {
            // Handle successful deposit if needed
            this._toastService.success(response.msg)
            console.log('Deposit successful!', response);
            this.router.navigate(['/dashboard'])
          },
          (error) => {
            // Handle error if the deposit request fails
            this._toastService.success(error.error || "Deposit failed")
            console.error('Deposit failed:', error);
          }
        );
      }
    }

    this.initDepositForm();
  }
}
