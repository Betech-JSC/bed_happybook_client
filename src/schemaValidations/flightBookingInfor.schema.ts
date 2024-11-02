import z from "zod";

export const FlightBookingInforBody = z.object({
  atd_name: z
    .string()
    .min(3, { message: "Vui lòng điền thông tin này" })
    .max(256, {
      message: "Họ & tên không hợp lệ!",
    }),
  atd_gender: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((value) => ["male", "female"].includes(value), {
      message: "Vui lòng điền thông tin này",
    }),
  gender_person_contact: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .refine((value) => ["male", "female"].includes(value), {
      message: "Vui lòng điền thông tin này",
    }),
  fullname_person_contact: z
    .string()
    .min(3, { message: "Vui lòng điền thông tin này" })
    .max(256, {
      message: "Họ & tên không hợp lệ!",
    }),
  phone_person_contact: z
    .string()
    .min(1, {
      message: "Vui lòng điền thông tin này",
    })
    .regex(/^\d{10,11}$/, {
      message: "Số điện thoại không đúng định dạng",
    }),
  email_person_contact: z
    .string()
    .min(1, { message: "Vui lòng điền thông tin này" })
    .email({
      message: "Email không đúng định dạng",
    }),
  note: z.string(),
});

export type FlightBookingInforType = z.infer<typeof FlightBookingInforBody>;
