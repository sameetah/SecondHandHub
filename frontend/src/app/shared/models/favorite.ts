export interface Favorite {
    some(arg0: (product: any) => boolean): unknown;
    userId: number;
    productId: number;
    dateFavorited: Date
}