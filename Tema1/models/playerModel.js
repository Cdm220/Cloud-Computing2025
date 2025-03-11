const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/data.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the data.db database.');
});

function findAll(callback) {
    db.all('SELECT * FROM players', [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

function findById(id, callback) {
    db.get('SELECT * FROM players WHERE id = ?', [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

function create(product, callback) {
    const query = `INSERT INTO players (name, team, age) VALUES (?, ?, ?)`;
    const values = [product.name, product.team, product.age];
    db.run(query, values, function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, this.lastID);
        }
    });
}

function update(id, product, callback) {
    const query = `UPDATE players SET name = ?, team = ?, age = ? WHERE id = ?`;
    const values = [product.name, product.team, product.age, id];
    db.run(query, values, function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, this.changes);
        }
    });
}

function remove(id, callback) {
    db.run('DELETE FROM players WHERE id = ?', [id], function(err) {
        if (err) {
            callback(err, null);
        } else {
            db.run('UPDATE players SET id = id - 1 WHERE id > ?', [id], function(updateErr) {
                if (updateErr) {
                    callback(updateErr, null);
                } else {
                    db.run('UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM players) WHERE name = "players"', function(sequenceErr) {
                        if (sequenceErr) {
                            callback(sequenceErr, null);
                        } else {
                            callback(null, this.changes);
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};