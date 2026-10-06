"use client";

import DownloadRounded from "@mui/icons-material/DownloadRounded";
import {
  Box,
  Button,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { formatNumber } from "@/core/i18n/formatters";
import { SectionCard } from "@/core/ui/section-card";

import type { OperationalReport } from "../../domain/operational-report";

import { reportStyles } from "./styles";

export function ReportScreen({
  report,
  locale,
  dictionary,
}: {
  report: OperationalReport;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const exportCsv = () => {
    const header = [
      dictionary.reports.branch,
      dictionary.reports.total,
      dictionary.reports.delivered,
      dictionary.reports.delayed,
      dictionary.reports.revenue,
    ];
    const rows = report.byBranch.map((item) => [
      item.branch,
      item.total,
      item.delivered,
      item.delayed,
      item.revenue,
    ]);
    const csv =
      "\uFEFF" +
      [header, ...rows]
        .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
        .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `rahro-report-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    [dictionary.reports.total, report.summary.total],
    [dictionary.reports.active, report.summary.active],
    [dictionary.reports.delivered, report.summary.delivered],
    [
      dictionary.reports.revenue,
      `${formatNumber(report.summary.revenue, locale)} ${dictionary.common.toman}`,
    ],
  ] as const;

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography component="h1" variant="h1">
            {dictionary.reports.title}
          </Typography>
          <Typography color="text.secondary" mt={0.75}>
            {dictionary.reports.subtitle}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<DownloadRounded />} onClick={exportCsv}>
          {dictionary.reports.export}
        </Button>
      </Stack>
      <Box sx={reportStyles.summaryGrid}>
        {cards.map(([label, value]) => (
          <SectionCard key={label}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography fontSize={{ xs: 24, md: 30 }} fontWeight={900} mt={1}>
                {typeof value === "number" ? formatNumber(value, locale) : value}
              </Typography>
            </CardContent>
          </SectionCard>
        ))}
      </Box>
      <Box sx={reportStyles.detailsGrid}>
        <SectionCard>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="h2">{dictionary.reports.statusBreakdown}</Typography>
              <Chip
                color="success"
                label={`${formatNumber(report.summary.completionRate, locale)}% ${dictionary.reports.completion}`}
              />
            </Stack>
            <Stack gap={2}>
              {report.byStatus.map((item) => (
                <Box key={item.status}>
                  <Stack direction="row" justifyContent="space-between" mb={0.75}>
                    <Typography variant="body2" fontWeight={700}>
                      {dictionary.shipments.statuses[item.status]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(item.count, locale)} ({formatNumber(item.percentage, locale)}
                      %)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={reportStyles.progress}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </SectionCard>
        <SectionCard>
          <CardContent>
            <Typography variant="h2" mb={2}>
              {dictionary.reports.branchPerformance}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      dictionary.reports.branch,
                      dictionary.reports.total,
                      dictionary.reports.delivered,
                      dictionary.reports.delayed,
                      dictionary.reports.revenue,
                    ].map((label) => (
                      <TableCell key={label}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.byBranch.map((item) => (
                    <TableRow key={item.branch}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {item.branch}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatNumber(item.total, locale)}</TableCell>
                      <TableCell>{formatNumber(item.delivered, locale)}</TableCell>
                      <TableCell>{formatNumber(item.delayed, locale)}</TableCell>
                      <TableCell>{formatNumber(item.revenue, locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </SectionCard>
      </Box>
      <SectionCard>
        <CardContent>
          <Typography variant="h2" mb={2}>
            {dictionary.reports.driverPerformance}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    dictionary.reports.driver,
                    dictionary.reports.assigned,
                    dictionary.reports.delivered,
                    dictionary.reports.active,
                  ].map((label) => (
                    <TableCell key={label}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report.byDriver.map((item) => (
                  <TableRow key={item.driverId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {item.driverName}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatNumber(item.assigned, locale)}</TableCell>
                    <TableCell>{formatNumber(item.delivered, locale)}</TableCell>
                    <TableCell>{formatNumber(item.active, locale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </SectionCard>
      <Typography variant="caption" color="text.secondary" display="block" mt={2}>
        {dictionary.reports.generatedAt}:{" "}
        {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(report.generatedAt),
        )}
      </Typography>
    </>
  );
}
