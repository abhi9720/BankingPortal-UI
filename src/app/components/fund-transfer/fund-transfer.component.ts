import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css'],
})
export class FundTransferComponent implements OnInit {
  fundTransferForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router,
    private loader: LoadermodelService
  ) {}

  ngOnInit(): void {
    this.initFundTransferForm();
  }

  initFundTransferForm(): void {
    this.fundTransferForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      targetAccountNumber: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (!this.fundTransferForm.valid) return;

    const { amount, pin, targetAccountNumber } = this.fundTransferForm.value;

    this.loader.show('Fetching account details...');
    this.apiService.getAccountDetails().subscribe({
      next: (accountResponse: any) => {
        this.loader.hide();
        console.log('✅ Account details fetched:', accountResponse);

        const sourceAccountNumber = accountResponse.accountNumber;
        const newTransfer = { amount, pin, targetAccountNumber, sourceAccountNumber };

        this.loader.show('Detecting Unusaulity...');
        this.apiService.getTransactions().subscribe({
          next: (transactionsResponse: any) => {
            this.loader.hide();
            console.log('✅ Transactions fetched:', transactionsResponse);

            this.loader.show('Transferring funds...');
            this.apiService.startWorkflow(transactionsResponse, newTransfer).subscribe({
              next: (response: any) => {
                this.loader.hide();
                console.log('🚦 Workflow response:', response);

                if (response.status === 'WAITING_FOR_OTP') {
                  sessionStorage.setItem('workflowSessionId', response.checkpoint);
                  this.toastService.info('OTP sent to your registered email/phone.');
                  this.router.navigate(['/fund-transfer-otp']);
                } else if (response.status === 'COMPLETED') {
                  if (response.data?.transferInstruction) {
                    const { amount, pin, targetAccountNumber } =
                      response.data.transferInstruction;

                    this.loader.show('Transferring funds...');
                    this.apiService
                      .fundTransfer(amount, pin, targetAccountNumber)
                      .subscribe({
                        next: (res: any) => {
                          this.loader.hide();
                          this.fundTransferForm.reset();
                          this.toastService.success(res.msg || 'Transfer successful.');
                          this.router.navigate(['/dashboard']);
                          console.log('Fund transfer successful!', res);
                        },
                        error: (error: any) => {
                          this.loader.hide();
                          this.toastService.error(error.error || 'Transfer failed.');
                          console.error('Fund transfer failed:', error);
                        },
                      });
                  } else {
                    this.toastService.success('Transfer successful.');
                    this.router.navigate(['/dashboard']);
                  }
                } else {
                  this.toastService.error(response.message || 'Unexpected workflow state');
                }
              },
              error: (error: any) => {
                this.loader.hide();
                console.error('Workflow start failed:', error);
                this.toastService.error(error.error || 'Transfer failed.');
              },
            });
          },
          error: (error: any) => {
            this.loader.hide();
            this.toastService.error('Failed to fetch transactions.');
            console.error('Transaction fetch error:', error);
          },
        });
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastService.error('Failed to fetch account details.');
        console.error('Account fetch error:', error);
      },
    });
  }

}
