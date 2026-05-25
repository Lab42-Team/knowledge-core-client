import { createApp } from 'vue';

import 'swiper/css'
import 'swiper/css/navigation'     // для стрелок
import 'swiper/css/pagination'     // для точек пагинации

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
        // Загрузка стилей
        await loadStyles(isAdmin);
        // Загружаем компоненты
        const { default: App } = await import(isAdmin ? './admin/app.vue' : './client/app.vue');
        // Загружаем маршруты
        const { default: router } = await import(isAdmin ? './admin/router' : './client/router');
        // Загрузка переводов
        const { default: i18n } = await import(isAdmin ? './admin/lang' : './client/lang');

        // Устанавливаем базовый путь для админки или клиента
        const historyBase = isAdmin ? '/admin' : '/';

        // Создаем приложение
        const app = createApp(App);

        // Используем роутер с правильным базовым путем
        app.use(router);
        // Используем нужный перевод
        app.use(i18n);

        // Подключение иконок Font Awesome
        const { library } = await import('@fortawesome/fontawesome-svg-core');
        const { FontAwesomeIcon } = await import('@fortawesome/vue-fontawesome');

        // Добавление нужных иконок
        // Добавление админке
        if (isAdmin) {
            const {
                faCog,
                faUsers,
                faHome,
                faSignOutAlt,
                faBell,
                faChartBar,
            } = await import('@fortawesome/free-solid-svg-icons');
            library.add(faCog, faUsers, faHome, faSignOutAlt, faBell, faChartBar);
        // Добавление клиенту
        } else {
            const {
                faSun,
                faMoon,
                faSignInAlt,
                faAngleRight,
                faAngleLeft,
                faNewspaper,
                //faUser,
                //faHome,
                //faBars,
                //faTimes,
                //faSearch,
                //faHeart,
                //faShoppingCart
            } = await import('@fortawesome/free-solid-svg-icons');
            library.add(faSun, faMoon, faSignInAlt, faAngleRight, faAngleLeft, faNewspaper);
        }

        // Глобальная регистрация компонента
        app.component('font-awesome-icon', FontAwesomeIcon);

        // Монтируем приложение в элемент с id="app"
        app.mount('#app');
    } catch (error) {
        console.error('Ошибка при загрузке приложения:', error);
    }
};

loadApp();  // Загружаем и монтируем нужное приложение
