import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { FundTransferComponent } from './components/fund-transfer/fund-transfer.component';
import { AccountPinComponent } from './components/account-pin/account-pin.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account/deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'account/withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  { path: 'account/fund-transfer', component: FundTransferComponent, canActivate: [AuthGuard] },
  { path: 'account/pin', component: AccountPinComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'account/transaction-history', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  // Add other routes or a default route if needed
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }, // Handle 404 - Page Not Found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
