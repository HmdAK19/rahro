"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Box, Chip } from "@mui/material";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";

import type { Dictionary } from "@/core/i18n/dictionaries";
import { loadMapLibre } from "@/core/map/load-maplibre";

import type { PublicDriverLocation } from "../../domain/tracking-snapshot";

import { trackingStyles } from "./styles";

import styles from "./tracking-map.module.css";

const defaultStyle = "https://tiles.openfreemap.org/styles/liberty";

export function TrackingMap({
  driver,
  dictionary,
}: {
  driver: PublicDriverLocation;
  dictionary: Dictionary;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const initialDriver = useRef(driver);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    void loadMapLibre()
      .then((maplibre) => {
        if (disposed || !container.current) return;

        const firstLocation = initialDriver.current;
        const instance = new maplibre.Map({
          container: container.current,
          style: process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? defaultStyle,
          center: [firstLocation.lng, firstLocation.lat],
          zoom: 14,
        });
        instance.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-left");
        instance.once("load", () => setFailed(false));
        instance.on("error", () => {
          if (!instance.loaded()) setFailed(true);
        });
        const element = document.createElement("div");
        element.className = styles.marker;
        element.innerHTML = `<span>${firstLocation.name.slice(0, 1)}</span>`;
        marker.current = new maplibre.Marker({ element, anchor: "bottom" })
          .setLngLat([firstLocation.lng, firstLocation.lat])
          .addTo(instance);
        map.current = instance;
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      marker.current?.remove();
      marker.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    marker.current?.setLngLat([driver.lng, driver.lat]);
    map.current?.easeTo({ center: [driver.lng, driver.lat], duration: 600 });
  }, [driver.lat, driver.lng]);

  return (
    <Box className={styles.map} aria-label={dictionary.tracking.liveMap}>
      {failed && (
        <Alert severity="warning" sx={trackingStyles.mapAlert}>
          {dictionary.fleet.mapError}
        </Alert>
      )}
      <Chip
        label={dictionary.tracking.liveMap}
        color="success"
        size="small"
        sx={trackingStyles.mapBadge}
      />
      <Box ref={container} className={styles.canvas} />
    </Box>
  );
}
