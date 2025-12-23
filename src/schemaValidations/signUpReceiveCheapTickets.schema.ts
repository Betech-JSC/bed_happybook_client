import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const SignUpReceiveCheapTicketSchema = (
  messages: ValidationMessages
) => {
  return z.object({
    full_name: z
      .string()
      .trim()
      .min(3, {
        message: messages.required,
      })
      .max(256, {
        message: messages.required,
      }),
    phone: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .refine(
        (val) => {
          // Accept format with country code: +84xxxxxxxxx
          if (val.startsWith("+")) {
            const digitsOnly = val.replace(/\D/g, "");
            return digitsOnly.length >= 10 && digitsOnly.length <= 15;
          }
          // Accept format without country code: 10-11 digits
          return /^\d{10,11}$/.test(val);
        },
        {
          message: messages.inValid,
        }
      ),

    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),
  });
};

export type SignUpReceiveCheapTicketType = z.infer<
  ReturnType<typeof SignUpReceiveCheapTicketSchema>
>;
