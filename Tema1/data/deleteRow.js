const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

db.run(`DELETE FROM players WHERE id IS NULL;`, function(err) {
    if (err) {
        console.error('Error deleting last row:', err.message);
    } else {
        console.log(`Last row deleted, changes: ${this.changes}`);
    }
    db.close();
});
