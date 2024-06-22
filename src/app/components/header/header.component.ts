import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environment/environment';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private authTokenName = environment.tokenName;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _toastService: ToastService
  ) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  checkScreenSize() {
    return window.innerWidth < 768;
  }

  logout(): void {
    this.authService.logOutUser().subscribe({
      next: () => {
        localStorage.removeItem(this.authTokenName);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Logout error:', error);
        this._toastService.error(error.error);
      },
    });
  }
}
