import React, { useEffect, useState } from 'react';
import tournamentService from '../services/tournament-service';
import '../css/standings.css'

const StandingsTable = ({ tournamentId }) => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    if (tournamentId) {
      fetch(`/api/standings?tournamentId=${tournamentId}`)
        .then(response => response.json())
        .then(data => setStandings(data));
    }
  }, [tournamentId]);

  return (
    <div className="standingTable">
    <h1 className="standingHead">Puan Durumu</h1>
    <table className="standingTable">
      <thead>
        <tr className="standingCol">
          <th>#</th>
          <th>Takım</th>
          <th>Oynanan Maç</th>
          <th>Galibiyet</th>
          <th>Beraberlik</th>
          <th>Mağlubiyet</th>
          <th>Averaj</th>
          <th>Puan</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((standing, index) => (
          <tr key={standing.id} className={index < 2 ? "wpos" : "pos"}>
            <td>{index + 1}</td>
            <td>{standing.team.name}</td>
            <td>{standing.matchesPlayed}</td>
            <td>{standing.wins}</td>
            <td>{standing.draws}</td>
            <td>{standing.losses}</td>
            <td>{standing.goalDifference}</td>
            <td>{standing.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

const TournamentSelect = ({ onTournamentChange }) => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');

  useEffect(() => {
    tournamentService.getAllTournaments()
      .then(data => {
        console.log(data);
        if (Array.isArray(data)) { // Veri doğru formatta mı kontrol et
          setTournaments(data);
        } else {
          console.error("Tournaments verisi hatalı:", data);
        }
      })
      .catch(error => {
        console.error("Tournaments verisi alınamadı:", error);
      });
  }, []);

  const handleTournamentChange = (event) => {
    const selectedTournamentId = event.target.value;
    setSelectedTournament(selectedTournamentId);
    onTournamentChange(selectedTournamentId);
  };

  return (
    <div>
      <h2>Turnuva Seçimi</h2>
      <select value={selectedTournament} onChange={handleTournamentChange}>
        <option value="">Turnuva Seçin</option>
        {tournaments.map(tournament => (
          <option key={tournament.id} value={tournament.id}>{tournament.year} {tournament.branch} Turnuvası</option>
        ))}
      </select>
    </div>
  );
};

const StandingsComponent = () => {
  const [selectedTournament, setSelectedTournament] = useState('');

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournament(tournamentId);
  };

  return (
    <div>
      <TournamentSelect onTournamentChange={handleTournamentChange} />
      {selectedTournament && <StandingsTable tournamentId={selectedTournament} />}
    </div>
  );
};

export default StandingsComponent;