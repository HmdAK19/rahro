import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { getReportsContainer } from "@/features/reports/server/container";
import { ReportScreen } from "@/features/reports/ui/components/report-screen";

export const dynamic = "force-dynamic";

export default async function ReportsPage({ params }: PageProps<"/[locale]/reports">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const [dictionary, report] = await Promise.all([
    getDictionary(locale),
    getReportsContainer().generateOperationalReport.execute(),
  ]);

  return <ReportScreen locale={locale} dictionary={dictionary} report={report} />;
}
