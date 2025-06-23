export interface VoucherType {
  id: number;
  name: string;
  code: string;
  discount_type: "amount" | "percent";
  discount_value: number;
  min_order_amount: number;
  quantity: number;
  start_date: Date;
  end_date: Date;
  status: string;
  value: string;
  label: string;
  created_at: Date;
  updated_at: Date;
}
