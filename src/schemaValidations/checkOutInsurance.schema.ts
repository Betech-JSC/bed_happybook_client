import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const checkOutInsuranceSchema = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean
) => {
  return z.object({
    departurePoint: z.string().min(1, {
      message: messages.required,
    }),
    destination: z.string().min(1, {
      message: messages.required,
    }),
    qty: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 1, { message: messages.required })
      .refine((val) => val <= 100, {
        message: messages.inValid,
      }),
    insuranceBuyer: z.object({
      fullName: z.string().min(3, { message: messages.required }).max(255, {
        message: messages.inValid,
      }),
      address: z.string().min(3, { message: messages.required }),
      birthday: z.date({
        required_error: messages.required,
        invalid_type_error: messages.required,
      }),
      citizenId: z
        .string()
        .min(1, {
          message: messages.required,
        })
        .regex(/^0\d{12}$/, {
          message: messages.inValid,
        }),
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
    }),
    insuredUser: z.array(
      z.object({
        gender: z
          .string()
          .min(1, {
            message: messages.required,
          })
          .refine((value) => ["male", "female"].includes(value), {
            message: messages.required,
          }),
        fullName: z.string().min(3, { message: messages.required }).max(255, {
          message: messages.inValid,
        }),
        address: z.string().min(3, { message: messages.required }),
        birthday: z.date({
          required_error: messages.required,
          invalid_type_error: messages.required,
        }),
        citizenId: z
          .string()
          .min(1, {
            message: messages.required,
          })
          .regex(/^0\d{12}$/, {
            message: messages.inValid,
          }),
        buyFor: z.string().min(3, { message: messages.required }),
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
  });
};

export type checkOutInsuranceType = z.infer<
  ReturnType<typeof checkOutInsuranceSchema>
>;
