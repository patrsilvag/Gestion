/**
 * Demo hooks to unblock TypeScript compilation.
 * Replace with real data fetching logic when backend is ready.
 */
import { useMemo } from "react";

export function useFetchUsers() {
  const users = useMemo(() => [
    { id: 1, name: "Admin", role: "admin" },
    { id: 2, name: "Operador", role: "operator" },
  ], []);
  return { users, isLoading: false, error: null };
}

export function useFetchScoringWeights() {
  const scoringWeights = useMemo(() => [
    { event: "ZC", weight: -30 },
    { event: "Reprogramación", weight: -15 },
    { event: "Diferencia", weight: -10 },
  ], []);
  return { scoringWeights, isLoading: false, error: null };
}

export function useFetchDashboardData() {
  const kpis = useMemo(() => ({
    alfa: 92,
    otif: 88,
    ncRate: 4.5,
    agingDays: 12,
  }), []);
  const alerts = useMemo(() => ({
    critical: [
      { id: "A-1", message: "Atraso crítico OC 12345, proveedor X", slaDays: 5 },
      { id: "A-2", message: "NC abierta sin evidencia adjunta", slaDays: 2 },
    ]
  }), []);
  return { kpis, alerts, isLoading: false, error: null };
}

export function useFetchScoringRanking() {
  const data = useMemo(() => ([
    { id: "prov-1", supplier: "Proveedor A", score: 87, alfaCompliance: 95 },
    { id: "prov-2", supplier: "Proveedor B", score: 73, alfaCompliance: 88 },
  ]), []);
  return { data, isLoading: false, error: null };
}
