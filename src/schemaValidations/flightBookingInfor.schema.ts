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
        birthday: z.date({
          required_error: "Vui lòng điền thông tin này",
          invalid_type_error: "Ngày sinh không đúng định dạng",
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
          birthday: z.date({
            required_error: "Vui lòng điền thông tin này",
            invalid_type_error: "Ngày sinh không đúng định dạng",
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
          birthday: z.date({
            required_error: "Vui lòng điền thông tin này",
            invalid_type_error: "Ngày sinh không đúng định dạng",
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
          { message: "Vui lòng điền thông tin này" }
        ),
      first_name: z
        .string()
        .min(3, { message: "Vui lòng điền thông tin này" })
        .max(30, {
          message: "Họ không hợp lệ!",
        }),
      last_name: z
        .string()
        .min(1, { message: "Vui lòng điền thông tin này" })
        .max(100, {
          message: "Tên không hợp lệ!",
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
      address: z.string().optional(),
    }),
    Note: z.string(),
    PaymentMethod: z
      .string()
      .min(1, { message: "Vui lòng chọn phương thức thanh toán" })
      .refine((value) => ["cash", "vnpay", "bank_transfer"].includes(value), {
        message: "Vui lòng điền thông tin này",
      }),
    invoice: checkBoxGenerateInvoice
      ? z.object({
          company_name: z
            .string()
            .min(3, { message: "Vui lòng điền thông tin này" })
            .max(256, {
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

export type FlightBookingInforType = z.infer<
  ReturnType<typeof FlightBookingInforBody>
>;
