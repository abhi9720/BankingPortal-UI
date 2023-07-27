import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showDropdown: boolean = false; // Add this property to control the visibility of the dropdown menu

  constructor(private authService: AuthService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logOutUser();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown; // Toggle the visibility of the dropdown menu
  }
}
