const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to handle file operations
const handleFileOperation = (req, res) => {
  const { method, url } = req;
  const filePath = path.join(__dirname, url);

  if (method === 'GET') {
    // Read file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });
  } else if (method === 'POST') {
    // Create or overwrite file
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.writeFile(filePath, body, err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error writing file');
        } else {
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.end('File created/updated');
        }
      });
    });
  } else if (method === 'DELETE') {
    // Delete file
    fs.unlink(filePath, err => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File deleted');
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
};

// Create HTTP server
const server = http.createServer((req, res) => {
  handleFileOperation(req, res);
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
