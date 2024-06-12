import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  withdrawForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private _toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService // Inject the LoaderService here
  ) {}

  ngOnInit(): void {
    this.initWithDrawForm();
  }

  initWithDrawForm() {
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  onSubmit(): void {
    if (this.withdrawForm.valid) {
      const amount = this.withdrawForm.get('amount')?.value;
      const pin = this.withdrawForm.get('pin')?.value;

      this.loader.show('Withdrawing...'); // Show the loader before making the API call
      this.apiService.withdraw(amount, pin).subscribe({
        next: (response: any) => {
          this.loader.hide(); // Hide the loader on successful withdrawal
          this._toastService.success(response.msg);
          this.withdrawForm.reset();
          this.router.navigate(['/dashboard']);
          console.log('Withdrawal successful!', response);
        },
        error: (error: any) => {
          this.loader.hide(); // Hide the loader on withdrawal request failure
          this._toastService.error(error.error);
          console.error('Withdrawal failed:', error);
        },
      });
    }
    this.initWithDrawForm();
  }
}
