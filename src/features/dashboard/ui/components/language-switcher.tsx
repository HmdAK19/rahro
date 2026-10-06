import Link from "next/link";
import LanguageRounded from "@mui/icons-material/LanguageRounded";
import { Button } from "@mui/material";

import { getAlternateLocale, type Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";

export function LanguageSwitcher({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <Button
      component={Link}
      href={`/${getAlternateLocale(locale)}`}
      color="inherit"
      startIcon={<LanguageRounded />}
    >
      {dictionary.common.language}
    </Button>
  );
}
