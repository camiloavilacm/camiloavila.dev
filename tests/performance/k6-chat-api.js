/**
 * k6-chat-api.js — Load Test for /chat Endpoint
 * ===============================================
 * Load test the chatbot API endpoint.
 *
 * Run with:
 *   k6 run k6-chat-api.js
 *
 * Environment variables:
 *   K6_API_URL - Base API URL (default: staging API)
 *   K6_VUS     - Virtual users (default: 10)
 *   K6_DURATION - Duration in seconds (default: 30s)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const chatDuration = new Trend('chat_response_time');

// Configuration
const API_URL = __ENV.K6_API_URL || 'https://zx0061ghxe.execute-api.us-east-1.amazonaws.com/prod';
const CHAT_URL = `${API_URL}/chat`;

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // Ramp up to 10 users
    { duration: '20s', target: 10 },  // Stay at 10 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% < 500ms, 99% < 1s
    'errors': ['rate<0.1'],  // Error rate < 10%
  },
};

const testQuestions = [
  'What are your AWS certifications?',
  'Tell me about your Python skills',
  'What is your experience with Selenium?',
  'Do you have Cypress experience?',
];

export default function () {
  const question = testQuestions[Math.floor(Math.random() * testQuestions.length)];
  
  const payload = JSON.stringify({ question });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const startTime = new Date();
  const response = http.post(CHAT_URL, payload, params);
  const duration = new Date() - startTime;

  chatDuration.add(duration);

  // Check response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has answer': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.answer !== undefined;
      } catch (e) {
        return false;
      }
    },
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  errorRate.add(success ? 0 : 1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data),
    'reports/summary.json': JSON.stringify(data),
  };
}

function textSummary(data) {
  return `
  =============================================
  Chat API Load Test Summary
  =============================================
  
  Total Requests: ${data.metrics.http_reqs.values.count}
  Failed Requests: ${data.metrics.http_req_failed.values.passes - data.metrics.http_reqs.values.count}
  Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
  
  Response Times:
  - Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  - P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  - P99: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
  
  =============================================
  `;
}