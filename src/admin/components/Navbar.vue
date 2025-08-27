<template>
  <n-layout-header bordered class="header">
    <div class="header-content">
      <n-space align="center">
        <n-menu
            mode="horizontal"
            :options="menuItems"
            :value="activeItems"
            @update:value="selectMenuItem"
            class="menu"
        />
      </n-space>

      <n-button type="error" @click="btnLogout">
        <template #icon>
          <i class="bi bi-door-open"></i>
        </template>
        Выход
      </n-button>
    </div>
  </n-layout-header>
</template>

<script>
import { NLayoutHeader, NSpace, NMenu, NButton } from 'naive-ui';
import { logout } from '@/client/api/auth';
import { h } from 'vue';
import { RouterLink } from 'vue-router';

export default {
  name: 'NavbarComponent',

  components: {
    NLayoutHeader,
    NSpace,
    NMenu,
    NButton,
  },

  data() {
    return {
      activeItems: this.$route.name, // Активный пункт меню, инициализируется текущим маршрутом
      menuItems: [
        {
          label: () => h(RouterLink, { to: { name: 'dashboard' } }, { default: () => 'Главная' }),
          key: 'dashboard',
        },
        {
          label: () => h(RouterLink, { to: { name: 'NewsList' } }, { default: () => 'Новости' }),
          key: 'NewsList',
        },
        {
          label: 'В Клиент',
          key: 'client',
        },
      ],
    };
  },

  watch: {
    // Отслеживание изменений маршрута для обновления активного пункта меню
    '$route.name'(newName) {
      this.activeItems = newName;
    },
  },

  methods: {
    // Обработчик выбора пункта меню
    selectMenuItem(key) {
      if (key === 'client') {
        window.location.href = '/'; // Перенаправление на главную страницу
      } else {
        this.$router.push({ name: key }); // Навигация к маршруту по имени
      }
    },

    // Обработчик выхода
    async btnLogout() {
      await logout(); // Вызов API-функции для выполнения выхода
      localStorage.removeItem('token'); // Удаление токена авторизации
      window.location.href = '/login'; // Перенаправление на страницу входа
    },
  },
};
</script>
