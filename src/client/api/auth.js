import api from './axios'

export const login = async (data) => {
    try {
        const response = await api.post('/auth/login', data)
        const token = response.data.access_token
        localStorage.setItem('token', token)
        return response.data
    } catch (error) {
        console.error('Login error:', error)
        throw error.response?.data || { message: 'Login failed' }
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        localStorage.removeItem('token')
        return response.data
    } catch (error) {
        console.error('Logout error:', error)
        throw error.response?.data || { message: 'Logout failed' }
    }
}

//export const refresh = async () => {
//    try {
//        const response = await api.post('/auth/refresh')
//        const newToken = response.data.access_token
//        localStorage.setItem('token', newToken)
//        return response.data
//    } catch (error) {
//        console.error('Token refresh error:', error)
//        throw error.response?.data || { message: 'Token refresh failed' }
//    }
//}

export const getUser = async () => {
    try {
        const response = await api.get('/auth/me')
        return response.data
    } catch (error) {
        console.error('Get user error:', error)
        throw error.response?.data || { message: 'Failed to fetch user' }
    }
}


