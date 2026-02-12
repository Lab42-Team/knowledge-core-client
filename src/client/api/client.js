import api from './axios'

export const getLatestNews = async (limit = 10) => {
    try {
        const { data: news } = await api.get('/v1/news');

        return news
            .filter(item => item.status === 0)                  // только с status = 0
            .sort((a, b) => b.date.localeCompare(a.date))       // от новой к старой
            .slice(0, limit);                                   // последние limit штук

    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const { data: projects } = await api.get('/v1/project');
        return projects
            .filter(item => item.type === 0)                     // только с type = 0
    } catch (error) {
        console.error('Ошибка получения данных:', error);
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


export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/v1/news/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении новости по id:', error);
        throw error;
    }
}






