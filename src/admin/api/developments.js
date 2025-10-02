import api from '@/client/api/axios' // импорт заранее настроенного axios-инстанса

//получение списка новостей
export const getDevelopments = async () => {
    try {
        const response = await api.get('/v1/developments');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

//создание новости
export const createDevelopments = async (developments) => {
    try {
        const response = await api.post('/v1/developments', developments);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

//просмотр новости
export const getDevelopmentsById = async (id) => {
    try {
        const response = await api.get(`/v1/developments/${id}`);
        return response.data;

    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
};

//редактирование новости
export const updateDevelopments = async (id, developments) => {
    try {
        const response = await api.patch(`/v1/developments/${id}`, developments);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error;
    }
};

//удаление новости
export const deleteDevelopments = async (id) => {
    try {
        await api.delete(`/v1/developments/${id}`);
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};
