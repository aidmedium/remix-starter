import { z } from "zod";

const fieldSchema = z.string().min(2, { message: "This field is required" });
const optionalFieldSchema = fieldSchema.optional();
const formSchema = z
  .object({
    email: fieldSchema.email(),
    "shipping.first_name": fieldSchema,
    "shipping.last_name": fieldSchema,
    "shipping.address": fieldSchema,
    "shipping.city": fieldSchema,
    "shipping.postal_code": fieldSchema,
    "shipping.province": fieldSchema,
    "shipping.phone": fieldSchema,
    "billing.first_name": optionalFieldSchema,
    "billing.last_name": optionalFieldSchema,
    "billing.address": optionalFieldSchema,
    "billing.city": optionalFieldSchema,
    "billing.postal_code": optionalFieldSchema,
    "billing.province": optionalFieldSchema,
    "billing.phone": optionalFieldSchema,
    same_as_billing: z.union([z.literal("on"), z.literal("off")]),
  })
  .superRefine((data, ctx) => {
    // Only validate billing fields if same_as_billing is "off"
    if (data.same_as_billing === "off") {
      const billingFields = [
        "billing.first_name",
        "billing.last_name",
        "billing.address",
        "billing.city",
        "billing.postal_code",
        "billing.province",
        "billing.phone",
      ];

      billingFields.forEach((field) => {
        if (!data[field as keyof typeof data]) {
          ctx.addIssue({
            path: [field],
            message: `${field.split(".").pop()} is required when 'same_as_billing' is off`,
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;

export function validateCheckoutForm(formData: FormData) {
  const parsedData = formSchema.safeParse(Object.fromEntries(formData));

  const errors = Object.keys(Object.fromEntries(formData)).reduce(
    (acc, key) => {
      const fieldKey = key as keyof FormSchema;
      const fieldErrors = parsedData.error?.formErrors.fieldErrors;
      const error = fieldErrors?.[fieldKey];
      acc[fieldKey] = error ? error[0] : undefined;
      return acc;
    },
    {} as Record<keyof FormSchema, string | undefined>
  );

  return { data: parsedData.data, errors };
}
