import { notFound } from "next/navigation";
import { Box } from "@mui/material";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { getPageSession } from "@/features/auth/server/authorization";
import { Sidebar } from "@/features/dashboard/ui/components/sidebar";
import { dashboardStyles } from "@/features/dashboard/ui/components/styles";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();
  await getPageSession(locale);
  const dictionary = await getDictionary(locale);

  return (
    <Box sx={dashboardStyles.layout}>
      <Sidebar dictionary={dictionary} />
      <Box component="main" sx={dashboardStyles.content}>
        {children}
      </Box>
    </Box>
  );
}
