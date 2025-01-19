import z from "zod";

export const CheckOutVisaBody = (checkBoxGenerateInvoice: boolean) => {
  return z.object({
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

    note: z.string(),

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

export type CheckOutVisaType = z.infer<ReturnType<typeof CheckOutVisaBody>>;
