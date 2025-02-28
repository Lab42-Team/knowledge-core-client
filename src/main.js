import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// Импорт CSS Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';

const isAdmin = location.pathname.startsWith('/admin');  // Проверяем, находится ли пользователь в админке

const loadApp = async () => {
    try {
        // Загружаем компоненты
        const { default: App } = await import(isAdmin ? './admin/app.vue' : './client/app.vue');
        // Загружаем маршруты
        const { default: router } = await import(isAdmin ? './admin/router' : './client/router');

        // Устанавливаем базовый путь для админки или клиента
        const historyBase = isAdmin ? '/admin' : '/';

        // Создаем приложение
        const app = createApp(App);

        // Используем роутер с правильным базовым путем
        app.use(router);

        // Монтируем приложение в элемент с id="app"
        app.mount('#app');
    } catch (error) {
        console.error('Ошибка при загрузке приложения:', error);
    }
};

loadApp();  // Загружаем и монтируем нужное приложение
