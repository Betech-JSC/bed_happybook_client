import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const ContactSchema = (messages: ValidationMessages) =>
  z.object({
    full_name: z
      .string({ required_error: messages.required })
      .trim()
      .min(3, {
        message: messages.required,
      })
      .max(256, {
        message: messages.inValid,
      }),
    phone: z
      .string({ required_error: messages.required })
      .min(1, {
        message: messages.required,
      })
      .regex(/^(\+?\d{1,3})?(\d{9,11})$/, {
        message: messages.inValid,
      }),
    service: z.string({ required_error: messages.required }).trim().min(4, {
      message: messages.required,
    }),
    email: z
      .string({ required_error: messages.required })
      .min(1, { message: messages.required })
      .email({
        message: messages.email,
      }),
    note: z.string(),
  });

export type ContactBodyType = z.infer<ReturnType<typeof ContactSchema>>;
