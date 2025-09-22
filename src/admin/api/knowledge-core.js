import api from '@/client/api/axios' // импорт заранее настроенного axios-инстанса

//получение данных
export const getKnowledgeCore = async () => {
    try {
        const response = await api.get('/v1/knowledge-core');
        return response.data;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        throw error;
    }
};


//редактирование данных
export const updateKnowledgeCore = async (id, knowledge_core) => {
    try {
        const response = await api.patch(`/v1/knowledge-core/${id}`, knowledge_core);
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании данных:', error);
        throw error;
    }
};
