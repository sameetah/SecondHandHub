import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Chat } from 'src/app/shared/models/chat';
import { ChatMessage } from 'src/app/shared/models/chatMessage';
import { User } from 'src/app/shared/models/user';
import { AxiosService } from 'src/app/shared/services/axios.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/shared/services/upload.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { RxStompService } from 'src/app/rx-stomp.service';

@Component({
  selector: 'app-chat-overview',
  templateUrl: './chat-overview.component.html',
  styleUrls: ['./chat-overview.component.scss'],
})
export class ChatOverviewComponent {
  @ViewChild('chatList', { static: false }) chatList?: ElementRef;
  loggedInUser: User | null = null;
  chatting: boolean = true;
  showChatResponsive: boolean = false;
  activeChat: Chat | undefined = undefined;
  chats: Chat[] = [];
  chatMessages: ChatMessage[] = [];
  messageToSend: string = '';
  offerPrice: number = 0;

  searchedChats: Chat[] = [];
  searchTerm: string = '';
  isChatlistHidden: boolean = false;
  uploadPercent: Observable<number> | undefined;
  downloadURL: Observable<string> | undefined;
  selectedFiles!: FileList;

  constructor(
    private axiosService: AxiosService,
    private afStorage: AngularFireStorage,
    private uploadService: UploadService,
    private chatService: ChatService,
    private rxStompService: RxStompService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.isChatlistHidden = false;
    } else {
      this.isChatlistHidden = true;
    }
  }

  ngOnInit(): void {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
      if (this.loggedInUser) {
        this.axiosService
          .request('GET', '/chats', {}, {userId: this.loggedInUser.id})
          .then((response) => {
            this.chats = response.data;
            this.searchedChats = this.chats;
            if (this.chats.length > 0) {
              this.setActiveChat(this.chats[0]);
              this.chatService.receivedMessage$.subscribe((receivedMessage) => {
                if (receivedMessage && this.activeChat?.id === receivedMessage.chatId) {
                  this.chatMessages.push(receivedMessage);
                  // If you have any logic to scroll to the bottom or update the UI, add it here.
                }
              });
            }
          });

      }
    });
  }

  setActiveChat(chat: Chat) {
    this.activeChat = chat;
    if (this.activeChat) {
      this.chatService.subscribeToChat(this.activeChat.id.toString());
    }

    if (this.activeChat) {
      this.axiosService
        .request('GET', '/chatMessages', {}, {chatId: this.activeChat.id, page: 0, size: 10})
        .then((response) => {
          this.chatMessages = response.data;
          this.sortMessagesByTimestamp(); // Sort the messages by timestamp
        });
    }
}

sortMessagesByTimestamp(): void {
    this.chatMessages.sort((a, b) => {
        return new Date(a.sentTimestampMillis).getTime() - new Date(b.sentTimestampMillis).getTime();
    });
}


  addMessage(imageUrl?: string) {
    const token = this.axiosService.getAuthToken();
    if (token){
    if (this.activeChat && this.loggedInUser) {
      const message: ChatMessage = {
        id: null,
        content: this.messageToSend,
        chatId: this.activeChat?.id,
        sender: this.loggedInUser,
        imageUrl: imageUrl ? imageUrl : '',
        sentTimestampMillis: new Date(), 
        price: this.offerPrice
      };
     

      // Send the message via WebSocket (using STOMP in ChatService)
      this.chatService.sendMessage(this.activeChat.id.toString(), message,token);

    

      this.messageToSend = '';
    }}
  }

  toggleChat() {
    this.showChatResponsive = !this.showChatResponsive;
  }


  searchChats() {
    this.searchedChats = this.chats.filter((chat) =>
      chat.product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  hideChatlist() {
    this.isChatlistHidden = !this.isChatlistHidden;
    // get the chatListButton element
    const chatListButton = document.querySelector('.chatListButton');

    if (!this.isChatlistHidden) {
      // assuming this is a global variable or accessible in this scope
      chatListButton?.classList.add('moved');
    } else {
      chatListButton?.classList.remove('moved');
    }
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    this.uploadService.uploadFile(this.selectedFiles[0]).then((url) => {
      if (url) {
        this.addMessage(url);
      }
    });
  }
}
