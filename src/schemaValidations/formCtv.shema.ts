import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const FormCtvSchema = (messages: ValidationMessages) =>
  z.object({
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
    citizen_id: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .regex(/^\d{12}$/, {
        message: messages.inValid,
      }),
    citizen_id_date: z.date({
      required_error: messages.required,
      invalid_type_error: messages.inValid,
    }),

    citizen_id_place: z.string().min(1, {
      message: messages.required,
    }),
    address: z.string().trim().min(5, {
      message: messages.required,
    }),
    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),
    required: z.string(),
  });

export type FormCtvType = z.infer<ReturnType<typeof FormCtvSchema>>;
