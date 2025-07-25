import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CheckOutVisaSchema = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean
) => {
  return z.object({
    phone: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .regex(/^\d{10,11}$/, {
        message: messages.inValid,
      }),

    gender: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .refine((value) => ["male", "female", "other"].includes(value), {
        message: messages.required,
      }),

    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),

    full_name: z
      .string()
      .min(3, {
        message: messages.required,
      })
      .max(255, { message: messages.inValid }),

    note: z.string(),

    invoice: checkBoxGenerateInvoice
      ? z.object({
          contact_name: z.string().min(3, { message: messages.required }),
          address: z.string().min(3, { message: messages.required }),
          mst: z
            .string()
            .min(1, {
              message: messages.required,
            })
            .regex(/^\d{10,13}$/, {
              message: messages.inValid,
            }),
        })
      : z
          .object({
            contact_name: z.string().optional(),
            mst: z.string().optional(),
            address: z.string().optional(),
          })
          .optional(),

    checkBoxGenerateInvoice: z.boolean(),
  });
};

export type CheckOutVisaType = z.infer<ReturnType<typeof CheckOutVisaSchema>>;
