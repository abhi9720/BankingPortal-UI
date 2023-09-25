// app-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { AccountPinComponent } from './components/account-pin/account-pin.component';
import { AccountdetailcardComponent } from './components/accountdetailcard/accountdetailcard.component';
import { UserprofilecardComponent } from './components/userprofilecard/userprofilecard.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OtpComponent } from './components/otp/otp.component';
import { NotfoundpageComponent } from './components/notfoundpage/notfoundpage.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Root route (HomeComponent) without AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account/deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'account/withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  { path: 'account/fund-transfer', component: FundTransferComponent, canActivate: [AuthGuard] },
  { path: 'account/pin', component: AccountPinComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountdetailcardComponent, canActivate: [AuthGuard] },
  { path: 'user/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'account/transaction-history', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/otp', component: OtpComponent },
  { path: '**', component: NotfoundpageComponent }, // Handle 404 - Page Not Found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
