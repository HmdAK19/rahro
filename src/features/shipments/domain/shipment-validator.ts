import * as yup from "yup";

import {
  InvalidShipmentError,
  type ShipmentChanges,
  type ShipmentDraft,
  type ShipmentStatus,
} from "./shipment";

const requiredText = yup.string().trim().required("REQUIRED");
const optionalDriver = yup
  .string()
  .transform((value) => (value === "" ? null : value))
  .trim()
  .nullable()
  .defined();
const price = yup
  .number()
  .transform((value, originalValue) => (originalValue === "" ? Number.NaN : value))
  .typeError("INVALID_NUMBER")
  .min(0, "OUT_OF_RANGE")
  .required("REQUIRED");

export const shipmentDraftSchema: yup.ObjectSchema<ShipmentDraft> = yup
  .object({
    trackingCode: requiredText,
    customer: requiredText,
    address: requiredText,
    branch: requiredText,
    driverId: optionalDriver,
    status: yup
      .mixed<ShipmentStatus>()
      .oneOf(["ready", "assigned", "in_transit", "delayed", "delivered"], "INVALID_STATUS")
      .required("REQUIRED"),
    eta: requiredText,
    price,
  })
  .noUnknown();

export const shipmentChangesSchema: yup.ObjectSchema<ShipmentChanges> = yup
  .object({
    customer: requiredText.optional(),
    address: requiredText.optional(),
    branch: requiredText.optional(),
    driverId: optionalDriver.optional(),
    status: yup
      .mixed<ShipmentStatus>()
      .oneOf(["ready", "assigned", "in_transit", "delayed", "delivered"], "INVALID_STATUS")
      .optional(),
    eta: requiredText.optional(),
    price: price.optional(),
  })
  .test("has-changes", "EMPTY_CHANGES", (value) => Object.keys(value).length > 0)
  .noUnknown();

const validate = <T>(schema: yup.Schema<T>, value: unknown): T => {
  try {
    return schema.validateSync(value, { abortEarly: false, strict: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) throw new InvalidShipmentError();

    throw error;
  }
};

export const parseShipmentDraft = (value: unknown) => validate(shipmentDraftSchema, value);

export const parseShipmentChanges = (value: unknown) => validate(shipmentChangesSchema, value);
