import axios from 'axios';


const BASE_URL = 'http://localhost:8000/api';


export default async function handler(req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/data`); // Adjust the URL
        const data = response.data
        return data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
