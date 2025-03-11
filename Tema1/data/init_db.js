const players = require('./players.json');
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
    db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT,
        age INTEGER
    )`);

    const insertStmt = db.prepare("INSERT INTO players (id, name, team, age) VALUES (?, ?, ?, ?)");
    players.forEach(player => {
        insertStmt.run(player.id, player.name, player.team, player.age);
    });
    insertStmt.finalize();

    console.log('Database initialized with sample data.');
});

db.close();
