import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const checkOutAmusementTicketSchema = (
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
    // number_adult: z
    //   .string()
    //   .transform((val) => {
    //     const num = Number(val);
    //     return isNaN(num) ? 0 : num;
    //   })
    //   .refine((val) => val >= 1, { message: messages.inValid })
    //   .refine((val) => val <= 30, {
    //     message: messages.inValid,
    //   }),

    // number_child: z
    //   .string()
    //   .transform((val) => {
    //     const num = Number(val);
    //     return isNaN(num) ? 0 : num;
    //   })
    //   .refine((val) => val >= 0, { message: messages.inValid })
    //   .refine((val) => val <= 30, {
    //     message: messages.inValid,
    //   }),

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

export type checkOutAmusementTicketType = z.infer<
  ReturnType<typeof checkOutAmusementTicketSchema>
>;
