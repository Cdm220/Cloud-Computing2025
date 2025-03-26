require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const winnerModel = require('./models/leagueModel');

app.use(cors());
app.use(express.json());

const API_TOKEN1 = process.env.API_TOKEN1;
const API_TOKEN2 = process.env.API_TOKEN2;

app.get('/api', (req, res) => {
    res.json({ message: 'Cloud Homework2' });
})

app.get('/api/players', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/players');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching players data' });
    }
});

app.post('/api/league-winners', async (req, res) => {
    const { leagueCode } = req.body;
    if (!leagueCode) {
        return res.status(400).json({ error: 'League code is required' });
    }
    try {
        console.log('Fetching data for league:', leagueCode);
        const response = await axios.get(`http://api.football-data.org/v4/competitions/${leagueCode}`, {
            headers: {
                'X-Auth-Token': API_TOKEN1
            }
        });
        const winners = winnerModel.extractLastThreeWinners(response.data);
        res.json(winners);
    } catch (error) {
        if (error.response && error.response.status === 429) {
            return res.status(429).json(error.response.data);
        }
        res.status(500).json({ error: 'Error fetching league data' });
    }
});

app.get('/api/league-standings', async (req, res) => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/standings', {
            params: {
                league: 39,
                season: 2023
            },
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': API_TOKEN2
            }
        });
        const standings = response.data.response[0].league.standings[0].map(team => ({
            name: team.team.name,
            rank: team.rank
        }));

        res.json(standings);
    } catch (error) {
        console.error('Error fetching standings:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Failed to fetch standings', 
            details: error.message 
        });
    }
});

app.listen(5001, () => console.log('Server running on port 5001'));