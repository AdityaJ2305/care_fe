import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { navigate } from "raviger";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/input-password";

import Loading from "@/components/Common/Loading";
import { ValidationHelper } from "@/components/Users/UserFormValidations";

import { LocalStorageKeys } from "@/common/constants";
import { validatePassword } from "@/common/validation";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";

export default function ResetPassword({ token }: { token: string }) {
  const { t } = useTranslation();

  const resetPasswordFormSchema = z
    .object({
      password: z.string().refine((val) => validatePassword(val), {
        message: t("new_password_validation"),
      }),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("password_mismatch"),
      path: ["confirm_password"],
    });

  const form = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { mutate: resetPassword, isPending: resettingPassword } = useMutation({
    mutationFn: mutate(routes.resetPassword),
    onSuccess: () => {
      localStorage.removeItem(LocalStorageKeys.accessToken);
      toast.success(t("password_reset_success"));
      navigate("/login");
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    resetPassword({
      password: values.password,
      confirm: values.confirm_password,
      token: token,
    });
  };

  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);

  const { isError, isLoading } = useQuery({
    queryKey: ["checkResetToken", { token: token }],
    queryFn: query(routes.checkResetToken, { body: { token: token } }),
    enabled: !!token,
  });

  if (isLoading) return <Loading />;

  if (isError) navigate("/invalid-reset");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto rounded-lg bg-white shadow-lg p-6"
        >
          <div className="py-4 text-center text-xl font-bold">
            {t("reset_password")}
          </div>

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("new_password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder={t("new_password")}
                      onFocus={() => setIsPasswordFieldFocused(true)}
                      onBlur={() => setIsPasswordFieldFocused(false)}
                    />
                  </FormControl>
                  <div
                    className={cn(
                      "text-small pl-2 text-secondary-500",
                      !isPasswordFieldFocused && "hidden",
                    )}
                    aria-live="polite"
                  >
                    <ValidationHelper
                      isInputEmpty={!field.value}
                      successMessage={t("password_success_message")}
                      validations={[
                        {
                          description: "password_length_validation",
                          fulfilled: (field.value || "").length >= 8,
                        },
                        {
                          description: "password_lowercase_validation",
                          fulfilled: /[a-z]/.test(field.value || ""),
                        },
                        {
                          description: "password_uppercase_validation",
                          fulfilled: /[A-Z]/.test(field.value || ""),
                        },
                        {
                          description: "password_number_validation",
                          fulfilled: /\d/.test(field.value || ""),
                        },
                      ]}
                    />
                  </div>

                  <div className={cn(isPasswordFieldFocused && "hidden")}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>{t("confirm_password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder={t("confirm_password")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap justify-between mt-4 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={resettingPassword}
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={resettingPassword}
              className="w-full sm:w-auto"
            >
              {t("reset")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
