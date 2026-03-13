import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const VisaApplicationSchema = (messages: ValidationMessages) =>
  z.object({
    country: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .max(255, {
        message: messages.inValid,
      }),
    is_visa_rejected: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["0", "1"].includes(val), {
        message: messages.inValid,
      }),
    full_name: z
      .string({ required_error: messages.required })
      .trim()
      .min(3, {
        message: messages.required,
      })
      .max(255, {
        message: messages.inValid,
      }),
    birth_year: z
      .string({ required_error: messages.required })
      .min(4, {
        message: messages.required,
      })
      .regex(/^\d{4}$/, {
        message: "Năm sinh không đúng định dạng",
      }),
    phone: z
      .string({ required_error: messages.required })
      .min(1, {
        message: messages.required,
      })
      .regex(/^\d{10,11}$/, {
        message: "Số điện thoại không đúng định dạng",
      }),
    email: z.string({ required_error: messages.required }).trim().email({
      message: messages.email,
    }),
    address: z.string({ required_error: messages.required }).min(5, {
      message: messages.required,
    }),
    temporary_address: z.string({ required_error: messages.required }).min(5, {
      message: messages.required,
    }),
    is_relatives_abroad_not_legal: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["0", "1"].includes(val), {
        message: messages.inValid,
      }),
    education: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["1", "2", "3", "4", "5", "6", "7", "8"].includes(val), {
        message: messages.inValid,
      }),
    purpose_visa_application: z
      .array(z.string())
      .nonempty({ message: messages.required })
      .refine(
        (values) =>
          values.every((val) => ["1", "2", "3", "4", "5", "6"].includes(val)),
        {
          message: messages.inValid,
        }
      ),
    travel_history: z.string({ required_error: messages.required }).min(5, {
      message: messages.required,
    }),
    job: z
      .array(z.string())
      .nonempty({ message: messages.required })
      .refine(
        (values) =>
          values.every((val) => ["1", "2", "3", "4", "5"].includes(val)),
        {
          message: messages.inValid,
        }
      ),
    job_description: z.string({ required_error: messages.required }).min(3, {
      message: messages.required,
    }),
    max_savings_book: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["1", "2", "3", "4", "5"].includes(val), {
        message: messages.inValid,
      }),
    assets_home: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["0", "1"].includes(val), {
        message: messages.inValid,
      }),
    assets_car: z
      .string({ required_error: messages.required })
      .trim()
      .min(1, {
        message: messages.required,
      })
      .refine((val) => ["0", "1"].includes(val), {
        message: messages.inValid,
      }),
    other_assets: z.string({ required_error: messages.required }).min(5, {
      message: messages.required,
    }),
  });

export type VisaApplicationType = z.infer<
  ReturnType<typeof VisaApplicationSchema>
>;
