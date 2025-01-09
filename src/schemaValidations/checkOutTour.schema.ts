import z from "zod";

export const CheckOutTourBody = (checkBoxGenerateInvoice: boolean) => {
  return z.object({
    depart_date: z.date({
      required_error: "Vui lòng điền thông tin này",
      invalid_type_error: "Ngày khởi hành không đúng định dạng",
    }),

    depart_point: z.string().min(1, {
      message: "Vui lòng điền thông tin này",
    }),

    atd: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 1, { message: "Số phải lớn hơn hoặc bằng 1" })
      .refine((val) => val <= 1000, {
        message: "Số lượng tối là 1000",
      }),

    chd: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 0, { message: "Số phải lớn hơn hoặc bằng 0" })
      .refine((val) => val <= 1000, {
        message: "Số lượng tối là 1000",
      }),
    inf: z
      .string()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .refine((val) => val >= 0, { message: "Số phải lớn hơn hoặc bằng 0" })
      .refine((val) => val <= 1000, {
        message: "Số lượng tối là 1000",
      }),

    phone: z
      .string()
      .min(1, {
        message: "Vui lòng điền thông tin này",
      })
      .regex(/^\d{10,11}$/, {
        message: "Số điện thoại không đúng định dạng",
      }),

    gender: z
      .string()
      .min(1, {
        message: "Vui lòng điền thông tin này",
      })
      .refine((value) => ["male", "female", "other"].includes(value), {
        message: "Vui lòng điền thông tin này",
      }),

    email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
      message: "Email không đúng định dạng",
    }),

    full_name: z
      .string()
      .min(3, {
        message: "Vui lòng điền thông tin này",
      })
      .max(255, { message: "Họ và Tên không hợp lệ" }),

    invoice: checkBoxGenerateInvoice
      ? z.object({
          company_name: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" })
            .max(255, {
              message: "Tên công ty không hợp lệ",
            }),
          address: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" }),
          city: z.string().min(3, { message: "Vui lòng điền thông tin này" }),
          mst: z
            .string()
            .min(1, {
              message: "Vui lòng điền thông tin này",
            })
            .regex(/^\d{10,13}$/, {
              message: "Thông tin không hợp lệ",
            }),
          contact_name: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" }),
          phone: z
            .string()
            .min(1, {
              message: "Vui lòng điền thông tin này",
            })
            .regex(/^0\d{9}$/, {
              message: "Số điện thoại không đúng định dạng",
            }),
          email: z
            .string()
            .min(1, { message: "Vui lòng điền thông tin này" })
            .email({
              message: "Email không đúng định dạng",
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

export type CheckOutTourType = z.infer<ReturnType<typeof CheckOutTourBody>>;
