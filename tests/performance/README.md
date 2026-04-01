# Performance Tests

Load testing scripts using k6.

## Prerequisites

```bash
# Install k6 (macOS)
brew install k6

# Or download from https://github.com/grafana/k6/releases
```

## Running Tests

### Chat API Endpoint

```bash
cd tests/performance
k6 run k6-chat-api.js
```

### Contact API Endpoint

```bash
cd tests/performance
k6 run k6-contact-api.js
```

### With Custom Environment

```bash
K6_API_URL=https://your-api-url.com/prod k6 run k6-chat-api.js
```

### With Custom Load

```bash
# Run with 50 virtual users
K6_VUS=50 k6 run k6-chat-api.js
```

## CI/CD Integration

To run in GitHub Actions, add to your workflow:

```yaml
- name: Run k6 performance tests
  run: |
    curl -fsSL https://github.com/grafana/k6/releases/download/v0.49.0/k6-v0.49.0-linux-amd64.tar.gz | tar -xz
    ./k6 run tests/performance/k6-chat-api.js
```

## Expected Results

| Metric | Target | Threshold |
|--------|--------|-----------|
| P95 Response Time | < 500ms | p(95)<500ms |
| P99 Response Time | < 1000ms | p(99)<1000ms |
| Error Rate | < 5% | rate<0.05 |
| Availability | 99.9% | No failures |

## Adding New Tests

1. Copy `k6-chat-api.js` as a template
2. Update the `options.stages` for your load pattern
3. Update the API endpoint and payload
4. Add to this directory