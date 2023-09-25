import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  profileForm!: FormGroup; // Reactive form
  showUpdateForm: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUserProfileData();

    // Create the reactive form
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      address: [''],
      phone_number: [''],
      accountNumber: [''],
      branch: [null],
      account_type: [null],
      ifsc_code: [null]
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
    // Send the form value to your API or service for updating the user profile
    // Implement this logic in your AuthService or a dedicated service
    this.authService.updateUserProfile(this.profileForm.value).subscribe(
      (data) => {
        this.userProfile = data;
        // Handle success, e.g., show a success message
        console.log('Profile updated successfully:', data);
        // Hide the update form
        this.showUpdateForm = false;
      },
      (error) => {
        console.error('Error updating user profile:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
}
