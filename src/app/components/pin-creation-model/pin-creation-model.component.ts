import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pin-creation-model',
  templateUrl: './pin-creation-model.component.html',
  styleUrls: ['./pin-creation-model.component.css']
})
export class PinCreationModelComponent {
  @Output() redirect: EventEmitter<void> = new EventEmitter<void>();

  onClose(): void {
    // Emit the 'redirect' event to inform the parent component (DashboardComponent) to redirect to the PIN creation page.
    this.redirect.emit();
  }
}
