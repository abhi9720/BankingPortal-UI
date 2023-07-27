import { Component } from '@angular/core';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  constructor(public loadermodelService: LoadermodelService) {}

  // Some example code to trigger the loader
  // You can call this method in response to some asynchronous action
  // e.g., during an HTTP request
  showLoader() {
    this.loadermodelService.show('Loading...'); // Pass the message you want to display
    // Simulate some async operation
    setTimeout(() => {
      this.loadermodelService.hide(); // Hide the loader after some time (when the async operation is completed)
    }, 20000);
  }
}
