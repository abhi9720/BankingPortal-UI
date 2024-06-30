import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';
import { passwordMismatch, StrongPasswordRegx } from 'src/app/util/formutil';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  showNewPasswordForm: boolean = false;
  otpSentSuccessfully: boolean = false;
  resetToken: string = '';

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

  constructor(private fb: FormBuilder, private router: Router, private toastService: ToastService, private loader: LoadermodelService,
    private authService: AuthService,
  ) {
    this.resetPasswordForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.pattern(/^(?:(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(?:.{6}))$/)]],
      otp: [''] // Added OTP field to the form
    });

    this.newPasswordForm = this.fb.group({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(127),
        Validators.pattern(StrongPasswordRegx)
      ]),
      confirmPassword: new FormControl('', Validators.required),
    }, {
      validators: passwordMismatch('newPassword', 'confirmPassword'),
    });
  }

  get f() {
    return this.newPasswordForm.controls;
  }

  onOtpChange(otp: string): void {
    this.resetPasswordForm.patchValue({ otp: otp });
  }

  ngOnInit(): void {
  }

  sendOtp(): void {
    if (this.resetPasswordForm.valid) {
      this.loader.show('Generating OTP...');
      const input = this.resetPasswordForm.value.identifier;
      this.authService.sendOtpForPasswordReset(input).pipe(
        finalize(() => {
          this.loader.hide();
        })
      ).subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.otpSentSuccessfully = true;
          this.resetPasswordForm.get('otp')?.setValidators(Validators.required);
          this.resetPasswordForm.get('otp')?.updateValueAndValidity();
        },
        error: (error: any) => {
          this.toastService.error("Failed to send OTP: " + error.error);
          console.error("Failed to send OTP: " + error.error);
        }
      })
    }
  }


  verifyOtp(): void {
    if (this.resetPasswordForm.valid) {
      this.loader.show('Verifying OTP...');

      const identifier = this.resetPasswordForm.value.identifier;
      const otp = this.resetPasswordForm.value.otp;

      this.authService.verifyOtpForPasswordReset(identifier, otp).pipe(
        finalize(() => {
          this.loader.hide();
        })
      ).subscribe({
        next: (response) => {
          this.toastService.success('OTP Verified');
          this.showNewPasswordForm = true;
          this.resetToken = response.passwordResetToken;
        },
        error: (error) => {
          this.toastService.error('Error verifying OTP : ' + error.error);
          console.error('Error verifying OTP:', error);
        }
      });
    }
  }

  resetPassword(): void {
    if (this.newPasswordForm.valid) {
      this.loader.show('Setting new Password...');
      const newPassword = this.newPasswordForm.value.newPassword;

      this.authService.resetPassword(this.resetPasswordForm.value.identifier, this.resetToken, newPassword)
        .pipe(
          finalize(() => {
            this.loader.hide();
          })
        ).subscribe({
          next: (response) => {
            this.toastService.success('Password reset successfully');
            console.log('Password reset successfully:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.toastService.error('Error resetting password ' + error.error);
            console.error('Error resetting password:', error.error);
          }
        });
    }
  }
}
