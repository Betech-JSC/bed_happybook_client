import z from "zod";

export const CustomerRatingBody = z.object({
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
  email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
    message: "Email không đúng định dạng",
  }),
  message: z
    .string()
    .trim()
    .min(3, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(2000, {
      message: "Nội dung đánh giá không hợp lệ!",
    }),
});

export type CustomerRatingType = z.infer<typeof CustomerRatingBody>;
