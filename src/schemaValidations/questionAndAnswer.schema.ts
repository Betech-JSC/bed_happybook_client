import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const QuestionAndAnswerSchema = (messages: ValidationMessages) =>
  z.object({
    full_name: z
      .string()
      .trim()
      .min(1, {
        message: messages.required,
      })
      .max(256, {
        message: messages.required,
      }),
    question_content: z
      .string()
      .trim()
      .min(1, {
        message: messages.required,
      })
      .max(2000, {
        message: messages.inValid,
      }),
    website: z
      .string()
      .trim()
      .min(1, {
        message: messages.required,
      })
      .max(256, {
        message: messages.required,
      }),
    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),
  });

export type QuestionAndAnswerType = z.infer<
  ReturnType<typeof QuestionAndAnswerSchema>
>;
