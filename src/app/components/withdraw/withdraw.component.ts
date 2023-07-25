import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  withdrawForm! : FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService,private _toastService: ToastService, private router: Router) { }


  ngOnInit(): void {
    this.initWithDrawForm();
  }

  initWithDrawForm(){
    this.withdrawForm =  this.fb.group({
       amount: ['', [Validators.required, Validators.min(0)]],
       pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
     });
   }

  onSubmit(): void {
    if (this.withdrawForm.valid) {
      const amount = this.withdrawForm.get('amount')?.value;
      const pin = this.withdrawForm.get('pin')?.value;

      this.apiService.withdraw(amount, pin).subscribe(
        (response) => {
          // Handle successful withdrawal if needed
          this._toastService.success(response.msg)
           console.log('Withdrawal successful!', response);
           this.router.navigate(['/dashboard'])

        },
        (error) => {
          this._toastService.error(error.error)
          // Handle error if the withdrawal request fails
          console.error('Withdrawal failed:', error);
        }
      );
    }
    this.initWithDrawForm();
  }
}
