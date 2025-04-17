import axios from 'axios';

const API_URL = 'http://127.0.0.9/api/auth'; // Заменить на свой API URL

const API = axios.create({
    baseURL: API_URL,
})

// Добавление токена авторизации ко всем запросам
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = async (data) => {
    try {
        const response = await API.post('/login', data)
        return response.data
    } catch (error) {
        console.error('Login error:', error)
        throw error.response?.data || { message: 'Login failed' }
    }
}

export const logout = async () => {
    try {
        const response = await API.post('/logout')
        return response.data
    } catch (error) {
        console.error('Logout error:', error)
        throw error.response?.data || { message: 'Logout failed' }
    }
}

export const refresh = async () => {
    try {
        const response = await API.post('/refresh')
        return response.data
    } catch (error) {
        console.error('Token refresh error:', error)
        throw error.response?.data || { message: 'Token refresh failed' }
    }
}

export const getUser = async () => {
    try {
        const response = await API.get('/me')
        return response.data
    } catch (error) {
        console.error('Get user error:', error)
        throw error.response?.data || { message: 'Failed to fetch user' }
    }
}


