import { User } from "./user";

export interface ChatMessage {
    id: number | null,
    chatId: number;
    content: string;
    sender: User;
    sentTimestampMillis: Date;
    imageUrl?: string;
    price?: number;
   
}
