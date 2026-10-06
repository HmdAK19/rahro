import type * as MapLibre from "maplibre-gl";

let modulePromise: Promise<typeof MapLibre> | undefined;

export function loadMapLibre(): Promise<typeof MapLibre> {
  modulePromise ??= import("maplibre-gl").then((module) => {
    module.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

    return module;
  });

  return modulePromise;
}
