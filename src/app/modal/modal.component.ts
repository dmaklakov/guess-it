import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Modal event, used in home for join
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() modalEvent = new EventEmitter<string | boolean>();
  constructor() { }

  close(): void {
    this.modalEvent.emit(true);
  }

  sendCode(code: string): void {
    this.modalEvent.emit(code);
  }

}
