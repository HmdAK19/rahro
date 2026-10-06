import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { getFleetContainer } from "@/features/fleet/server/container";
import { DriverManagementScreen } from "@/features/fleet/ui/components/driver-management-screen";

export const dynamic = "force-dynamic";

export default async function DriversPage({ params }: PageProps<"/[locale]/drivers">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const [dictionary, fleet] = await Promise.all([
    getDictionary(locale),
    getFleetContainer().getFleetSnapshot.execute(),
  ]);

  return (
    <DriverManagementScreen
      locale={locale}
      dictionary={dictionary}
      initialDrivers={fleet.drivers}
    />
  );
}
