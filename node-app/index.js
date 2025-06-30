const express = require('express');
const client = require('prom-client');
const app = express();

const register = client.register;

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});


const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});


client.collectDefaultMetrics({ register, prefix: '' });


app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        const route = req.route?.path || req.path;
        const method = req.method;
        const status = res.statusCode;

        httpRequestsTotal.labels(method, route, status).inc();
        end({ method, route, status_code: status });
    });
    next();
});

app.get('/', (req, res) => {
    res.send('This app is for Grafana and Prometheus');
});

app.get('/error', (req, res) => {
    res.status(500).send('Internal Server Error');
});

app.get('/unauthorized', (req, res) => {
    res.status(401).send('Unauthorized access');
});

app.get('/not-found', (req, res) => {
    res.status(404).send('Resource not found');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
