import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournament-service';
import { Navigate } from 'react-router-dom';

import '../css/tournament-management.css';
import Select from 'react-select';
import AuthService from '../services/auth-service'

function TournamentManagement() {
  const [tournaments, setTournaments] = useState([]);
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [tournamentEditMessage, setTournamentEditMessage] = useState('');
  const [tournamentEditSuccess, setTournamentEditsuccess] = useState(false);
  const [selectedTournamentData, setSelectedTournamentData] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);

  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || !currentUser.roles.includes('TAKIM_SORUMLUSU') || currentUser.roles('SISTEM_YONETICISI')) {
    return <Navigate to="/" />;
  }  

  const createTournament = () => {
    const tournamentData = {
      year: parseInt(year),
      branch: branch,
      teamPlayerCount: parseInt(playerCount),
    };

    tournamentService
      .createTournament(tournamentData)
      .then((response) => {
        console.log('Turnuva oluşturuldu:', response);
        setMessage('Turnuva başarıyla oluşturuldu');
        setSuccessful(true);
        getAllTournaments();
      })
      .catch((error) => {
        console.error('Turnuva oluşturulamadı:', error.response.data.message);
        setMessage(error.response.data || 'Bir hata oluştu.');
        setSuccessful(false);
      });
  };

  const getAllTournaments = () => {
    tournamentService
      .getAllTournaments()
      .then((data) => {
        if (Array.isArray(data)) {
          setTournaments(data);
          console.log(data)
        } else {
          console.error('Tournaments verisi hatalı:', data);
        }
      })
      .catch((error) => {
        console.log(error)
        console.error('Tournaments verisi alınamadı:', error);
      });
  };


  const getAllAvailableTeams = () => {
    tournamentService
      .getAllAvailableTeams()
      .then((data) => {
        setAvailableTeams(data);
      })
      .catch((error) => {
        console.error('Mevcut takımlar alınamadı:', error);
      });
  };

  const updateTournament = () => {
    const updateTournamentData = {
      id: selectedTournamentData.id,
      year: selectedTournamentData.year,
      branch: selectedTournament.branch,
      teamPlayerCount: selectedTournamentData.teamPlayerCount,
      teams: selectedTournamentData.teams.map((team) => team.id),
    };

    tournamentService
      .updateTournament(updateTournamentData)
      .then((response) => {
        console.log('Turnuva güncellendi:', response);
        setTournamentEditMessage('Turnuva başarıyla güncellendi');
        setTournamentEditsuccess(true);
        setEditModalOpen(false);
        getAllTournaments();
      })
      .catch((error) => {
        console.error('Turnuva güncellenemedi:', error.response.data.message);
        setTournamentEditMessage(error.response.data || 'Bir hata oluştu.');
        setTournamentEditsuccess(false);
      });
  };

  const deleteTournament = () => {
    console.log(tournamentToDelete.id)
    if (tournamentToDelete) {
      tournamentService
        .deleteTournament(tournamentToDelete.id)
        .then((response) => {
          console.log('Turnuva silindi:', response);
          setTournamentEditMessage('Turnuva başarıyla silindi');
          setTournamentEditsuccess(true);
          setTournamentToDelete(null);
          setConfirmDelete(false);
          getAllTournaments();
        })
        .catch((error) => {
          console.error('Turnuva silinemedi:', error.response.data.message);
          setTournamentEditMessage(error.response.data || 'Bir hata oluştu.');
          setTournamentEditsuccess(false);
          setTournamentToDelete(null);
          setConfirmDelete(false);
        });
    }
  };

  const openEditModal = (tournament) => {
    setSelectedTournamentData({
      id: tournament.id,
      year: tournament.year,
      branch: tournament.branch,
      teamPlayerCount: tournament.teamPlayerCount,
      teams: tournament.teams
    });

    setSelectedTournament(tournament);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTournament(null);
    setYear('');
    setBranch('');
    setPlayerCount('');
    setMessage('');
    setSuccessful(false);
  };

  const confirmDeleteTournament = (tournament) => {
    setTournamentToDelete(tournament);
    setConfirmDelete(true);
  };

  useEffect(() => {
  
    const fetchData = async () => {
      await getAllTournaments();
      await getAllAvailableTeams();
    };
  
    fetchData();
  }, []);


  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center">Turnuva Yönetimi</h2>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Turnuva Oluştur</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="year">Yıl:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="branch">Branş:</label>
                  <select
                    className="form-control"
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="BASKETBOL">Basketbol</option>
                    <option value="FUTBOL">Futbol</option>
                    <option value="VOLEYBOL">Voleybol</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="playerCount">Takım Oyuncu Sayısı:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="playerCount"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                  />
                </div>
                <br></br>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createTournament}
                >
                  Turnuva Oluştur
                </button>
              </form>

              {message && (
                <div className="mt-4">
                  <div
                    className={
                      successful ? 'alert alert-success' : 'alert alert-danger'
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Turnuvalar</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Yıl</th>
                    <th>Branş</th>
                    <th>Takım Oyuncu Sayıları</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((tournament) => (
                    <tr key={tournament.id}>
                      <td>{tournament.year}</td>
                      <td>{tournament.branch}</td>
                      <td>{tournament.teamPlayerCount}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => openEditModal(tournament)}
                        >
                          Düzenle
                        </button>
                        
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDeleteTournament(tournament)}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tournamentEditMessage && (
              <div className="mt-4">
                <div
                  className={
                    tournamentEditSuccess ? 'alert alert-success' : 'alert alert-danger'
                  }
                  role="alert"
                >
                  {tournamentEditMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Turnuva Düzenle</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeEditModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="editYear">Yıl:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editYear"
                      value={selectedTournamentData.year}
                      onChange={(e) =>
                        setSelectedTournamentData({
                          ...selectedTournamentData,
                          year: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="editBranch">Branş:</label>
                    <select
                      className="form-control"
                      id="editBranch"
                      value={selectedTournamentData.branch}
                      onChange={(e) =>
                        setSelectedTournamentData({
                          ...selectedTournamentData,
                          branch: e.target.value
                        })
                      }
                    >
                      <option value="BASKETBOL">Basketbol</option>
                      <option value="FUTBOL">Futbol</option>
                      <option value="VOLEYBOL">Voleybol</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editPlayerCount">Takım Oyuncu Sayısı:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editPlayerCount"
                      value={selectedTournamentData.teamPlayerCount}
                      onChange={(e) =>
                        setSelectedTournamentData({
                          ...selectedTournamentData,
                          teamPlayerCount: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPlayerCount">Takım Listesi</label>

                    <Select
                      defaultValue={
                        selectedTournamentData.teams.length > 0
                          ? selectedTournamentData.teams.map((team) => ({
                            value: team.id,
                            label: team.name
                          }))
                          : null
                      }
                      isMulti
                      name="teamListSelect"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={availableTeams.map((team) => ({
                        value: team.id,
                        label: team.name
                      }))}
                      onChange={(selectedOptions) => {
                        const updatedTeams = selectedOptions.map((option) => ({
                          id: option.value,
                          name: option.label,
                        }));
                        setSelectedTournamentData({
                          ...selectedTournamentData,
                          teams: updatedTeams,
                        });
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateTournament}
                  disabled={
                    selectedTournamentData.year === selectedTournament.year &&
                    selectedTournamentData.branch === selectedTournament.branch &&
                    selectedTournamentData.teamPlayerCount === selectedTournament.teamPlayerCount
                  }
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Turnuva Sil</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setConfirmDelete(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Emin misiniz?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(false)}
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteTournament}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentManagement;
