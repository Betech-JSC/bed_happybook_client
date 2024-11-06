import z from "zod";

export const FlightBookingInforBody = (checkBoxGenerateInvoice: boolean) => {
  return z.object({
    atd: z.array(
      z.object({
        firstName: z
          .string()
          .min(1, { message: "Vui lòng điền thông tin này" })
          .regex(/^[a-zA-Z\s]+$/, {
            message: "Vui lòng nhập Họ không dấu và không có các chữ số",
          })
          .max(30, {
            message: "Họ không hợp lệ!",
          }),
        lastName: z
          .string()
          .min(1, { message: "Vui lòng điền thông tin này" })
          .regex(/^[a-zA-Z\s]+$/, {
            message:
              "Vui lòng nhập Tên đệm & Tên không dấu và không có các chữ số",
          })
          .max(100, {
            message: "Tên & tên đệm không hợp lệ!",
          }),
        gender: z
          .string()
          .min(1, {
            message: "Vui lòng điền thông tin này",
          })
          .refine((value) => ["male", "female"].includes(value), {
            message: "Vui lòng điền thông tin này",
          }),
        baggage: z.string(),
      })
    ),
    chd: z
      .array(
        z.object({
          firstName: z
            .string()
            .min(1, { message: "Vui lòng điền thông tin này" })
            .regex(/^[a-zA-Z\s]+$/, {
              message: "Vui lòng nhập Họ không dấu và không có các chữ số",
            })
            .max(30, {
              message: "Họ không hợp lệ!",
            }),
          lastName: z
            .string()
            .min(1, { message: "Vui lòng điền thông tin này" })
            .regex(/^[a-zA-Z\s]+$/, {
              message:
                "Vui lòng nhập Tên đệm & Tên không dấu và không có các chữ số",
            })
            .max(100, {
              message: "Tên & tên đệm không hợp lệ!",
            }),
          gender: z
            .string()
            .min(1, {
              message: "Vui lòng điền thông tin này",
            })
            .refine((value) => ["male", "female"].includes(value), {
              message: "Vui lòng điền thông tin này",
            }),
          baggage: z.string(),
        })
      )
      .optional(),
    inf: z
      .array(
        z.object({
          firstName: z
            .string()
            .min(1, { message: "Vui lòng điền thông tin này" })
            .regex(/^[a-zA-Z\s]+$/, {
              message: "Vui lòng nhập Họ không dấu và không có các chữ số",
            })
            .max(30, {
              message: "Họ không hợp lệ!",
            }),
          lastName: z
            .string()
            .min(1, { message: "Vui lòng điền thông tin này" })
            .regex(/^[a-zA-Z\s]+$/, {
              message:
                "Vui lòng nhập Tên đệm & Tên không dấu và không có các chữ số",
            })
            .max(100, {
              message: "Tên & tên đệm không hợp lệ!",
            }),
          gender: z
            .string()
            .min(1, {
              message: "Vui lòng điền thông tin này",
            })
            .refine((value) => ["male", "female"].includes(value), {
              message: "Vui lòng điền thông tin này",
            }),
          baggage: z.string(),
        })
      )
      .optional(),
    Contact: z.object({
      Gender: z
        .string()
        .min(1, {
          message: "Vui lòng điền thông tin này",
        })
        .refine((value) => ["male", "female"].includes(value), {
          message: "Vui lòng điền thông tin này",
        }),
      FirstName: z
        .string()
        .min(3, { message: "Vui lòng điền thông tin này" })
        .max(30, {
          message: "Họ không hợp lệ!",
        }),
      LastName: z
        .string()
        .min(1, { message: "Vui lòng điền thông tin này" })
        .max(100, {
          message: "Tên không hợp lệ!",
        }),
      Phone: z
        .string()
        .min(1, {
          message: "Vui lòng điền thông tin này",
        })
        .regex(/^\d{10,11}$/, {
          message: "Số điện thoại không đúng định dạng",
        }),
      Email: z
        .string()
        .min(1, { message: "Vui lòng điền thông tin này" })
        .email({
          message: "Email không đúng định dạng",
        }),
      Address: z.string().optional(),
    }),
    Note: z.string(),
    PaymentMethod: z
      .string()
      .min(1, { message: "Vui lòng chọn phương thức thanh toán" })
      .refine((value) => ["cash", "vnpay", "bank_transfer"].includes(value), {
        message: "Vui lòng điền thông tin này",
      }),
    GenerateInvoice: checkBoxGenerateInvoice
      ? z.object({
          company_name: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" })
            .max(256, {
              message: "Tên công ty không hợp lệ",
            }),
          company_address: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" }),
          city: z.string().min(3, { message: "Vui lòng điền thông tin này" }),
          tax_code: z
            .string()
            .min(1, {
              message: "Vui lòng điền thông tin này",
            })
            .regex(/^\d{10,15}$/, {
              message: "Thông tin không hợp lệ",
            }),
          recipient_name: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" }),
          phone: z
            .string()
            .min(2, {
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
        })
      : z
          .object({
            company_name: z.string().optional(),
            company_address: z.string().optional(),
            city: z.string().optional(),
            tax_code: z.string().optional(),
            recipient_name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),

    checkBoxGenerateInvoice: z.boolean(),
  });
};

export type FlightBookingInforType = z.infer<
  ReturnType<typeof FlightBookingInforBody>
>;
