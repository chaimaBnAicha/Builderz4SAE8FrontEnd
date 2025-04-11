export interface Insurance {
    id_Insurance?: number;
    description: string;
    start_Date: Date | string;
    end_Date: Date | string;
    amount: number;
    category: Category;
    user?: {
        id: number;
    };
}

export enum Category {
    RCPro = 'RCPro',
    RC = 'RC',
    RCProPlus = 'RCProPlus'
} 