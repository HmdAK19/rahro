"use client";

import { useLinkStatus } from "next/link";
import { Box, CircularProgress, LinearProgress } from "@mui/material";

export function NavigationPendingIndicator({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      <Box
        aria-hidden="true"
        sx={{
          width: 20,
          height: 20,
          display: "grid",
          placeItems: "center",
          ms: "auto",
          opacity: pending ? 1 : 0,
          transition: "opacity 120ms ease",
          transitionDelay: pending ? "100ms" : "0ms",
        }}
      >
        <CircularProgress size={16} thickness={5} color="inherit" />
      </Box>
      {pending && (
        <>
          <LinearProgress
            aria-hidden="true"
            color="secondary"
            sx={{
              position: "fixed",
              insetInline: 0,
              top: 0,
              height: 3,
              zIndex: (theme) => theme.zIndex.tooltip + 1,
              opacity: 0,
              animation: "navigationProgressReveal 150ms ease 100ms forwards",
              "@keyframes navigationProgressReveal": { to: { opacity: 1 } },
            }}
          />
          <Box
            component="span"
            role="status"
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              p: 0,
              m: -1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {label}
          </Box>
        </>
      )}
    </>
  );
}
