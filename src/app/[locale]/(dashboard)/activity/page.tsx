import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { ActivityScreen } from "@/features/dashboard/ui/components/activity-screen";

export default async function ActivityPage({ params }: PageProps<"/[locale]/activity">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <ActivityScreen dictionary={await getDictionary(locale)} />;
}
