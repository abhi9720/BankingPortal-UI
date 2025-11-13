import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

@Component({
  selector: 'app-fund-transfer-otp',
  templateUrl: './fund-transfer-otp.component.html',
  styleUrls: ['./fund-transfer-otp.component.css'],
})
export class FundTransferOtpComponent {
  otp: string = '';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService
  ) {}

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  setVal(val: string) {
    this.ngOtpInput.setValue(val);
  }

  verifyFundTransferOtp() {
    const sessionId = sessionStorage.getItem('workflowSessionId');

    if (!sessionId) {
      this.toastService.error('Session expired. Please retry transfer.');
      this.router.navigate(['/fund-transfer']);
      return;
    }

    this.loader.show('Verifying OTP...');
    this.apiService.resumeWorkflow(this.otp, sessionId).subscribe({
      next: (response: any) => {
        this.loader.hide();

        if (response.status === 'COMPLETED') {
          if (response.data?.transferInstruction) {
            const { amount, pin, targetAccountNumber } =
              response.data.transferInstruction;

            this.loader.show('Transferring funds...');
            this.apiService.fundTransfer(amount, pin, targetAccountNumber).subscribe({
              next: (res: any) => {
                this.loader.hide();
                this.toastService.success(res.msg || 'Transfer successful.');
                sessionStorage.removeItem('workflowSessionId');
                this.router.navigate(['/dashboard']);
              },
              error: (error: any) => {
                this.loader.hide();
                this.toastService.error(error.error || 'Transfer failed.');
                console.error('Fund transfer failed:', error);
              },
            });
          } else {
            this.toastService.success('Transfer successful.');
            sessionStorage.removeItem('workflowSessionId');
            this.router.navigate(['/dashboard']);
          }
        } else if (response.status === 'INVALID_OTP') {
          this.toastService.error('Invalid OTP, please try again.');
        } else {
          this.toastService.error(response.message || 'Verification failed.');
        }
      },
      error: (err) => {
        this.loader.hide();
        console.error('OTP verification error:', err);
        this.toastService.error('Verification failed.');
      },
    });
  }
}
