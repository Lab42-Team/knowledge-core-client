import axios from 'axios';

const API_URL = 'http://127.0.0.9/api/v1/news'; // Заменить на свой API URL

//получение списка новостей
export const getNews = async () => {
    try {
        const response = await axios.get(API_URL);
        const news = response.data;

        // Запрашиваем названия статусов и добавляем их к новостям
        const newsStatusName = await Promise.all(
            news.map(async (item) => {
                const statusName = await getNewsStatusName(item.status);
                return { ...item, statusName };
            })
        );

        return newsStatusName;

    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

//создание новости
export const createNews = async (news) => {
    try {
        const response = await axios.post(API_URL, news);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

//просмотр новости
export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
};

//редактирование новости
export const updateNews = async (id, news) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, news);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error;
    }
};

//удаление новости
export const deleteNews = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};

export const getNewsStatuses = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-statuses`);
        return response.data.statuses;
    } catch (error) {
        console.error('Ошибка получения статусов:', error);
        throw error;
    }
};

export const getNewsStatusName = async (status) => {
    try {
        const response = await axios.get(`${API_URL}/get-status-name/${status}`);
        return response.data.statusName;
    } catch (error) {
        console.error('Ошибка получения статусов:', error);
        throw error;
    }
};
