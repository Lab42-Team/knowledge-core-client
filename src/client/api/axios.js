import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.9/api',
})

// Добавим токен перед каждым запросом
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Перехват ошибки 401 и обновление токена
api.interceptors.response.use(
    res => res, // Если ответ успешен то возвращаем его
    async error => {
        const originalRequest = error.config // Сохраняем исходный запрос

        // Проверка есть ли ошибка 401 и запрос еще не был повторен
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Устанавливка флага чтобы не повторять бесконечно
            try {
                // Обновление токена через /auth/refresh
                const refreshResponse = await api.post('/auth/refresh', {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Передача текущего токена
                    }
                })

                // Сохранение нового токена в localStorage
                const newToken = refreshResponse.data.access_token
                localStorage.setItem('token', newToken)

                // Добавление нового токена в заголовки исходного запроса
                originalRequest.headers.Authorization = `Bearer ${newToken}`

                // Повтор исходного запроса с новым токеном
                return api(originalRequest)
            } catch (refreshError) {
                // Если обновление токена не удалось — очищаем токен и перенаправляем на логин
                localStorage.removeItem('token')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        // Если ошибка не 401 или запрос уже повторялся — пробрасываем ошибку дальше
        return Promise.reject(error)
    }
)

export default api


