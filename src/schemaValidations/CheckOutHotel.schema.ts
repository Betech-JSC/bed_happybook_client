import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CheckOutHotelSchema = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean
) => {
  return z
    .object({
      check_in_date: z.date({
        required_error: messages.required,
        invalid_type_error: messages.required,
      }),

      check_out_date: z.date({
        required_error: messages.required,
        invalid_type_error: messages.required,
      }),

      atd: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 1, { message: messages.inValid })
        .refine((val) => val <= 30, {
          message: messages.inValid,
        }),

      chd: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 0, { message: messages.inValid })
        .refine((val) => val <= 30, {
          message: messages.inValid,
        }),
      inf: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 0, { message: messages.inValid })
        .refine((val) => val <= 30, {
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
    })
    .refine((data) => data.check_in_date < data.check_out_date, {
      path: ["check_out_date"],
      message: messages.inValidCheckOutDate,
    });
};

export type CheckOutHotelType = z.infer<ReturnType<typeof CheckOutHotelSchema>>;
