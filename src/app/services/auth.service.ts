import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl; // Replace with your actual API base URL
  private authtokenName = environment.tokenName;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/register`, data);
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/user`);
  }

  updateUserProfile(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/update`, payload);
  }
  generateOTP(accountNumber: string): Observable<any> {
    const body = { accountNumber: accountNumber };
    return this.http.post(`${this.baseUrl}/users/generate-otp`, body);
  }

  verifyOTP(otpVerificationRequest: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/users/verify-otp`,
      otpVerificationRequest
    );
  }

  login(accountNumber: string, password: string): Observable<any> {
    const body = {
      accountNumber: accountNumber,
      password: password,
    };
    return this.http.post<any>(`${this.baseUrl}/users/login`, body);
  }

  isLoggedIn() {
    const token = localStorage.getItem(this.authtokenName);
    if (token) {
      try {
        // Decode the JWT token
        const decodedToken: any = jwtDecode(token);

        // Check if the token is valid and not expired
        if (
          decodedToken &&
          decodedToken.exp &&
          decodedToken.exp * 1000 > Date.now()
        ) {
          // Token is valid and not expired
          return true;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    return false;
  }

  logOutUser() {
    return this.http.get<any>(`${this.baseUrl}/users/logout`);
  }

  // Password reset
  sendOtpForPasswordReset(identifier: string): Observable<any> {
    const body = { identifier: identifier };
    return this.http.post(`${this.baseUrl}/auth/password-reset/send-otp`, body);
  }

  verifyOtpForPasswordReset(identifier: string, otp: string): Observable<any> {
    const body = { identifier: identifier, otp: otp };
    return this.http.post(`${this.baseUrl}/auth/password-reset/verify-otp`, body);
  }

  resetPassword(identifier: string, resetToken: string, newPassword: string): Observable<any> {
    const body = { identifier: identifier, resetToken: resetToken, newPassword: newPassword };
    return this.http.post(`${this.baseUrl}/auth/password-reset`, body);
  }
}
