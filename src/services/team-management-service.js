import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/teams';

class TeamManagementService {
  getAllTeams() {
    return axios
      .get(API_URL, { headers: authHeader() })
      .then(response => {
        console.log(response);
        return response.data;
      })
      .catch(error => {
        console.error('Takımlar alınamadı:', error);
        throw error;
      });
  }

  createTeam(teamData) {
    return axios
      .post(API_URL, teamData, { headers: authHeader() })
      .then(response => {
        console.log('Takım oluşturuldu:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Takım oluşturulamadı:', error);
        throw error;
      });
  }

  addPlayerToTeam(teamId, playerData) {
    return axios
      .post(`${API_URL}/${teamId}/players`, playerData, { headers: authHeader() })
      .then(response => {
        console.log('Oyuncu eklendi:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Oyuncu eklenemedi:', error);
        throw error;
      });
  }
}

export default new TeamManagementService();
