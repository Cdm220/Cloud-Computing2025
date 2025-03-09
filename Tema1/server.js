const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/data.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the data.db database.');
});

const server = http.createServer((req, res) => {
    if(req.url === '/api/products' && req.method === 'GET') {
        db.all('SELECT * FROM items', [], (err, rows) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ message: 'Internal Server Error' }))
                res.end()
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(rows))
                res.end()
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({ message: 'Not Found' }))
        res.end()
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))