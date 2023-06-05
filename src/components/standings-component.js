import React, { useEffect, useState } from 'react';
import tournamentService from '../services/tournament-service';
import '../css/standings.css'
import standingsService from '../services/standings-service';

const StandingsTable = ({ tournamentId }) => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    if (tournamentId) {
      standingsService.getStandings(tournamentId)
        .then(data => {
          if (Array.isArray(data)) {
            const sortedStandings = data.sort((a, b) => b.points - a.points);
            setStandings(sortedStandings);
          } else {
            console.error("Standings verisi hatalı:", data);
          }
        })
        .catch(error => {
          console.error("Standings verisi alınamadı:", error);
        });
    }
  }, [tournamentId]);

  return (
    <div className="standingTable">
      <h1 className="standingHead">Puan Durumu</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Takım</th>
            <th>Oynanan Maç</th>
            <th>Galibiyet</th>
            <th>Beraberlik</th>
            <th>Mağlubiyet</th>
            <th>Atılan Gol</th>
            <th>Yenilen Gol</th>
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
              <td>{standing.goalsScored}</td>
              <td>{standing.goalsConceded}</td>
              <td>{standing.goalDifference}</td>
              <td>{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TournamentSelect = ({ tournaments, selectedTournament, onTournamentChange }) => {
  const handleTournamentChange = (event) => {
    const selectedTournamentId = event.target.value;
    onTournamentChange(selectedTournamentId);
  };

  return (
    <div>
      <h2>Turnuva Seçimi</h2>
      <select value={selectedTournament} onChange={handleTournamentChange}>
        {tournaments.map(tournament => (
          <option key={tournament.id} value={tournament.id}>{tournament.year} {tournament.branch} Turnuvası</option>
        ))}
      </select>
    </div>
  );
};

const StandingsComponent = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');

  useEffect(() => {
    tournamentService.getAllTournaments()
      .then(data => {
        console.log(data);
        if (Array.isArray(data)) {
          setTournaments(data);
          setSelectedTournament(data[0].id);
          standingsService.getStandings(data[0].id)
            .then(standingsData => {
              if (Array.isArray(standingsData)) {
                const sortedStandings = standingsData.sort((a, b) => b.points - a.points);
                setStandings(sortedStandings);
              } else {
                console.error("Standings verisi hatalı:", standingsData);
              }
            })
            .catch(error => {
              console.error("Standings verisi alınamadı:", error);
            });
        } else {
          console.error("Tournaments verisi hatalı:", data);
        }
      })
      .catch(error => {
        console.error("Tournaments verisi alınamadı:", error);
      });
  }, []);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournament(tournamentId);
    standingsService.getStandings(tournamentId)
      .then(data => {
        if (Array.isArray(data)) {
          const sortedStandings = data.sort((a, b) => b.points - a.points);
          setStandings(sortedStandings);
        } else {
          console.error("Standings verisi hatalı:", data);
        }
      })
      .catch(error => {
        console.error("Standings verisi alınamadı:", error);
      });
  };

  return (
    <div>
      <TournamentSelect
        tournaments={tournaments}
        selectedTournament={selectedTournament}
        onTournamentChange={handleTournamentChange}
      />
      {selectedTournament && <StandingsTable tournamentId={selectedTournament} />}
    </div>
  );
};

export default StandingsComponent;
