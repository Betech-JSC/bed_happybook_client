import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const checkOutInsuranceSchema = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean,
  checkBoxcontactByBuyer: boolean
) => {
  return z.object({
    from_address: z.string().min(1, {
      message: messages.required,
    }),
    to_address: z.string().min(1, {
      message: messages.required,
    }),
    number_insured: z
      .union([z.string(), z.number()])
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 1, { message: messages.required })
      .refine((val) => val <= 100, {
        message: messages.inValid,
      }),
    name_buyer: z.string().min(3, { message: messages.required }).max(255, {
      message: messages.inValid,
    }),
    address_buyer: z.string().min(3, { message: messages.required }),
    birthday_buyer: z.date({
      required_error: messages.required,
      invalid_type_error: messages.required,
    }),
    passport_number_buyer: z
      .string()
      .min(1, { message: messages.required })
      .refine((val) => /^\d{12}$/.test(val) || /^[A-Z][0-9]{6,8}$/.test(val), {
        message: messages.inValid,
      }),

    phone_buyer: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .regex(/^0\d{9}$/, {
        message: messages.inValid,
      }),
    email_buyer: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),

    insured_info: z.array(
      z.object({
        gender: z
          .string()
          .min(1, {
            message: messages.required,
          })
          .refine((value) => ["male", "female"].includes(value), {
            message: messages.required,
          }),
        name: z.string().min(3, { message: messages.required }).max(255, {
          message: messages.inValid,
        }),
        birthday: z.date({
          required_error: messages.required,
          invalid_type_error: messages.required,
        }),
        passport_number: z
          .string()
          .min(1, { message: messages.required })
          .refine(
            (val) => /^\d{12}$/.test(val) || /^[A-Z][0-9]{6,8}$/.test(val),
            {
              message: messages.inValid,
            }
          ),
        buyFor: z.string().min(3, { message: messages.required }),
        address: !checkBoxcontactByBuyer
          ? z.string().min(3, { message: messages.required })
          : z.string().optional(),
        phone: !checkBoxcontactByBuyer
          ? z
              .string()
              .min(1, {
                message: messages.required,
              })
              .regex(/^0\d{9}$/, {
                message: messages.inValid,
              })
          : z.string().optional(),
        email: !checkBoxcontactByBuyer
          ? z.string().min(1, { message: messages.required }).email({
              message: messages.email,
            })
          : z.string().optional(),
      })
    ),
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
            message: messages.email,
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
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: messages.inValidAgreeTerms,
    }),
  });
};

export type checkOutInsuranceType = z.infer<
  ReturnType<typeof checkOutInsuranceSchema>
>;
