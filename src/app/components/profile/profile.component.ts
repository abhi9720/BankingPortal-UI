import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm!: FormGroup;
  showUpdateForm: boolean = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getUserProfileData();
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{5,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(127)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  getUserProfileData(): void {
    this.authService.getUserDetails().subscribe(
      (data) => {
        this.userProfile = data;

        this.profileForm.patchValue(data);
      },
      (error) => {
        console.error('Error fetching user profile data:', error);
      }
    );
  }

  toggleUpdateForm(): void {
    this.profileForm.patchValue(this.userProfile);
    this.showUpdateForm = !this.showUpdateForm;
  }

  updateProfile(): void {

    console.log(this.profileForm.value);

    this.authService.updateUserProfile(this.profileForm.value).subscribe(
      (data) => {
        this.userProfile = data;
        console.log('Profile updated successfully:', data);
        this.showUpdateForm = false;
      },
      (error) => {
        this._toastService.error(error.error);
        console.error('Error updating user profile:', error);
      }
    );
  }
}
