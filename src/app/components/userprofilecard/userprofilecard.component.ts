import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userprofilecard',
  templateUrl: './userprofilecard.component.html',
  styleUrls: ['./userprofilecard.component.css'],
})
export class UserprofilecardComponent implements OnInit {
  userProfileData: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserProfileData();
  }

  getUserProfileData(): void {
    this.authService.getUserDetails().subscribe({
      next: (data: any) => {
        this.userProfileData = data;
      },
      error: (error: any) => {
        console.error('Error fetching user profile data:', error);
      },
    });
  }
}
