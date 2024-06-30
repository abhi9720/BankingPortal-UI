import { ToastService } from 'angular-toastify';
import { ICountry } from 'ngx-countries-dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { invalidPhoneNumber } from 'src/app/services/country-code.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMismatch, StrongPasswordRegx } from 'src/app/util/formutil';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showRegistrationData = false;
  registrationData: any;

  constructor(
    private authService: AuthService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        countryCode: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(127),
          Validators.pattern(StrongPasswordRegx)
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      {
        validators: [
          passwordMismatch('password', 'confirmPassword'),
          invalidPhoneNumber(),
        ],
      }
    );
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onCountryChange(country: ICountry) {
    this.registerForm.patchValue({ countryCode: country.code });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.registerForm.value);
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
