import { ValidationMessages } from "@/lib/messages";
import * as z from "zod";

export const getAuthLoginSchema = (messages: ValidationMessages) => {
  return z.object({
    email: z
      .string()
      .min(1, (messages.minLength as (length: number) => string)(1))
      .email(messages.email as string),

    password: z
      .string()
      .min(6, (messages.minLength as (length: number) => string)(6)),
  });
};

export type AuthLoginSchema = z.infer<ReturnType<typeof getAuthLoginSchema>>;
