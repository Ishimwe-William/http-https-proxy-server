const http = require('http');
const https = require('https');
const { URL } = require('url');

const targetUrl = 'https://b018-2c0f-eb68-60e-9700-34c8-f3c6-8f53-171f.ngrok-free.app';

const server = http.createServer((req, res) => {
  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: req.url,  // Use the path from the incoming request
    method: req.method,
    headers: {
      ...req.headers,
      host: url.hostname
    },
    rejectUnauthorized: false  // Only use this for testing, not in production
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e);
    res.writeHead(500);
    res.end(`Problem with request: ${e.message}`);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`HTTP proxy server running on port ${PORT}`);
});