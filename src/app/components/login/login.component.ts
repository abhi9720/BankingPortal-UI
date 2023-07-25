import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environment/environment';

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
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { accountNumber, password } = this.loginForm.value;
      this.authService.login(accountNumber, password).subscribe(
        (response: any) => {
          // Handle successful login here
          // Save the token from the response if needed
          console.log(response);
          this._toastService.success('Account LoggedIn');
          const token = response.token;
          console.log(token);
          localStorage.setItem(this.authTokenName, token);
          this.router.navigate(['/']);
          // Redirect to the desired page or perform any other action
        },
        (error: any) => {
          // Handle login failure here
          this._toastService.error('Invalid Credentials');
          console.error('Login error:', error);
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
