import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CheckOutBody = (messages: ValidationMessages) =>
  z.object({
    payment_method: z
      .string({
        required_error: messages.inValidPaymentMethod,
        invalid_type_error: messages.inValidPaymentMethod,
      })
      .default("")
      .refine(
        (value) => value && ["cash", "vietqr", "onepay"].includes(value),
        {
          message: messages.inValidPaymentMethod,
        }
      ),
  });

export type CheckOutBodyType = z.infer<ReturnType<typeof CheckOutBody>>;
