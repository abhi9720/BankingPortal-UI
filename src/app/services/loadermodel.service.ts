import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadermodelService {
  private isModalVisible = false;
  private modalMessage = '';

  constructor() {}

  show(message: string) {
    this.isModalVisible = true;
    this.modalMessage = message;
  }

  hide() {
    this.isModalVisible = false;
    this.modalMessage = '';
  }

  isShown() {
    return this.isModalVisible;
  }

  getMessage() {
    return this.modalMessage;
  }
}
