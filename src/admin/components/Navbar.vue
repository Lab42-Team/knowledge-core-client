<template>
  <n-layout-header bordered class="header">
    <div class="header-content">
      <n-space align="center">
        <n-menu mode="horizontal" :options="menuItems" :value="activeItems" @update:value="selectMenuItem" class="menu"/>
      </n-space>

      <div class="right-section">
        <n-select
            v-model:value="locale"
            :options="languageOptions"
            :render-label="renderLabel"
            :render-tag="renderTag"
            @update:value="changeLanguage"
            class="language-select"
            size="medium"
        />

        <n-button type="error" @click="btnLogout">
          <template #icon>
            <i class="bi bi-door-open"></i>
          </template>
          {{ $t('BUTTON.LOGOUT') }}
        </n-button>
      </div>
    </div>
  </n-layout-header>
</template>

<script>
import { NLayoutHeader, NSpace, NMenu, NButton, NSelect } from 'naive-ui';
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
    NSelect
  },

  data() {
    return {
      activeItems: this.$route.name, // Активный пункт меню, инициализируется текущим маршрутом
      locale: this.$i18n.locale,
      languageOptions: [
        { label: 'English', value: 'en', flag: 'us' },
        { label: 'Русский', value: 'ru', flag: 'ru' }
      ],
      menuItems: [
        {
          label: () => h(RouterLink, { to: { name: 'dashboard' } }, { default: () => this.$t('MENU.HOME') }),
          key: 'dashboard',
        },
        {
          label: () => h(RouterLink, { to: { name: 'KnowledgeCoreShow' } }, { default: () => this.$t('MENU.KNOWLEDGE_CORE') }),
          key: 'KnowledgeCoreShow',
        },
        {
          label: () => h(RouterLink, { to: { name: 'NewsList' } }, { default: () => this.$t('MENU.NEWS') }),
          key: 'NewsList',
        },
        {
          label: () => h(RouterLink, { to: { name: 'DevelopmentsList' } }, { default: () => this.$t('MENU.DEVELOPMENTS') }),
          key: 'DevelopmentsList',
        },
        {
          label: () => this.$t('MENU.CLIENT'),
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
    renderLabel(option) {
      return h('div', { class: 'language-label' }, [
        h('span', { class: `fi fi-${option.flag}` })
      ]);
    },
    renderTag({ option }) {
      return h('span', { class: `fi fi-${option.flag} language-tag` });
    },
    // Обработчик выбора пункта меню
    selectMenuItem(key) {
      if (key === 'client') {
        window.location.href = '/'; // Перенаправление на главную страницу
      } else {
        this.$router.push({ name: key }); // Навигация к маршруту по имени
      }
    },

    changeLanguage() {
      this.$i18n.locale = this.locale;
      localStorage.setItem('locale', this.locale);
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
