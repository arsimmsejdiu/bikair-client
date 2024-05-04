export interface PaymentMethod {
    card_token: string
    brand: string
    exp_year: number
    exp_month: number
    last_4: number
    country: string
    uuid: string
}
