import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountPinComponent } from './components/account-pin/account-pin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { AuthInterceptor } from './auth.interceptor';
import { AngularToastifyModule } from 'angular-toastify';
import { PinCreationModelComponent } from './components/pin-creation-model/pin-creation-model.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DepositComponent,
    WithdrawComponent,
    FundTransferComponent,
    AccountDetailsComponent,
    AccountPinComponent,
    UserProfileComponent,
    TransactionHistoryComponent,
    HeaderComponent,
    SidebarComponent,
    PinCreationModelComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularToastifyModule

    
  ],
  providers: [ApiService, AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [PinCreationModelComponent]
})
export class AppModule { }
