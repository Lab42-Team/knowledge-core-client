import api from '@/client/api/axios' // импорт заранее настроенного axios-инстанса

//получение списка новостей
export const getProject = async () => {
    try {
        const response = await api.get('/v1/project');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

//создание новости
export const createProject = async (project) => {
    try {
        const response = await api.post('/v1/project', project);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

//просмотр новости
export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/v1/project/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
};

//редактирование новости
export const updateProject = async (id, project) => {
    try {
        const response = await api.patch(`/v1/project/${id}`, project);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error;
    }
};

//удаление новости
export const deleteProject = async (id) => {
    try {
        await api.delete(`/v1/project/${id}`);
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};

export const getProjectStatuses = async () => {
    try {
        const response = await api.get(`/v1/project/get-statuses`);
        return response.data.statuses;
    } catch (error) {
        console.error('Ошибка получения статусов:', error);
        throw error;
    }
};

export const getProjectTypes = async () => {
    try {
        const response = await api.get(`/v1/project/get-types`);
        return response.data.types;
    } catch (error) {
        console.error('Ошибка получения типов:', error);
        throw error;
    }
};
