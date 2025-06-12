import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const checkOutAmusementYachtSchema = (
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
    depart_date: z.date({
      required_error: messages.required,
      invalid_type_error: messages.inValid,
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
          company_name: z
            .string()
            .min(3, { message: messages.required })
            .max(255, {
              message: messages.inValid,
            }),
          address: z.string().min(3, { message: messages.required }),
          city: z.string().min(3, { message: messages.required }),
          mst: z
            .string()
            .min(1, {
              message: messages.required,
            })
            .regex(/^\d{10,13}$/, {
              message: messages.inValid,
            }),
          contact_name: z.string().min(3, { message: messages.required }),
          phone: z
            .string()
            .min(1, {
              message: messages.required,
            })
            .regex(/^0\d{9}$/, {
              message: messages.inValid,
            }),
          email: z.string().min(1, { message: messages.required }).email({
            message: messages.inValid,
          }),
        })
      : z
          .object({
            company_name: z.string().optional(),
            address: z.string().optional(),
            city: z.string().optional(),
            mst: z.string().optional(),
            contact_name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),

    checkBoxGenerateInvoice: z.boolean(),
  });
};

export type checkOutAmusementYachtType = z.infer<
  ReturnType<typeof checkOutAmusementYachtSchema>
>;
