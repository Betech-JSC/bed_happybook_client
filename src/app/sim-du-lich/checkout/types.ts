export type PaymentMethod = "vietqr" | "onepay" | "paypal";

export type EsimQuoteData = {
  items?: Array<{
    variant_id?: string | number;
    quantity?: number;
    subtotal_amount?: number;
    service_fee_amount?: number;
    total_amount?: number;
    currency?: string;
    is_available?: boolean;
    reason?: string;
  }>;
  subtotal_amount?: number;
  service_fee_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  currency?: string;
  is_available?: boolean;
};

export type EsimCheckoutData = {
  payment_method?: PaymentMethod;
  order_code?: string;
  payment_url?: string;
  approval_url?: string;
  payable_amount?: number;
  payment_fee_amount?: number;
  currency?: string;
  qr_display?: {
    image_url?: string | null;
    bank_account_number?: string | null;
    bank_account_name?: string | null;
    bank_name?: string | null;
    transaction_note?: string | null;
  };
  bank_transfer?: {
    amount?: number;
    content?: string;
    currency?: string;
  };
};
