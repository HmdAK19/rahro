import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { DashboardScreen } from "@/features/dashboard/ui/components/dashboard-screen";
import { getFleetContainer } from "@/features/fleet/server/container";

export default async function DashboardPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const [dictionary, fleet] = await Promise.all([
    getDictionary(locale),
    getFleetContainer().getFleetSnapshot.execute(),
  ]);

  return (
    <DashboardScreen
      locale={locale}
      dictionary={dictionary}
      initialDrivers={fleet.drivers}
    />
  );
}
