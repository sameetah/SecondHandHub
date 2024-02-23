import { Injectable } from '@angular/core';
import { RxStompService } from '../../rx-stomp.service';
import { ChatMessage } from '../models/chatMessage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private receivedMessageSubject = new BehaviorSubject<ChatMessage | null>(null);
  receivedMessage$ = this.receivedMessageSubject.asObservable();

  constructor(private rxStompService: RxStompService) { }

  public subscribeToChat(chatId: string): void {
    this.rxStompService.watch(`/topic/chat/${chatId}`).subscribe(message => {
      console.log(message.body);
      const receivedChatMessage: ChatMessage = JSON.parse(message.body);
      this.receivedMessageSubject.next(receivedChatMessage);
    });
  }
  public sendMessage(chatId: string, chatMessage: ChatMessage, token: string): void {
    this.rxStompService.publish({
      destination: `/app/chat/${chatId}/sendMessage`,
      body: JSON.stringify(chatMessage),
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Sent message to chatId:', chatId, 'with content:', chatMessage);
}


}
