import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMismatch } from 'src/app/util/formutil';

@Component({
  selector: 'app-account-pin',
  templateUrl: './account-pin.component.html',
  styleUrls: ['./account-pin.component.css'],
})
export class AccountPinComponent implements OnInit {
  showGeneratePINForm: boolean = true;
  pinChangeForm!: FormGroup;
  loading: boolean = true;

  print = console.log;

  constructor(
    private apiService: ApiService,
    private _toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService
  ) {}

  ngOnInit(): void {
    // Initialize with a safe default form so it's never undefined
    this.pinChangeForm = new FormGroup({
      newPin: new FormControl(''),
      confirmPin: new FormControl(''),
      password: new FormControl(''),
    });

    // Call API to check if PIN already exists
    this.apiService.checkPinCreated().subscribe({
      next: (response: any) => {
        // Handle both JSON and plain text responses
        if (typeof response === 'string') {
          // Backend returned plain text like "PIN has not been created..."
          if (response.includes('not been created')) {
            this.showGeneratePINForm = true;
          } else {
            this.showGeneratePINForm = false;
          }
        } else if (response && response.hasPIN) {
          this.showGeneratePINForm = false;
        } else {
          this.showGeneratePINForm = true;
        }

        this.initPinChangeForm(); // re-init with correct structure
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error checking PIN status:', error);
        // fallback: assume PIN not created
        this.showGeneratePINForm = true;
        this.initPinChangeForm();
      },
    });
  }

  initPinChangeForm(): void {
    if (this.showGeneratePINForm) {
      // "Generate PIN" form
      this.pinChangeForm = new FormGroup(
        {
          newPin: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4),
          ]),
          confirmPin: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
        },
        {
          validators: passwordMismatch('newPin', 'confirmPin'),
        }
      );
    } else {
      // "Change PIN" form
      this.pinChangeForm = new FormGroup({
        oldPin: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
        newPin: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
        password: new FormControl('', Validators.required),
      });
    }
  }

  onSubmitGeneratePIN(): void {
    if (this.pinChangeForm.valid) {
      const newPin = this.pinChangeForm.get('newPin')?.value;
      const password = this.pinChangeForm.get('password')?.value;

      this.loader.show('Generating PIN...');
      this.apiService.createPin(newPin, password).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this._toastService.success('PIN generated successfully');
          console.log('PIN generated successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.loader.hide();
          this._toastService.error(error.error || 'Failed to generate PIN');
          console.error('Error generating PIN:', error);
        },
      });
    }
  }

  onSubmitChangePIN(): void {
    if (this.pinChangeForm.valid) {
      const oldPin = this.pinChangeForm.get('oldPin')?.value;
      const newPin = this.pinChangeForm.get('newPin')?.value;
      const password = this.pinChangeForm.get('password')?.value;

      this.loader.show('Updating PIN...');
      this.apiService.updatePin(oldPin, newPin, password).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this._toastService.success('PIN updated successfully');
          console.log('PIN updated successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.loader.hide();
          this._toastService.error(error.error || 'Failed to update PIN');
          console.error('Error updating PIN:', error);
        },
      });
    }
  }
}
