import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfileData: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserProfileData();
  }

  getUserProfileData(): void {
    this.authService.getUserDetails().subscribe(
      (data) => {
        this.userProfileData = data;
      },
      (error) => {
        console.error('Error fetching user profile data:', error);
      }
    );
  }
}
