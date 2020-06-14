import axios from 'axios';

const api = axios.create({
    baseURL: 'https://musicas-backend.herokuapp.com'
});

export default api; 