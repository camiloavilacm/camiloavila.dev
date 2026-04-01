/**
 * k6-config.js — Shared k6 Configuration
 * ========================================
 * Common configuration for all k6 performance tests.
 */

export const thresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.05'],
  errors: ['rate<0.1'],
};

export const testScenarios = {
  light: {
    vus: 10,
    duration: '30s',
  },
  medium: {
    vus: 50,
    duration: '1m',
  },
  heavy: {
    vus: 100,
    duration: '2m',
  },
};