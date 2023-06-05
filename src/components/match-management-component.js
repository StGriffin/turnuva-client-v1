import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tournamentService from '../services/tournament-service';
import matchService from '../services/match-service';
import AuthService from '../services/auth-service';

const MatchManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const isSystemAdmin = currentUser && currentUser.roles.includes('SISTEM_YONETICISI');

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

  const startTournament = (tournamentId,teamIds) => {
    if (teamIds.length < 2) {
      console.error('Turnuva başlatmak için en az 2 takımın bulunması gerekmektedir.');
      return;
    }
    console.log(teamIds);
    matchService.createMatches(tournamentId,teamIds)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Turnuva başlatılamadı :', error);
      });
  };

  const fetchMatches = (tournamentId) => {
    matchService.getMatchesByTournament(tournamentId)
      .then(response => {
        const formattedMatches = response.map(match => {
          const { homeTeam, awayTeam, score, matchDate } = match;
          const formattedDate = new Date(matchDate).toLocaleDateString('tr-TR');
          const [homeTeamScore, awayTeamScore] = score ? score.split('-') : [null, null];
          const formattedScore = score ? `${homeTeamScore}-${awayTeamScore}` : 'Oynanacak';
          return {
            ...match,
            matchDate: formattedDate,
            homeTeamScore,
            awayTeamScore,
            formattedScore
          };
        });
        setMatches(formattedMatches);
      })
      .catch(error => {
        console.error('Karşılaşmalar alınamadı:', error);
      });
  };

  const handleTournamentChange = (event) => {
    const selectedTournamentId = event.target.value;
    setSelectedTournament(selectedTournamentId);
    fetchMatches(selectedTournamentId);
  };

  const openMatchPanel = (match) => {
    setSelectedMatch(match);
    setHomeScore(match.homeTeamScore || '');
    setAwayScore(match.awayTeamScore || '');
  };

  const closeMatchPanel = () => {
    setSelectedMatch(null);
    setHomeScore('');
    setAwayScore('');
  };

  const saveMatchResult = () => {
    const { id: matchId } = selectedMatch;
    const result = `${homeScore}-${awayScore}`;

    console.log('Sonuçlar:', result, 'Karşılaşma ID:', matchId);
    matchService.saveMatchResult(matchId,result)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Turnuva başlatılamadı :', error);
      });
    closeMatchPanel();
  };

  return (
    <div className="container">
      <h1>Karşılaşma Bilgileri</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3>Turnuvalar</h3>
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Yıl</th>
                    <th>Branş</th>
                    <th>Takım Listesi</th>
                    {isSystemAdmin && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map(tournament => (
                    <tr key={tournament.id}>
                      <td>{tournament.year}</td>
                      <td>{tournament.branch}</td>
                      <td>{tournament.teams.map(team => team.name).join(', ')}</td>
                      {isSystemAdmin && (
                        <td>
                          {tournament.active ? (
                            <button
                              className="btn btn-primary btn-sm"
                              disabled
                            >
                              Oynanıyor
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => startTournament(tournament.id,tournament.teams.map(team => team.id))}
                            >
                              Turnuvayı Başlat
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3>Karşılaşmalar</h3>
              <div className="form-group">
                <label htmlFor="tournamentSelect">Turnuva Seçin:</label>
                <select
                  id="tournamentSelect"
                  className="form-control"
                  value={selectedTournament}
                  onChange={handleTournamentChange}
                >
                  <option value="">-- Seçin --</option>
                  {tournaments.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.year} - {tournament.branch}
                    </option>
                  ))}
                </select>
              </div>
              {matches.length > 0 ? (
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Ev Sahibi</th>
                      <th>Skor</th>
                      <th>Deplasman</th>
                      {isSystemAdmin && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map(match => (
                      <tr key={match.id}>
                        <td>{match.matchDate}</td>
                        <td>{match.homeTeam.name}</td>
                        <td>{match.formattedScore}</td>
                        <td>{match.awayTeam.name}</td>
                        {isSystemAdmin && match.formattedScore === 'Oynanacak' && (
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => openMatchPanel(match)}
                            >
                              Sonuçlandır
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Seçilen turnuvaya ait karşılaşma bulunmamaktadır.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sonuçlandırma Paneli */}
      {selectedMatch && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Karşılaşma Sonuçlandırma</h5>
                <button type="button" className="close" onClick={closeMatchPanel}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h6>Tarih: {selectedMatch.matchDate}</h6>
                <h6>
                  Takımlar: {selectedMatch.homeTeam.name} - {selectedMatch.awayTeam.name}
                </h6>
                <div className="form-group">
                  <label htmlFor="homeScore">Ev Sahibi Skoru:</label>
                  <input
                    type="text"
                    id="homeScore"
                    className="form-control"
                    value={homeScore}
                    onChange={e => setHomeScore(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="awayScore">Deplasman Skoru:</label>
                  <input
                    type="text"
                    id="awayScore"
                    className="form-control"
                    value={awayScore}
                    onChange={e => setAwayScore(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={saveMatchResult}>
                  Kaydet ve Kapat
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeMatchPanel}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchManagement;
