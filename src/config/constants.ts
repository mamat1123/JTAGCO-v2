// src/config/constants.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ANALYTICS: '/analytics',
  BILLING: '/billing',
  SETTINGS: '/settings',
  HELP: '/help',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    USER: '/api/auth/user',
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    PROJECTS: '/api/projects',
    TASKS: '/api/tasks',
  },
};