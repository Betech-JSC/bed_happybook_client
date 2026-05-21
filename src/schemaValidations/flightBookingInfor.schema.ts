import { ValidationMessages } from "@/lib/messages";
import z from "zod";

function internationalPassportFields(
  messages: ValidationMessages,
  flightType: string
) {
  const isIntl = flightType === "international";
  return {
    passport: isIntl
      ? z.string().min(1, { message: messages.required })
      : z.string().optional(),
    nationality: isIntl
      ? z.string().min(1, { message: messages.required })
      : z.string().optional(),
    passport_expiry_date: isIntl
      ? z.date({
          required_error: messages.required,
          invalid_type_error: messages.inValid,
        })
      : z.date().optional(),
  };
}

function validatePassportExpiryBeforeDeparture(
  data: {
    atd?: { passport_expiry_date?: Date }[];
    chd?: { passport_expiry_date?: Date }[];
  },
  ctx: z.RefinementCtx,
  earliestDepartureDate: Date,
  segment: "atd" | "chd"
) {
  const list = segment === "atd" ? data.atd : data.chd;
  const departDay = new Date(earliestDepartureDate);
  departDay.setHours(0, 0, 0, 0);

  list?.forEach((pax, index) => {
    if (!pax.passport_expiry_date) return;
    const expiry = new Date(pax.passport_expiry_date);
    expiry.setHours(0, 0, 0, 0);
    if (expiry < departDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hộ chiếu không được hết hạn trước ngày bay",
        path: [segment, index, "passport_expiry_date"],
      });
    }
  });
}

export const FlightBookingInforBody = (
  messages: ValidationMessages,
  checkBoxGenerateInvoice: boolean,
  flightType: string,
  earliestDepartureDate?: Date
) =>
  z
    .object({
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
        ...internationalPassportFields(messages, flightType),
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
          ...internationalPassportFields(messages, flightType),
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
      full_name: z.string().min(3, { message: messages.required }).max(200, {
        message: messages.inValid,
      }),
      // last_name: z.string().min(1, { message: messages.required }).max(100, {
      //   message: messages.inValid,
      // }),
      phone: z
        .string()
        .min(1, {
          message: messages.required,
        })
        .refine(
          (val) => {
            // Accept format with country code: +84xxxxxxxxx
            if (val.startsWith("+")) {
              const digitsOnly = val.replace(/\D/g, "");
              return digitsOnly.length >= 10 && digitsOnly.length <= 15;
            }
            // Accept format without country code: 0xxxxxxxxx (10-11 digits)
            return /^0\d{9,10}$/.test(val);
          },
          {
            message: messages.inValid,
          }
        ),
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
  })
    .superRefine((data, ctx) => {
      if (flightType !== "international" || !earliestDepartureDate) return;
      validatePassportExpiryBeforeDeparture(
        data,
        ctx,
        earliestDepartureDate,
        "atd"
      );
      validatePassportExpiryBeforeDeparture(
        data,
        ctx,
        earliestDepartureDate,
        "chd"
      );
    });

export type FlightBookingInforType = z.infer<
  ReturnType<typeof FlightBookingInforBody>
>;
