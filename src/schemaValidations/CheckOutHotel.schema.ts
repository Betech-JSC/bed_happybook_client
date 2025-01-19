import z from "zod";

export const CheckOutHotelBody = (checkBoxGenerateInvoice: boolean) => {
  return z
    .object({
      check_in_date: z.date({
        required_error: "Vui lòng điền thông tin này",
        invalid_type_error: "Ngày nhận phòng không đúng định dạng",
      }),

      check_out_date: z.date({
        required_error: "Vui lòng điền thông tin này",
        invalid_type_error: "Ngày trả phòng không đúng định dạng",
      }),

      atd: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 1, { message: "Số phải lớn hơn hoặc bằng 1" })
        .refine((val) => val <= 30, {
          message: "Số lượng tối là 30",
        }),

      chd: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 0, { message: "Số phải lớn hơn hoặc bằng 0" })
        .refine((val) => val <= 30, {
          message: "Số lượng tối là 30",
        }),
      inf: z
        .string()
        .transform((val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        })
        .refine((val) => val >= 0, { message: "Số phải lớn hơn hoặc bằng 0" })
        .refine((val) => val <= 30, {
          message: "Số lượng tối là 30",
        }),
      phone: z
        .string()
        .min(1, {
          message: "Vui lòng điền thông tin này",
        })
        .regex(/^\d{10,11}$/, {
          message: "Số điện thoại không đúng định dạng",
        }),

      email: z
        .string()
        .min(1, { message: "Vui lòng điền thông tin này" })
        .email({
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
    })
    .refine((data) => data.check_in_date < data.check_out_date, {
      path: ["check_out_date"],
      message: "Ngày trả phòng không được nhỏ hơn ngày nhận phòng",
    });
};

export type CheckOutHotelType = z.infer<ReturnType<typeof CheckOutHotelBody>>;
