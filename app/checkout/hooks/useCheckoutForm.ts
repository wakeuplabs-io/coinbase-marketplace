"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  checkoutFormSchema,
  type CheckoutFormData,
  getFormDefaultsFromSearchParams,
  formDataToSearchParams,
} from "@/app/checkout/lib/checkout-form";

export function useCheckoutForm(): Pick<
  UseFormReturn<CheckoutFormData>,
  "register" | "handleSubmit" | "watch" | "formState"
> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formDefaults = getFormDefaultsFromSearchParams(searchParams);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      "full-name": formDefaults["full-name"] ?? "",
      email: formDefaults.email ?? "",
      country: formDefaults.country ?? "",
      address: formDefaults.address ?? "",
      apartment: formDefaults.apartment ?? "",
      city: formDefaults.city ?? "",
      state: formDefaults.state ?? "",
      zip: formDefaults.zip ?? "",
    },
  });

  const { watch } = form;

  const updateQueryParams = useCallback(
    (data: Partial<CheckoutFormData>) => {
      const params = formDataToSearchParams(data);
      const query = params.toString();
      const url = query ? `/checkout?${query}` : "/checkout";
      router.replace(url, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const subscription = watch((data) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateQueryParams(data as Partial<CheckoutFormData>);
      }, 400);
    });
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [watch, updateQueryParams]);

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    formState: form.formState,
  };
}
