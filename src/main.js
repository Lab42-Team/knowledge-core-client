import { createApp } from 'vue';

// Функция для динамической загрузки CSS
const loadStyles = async (isAdmin) => {
    if (isAdmin) {
        await import('./styles/admin.css'); // Динамический импорт CSS для админки
        document.body.classList.add('admin');
    } else {
        await import('./styles/client.css'); // Динамический импорт CSS для клиента
        document.body.classList.add('client');
    }
};

const isAdmin = location.pathname.startsWith('/admin');  // Проверяем, находится ли пользователь в админке

const loadApp = async () => {
    try {
        // Загружаем стили
        await loadStyles(isAdmin);
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
