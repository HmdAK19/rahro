"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { type LoginInput, loginSchema } from "@/features/auth/domain/login-schema";

import { authStyles } from "./styles";

export function LoginForm({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (input: LoginInput) => {
    setError(undefined);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(
          body.error === "INVALID_CREDENTIALS" ? dictionary.auth.invalid : dictionary.auth.error,
        );

        return;
      }
      router.replace(`/${locale}`);
      router.refresh();
    } catch {
      setError(dictionary.auth.error);
    }
  };

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit(submit)} sx={authStyles.form}>
      <Stack gap={2.5} alignItems="stretch">
        <Stack alignItems="center" gap={1}>
          <LockOutlined color="primary" sx={authStyles.icon} />
          <Typography variant="h1" textAlign="center">
            {dictionary.auth.title}
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            {dictionary.auth.subtitle}
          </Typography>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              required
              type="email"
              autoComplete="email"
              label={dictionary.auth.email}
              error={fieldState.invalid}
              helperText={fieldState.invalid ? dictionary.auth.invalid : undefined}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              required
              type="password"
              autoComplete="current-password"
              label={dictionary.auth.password}
              error={fieldState.invalid}
              helperText={fieldState.invalid ? dictionary.auth.invalid : undefined}
            />
          )}
        />
        <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
          {dictionary.auth.submit}
        </Button>
        {process.env.NODE_ENV !== "production" && (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            {dictionary.auth.demo}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
