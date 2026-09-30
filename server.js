const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;
const dataFile = path.join(__dirname, 'canvas_assignments.json');

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ALU Assignments</title>
  <script src="/jquery.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6fb;
      color: #1f2937;
      margin: 0;
      padding: 32px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
      padding: 24px;
    }

    h1 {
      margin-top: 0;
      color: #1d4ed8;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #eff6ff;
      color: #1e3a8a;
    }

    tr:hover {
      background: #f8fafc;
    }

    .status {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
      background: #e0f2fe;
      color: #075985;
    }

    .empty {
      color: #6b7280;
      font-style: italic;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Frontend Web Development Assignments</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Assignment</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="assignment-table-body"></tbody>
    </table>
  </div>

  <script>
    $(document).ready(function () {
      $.getJSON('/api/assignments', function (data) {
        if (!data || data.length === 0) {
          $('#assignment-table-body').html('<tr><td colspan="4" class="empty">No assignments found yet.</td></tr>');
          return;
        }

        data.forEach(function (item, index) {
          var row = '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + item.title + '</td>' +
            '<td>' + item.dueDate + '</td>' +
            '<td><span class="status">' + item.status + '</span></td>' +
            '</tr>';
          $('#assignment-table-body').append(row);
        });
      }).fail(function () {
        $('#assignment-table-body').html('<tr><td colspan="4" class="empty">Unable to load assignments yet. Try running the scraper again.</td></tr>');
      });
    });
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (url === '/jquery.min.js') {
    const jqueryPath = path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js');

    fs.readFile(jqueryPath, 'utf8', (err, jquery) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('jQuery not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(jquery);
    });
    return;
  }

  if (url === '/api/assignments') {
    fs.readFile(dataFile, 'utf8', (err, fileData) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No assignments file found yet.' }));
        return;
      }

      try {
        const assignments = JSON.parse(fileData);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(assignments));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid assignments file.' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`ALU assignment UI is running at http://localhost:${port}`);
});
