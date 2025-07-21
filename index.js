const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  // Handle root route
  if (req.url === '/') {
    fs.readFile('html/index.html', 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  // Handle CSS file
  else if (req.url === '/index.css') {
    fs.readFile('html/index.css', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('CSS file not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  }

  // Handle form submission
  else if (req.url === '/submit' && req.method === 'POST') {
    let databody = [];
    req.on('data', chunk => databody.push(chunk));
    req.on('end', () => {
      const rawdata = Buffer.concat(databody).toString();
      const parsedData = querystring.parse(rawdata);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Data Page</title></head>
        <body>
          <h1>Data page</h1>
          <ul>
            <li>Name: ${parsedData.username}</li>
            <li>Password: ${parsedData.password}</li>
          </ul>
        </body>
        </html>
      `);
    });
  }

  // If no route matches
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
