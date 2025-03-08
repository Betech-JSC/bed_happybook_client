import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CheckOutBody = (messages: ValidationMessages) =>
  z.object({
    payment_method: z
      .string({
        required_error: messages.inValidPaymentMethod,
        invalid_type_error: messages.inValidPaymentMethod,
      })
      .nullable()
      .refine(
        (value) =>
          value && ["cash", "vietqr", "international_card"].includes(value),
        {
          message: messages.inValidPaymentMethod,
        }
      ),
  });

export type CheckOutBodyType = z.infer<ReturnType<typeof CheckOutBody>>;
