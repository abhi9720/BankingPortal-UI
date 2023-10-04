import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm!: FormGroup;
  showUpdateForm: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUserProfileData();
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phone_number: ['', Validators.required]
    });
  }

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
        console.error('Error updating user profile:', error);
      }
    );
  }
}
