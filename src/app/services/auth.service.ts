import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl; // Replace with your actual API base URL
  private authtokenName = environment.tokenName

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
    return this.http.post(`${this.baseUrl}/users/verify-otp`, otpVerificationRequest);
  }

  login(accountNumber: string, password: string): Observable<any> {
    const body = {
      accountNumber: accountNumber,
      password: password
    };
    return this.http.post<any>(`${this.baseUrl}/users/login`, body);
  }

  isLoggedIn() {
    const token = localStorage.getItem(this.authtokenName);
    if (token) {
      try {
        // Decode the JWT token
        const decodedToken: any = jwt_decode(token);


        // Check if the token is valid and not expired
        if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
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
    localStorage.removeItem(this.authtokenName)
    this.router.navigate(['/']);
  }
}