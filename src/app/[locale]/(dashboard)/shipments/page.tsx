import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { getFleetContainer } from "@/features/fleet/server/container";
import { getShipmentContainer } from "@/features/shipments/server/container";
import { ShipmentManagementScreen } from "@/features/shipments/ui/components/shipment-management-screen";

export const dynamic = "force-dynamic";

export default async function ShipmentsPage({ params }: PageProps<"/[locale]/shipments">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const [dictionary, fleet, shipments] = await Promise.all([
    getDictionary(locale),
    getFleetContainer().getFleetSnapshot.execute(),
    getShipmentContainer().repository.findAll(),
  ]);

  return (
    <ShipmentManagementScreen
      locale={locale}
      dictionary={dictionary}
      initialDrivers={fleet.drivers}
      initialShipments={shipments}
    />
  );
}
