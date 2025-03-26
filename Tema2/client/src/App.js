import React, { useEffect, useState } from 'react';
import './App.css';

const leagues = [
  { code: 'WC', name: 'FIFA World Cup' },
  { code: 'CL', name: 'UEFA Champions League' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'DED', name: 'Eredivisie' },
  { code: 'BSA', name: 'Campeonato Brasileiro Série A' },
  { code: 'PD', name: 'Primera Division' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'ELC', name: 'Championship' },
  { code: 'PPL', name: 'Primeira Liga' },
  { code: 'EC', name: 'European Championship' },
  { code: 'SA', name: 'Serie A' },
  { code: 'PL', name: 'Premier League' }
];


function App() {
  
  const [players, setPlayers] = useState([{}]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [winners, setWinners] = useState([]);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error("Error fetching players data:", err));
  }, []);


  const fetchStandings = async () => {
    try {
      const response = await fetch('/api/league-standings');
      const data = await response.json();
      setStandings(data);
    } catch (error) {
      console.error('Error fetching standings:', error);
      alert('Failed to fetch standings');
    }
  };



  const fetchWinners = async () => {
    if (!selectedLeague) {
        alert("Please select a league first!");
        return;
    }

    console.log("Sending request to server with league:", selectedLeague);

    try {
        const response = await fetch("http://localhost:5001/api/league-winners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leagueCode: selectedLeague })
        });

        console.log("Response received from server:", response);
        const data = await response.json();
        console.log("Data received:", data);
        if (response.status === 429) {
          alert(data.message);
          return;
        }
        setWinners(data);
    } catch (error) {
        console.error("Error fetching league data:", error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div className='container1'>
        <h2>Players</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name}, {player.age}yrs, {player.team}</li>
          ))}
        </ul>
      </div>
      <div className='container2'>
        <h2>Choose a Football League</h2>
        <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}>
          <option value="">Select a league</option>
          {leagues.map(league => (
            <option key={league.code} value={league.code}>
              {league.name}
            </option>
          ))}
        </select>
        <button onClick={() => { console.log("Button clicked"); fetchWinners();}} style={{ marginTop: '10px', padding: '5px 10px' }}>
          Get Past Winners
        </button>

        <h3>Past Winners</h3>
        <ul>
          {winners.length > 0 ? (
            winners.map((winner, index) => (
              <li key={index}>
                {winner.season}: {winner.winner}
              </li>
            ))
          ) : (
            <p>No data available</p>
          )}
        </ul>
      </div>
      <div className='container3'>
      <h2>Premier League Standings</h2>
      <button 
        onClick={fetchStandings}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Show Standings
      </button>

      {standings.length > 0 && (
        <ul>
          {standings.map(team => (
            <li 
              key={team.rank} 
              className="border-b py-2 flex justify-between"
            >
              <span>{team.rank}.</span>
              <span>{team.name}</span>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default App;
