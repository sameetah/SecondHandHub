import { Product } from "./product";
import { User } from "./user";

export interface Chat {
    id: number,
    user1: User;
    user2: User;
    product: Product;    
}