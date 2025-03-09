const products = require('./products.json');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = 'data.db';

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL
    )`);

    const insertStmt = db.prepare("INSERT INTO items (id, name, description, price) VALUES (?, ?, ?, ?)");
    products.forEach(product => {
        insertStmt.run(product.id, product.name, product.description, product.price);
    });
    insertStmt.finalize();

    console.log('Database initialized with sample data.');
});

db.close();
