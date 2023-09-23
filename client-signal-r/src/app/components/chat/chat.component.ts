import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatPrivateComponent } from '../chat-private/chat-private.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Output() closeChatEmitter = new EventEmitter();
  private subscription?: Subscription;

  public myName = 'Unregistered';
  public onlineUsers: string[] = [];

  constructor(
    private router: Router,
    public notificationService: NotificationService,
    private modalService: NgbModal
  ) {
    // listen to the event OnlineUsers
    this.notificationService.notificationHub?.on(
      'OnlineUsers',
      (users: string[]) => {
        this.onlineUsers = users;
      }
    );
  }

  ngOnInit(): void {
    this.myName = this.notificationService.userName;
    this.notificationService.createChatHubConnection(); // to create the connection
  }

  sendMessage(message: string) {
    this.notificationService.SendMessage(message);
  }

  openPrivateChat(user: string) {
    const modalRef = this.modalService.open(ChatPrivateComponent)
    modalRef.componentInstance.toUser = user;
  }

  backToHome() {
    // this.closeChatEmitter.emit();
    this.router.navigate(['/auth/register']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();

    this.notificationService.stopChatHubConnection(); // to stop the connection when the component is destroyed
  }
}
