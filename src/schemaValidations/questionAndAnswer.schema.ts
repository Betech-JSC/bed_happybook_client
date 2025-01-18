import z from "zod";

export const QuestionAndAnswerBody = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(256, {
      message: "Vui lòng điền thông tin này!",
    }),
  question: z
    .string()
    .trim()
    .min(3, {
      message: "Vui lòng điền ý kiến của bạn!",
    })
    .max(1000, {
      message: "Thông tin không hợp lệ!",
    }),
  website: z
    .string()
    .trim()
    .min(5, {
      message: "Vui lòng điền thông tin này!",
    })
    .max(256, {
      message: "Vui lòng điền thông tin này!",
    }),
  email: z.string().min(1, { message: "Vui lòng điền thông tin này" }).email({
    message: "Email không đúng định dạng",
  }),
  note: z.string(),
});

export type QuestionAndAnswerType = z.infer<typeof QuestionAndAnswerBody>;
