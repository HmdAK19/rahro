import { notFound } from "next/navigation";

import { isLocale } from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionaries";
import { getTrackingContainer } from "@/features/tracking/server/container";
import { TrackingScreen } from "@/features/tracking/ui/components/tracking-screen";

export const dynamic = "force-dynamic";

export default async function TrackingPage({ params }: PageProps<"/[locale]/track/[code]">) {
  const { locale, code } = await params;

  if (!isLocale(locale)) notFound();

  const snapshot = await getTrackingContainer().getTrackingSnapshot.execute(code);

  if (!snapshot) notFound();

  return (
    <TrackingScreen
      locale={locale}
      dictionary={await getDictionary(locale)}
      initialSnapshot={snapshot}
    />
  );
}
