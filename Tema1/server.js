const http = require('http');
const { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } = require('./controllers/playerController');

const server = http.createServer((req, res) => {
    if(req.url === '/api/players' && req.method === 'GET') {
        getAllPlayers(req, res);
    } else if(req.url.match(/\/api\/players\/([0-9]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[3];
        getPlayerById(req, res, id);
    } else if (req.url === '/api/players' && req.method === 'POST') {
        createPlayer(req, res);
    } else if (req.url.match(/\/api\/players\/([0-9]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        updatePlayer(req, res, id);
    } else if (req.url.match(/\/api\/players\/([0-9])+/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        deletePlayer(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Route Not Found' }));
        res.end();
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))