export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// Analytics data (dashboard, monitoring, sentiment, keywords, ai, reports,
// settings panels) still comes from lib/data/dummy-data.ts because
// PawonWarga-BE only exposes /auth/* so far. Set NEXT_PUBLIC_USE_MOCK_API to
// "false" once the endpoints in docs/api-contract.md exist — every service in
// lib/api/ then hits the real backend and no page or hook needs to change.
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

// Simulated round-trip in mock mode so loading and error states are actually
// exercised during development instead of only showing up in production.
export const MOCK_LATENCY_MS = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 250);

export const DEFAULT_PAGE_SIZE = 20;
