import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/matches';


class MatchService {
    
    createMatches(teamIds) {
        return new Promise((resolve, reject) => {
          axios.post(API_URL + '/create', teamIds, { headers: authHeader() })
            .then(response => {
              console.log('Maçlar oluşturuldu:', response);
              resolve(response); // Promise'ı tamamlanmış (fulfilled) olarak işaretle
            })
            .catch(error => {
              console.error('Maçlar oluşturulamadı:', error);
              reject(error); // Promise'ı reddedilmiş (rejected) olarak işaretle
            });
        });
      }


}


export default new MatchService();
