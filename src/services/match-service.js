import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/matches';


class MatchService {
    
    createMatches(tournamentId,teamIds) {
        return new Promise((resolve, reject) => {
          const data = {
            tournamentId: tournamentId,
            teamIds: teamIds
          };

          axios.post(API_URL + '/create', data, { headers: authHeader() })
            .then(response => {
              console.log('Maçlar oluşturuldu:', response);
              resolve(response); 
            })
            .catch(error => {
              console.error('Maçlar oluşturulamadı:', error);
              reject(error); 
            });
        });
      }
     
      getMatchesByTournament = (tournamentId) => {
        return new Promise((resolve, reject) => {
          axios
            .get(API_URL + `/tournament/${tournamentId}`, { headers: authHeader() })
            .then(response => {
              console.log(response.data);
              resolve(response.data); 
            })
            .catch(error => {
              console.error('Maçlar alınamadı:', error);
              reject(error); 
            });
        });
      };

      saveMatchResult = (matchId, result) => {
        const data = {
          matchId: matchId,
          result: result
        };
      
        return axios.post(API_URL + '/save', data, { headers: authHeader() })
          .then(response => {
            console.log('Sonuçlar kaydedildi:', response.data);
            return response.data;
          })
          .catch(error => {
            console.error('Sonuçlar kaydedilemedi:', error);
            throw error;
          });
      }

}


export default new MatchService();
