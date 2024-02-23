import { Component } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { User } from '../../models/user';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateComponent } from 'src/app/shared/components/user-update/user-update.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import { Product } from '../../models/product';
import { webSocket } from 'rxjs/webSocket';
import { Chat } from '../../models/chat';
import { ChatMessage } from '../../models/chatMessage';

@Component({
  selector: 'app-auth-content',
  templateUrl: './auth-content.component.html',
  styleUrls: ['./auth-content.component.scss']
})
export class AuthContentComponent {
  data: string[] = [];
  users: User[] = [];
  products: Product[] = [];
  chats: Chat[] = [];
  chatMessages: ChatMessage[] = [];
  loggedInUserId: number = 1;
  productSubject = webSocket('ws://85.215.57.188/api/topic/productAdded');

  constructor(private axiosService: AxiosService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.axiosService.request("GET", "/messages", {})
      .then(response => { this.data = response.data });
    this.axiosService.request("GET", "/users", {})  
      .then(response => this.users = response.data);
    this.axiosService.request("GET", "/products", {}) 
      .then(response => this.products = response.data);

    this.axiosService.request("GET", `/chatMessages?chatId=${this.loggedInUserId}`, {})  // Added chatId to the endpoint
      .then(response => { this.chatMessages = response.data });
  }

  onUpdateUser(user: User) {
    this.axiosService.request("PUT", `/users/${user.id}`, {
      login: user.login,
      id: user.id,
      imageUrl: '',
      firstName: user.firstName,
      secondName: user.secondName
    })
  }

  addMessage(chat: Chat) {
    this.axiosService.request("POST", "/chatMessages", {  
      content: "Test test test",
      chatId: chat.id,
      senderId: this.loggedInUserId,  
      timestamp: Date.now(), 
    })
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '250px',
      data: {},
      position: {
        left: `calc(50vw - 125px)`,
        top: `calc(250px )`
      }
    });
  }

  addChat(user: User) {
    this.axiosService.request("POST", "/chats", {
      user1: this.loggedInUserId,  
      user2: user.id,  
    })
  }

  public onOpenModal(user: User): void {
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '250px',
      data: { user: user },
      position: {
        left: `calc(50vw - 125px)`,
        top: `calc(250px )`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onUpdateUser(result);
      }
    });
  }
}
