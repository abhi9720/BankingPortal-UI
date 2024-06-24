import { AngularToastifyModule } from 'angular-toastify';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { AccountPinComponent } from './components/account-pin/account-pin.component';
import { AccountdetailcardComponent } from './components/accountdetailcard/accountdetailcard.component';
import { DailyTransactionPiechartComponent } from './components/daily-transaction-piechart/daily-transaction-piechart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { DonwloadtransactionsComponent } from './components/donwloadtransactions/donwloadtransactions.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './components/login/login.component';
import { MonthlyTransactionChartComponent } from './components/monthly-transaction-chart/monthly-transaction-chart.component';
import { NotfoundpageComponent } from './components/notfoundpage/notfoundpage.component';
import { OtpComponent } from './components/otp/otp.component';
import { PinCreationModelComponent } from './components/pin-creation-model/pin-creation-model.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { TransactionLinechartComponent } from './components/transaction-linechart/transaction-linechart.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { UserprofilecardComponent } from './components/userprofilecard/userprofilecard.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { LoadermodelService } from './services/loadermodel.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DepositComponent,
    WithdrawComponent,
    FundTransferComponent,
    AccountdetailcardComponent,
    AccountPinComponent,
    UserprofilecardComponent,
    TransactionHistoryComponent,
    HeaderComponent,
    SidebarComponent,
    PinCreationModelComponent,
    HomeComponent,
    OtpComponent,
    LoaderComponent,
    NotfoundpageComponent,
    ProfileComponent,
    TransactionLinechartComponent,
    DailyTransactionPiechartComponent,
    TransactionComponent,
    MonthlyTransactionChartComponent,
    DonwloadtransactionsComponent,
    ResetPasswordComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularToastifyModule,
    BaseChartDirective,
    NgxCountriesDropdownModule,
    NgOtpInputModule
  ],
  providers: [
    ApiService,
    AuthService,
    LoadermodelService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

Chart.register(...registerables);
