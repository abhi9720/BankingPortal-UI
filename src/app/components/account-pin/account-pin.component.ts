import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

@Component({
  selector: 'app-account-pin',
  templateUrl: './account-pin.component.html',
  styleUrls: ['./account-pin.component.css']
})
export class AccountPinComponent implements OnInit {
  showGeneratePINForm: boolean = true;
  pinChangeForm!: FormGroup;
  loading: boolean = true;

  print = console.log;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private _toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService // Inject the LoaderService here
  ) {}

  ngOnInit(): void {
    this.apiService.checkPinCreated().subscribe(
      (response) => {
        if (response && response.hasPIN) {
          // User has already created a PIN, show the "Change PIN" form.
          this.showGeneratePINForm = false;
        }
        this.initPinChangeForm();
        this.loading = false; // Set loading to false after receiving the API response.
      },
      (error) => {
        this.loading = false; // Set loading to false in case of an error.
        console.error('Error checking PIN status:', error);
      }
    );
  }

  initPinChangeForm(): void {
    if (this.showGeneratePINForm) {
      // For "Generate PIN" form
      this.pinChangeForm = this.fb.group({
        newPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        password: ['', Validators.required]
      });
    } else {
      // For "Change PIN" form
      this.pinChangeForm = this.fb.group({
        oldPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        newPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        password: ['', Validators.required]
      });
    }
  }

  onSubmitGeneratePIN(): void {
    if (this.pinChangeForm.valid) {
      const newPin = this.pinChangeForm.get('newPin')?.value;
      const password = this.pinChangeForm.get('password')?.value;

      this.loader.show('Generating PIN...'); // Show the loader before making the API call
      // Call the API to generate a PIN.
      this.apiService.createPin(newPin, password).subscribe(
        (response: any) => {
          this.loader.hide(); // Hide the loader on successful PIN generation
          this._toastService.success('PIN generated successfully');
          console.log('PIN generated successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          this.loader.hide(); // Hide the loader on PIN generation request failure
          this._toastService.error(error.error);
          console.error('Error generating PIN:', error);
        }
      );
    }
  }

  onSubmitChangePIN(): void {
    if (this.pinChangeForm.valid) {
      const oldPin = this.pinChangeForm.get('oldPin')?.value;
      const newPin = this.pinChangeForm.get('newPin')?.value;
      const password = this.pinChangeForm.get('password')?.value;

      this.loader.show('Updating PIN...'); // Show the loader before making the API call
      // Call the API to update the PIN.
      this.apiService.updatePin(oldPin, newPin, password).subscribe(
        (response: any) => {
          this.loader.hide(); // Hide the loader on successful PIN update
          this._toastService.success('PIN updated successfully');
          console.log('PIN updated successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          this.loader.hide(); // Hide the loader on PIN update request failure
          this._toastService.error(error.error);
          console.error('Error updating PIN:', error);
        }
      );
    }
  }
}
