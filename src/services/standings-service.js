import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/standings';


class StandingsService {
    

    getStandings = (tournamentId) => {
        return axios
            .get(API_URL, { params: { tournamentId: tournamentId }, headers: authHeader() })
            .then(response => {
                console.log(response.data)
            return response.data;
            })
            .catch(error => {
                console.error('Maçlar alınamadı:', error);
            });
    }
    


}


export default new StandingsService();
