import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const CustomerRatingSchema = (messages: ValidationMessages) =>
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
    phone: z
      .string()
      .min(1, {
        message: messages.required,
      })
      .regex(/^\d{10,11}$/, {
        message: messages.inValid,
      }),
    email: z.string().min(1, { message: messages.required }).email({
      message: messages.email,
    }),
    message: z
      .string()
      .trim()
      .min(1, {
        message: messages.required,
      })
      .max(2000, {
        message: "Nội dung đánh giá không hợp lệ!",
      }),
  });

export type CustomerRatingType = z.infer<
  ReturnType<typeof CustomerRatingSchema>
>;
