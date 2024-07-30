const http = require('http');
const https = require('https');
const { URL } = require('url');

const targetUrl = `https://bfe1-2c0f-eb68-60e-9700-34c8-f3c6-8f53-171f.ngrok-free.app`;

const server = http.createServer((req, res) => {
  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (e) => {
    res.writeHead(500);
    res.end(`Problem with request: ${e.message}`);
  });
});
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`HTTP proxy server running on port ${PORT}`);
});
