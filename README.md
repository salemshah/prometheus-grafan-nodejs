---

## Overview

- **node-app**  
  A simple Express server exposing:
    - `/` endpoint
    - `/metrics` → Prometheus-formatted metrics (default + custom HTTP counter)

- **Prometheus**  
  Scrapes `node-app:3000/metrics` every 15 s.

- **Grafana**  
  Auto-provisions:
    - A **Prometheus** datasource
    - A **“Node.js HTTP Metrics”** dashboard

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Engine + Compose v2)

---

## Getting Started

1. Clone the repo
   ```bash
   docker compose build
   docker compose up -d
   ```

2. Node App
   curl http://localhost:3000/

3. Prometheus metrics
   curl http://localhost:3000/metrics

4. Prometheus UI
   curl http://localhost:9090/

5. Grafana UI
   curl http://localhost:3001/
    1. Login: u: admin => p: admin

---

## Generate Traffic

```bash
   for i in {1..20}; do
   curl -s http://localhost:3000/ > /dev/null
   done 
```
## Generate 404 Traffic

```bash
   for i in {1..20}; do
   curl -i http://localhost:3000/not-found > /dev/null
   done 
```

## Generate errors Traffic

```bash
    curl -i http://localhost:3000/error
    curl -i http://localhost:3000/unauthorized
    curl -i http://localhost:3000/not-found
```
