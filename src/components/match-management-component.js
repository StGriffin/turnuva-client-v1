import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tournamentService from '../services/tournament-service';
import matchService from '../services/match-service';

const MatchManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = () => {
    tournamentService.getAllTournaments()
      .then(response => {
        setTournaments(response);
      })
      .catch(error => {
        console.error('Turnuvalar alınamadı:', error);
      });
  };

  const startTournament = (teamIds) => {
    if (teamIds.length < 2) {
      console.error('Turnuva başlatmak için en az 2 takımın bulunması gerekmektedir.');
      return;
    }
    console.log(teamIds)
    matchService.createMatches(teamIds)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Turnuva başlatılamadı :', error);
      });
  };

  return (
    <div className="container">
      <h1>Karşılaşma Yönetimi</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3>Turnuvalar</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Yıl</th>
                    <th>Branş</th>
                    <th>Takım Listesi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map(tournament => (
                    <tr key={tournament.id}>
                      <td>{tournament.year}</td>
                      <td>{tournament.branch}</td>
                      <td>{tournament.teams.map(team => team.name).join(', ')}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => startTournament(tournament.teams.map(team => team.id))}
                        >
                          Turnuvayı Başlat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchManagement;
