import z from "zod";

export const AuthLoginBody = z.object({
  email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
    message: "Email không đúng định dạng",
  }),
  password: z
    .string()
    .min(6, {
      message: "Mật khẩu không hợp lệ!",
    })
    .max(100, {
      message: "Mật khẩu không hợp lệ",
    }),
});

export type AuthLoginBodyType = z.infer<typeof AuthLoginBody>;
