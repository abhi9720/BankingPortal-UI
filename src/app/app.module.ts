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
import { AccountdetailcardComponent } from './components/accountdetailcard/accountdetailcard.component';
import { AccountPinComponent } from './components/account-pin/account-pin.component';
import { UserprofilecardComponent } from './components/userprofilecard/userprofilecard.component';
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
import { OtpComponent } from './components/otp/otp.component';
import { LoadermodelService } from './services/loadermodel.service';
import { LoaderComponent } from './components/loader/loader.component';
import { NotfoundpageComponent } from './components/notfoundpage/notfoundpage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionLinechartComponent } from './components/transaction-linechart/transaction-linechart.component';
import { ChartsModule } from 'ng2-charts';
import { DailyTransactionPiechartComponent } from './components/daily-transaction-piechart/daily-transaction-piechart.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { MonthlyTransactionChartComponent } from './components/monthly-transaction-chart/monthly-transaction-chart.component';

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
    MonthlyTransactionChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularToastifyModule,
    ChartsModule


  ],
  providers: [ApiService, AuthService, LoadermodelService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PinCreationModelComponent]
})
export class AppModule { }
