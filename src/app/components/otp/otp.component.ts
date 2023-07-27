import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
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
    private loader: LoadermodelService // Inject the LoaderService here
  ) {}

  ngOnInit() {
    // Check if the accountNumber exists in sessionStorage (on page refresh)
    const storedAccountNumber = sessionStorage.getItem('accountNumber');
    if (storedAccountNumber) {
      this.accountNumber = storedAccountNumber;
      this.otpGenerated = true; // If account number exists, it means OTP is generated
    }
  }

  generateOTP() {
    this.loader.show('Generating OTP...'); // Show the loader before making the API call
    this.authService.generateOTP(this.accountNumber)
      .subscribe(
        (response: any) => {
          this.loader.hide(); // Hide the loader on API response
          this.toastService.success(response.message + ", Check Email");
          this.otpGenerated = true;
          // Save the account number in sessionStorage
          sessionStorage.setItem('accountNumber', this.accountNumber);
        },
        (error: any) => {
          this.loader.hide(); // Hide the loader on API error
          this.toastService.error(error.error);
          console.error(error);
        }
      );
  }

  verifyOTP() {
    this.loader.show('Verifying OTP...'); // Show the loader before making the API call
    const otpVerificationRequest = {
      accountNumber: this.accountNumber,
      otp: this.otp
    };

    this.authService.verifyOTP(otpVerificationRequest)
      .subscribe(
        (response: any) => {
          this.loader.hide(); // Hide the loader on API response
          console.log(response);
          this.toastService.success('Account LoggedIn');
          const token = response.token;
          localStorage.setItem(this.authTokenName, token);
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          this.loader.hide(); // Hide the loader on API error
          this.toastService.error(error.error);
          console.error(error);
        }
      );
  }
}
