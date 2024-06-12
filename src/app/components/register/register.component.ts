import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICountry } from 'ngx-countries-dropdown';

function passwordMismatch(
  controlName: string,
  matchingControlName: string
): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.passwordMismatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMismatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showRegistrationData = false;
  registrationData: any;
  print = console;

  constructor(
    private authService: AuthService,
    private _toastService: ToastService
  ) {}

  onCountryChange(country: ICountry) {
    this.registerForm.patchValue({ country: country.code });
  }

  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        country: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{5,15}$/),
        ]),
        address: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(127),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      {
        validators: passwordMismatch('password', 'confirmPassword'),
      }
    );
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    // Call the API service to register the user
    this.authService.registerUser(this.registerForm.value).subscribe({
      next: (response: any) => {
        // Store the registration data and show it on the page
        this.registrationData = response;
        this.showRegistrationData = true;
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        this._toastService.error(error.error);
      },
    });
  }
}
