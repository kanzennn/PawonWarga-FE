// Single source of truth for every REST path this frontend talks to.
// Keep it in sync with docs/api-contract.md and PawonWarga-BE's router.
export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    profile: "/auth/profile",
    profilePicture: "/auth/profile/picture",
    password: "/auth/password",
    logoutAll: "/auth/logout-all",
  },
  dashboard: {
    overview: "/dashboard/overview",
  },
  mentions: {
    list: "/mentions",
    detail: (id: number | string) => `/mentions/${id}`,
    comments: (id: number | string) => `/mentions/${id}/comments`,
  },
  sentiment: {
    overview: "/sentiment/overview",
    locations: "/sentiment/locations",
  },
  keywords: {
    list: "/keywords",
  },
  ai: {
    insight: "/ai/insight",
  },
  reports: {
    list: "/reports",
    templates: "/reports/templates",
    generate: "/reports/generate",
    detail: (id: string) => `/reports/${id}`,
    download: (id: string) => `/reports/${id}/download`,
  },
  settings: {
    integrations: "/settings/integrations",
    preferences: "/settings/preferences",
  },
} as const;
