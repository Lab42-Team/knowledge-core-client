import api from '@/client/api/axios' // импорт заранее настроенного axios-инстанса

//получение списка новостей
export const getNews = async () => {
    try {
        const response = await api.get('/v1/news');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

//создание новости
export const createNews = async (news) => {
    try {
        const response = await api.post('/v1/news', news);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

//просмотр новости
export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/v1/news/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
};

//редактирование новости
export const updateNews = async (id, news) => {
    try {
        const response = await api.patch(`/v1/news/${id}`, news);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error;
    }
};

//удаление новости
export const deleteNews = async (id) => {
    try {
        await api.delete(`/v1/news/${id}`);
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};

export const getNewsStatuses = async () => {
    try {
        const response = await api.get(`/v1/news/get-statuses`);
        return response.data.statuses;
    } catch (error) {
        console.error('Ошибка получения статусов:', error);
        throw error;
    }
};

