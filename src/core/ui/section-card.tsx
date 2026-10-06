import { Card, type CardProps } from "@mui/material";

export function SectionCard(props: CardProps) {
  return (
    <Card
      {...props}
      sx={[
        { borderRadius: 3, overflow: "hidden" },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}
