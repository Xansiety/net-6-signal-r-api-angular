import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-chat-private',
  templateUrl: './chat-private.component.html',
  styleUrls: ['./chat-private.component.css']
})
export class ChatPrivateComponent implements OnInit, OnDestroy{

  @Input() toUser: string = '';

  constructor(public activeModal: NgbActiveModal, public notificationService: NotificationService ) { }

  ngOnInit(): void {
  }

  sendPrivateMessage(message: any) {
    this.notificationService.SendPrivateMessage(this.toUser,message);
  }

  ngOnDestroy(): void {
    this.notificationService.closePrivateChatMessage(this.toUser);
  }



}
