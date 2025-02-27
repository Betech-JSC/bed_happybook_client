import z from "zod";

export const CheckOutBody = z.object({
  payment_method: z
    .string({
      required_error: "Vui lòng chọn phương thức thanh toán",
      invalid_type_error: "Vui lòng điền thông tin này",
    })
    .nullable()
    .refine(
      (value) =>
        value &&
        ["cash", "vietqr", "international_card", "bank_transfer"].includes(
          value
        ),
      {
        message: "Vui lòng chọn phương thức thanh toán",
      }
    ),
});

export type CheckOutBodyType = z.infer<typeof CheckOutBody>;
