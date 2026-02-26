import { z } from "zod";

export const checkoutFormSchema = z.object({
  "full-name": z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const FORM_PARAM_KEYS = [
  "full-name",
  "email",
] as const;

export function getFormDefaultsFromSearchParams(
  searchParams: URLSearchParams
): Partial<CheckoutFormData> {
  const defaults: Partial<CheckoutFormData> = {};
  for (const key of FORM_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) defaults[key as keyof CheckoutFormData] = value;
  }
  return defaults;
}

export function formDataToSearchParams(
  data: Partial<CheckoutFormData>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FORM_PARAM_KEYS) {
    const value = data[key as keyof CheckoutFormData];
    if (value && String(value).trim())
      params.set(key, String(value).trim());
  }
  return params;
}
