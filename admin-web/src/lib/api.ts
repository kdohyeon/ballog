import axios from 'axios';
import { Game } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
});

export const crawlSchedule = async (startDate: string, endDate: string) => {
    const response = await api.post(`/admin/crawl/schedule`, null, {
        params: { startDate, endDate },
    });
    return response.data;
};

export const fetchMonthlyGames = async (year: number, month: number): Promise<Game[]> => {
    const response = await api.get('/games/monthly', {
        params: { year, month },
    });
    return response.data;
};

export default api;
