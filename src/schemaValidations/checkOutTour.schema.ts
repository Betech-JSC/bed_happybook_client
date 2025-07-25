import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CheckOutTourSchema = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean
) => {
  return z.object({
    depart_date: z.date({
      required_error: messages.required,
      invalid_type_error: messages.inValid,
    }),

    depart_point: z.string().min(1, {
      message: messages.required,
    }),

    atd: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 1, { message: messages.inValid })
      .refine((val) => val <= 1000, {
        message: messages.inValid,
      }),

    chd: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 0, { message: messages.inValid })
      .refine((val) => val <= 1000, {
        message: messages.inValid,
      }),
    inf: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 0, { message: messages.inValid })
      .refine((val) => val <= 1000, {
        message: messages.inValid,
      }),

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

export type CheckOutTourType = z.infer<ReturnType<typeof CheckOutTourSchema>>;
