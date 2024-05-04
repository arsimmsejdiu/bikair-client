import {Check} from "@assets/index";

export interface IPaymentHistory {
    id: number,
    title: string,
    image: typeof Check,
    created_at: string,
    status: string,
    price: string
}
