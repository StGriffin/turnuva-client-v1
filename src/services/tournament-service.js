import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/tournaments";
const API_URL_TEAMS = "http://localhost:8080/api/teams/";

class TournamentService {

    getAllTournaments() {
        return axios
          .get(API_URL , {headers : authHeader()})
          .then(response => {
            return response.data;
          });
      }

      createTournament = (tournamentData) => {
        return axios
          .post(API_URL + '/create', tournamentData, { headers: authHeader() })
          .then(response => {
            console.log('Turnuva oluşturuldu:', response);
            return response.data;
          })
          .catch(error => {
            console.error('Turnuva oluşturulamadı:', error);
            throw error;
          });
      }
      deleteTournament = (tournamentId) => {
        return axios
          .delete(API_URL + '/delete/' + tournamentId, { headers: authHeader() })
          .then(response => {
            console.log('Turnuva silindi:', response);
            return response.data;
          })
          .catch(error => {
            console.error('Turnuva silinemedi:', error);
            throw error;
          });
      }

      getAllAvailableTeams  = () => {
        return axios
          .get(API_URL_TEAMS + 'availableTeams', { headers: authHeader() })
          .then(response => {
            return response.data;
          })
          .catch(error => {
            console.error('Error retrieving teams:', error);
            throw error;
          });
      };

      updateTournament = (tournamentData) => {
        return axios
          .put(API_URL + '/updateTournament', tournamentData, { headers: authHeader() })
          .then(response => {
            console.log('Turnuva güncellendi:', response);
            return response.data;
          })
          .catch(error => {
            console.error('Turnuva güncellenemedi:', error);
            throw error;
          });
      }

      


//   login(userName, password) {
//     return axios
//       .post(API_URL + "signin", {
//         userName,
//         password
//       })
//       .then(response => {
//         if (response.data.accessToken) {
//           localStorage.setItem("user", JSON.stringify(response.data));
//         }

//         return response.data;
//       });
//   }

//   logout() {
//     localStorage.removeItem("user");
//   }

//   register(userName, fullName, password,age) {
//     return axios.post(API_URL + "signup", {
//       userName,
//       fullName,
//       password,
//       age
//     });
//   }

//   getCurrentUser() {
//     return JSON.parse(localStorage.getItem('user'));;
//   }
}

export default new TournamentService();