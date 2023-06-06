import React, { useState, useEffect } from 'react';
import teamService from '../services/team-management-service';
import Select from 'react-select';
import { Table, Button } from 'react-bootstrap';
import AuthService from '../services/auth-service'
import { Navigate } from 'react-router-dom';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournamentList, setTournamentList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeamData, setSelectedTeamData] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [candidateTeamLeaders, setCandidateTeamLeaders] = useState([]);

  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.roles.includes('NORMAL')) {
    return <Navigate to="/" />;
  }

  const teamOptions = [];

  availableUsers.forEach((user) => {
    teamOptions.push({
      value: user.id,
      label: user.fullName
    });
  });

  const createTeam = () => {
    const teamData = {
      name: teamName,
      teamLead: teamLead
    };

    teamService.createTeam(teamData)
      .then(response => {
        console.log('Takım oluşturuldu:', response);
        setTeamName('');
        setTeamLead('');
        getAllTeams();
      })
      .catch(error => {
        console.error('Takım oluşturulamadı:', error);
      });
  };

  const getAllAvailableUsers = () => {
    teamService
      .getAllAvailableUsers()
      .then((data) => {
        setAvailableUsers(data);
        console.log(data)
      })
      .catch((error) => {
        console.error('Oyuncu listesi alınamadı:', error);
      });
  };

  const editTeam = () => {
    setIsEditModalOpen(false);
  };

  const deleteTeam = (teamId) => {
    getAllTeams();
  };

  const getAllTeams = () => {
    teamService.getAllTeams()
      .then(data => {
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

  const getTournamentList = () => {
    teamService.getTournamentList()
      .then(data => {
        if (Array.isArray(data)) {
          setTournamentList(data);
        } else {
          console.error('Turnuva listesi hatalı:', data);
        }
      })
      .catch(error => {
        console.error('Turnuva listesi alınamadı:', error);
      });
  };

  const getCandidateTeamLeaders = () => {
    teamService.getCandidateTeamLeaders()
      .then(data => {
        if (Array.isArray(data)) {
          setCandidateTeamLeaders(data);
        } else {
          console.error('Takım sorumlusu listesi hatalı:', data);
        }
      })
      .catch(error => {
        console.error('Takım sorumlusu listesialınamadı:', error);
      });
  };

  const editTeamInfo = () => {
    const updatedTeamData = {
      teamId: selectedTeamData.id,
      teamName: selectedTeamData.name,
      teamLeadUserId: selectedTeamData.teamLeader.id,
      playerIds: selectedTeamData.players.map(player => player.id)
    };

    console.log(updatedTeamData)

    teamService.updateTeam(updatedTeamData)
      .then(response => {
        console.log('Takım güncellendi:', response);
        closeEditModal();
        getAllTeams();
      })
      .catch(error => {
        console.error('Takım güncellenemedi:', error);
      });
  };



  useEffect(() => {
    getAllTeams();
    getTournamentList();
    getAllAvailableUsers();
    getCandidateTeamLeaders();
  }, []);



  const handleTournamentChange = (event) => {
    const selectedTournamentId = event.target.value;
    setSelectedTournament(selectedTournamentId);
  };

  useEffect(() => {
    if (!selectedTournament) {
      getAllTeams();
    } else {
      const selectedTournamentData = tournamentList.find(tournament => tournament.id === parseInt(selectedTournament));
      if (selectedTournamentData) {
        setTeams(selectedTournamentData.teams);
      } else {
        console.error('Seçilen turnuva bulunamadı:', selectedTournament);
      }
    }
  }, [selectedTournament, tournamentList]);

  const openEditModal = (team) => {
    setSelectedTeamData({
      id: team.id,
      name: team.name,
      players: team.players,
      teamLeader: team.teamLeader,
    });
    console.log(selectedTeamData)
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="container">
      <h1 className="mt-5">Takım Yönetimi</h1>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Takım Oluşturma</h2>
              <div className="form-group">
              <label htmlFor="teamNameInput">Takım Adı:</label>
                <input type="text" className="form-control" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Takım adı" />
              </div>
              <div className="form-group">
              <label htmlFor="teamNameInput">Takım Adı:</label>

                <Select
                  value={teamLead}
                  options={candidateTeamLeaders.map((user) => ({
                    value: user.id,
                    label: user.fullName
                  }))}
                  onChange={(selectedOption) => {
                    setTeamLead(selectedOption);
                  }}
                  placeholder="Takım Sorumlusu"
                  isSearchable={true}
                  isClearable={true}
                />              </div>
              <br></br>
              <button className="btn btn-primary" onClick={createTeam}>Takım Oluştur</button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Takımlar</h2>
              <div className="form-group">
                <select className="form-control" onChange={handleTournamentChange}>
                  <option value="">Tüm Turnuvalar</option>
                  {tournamentList.map((tournament) => (
                    <option value={tournament.id} key={tournament.id}>{tournament.year} {tournament.branch} TURNUVASI</option>
                  ))}
                </select>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Takım Adı</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>
                        <Button variant="primary" onClick={() => openEditModal(team)}>Düzenle</Button>{' '}
                        <Button variant="danger" onClick={() => deleteTeam(team.id)}>Sil</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Takım Düzenle</h5>
                <button type="button" className="close" onClick={closeEditModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Takım Adı:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTeamData.name}
                    onChange={(e) => setSelectedTeamData({ ...selectedTeamData, name: e.target.value })}
                    placeholder="Takım adı"
                  />
                </div>
                <div className="form-group">
                  <label>Takım Sorumlusu:</label>
                  <Select
                    defaultValue={
                      selectedTeamData.teamLeader
                        ? {
                          value: selectedTeamData.teamLeader.user.id,
                          label: selectedTeamData.teamLeader.user.fullName
                        }
                        : null
                    }
                    options={candidateTeamLeaders.map((user) => ({
                      value: user.id,
                      label: user.fullName
                    }))}
                    onChange={(selectedOption) => {
                      setSelectedTeamData({
                        ...selectedTeamData,
                        teamLeader: {
                          id: selectedOption.value,
                          user: {
                            fullName: selectedOption.label
                          }
                        }
                      });
                    }}
                    placeholder="Takım Sorumlusu"
                    isSearchable={true}
                    isClearable={true}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editPlayerList">Oyuncu Listesi</label>

                  <Select
                    defaultValue={
                      selectedTeamData.players.length > 0
                        ? selectedTeamData.players.map((player) => ({
                          value: player.id,
                          label: player.user.fullName
                        }))
                        : null
                    }
                    isMulti
                    name="playerListSelect"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={teamOptions}
                    onChange={(selectedOptions) => {
                      const selectedPlayers = selectedOptions.map((option) => ({
                        id: option.value,
                        user: {
                          fullName: option.label
                        }
                      }));
                      setSelectedTeamData({
                        ...selectedTeamData,
                        players: selectedPlayers
                      });
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={editTeamInfo}>Kaydet</button>
                <button className="btn btn-secondary" onClick={closeEditModal}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
