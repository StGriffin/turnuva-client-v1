import React, { useState, useEffect } from 'react';
import teamService from '../services/team-management-service';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createTeam = () => {
    const teamData = {
      name: teamName
    };

    teamService.createTeam(teamData)
      .then(response => {
        console.log('Takım oluşturuldu:', response);
        setTeamName('');
        getAllTeams();
      })
      .catch(error => {
        console.error('Takım oluşturulamadı:', error);
      });
  };

  const addPlayer = (teamId) => {
    const playerData = {
      name: playerName
    };

    teamService.addPlayerToTeam(teamId, playerData)
      .then(response => {
        console.log('Oyuncu eklendi:', response);
        setPlayerName('');
        getAllTeams();
      })
      .catch(error => {
        console.error('Oyuncu eklenemedi:', error);
      });
  };

  const getAllTeams = () => {
    teamService.getAllTeams()
      .then(data => {
        console.log(data);
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          console.error('Takım verisi hatalı:', data);
        }
      })
      .catch(error => {
        console.error('Takım verisi alınamadı:', error);
      });
  };

  useEffect(() => {
    getAllTeams();
  }, []);

  return (
    <div className="container">
      <h1 className="mt-5">Takım Yönetimi</h1>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Takım Oluşturma</h2>
              <div className="form-group">
                <input type="text" className="form-control" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Takım adı" />
              </div>
              <button className="btn btn-primary" onClick={createTeam}>Takım Oluştur</button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Takımlar</h2>
              {teams.map((team) => (
                <div key={team.id}>
                  <h3>{team.name}</h3>
                  <div className="form-group">
                    <input type="text" className="form-control" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Oyuncu adı" />
                  </div>
                  <button className="btn btn-primary" onClick={() => addPlayer(team.id)}>Oyuncu Ekle</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamManagement;
