import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  checkScreenSize() {
    return window.innerWidth < 768;
  }

  logout(): void {
    this.authService.logOutUser();
  }


}
