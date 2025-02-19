export enum TypeOffer {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface Offer {
    id_offer?: number;
    Title: string;
    Description: string;
    Start_Date: Date | string;
    End_Date: Date | string;
    Typeoffer: TypeOffer;
} 