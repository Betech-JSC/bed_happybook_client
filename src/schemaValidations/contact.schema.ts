import z from "zod";

export const ContactBody = z.object({
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
  service_name: z.string().trim().min(4, {
    message: "Vui lòng điền thông tin này!",
  }),
  email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
    message: "Email không đúng định dạng",
  }),
});

export type ContactBodyType = z.infer<typeof ContactBody>;
