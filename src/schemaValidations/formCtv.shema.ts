import z from "zod";

export const FormCtvBody = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(256, {
      message: "Vui lòng điền thông tin này!",
    }),
  phone: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .regex(/^\d{10,11}$/, {
      message: "Số điện thoại không đúng định dạng",
    }),
  citizen_id: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .regex(/^\d{12}$/, {
      message: "Số chứng minh thư không hợp lệ",
    }),
  citizen_id_date: z.date({
    required_error: "Vui lòng điền thông tin này",
    invalid_type_error: "Ngày cấp không đúng định dạng",
  }),

  citizen_id_place: z.string().min(1, {
    message: "Vui lòng điền thông tin này",
  }),
  address: z.string().trim().min(5, {
    message: "Vui lòng điền thông tin này!",
  }),
  email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
    message: "Email không đúng định dạng",
  }),
});

export type FormCtvBodyType = z.infer<typeof FormCtvBody>;
