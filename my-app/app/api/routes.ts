/**
 * A centralized route map for the application.
 * Using an object ensures autocomplete and prevents typos.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/pages/sign_in",
  SIGNUP: "/pages/sign_up",
  ENTRIES: "/pages/application_entries",
//   HISTORY: "/history",
  // DASHBOARD: "/",
  
  // Example of a dynamic route if you add it later
  // SETTINGS: (userId: string) => `/settings/${userId}`,
} as const;

/**
 * Routes that should be accessible without being logged in.
 */
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.HOME,
];

/**
 * The default redirect path after logging in.
 */
export const DEFAULT_LOGIN_REDIRECT = ROUTES.HOME;