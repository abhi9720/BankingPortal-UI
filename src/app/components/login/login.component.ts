import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';
import { environment } from 'src/environment/environment';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  authTokenName = environment.tokenName;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private _toastService: ToastService,
    private loader: LoadermodelService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    sessionStorage.clear();
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { identifier, password } = this.loginForm.value;
      this.loader.show('Logging...');
      this.authService.login(identifier, password).subscribe({
        next: (response: any) => {
          // Handle successful login here
          // Save the token from the response if needed
          console.log(response);
          // this._toastService.success('Account LoggedIn');
          const token = response.token;
          console.log(token);
          localStorage.setItem(this.authTokenName, token);
          this.loader.hide(); // Hide the loader on successful login
          this.router.navigate(['/dashboard']);
          // Redirect to the desired page or perform any other action
        },
        error: (error: any) => {
          // Handle login failure here
          this._toastService.error(error.error);
          console.error('Login error:', error);
          this.loader.hide(); // Hide the loader on login error
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
