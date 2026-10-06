import * as yup from "yup";

import {
  type DriverChanges,
  type DriverDraft,
  type DriverStatus,
  InvalidDriverError,
} from "./driver";

const requiredText = yup.string().trim().required("REQUIRED");
const coordinate = (min: number, max: number) =>
  yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? Number.NaN : value))
    .typeError("INVALID_NUMBER")
    .min(min, "OUT_OF_RANGE")
    .max(max, "OUT_OF_RANGE")
    .required("REQUIRED");

export const driverDraftSchema: yup.ObjectSchema<DriverDraft> = yup
  .object({
    name: requiredText,
    phone: requiredText,
    vehicle: requiredText,
    plate: requiredText,
    status: yup
      .mixed<DriverStatus>()
      .oneOf(["online", "delivering", "offline"], "INVALID_STATUS")
      .required("REQUIRED"),
    lat: coordinate(-90, 90),
    lng: coordinate(-180, 180),
  })
  .noUnknown();

export const driverChangesSchema: yup.ObjectSchema<DriverChanges> = yup
  .object({
    name: requiredText.optional(),
    phone: requiredText.optional(),
    vehicle: requiredText.optional(),
    plate: requiredText.optional(),
    status: yup
      .mixed<DriverStatus>()
      .oneOf(["online", "delivering", "offline"], "INVALID_STATUS")
      .optional(),
    lat: coordinate(-90, 90).optional(),
    lng: coordinate(-180, 180).optional(),
  })
  .test("has-changes", "EMPTY_CHANGES", (value) => Object.keys(value).length > 0)
  .noUnknown();

const validate = <T>(schema: yup.Schema<T>, value: unknown): T => {
  try {
    return schema.validateSync(value, { abortEarly: false, strict: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) throw new InvalidDriverError();

    throw error;
  }
};

export const parseDriverDraft = (value: unknown) => validate(driverDraftSchema, value);

export const parseDriverChanges = (value: unknown) => validate(driverChangesSchema, value);
