import { Component, Input, OnInit } from '@angular/core';
import { MessageDto } from '../../models/chat';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit {

  @Input() messages: MessageDto[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
