"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";

import type { Dictionary } from "@/core/i18n/dictionaries";
import { loadMapLibre } from "@/core/map/load-maplibre";
import { SectionCard } from "@/core/ui/section-card";

import type { Driver } from "../../domain/driver";

import { createLegendDotStyle, fleetStyles } from "./styles";

import styles from "./fleet-map.module.css";

const colors = { online: "#177A4B", delivering: "#E99428", offline: "#829087" } as const;
const defaultStyle = "https://tiles.openfreemap.org/styles/liberty";

export function FleetMap({
  drivers,
  selectedId,
  onSelect,
  dictionary,
}: {
  drivers: readonly Driver[];
  selectedId: string | null;
  onSelect(id: string): void;
  dictionary: Dictionary;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const markerRegistry = markers.current;
    let disposed = false;
    void loadMapLibre()
      .then((maplibre) => {
        if (disposed || !container.current || map.current) return;

        const instance = new maplibre.Map({
          container: container.current,
          style: process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? defaultStyle,
          center: [51.37, 35.72],
          zoom: 11.2,
        });
        instance.addControl(new maplibre.NavigationControl({ showCompass: true }), "top-left");
        instance.once("load", () => {
          setReady(true);
          setFailed(false);
        });
        instance.on("error", () => {
          if (!instance.loaded()) setFailed(true);
        });
        map.current = instance;
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      markerRegistry.forEach((marker) => marker.remove());
      markerRegistry.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    const instance = map.current;

    if (!instance) return;
    void loadMapLibre().then(({ Marker }) => {
      const currentIds = new Set(drivers.map((driver) => driver.id));
      markers.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          marker.remove();
          markers.current.delete(id);
        }
      });
      drivers.forEach((driver) => {
        let marker = markers.current.get(driver.id);

        if (!marker) {
          const element = document.createElement("button");
          element.type = "button";
          element.className = styles.marker;
          element.setAttribute("aria-label", `${dictionary.fleet.driver} ${driver.name}`);
          element.textContent = driver.name[0];
          element.addEventListener("click", () => onSelect(driver.id));
          marker = new Marker({ element, anchor: "bottom" })
            .setLngLat([driver.lng, driver.lat])
            .addTo(instance);
          markers.current.set(driver.id, marker);
        }
        marker.setLngLat([driver.lng, driver.lat]);
        const element = marker.getElement();
        element.style.setProperty("--marker-color", colors[driver.status]);
        element.classList.toggle(styles.selected, selectedId === driver.id);
      });
    });
  }, [dictionary.fleet.driver, drivers, onSelect, ready, selectedId]);
  const fitFleet = () => {
    if (!map.current || drivers.length === 0) return;

    const lngs = drivers.map((driver) => driver.lng),
      lats = drivers.map((driver) => driver.lat);
    map.current.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 70, maxZoom: 13, duration: 500 },
    );
  };

  return (
    <SectionCard component="section" aria-label={dictionary.fleet.title}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Typography variant="h2">{dictionary.fleet.title}</Typography>
          <Chip size="small" color="success" label={dictionary.fleet.live} />
        </Stack>
        <Button color="inherit" size="small" onClick={fitFleet}>
          {dictionary.fleet.allDrivers}
        </Button>
      </Stack>
      <Box className={styles.container}>
        {failed && (
          <Alert severity="warning" sx={fleetStyles.mapAlert}>
            {dictionary.fleet.mapError}
          </Alert>
        )}
        <Box ref={container} className={styles.canvas} />
        <Stack direction="row" gap={2} className={styles.legend}>
          {(["active", "delivering", "offline"] as const).map((key, index) => (
            <Stack direction="row" alignItems="center" gap={0.6} key={key}>
              <Box
                sx={createLegendDotStyle([colors.online, colors.delivering, colors.offline][index])}
              />
              <Typography variant="caption" fontWeight={700}>
                {dictionary.fleet[key]}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </SectionCard>
  );
}
