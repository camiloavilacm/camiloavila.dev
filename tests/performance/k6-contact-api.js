/**
 * k6-contact-api.js — Load Test for /contact Endpoint
 * =====================================================
 * Load test the contact form API endpoint.
 *
 * Run with:
 *   k6 run k6-contact-api.js
 *
 * Environment variables:
 *   K6_API_URL - Base API URL (default: staging API)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const contactDuration = new Trend('contact_response_time');

// Configuration
const API_URL = __ENV.K6_API_URL || 'https://zx0061ghxe.execute-api.us-east-1.amazonaws.com/prod';
const CONTACT_URL = `${API_URL}/contact`;

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 users (contact form less frequent)
    { duration: '20s', target: 5 },   // Stay at 5 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'],  // Contact may be slower
    'errors': ['rate<0.1'],
  },
};

export default function () {
  const payloads = [
    {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello, I am interested in your work.',
    },
    {
      name: 'Jane Smith',
      email: 'jane@company.com',
      message: 'We have a QA position available. Are you interested?',
    },
  ];

  const payload = JSON.stringify(payloads[Math.floor(Math.random() * payloads.length)]);
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const startTime = new Date();
  const response = http.post(CONTACT_URL, payload, params);
  const duration = new Date() - startTime;

  contactDuration.add(duration);

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message !== undefined;
      } catch (e) {
        return false;
      }
    },
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  errorRate.add(success ? 0 : 1);

  sleep(2);
}

export function handleSummary(data) {
  return {
    'stdout': `
  =============================================
  Contact API Load Test Summary
  =============================================
  
  Total Requests: ${data.metrics.http_reqs.values.count}
  Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
  
  Response Times:
  - Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  - P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  
  =============================================
  `,
  };
}