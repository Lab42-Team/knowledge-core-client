import api from '@/client/api/axios' // импорт заранее настроенного axios-инстанса

//получение списка новостей
export const getUser = async () => {
    try {
        const response = await api.get('/v1/users');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

//создание новости
export const createUser = async (user) => {
    try {
        const response = await api.post('/v1/users', user);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

//просмотр новости
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/v1/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
};

//редактирование новости
export const updateUser = async (id, user) => {
    try {
        const response = await api.patch(`/v1/users/${id}`, user);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error;
    }
};

//удаление новости
export const deleteUser = async (id) => {
    try {
        await api.delete(`/v1/users/${id}`);
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};

export const getUserStatuses = async () => {
    try {
        const response = await api.get(`/v1/users/get-statuses`);
        return response.data.statuses;
    } catch (error) {
        console.error('Ошибка получения статусов:', error);
        throw error;
    }
};

export const getUserRoles = async () => {
    try {
        const response = await api.get(`/v1/users/get-roles`);
        return response.data.roles;
    } catch (error) {
        console.error('Ошибка получения ролей:', error);
        throw error;
    }
};
