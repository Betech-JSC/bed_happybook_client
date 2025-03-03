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
      .regex(/^\d{10,11}$/, {
        message: messages.inValid,
      }),

    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),
  });
};

export type SignUpReceiveCheapTicketType = z.infer<
  ReturnType<typeof SignUpReceiveCheapTicketSchema>
>;
