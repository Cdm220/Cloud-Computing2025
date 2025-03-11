const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

db.run(`DROP TABLE players;`, function(err) {
    if (err) {
        console.error('Error deleting table:', err.message);
    } else {
        console.log(`Table deleted, changes: ${this.changes}`);
    }
    db.close();
});