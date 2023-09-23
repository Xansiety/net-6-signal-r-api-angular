import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit {
  @Output() sendMessageEmitter = new EventEmitter();

  public content = '';

  constructor() {}

  ngOnInit(): void {}

  sendMessage() {
    if (this.content?.trim() != '') {
      this.sendMessageEmitter.emit(this.content);
    }
  }
}
