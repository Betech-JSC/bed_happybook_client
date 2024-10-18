import z from "zod";

export const VisaApplicationBody = z.object({
  country: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(255, {
      message: "Thông tin không hợp lệ!",
    }),
  is_visa_rejected: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["0", "1"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  full_name: z
    .string()
    .trim()
    .min(3, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(255, {
      message: "Thông tin không hợp lệ!",
    }),
  birth_year: z
    .string()
    .min(4, {
      message: "Vui lòng điền thông tin này",
    })
    .regex(/^\d{4}$/, {
      message: "Năm sinh không đúng định dạng",
    }),
  phone: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .regex(/^\d{10,11}$/, {
      message: "Số điện thoại không đúng định dạng",
    }),
  address: z.string().min(5, {
    message: "Vui lòng điền thông tin này",
  }),
  temporary_address: z.string().min(5, {
    message: "Vui lòng điền thông tin này",
  }),
  is_relatives_abroad_not_legal: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["0", "1"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  education: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["1", "2", "3", "4", "5", "6", "7", "8"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  purpose_visa_application: z
    .array(z.string())
    .nonempty({ message: "Vui lòng điền thông tin này" })
    .refine(
      (values) =>
        values.every((val) => ["1", "2", "3", "4", "5", "6"].includes(val)),
      {
        message: "Thông tin không hợp lệ!",
      }
    ),
  travel_history: z.string().min(5, {
    message: "Vui lòng điền thông tin này",
  }),
  job: z
    .array(z.string())
    .nonempty({ message: "Vui lòng điền thông tin này" })
    .refine(
      (values) =>
        values.every((val) => ["1", "2", "3", "4", "5"].includes(val)),
      {
        message: "Thông tin không hợp lệ!",
      }
    ),
  job_description: z.string().min(3, {
    message: "Vui lòng điền thông tin này",
  }),
  max_savings_book: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["1", "2", "3", "4", "5"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  assets_home: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["0", "1"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  assets_car: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((val) => ["0", "1"].includes(val), {
      message: "Thông tin không hợp lệ",
    }),
  other_assets: z.string().min(5, {
    message: "Vui lòng điền thông tin này",
  }),
});

export type VisaApplicationBodyType = z.infer<typeof VisaApplicationBody>;
