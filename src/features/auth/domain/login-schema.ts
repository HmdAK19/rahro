import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().trim().email("INVALID_EMAIL").required("REQUIRED"),
    password: yup.string().min(8, "PASSWORD_TOO_SHORT").required("REQUIRED"),
  })
  .noUnknown();

export type LoginInput = yup.InferType<typeof loginSchema>;
