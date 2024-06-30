import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';
import { environment } from 'src/environment/environment';

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  accountNumber: string = '';
  otp: string = '';
  otpGenerated: boolean = false;
  authTokenName = environment.tokenName;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService
  ) { }

  ngOnInit() {
    // Check if the accountNumber exists in sessionStorage (on page refresh)
    const storedAccountNumber = sessionStorage.getItem('accountNumber');
    if (storedAccountNumber) {
      this.accountNumber = storedAccountNumber;
      this.otpGenerated = true;
    }
  }

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp: string) {
    this.otp = otp;
  }

  setVal(val: string) {
    this.ngOtpInput.setValue(val);
  }

  generateOTP() {
    this.loader.show('Generating OTP...'); // Show the loader before making the API call
    this.authService.generateOTP(this.accountNumber).pipe(
      finalize(() => {
        this.loader.hide(); // Hide the loader after API call completes (success or error)
      })
    ).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message + ', Check Email');
        this.otpGenerated = true;
        // Save the account number in sessionStorage
        sessionStorage.setItem('accountNumber', this.accountNumber);
      },
      error: (error: any) => {
        this.toastService.error(error.error);
        console.error(error);
      },
    });
  }

  verifyOTP() {
    this.loader.show('Verifying OTP...'); // Show the loader before making the API call
    const otpVerificationRequest = {
      accountNumber: this.accountNumber,
      otp: this.otp,
    };

    this.authService.verifyOTP(otpVerificationRequest).pipe(
      finalize(() => {
        // Hide the loader after API call completes (success or error)
        this.loader.hide();
      })
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastService.success('Account LoggedIn');
        const token = response.token;
        localStorage.setItem(this.authTokenName, token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.toastService.error(error.error);
        console.error(error);
      },
    });
  }
}
