import z from "zod";

export const AuthRegisterBody = z
  .object({
    email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
      message: "Email không đúng định dạng",
    }),
    password: z
      .string()
      .min(8, {
        message: "Mật khẩu quá ngắn!",
      })
      .max(100, {
        message: "Mật khẩu quá dài",
      }),
    password_confirmation: z
      .string()
      .min(8, {
        message: "Mật khẩu quá ngắn!",
      })
      .max(100, {
        message: "Mật khẩu quá dài",
      }),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không trùng khớp",
        path: ["password_confirmation"],
      });
    }
  });

export type AuthRegisterBodyType = z.infer<typeof AuthRegisterBody>;
