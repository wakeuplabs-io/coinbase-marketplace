"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const formDefaults = getFormDefaultsFromSearchParams(searchParams);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      "full-name": formDefaults["full-name"] ?? "",
      email: formDefaults.email ?? "",
    },
  });

  const { watch } = form;

  const updateQueryParams = useCallback((data: Partial<CheckoutFormData>) => {
    const params = formDataToSearchParams(data);
    const query = params.toString();
    const newPath = query ? `/checkout?${query}` : "/checkout";
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "";
    if (newPath !== currentPath) {
      window.history.replaceState(null, "", newPath);
    }
  }, []);

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
