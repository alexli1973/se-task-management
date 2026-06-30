export const INFRA_ROUTES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
} as const;

export const ROUTE_URLS = {
  LOGIN: `/${INFRA_ROUTES.LOGIN}`,
  DASHBOARD: `/${INFRA_ROUTES.DASHBOARD}`,
} as const;
