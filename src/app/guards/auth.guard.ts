// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      // User is logged in, redirect to "/dashboard" if trying to access the root route
      if (state.url === '/' || state.url === '') {
        this.router.navigate(['/dashboard']);
        return false; // Prevent access to the root route
      }
      return true; // Allow access to other routes
    } else {
      // User is not logged in, allow access to the root route
      return true;
    }
  }
}
