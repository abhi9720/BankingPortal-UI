import { ToastService } from 'angular-toastify';
import { ICountry } from 'ngx-countries-dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { invalidPhoneNumber } from 'src/app/services/country-code.service';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm!: FormGroup;
  showUpdateForm: boolean = false;

  constructor(
    private authService: AuthService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getUserProfileData();
    this.profileForm = new FormGroup(
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
        ]),
      },
      {
        validators: invalidPhoneNumber(),
      }
    );
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  onCountryChange(country: ICountry) {
    this.profileForm.patchValue({ countryCode: country.code });
  }

  getUserProfileData(): void {
    this.authService.getUserDetails().subscribe({
      next: (data: any) => {
        this.userProfile = data;

        this.profileForm.patchValue(data);
      },
      error: (error: any) => {
        console.error('Error fetching user profile data:', error);
      },
    });
  }

  toggleUpdateForm(): void {
    this.profileForm.patchValue(this.userProfile);
    this.showUpdateForm = !this.showUpdateForm;
  }

  updateProfile(): void {
    console.log(this.profileForm.value);

    this.authService.updateUserProfile(this.profileForm.value).subscribe({
      next: (data: any) => {
        this.userProfile = data;
        console.log('Profile updated successfully:', data);
        this.showUpdateForm = false;
      },
      error: (error: any) => {
        this._toastService.error(error.error);
        console.error('Error updating user profile:', error);
      },
    });
  }
}
