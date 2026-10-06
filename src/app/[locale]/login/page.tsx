import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box } from "@mui/material";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { sessionCookieName, verifySessionToken } from "@/features/auth/server/session";
import { LoginForm } from "@/features/auth/ui/login-form";
import { authStyles } from "@/features/auth/ui/styles";

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;

  if (!isLocale(locale)) redirect("/fa/login");
  if (await verifySessionToken((await cookies()).get(sessionCookieName)?.value))
    redirect(`/${locale}`);

  return (
    <Box component="main" sx={authStyles.page}>
      <LoginForm locale={locale} dictionary={await getDictionary(locale)} />
    </Box>
  );
}
