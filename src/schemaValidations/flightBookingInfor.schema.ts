import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const FlightBookingInforBody = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean,
  flightType: string
) =>
  z.object({
    atd: z.array(
      z.object({
        firstName: z
          .string()
          .min(1, { message: messages.required })
          .regex(/^[a-zA-Z\s]+$/, {
            message: messages.inValidLastName,
          })
          .max(30, {
            message: messages.inValid,
          }),
        lastName: z
          .string()
          .min(1, { message: messages.required })
          .regex(/^[a-zA-Z\s]+$/, {
            message: messages.inValidLastName,
          })
          .max(100, {
            message: messages.inValid,
          }),
        gender: z
          .string()
          .min(1, {
            message: messages.required,
          })
          .refine((value) => ["male", "female"].includes(value), {
            message: messages.required,
          }),
        birthday: z.date({
          required_error: messages.required,
          invalid_type_error: messages.inValidBirthDay,
        }),
        passport:
          flightType === "international"
            ? z
                .string()
                .min(1, {
                  message: messages.required,
                })
                // .max(10, {
                //   message: messages.inValid,
                // })
                .optional()
            : z.string().optional(),
        passport_expiry_date:
          flightType === "international"
            ? z.date({
                required_error: messages.required,
                invalid_type_error: messages.inValid,
              })
            : z.date().optional(),
        baggages: z
          .array(
            z
              .object({
                code: z.string(),
              })
              .optional()
          )
          .optional(),
      })
    ),
    chd: z
      .array(
        z.object({
          firstName: z
            .string()
            .min(1, { message: messages.required })
            .regex(/^[a-zA-Z\s]+$/, {
              message: messages.inValidLastName,
            })
            .max(30, {
              message: messages.inValid,
            }),
          lastName: z
            .string()
            .min(1, { message: messages.required })
            .regex(/^[a-zA-Z\s]+$/, {
              message: messages.inValidLastName,
            })
            .max(100, {
              message: messages.inValid,
            }),
          gender: z
            .string()
            .min(1, {
              message: messages.required,
            })
            .refine((value) => ["male", "female"].includes(value), {
              message: messages.required,
            }),
          birthday: z.date({
            required_error: messages.required,
            invalid_type_error: messages.inValidBirthDay,
          }),
          baggages: z
            .array(
              z
                .object({
                  code: z.string(),
                })
                .optional()
            )
            .optional(),
        })
      )
      .optional(),
    inf: z
      .array(
        z.object({
          firstName: z
            .string()
            .min(1, { message: messages.required })
            .regex(/^[a-zA-Z\s]+$/, {
              message: messages.inValidLastName,
            })
            .max(30, {
              message: messages.inValid,
            }),
          lastName: z
            .string()
            .min(1, { message: messages.required })
            .regex(/^[a-zA-Z\s]+$/, {
              message: messages.inValidLastName,
            })
            .max(100, {
              message: messages.inValid,
            }),
          gender: z
            .string()
            .min(1, {
              message: messages.required,
            })
            .refine((value) => ["male", "female"].includes(value), {
              message: messages.required,
            }),
          birthday: z.date({
            required_error: messages.required,
            invalid_type_error: messages.inValidBirthDay,
          }),
          baggages: z
            .array(
              z
                .object({
                  code: z.string(),
                })
                .optional()
            )
            .optional(),
        })
      )
      .optional(),
    book_type: z.string().optional(),
    trip: z.string().optional(),
    contact: z.object({
      gender: z
        .union([z.string(), z.boolean()])
        .refine(
          (val) =>
            val === true ||
            val === false ||
            ["male", "female"].includes(val as string),
          { message: messages.required }
        ),
      first_name: z.string().min(1, { message: messages.required }).max(30, {
        message: messages.inValid,
      }),
      last_name: z.string().min(1, { message: messages.required }).max(100, {
        message: messages.inValid,
      }),
      phone: z
        .string()
        .min(1, {
          message: messages.required,
        })
        .regex(/^0\d{9,10}$/, {
          message: messages.inValid,
        }),
      email: z.string().min(1, { message: messages.required }).email({
        message: messages.email,
      }),
      address: z.string().optional(),
    }),
    Note: z.string(),
    // PaymentMethod: z
    //   .string()
    //   .min(1, { message: "Vui lòng chọn phương thức thanh toán" })
    //   .refine((value) => ["cash", "vnpay", "bank_transfer"].includes(value), {
    //     message: messages.required,
    //   }),
    invoice: checkBoxGenerateInvoice
      ? z.object({
          company_name: z
            .string()
            .min(3, { message: messages.required })
            .max(256, {
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

export type FlightBookingInforType = z.infer<
  ReturnType<typeof FlightBookingInforBody>
>;
