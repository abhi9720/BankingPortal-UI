import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environment/environment';
import { ToastService } from 'angular-toastify';

import jwt_decode from "jwt-decode";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
   

    const token = localStorage.getItem(environment.tokenName);

    if (token) {
      // Token is present, check if it's valid
      try {
        // Decode the JWT token
        const decodedToken: any = jwt_decode(token);

        // Check if the token is valid and not expired
        if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
          // Token is valid and not expired, add it to the headers
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin': environment.origin
            }
          });
          return next.handle(authRequest);
        } else {
          // Token is expired, clear it and redirect to login page
          console.error('Session expired. Redirecting to login page...');
          localStorage.clear();
          this.router.navigate(['/login']);
          this.toastService.error('Session expired. Please log in again.');
          return next.handle(request);
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        // Token is invalid, clear it and redirect to login page
        console.error('Invalid token. Redirecting to login page...');
        localStorage.clear();
        this.router.navigate(['/login']);
        this.toastService.error('Invalid token. Please log in again.');
        return next.handle(request);
      }
    } else {
      // No token present, allow the request as it is
      return next.handle(request);
    }
  }
}
