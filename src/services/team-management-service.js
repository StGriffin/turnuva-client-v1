import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/teams';
const API_URL_TOURNAMENTS = 'http://localhost:8080/api/tournaments';

class TeamManagementService {
  getAllTeams() {
    return axios
      .get(API_URL, { headers: authHeader() })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Takımlar alınamadı:', error);
        throw error;
      });
  }

  createTeam(teamData) {

    const createTeamData = {
      
      teamName: teamData.name,
      teamLeadId: teamData.teamLead ? teamData.teamLead.value : null
    };

    console.log(createTeamData)

    return axios
      .post(API_URL+ '/createTeam', createTeamData, { headers: authHeader() })
      .then(response => {
        console.log('Takım oluşturuldu:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Takım oluşturulamadı:', error);
        throw error;
      });
  }


  getTournamentList() {
    return axios
      .get(API_URL_TOURNAMENTS , {headers : authHeader()})
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Oyuncu eklenemedi:', error);
        throw error;
      });;
  }

  getAllAvailableUsers(){
    return axios
      .get(API_URL + '/availableUsers' , {headers : authHeader()})
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Takımı bulunmayan oyuncular listelenemedi:', error);
        throw error;
      });;
  }

  getCandidateTeamLeaders(){
    return axios
      .get(API_URL + '/candidateTeamLeaders' , {headers : authHeader()})
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Aday takım sorumluları listesi getirilemedi.:', error);
        throw error;
      });;
  }
  updateTeam(updatedTeamData) {
    const teamData = {
      teamId : updatedTeamData.teamId,
      teamName: updatedTeamData.teamName,
      teamLeadUserId: updatedTeamData.teamLeadUserId,
      playerIds: updatedTeamData.playerIds
    };

    return axios
      .put(API_URL + '/updateTeam' , teamData, { headers: authHeader() })
      .then(response => {
        console.log('Takım bilgileri güncellendi:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Takım bilgileri güncellenemedi:', error);
        throw error;
      });
  }


}


export default new TeamManagementService();
