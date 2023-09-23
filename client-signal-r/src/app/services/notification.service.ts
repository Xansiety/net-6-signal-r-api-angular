import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessageDto } from '../models/chat';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatPrivateComponent } from '../components/chat-private/chat-private.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // create a behavior subject to store the user name
  public myName = 'Unregistered';
  public notificationHub?: HubConnection;
  public onlineUsers: string[] = [];
  public newMessages: MessageDto[] = [];

  public privateMessagedInitialized = false;
  public privateMessages: MessageDto[] = [];

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  get userName() {
    return this.myName;
  }

  public registerUser(user: UserDto) {
    return this.http.post(
      `${environment.apiUrl}/Notification/registerUser`,
      user,
      {
        responseType: 'text',
      }
    );
  }

  createChatHubConnection() {
    this.notificationHub = new HubConnectionBuilder()
      .withUrl(`${environment.api}/hubs/notification`)
      .withAutomaticReconnect()
      .build();
    this.notificationHub.start().catch((err) => console.log(err));

    // listen to the event UsersConnected
    this.notificationHub.on('UsersConnected', () => {
      this.addUserConnectionId();
    });

    // listen to the event OnlineUsers
    this.notificationHub.on('OnlineUsers', (users: string[]) => {
      this.onlineUsers = [...users];
    });

    this.notificationHub.on('NewMessage', (newMessage: MessageDto) => {
      console.log(newMessage);
      this.newMessages = [...this.newMessages, newMessage];
    });

    this.notificationHub.on('OpenPrivateChat', (newPrivateMessageChat: MessageDto) => {
        this.privateMessages = [...this.privateMessages, newPrivateMessageChat];
        this.privateMessagedInitialized = true;
        const modalRef = this.modalService.open(ChatPrivateComponent, { size: 'md', });
        modalRef.componentInstance.toUser = newPrivateMessageChat.from;
      }
    );

    this.notificationHub.on('NewPrivateMessage', (newPrivateMessage: MessageDto) => {
        this.privateMessages = [...this.privateMessages, newPrivateMessage];
      }
    );

    this.notificationHub.on('ClosePrivateChat', () => {
      this.privateMessagedInitialized = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });
  }

  stopChatHubConnection() {
    this.notificationHub?.stop().catch((err) => console.log(err));
  }

  async addUserConnectionId() {
    return this.notificationHub
      ?.invoke('AddUserToConnectionId', this.myName)
      .catch((err) => console.log(err));
  }

  async SendMessage(message: string) {
    const command: MessageDto = {
      from: this.myName,
      message: message,
    };
    return this.notificationHub
      ?.invoke('ReceiveMessage', command)
      .catch((err) => console.log(err));
  }

  async SendPrivateMessage(toUser: string, message: string) {
    const command: MessageDto = {
      from: this.myName,
      to: toUser,
      message: message,
    };

    if (!this.privateMessagedInitialized) {

      this.privateMessagedInitialized = true;
      return this.notificationHub
        ?.invoke('CreatePrivateChat', command)
        .then(() => {
          console.log({command});
          this.privateMessages = [...this.privateMessages, command];
        })
        .catch((err) => console.log(err));

    } else {
      return this.notificationHub
        ?.invoke('ReceivePrivateMessage', command)
        .catch((err) => console.log(err));
    }
  }

  async closePrivateChatMessage(toUser: string) {
    return this.notificationHub
      ?.invoke('RemovePrivateChat', this.myName, toUser)
      .catch((err) => console.log(err));
  }
}
