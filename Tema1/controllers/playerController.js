const Player = require('../models/playerModel');

function getAllPlayers(req, res) {
    Player.findAll((err, players) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Internal Server Error' }));
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(players));
            res.end();
        }
    });
}

function getPlayerById(req, res, id) {
    Player.findById(id, (err, player) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Internal Server Error' }));
            res.end();
        } else if (player) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(player));
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Player Not Found' }));
            res.end();
        }
    });
}

function createPlayer(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const player = JSON.parse(body);
        Player.create(player, (err, id) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'Internal Server Error' }));
                res.end();
            } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ id }));
                res.end();
            }
        });
    });
}

function updatePlayer(req, res, id) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    Player.findById(id, (err, playerByID) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Internal Server Error' }));
            res.end();
        } else if (!playerByID) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Player Not Found' }));
            res.end();
        } else {
            const { name, team, age } = JSON.parse(body);
            const player = { 
                name: name || playerByID.name, 
                team: team || playerByID.team, 
                age: age || playerByID.age 
            };
            Player.update(id, player, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'Internal Server Error' }));
                    res.end();
                } else {
                    Player.findById(id, (err, player) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ message: 'Internal Server Error' }));
                            res.end();
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify(player));
                            res.end();
                        }
                    });
                }
            });
        }
    });    
}

function deletePlayer(req, res, id) {
    Player.findById(id, (err, player) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Internal Server Error' }));
            res.end();
        } else if (!player) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Player Not Found' }));
            res.end();
        } else {
            Player.remove(id, (err, player) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'Internal Server Error' }));
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'Player deleted successfully' }));
                    res.end();
                }
            });
        }
    });
}

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer, 
    deletePlayer
};
