<template>
  <n-card :title="cardTitle" size="medium" :bordered="true">

    <!-- Хлебные крошки -->
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/"><i class="bi bi-house"></i> {{ $t('PAGE.HOME') }}</router-link>
      </n-breadcrumb-item>

      <!-- Перебор массива breadcrumbRoutes и создание элемента для каждой crumb -->
      <n-breadcrumb-item v-for="(route, index) in breadcrumbRoutes" :key="index">
        <!-- Если есть путь (route.path) и не последний элемент в цепочке (index < breadcrumbRoutes.length - 1) то создание ссылки через <router-link> -->
        <router-link v-if="route.to && index < breadcrumbRoutes.length - 1" :to="route.to">
          {{ route.name }}
        </router-link>
        <!-- Иначе (если нет path или это последний элемент) вывод текста без ссылки -->
        <span v-else class="current-element">{{ route.name }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Основные данные -->
    <router-view />
  </n-card>
</template>

<script>
import { NCard, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'

export default {
  name: "ProjectLayout",
  components: {
    NCard,
    NBreadcrumb,
    NBreadcrumbItem
  },

  computed: {
    cardTitle() {
      const titles = {
        ProjectTeam: this.$t('PAGE.PROJECTS.TEAM'),
        ProjectShowUser: this.$t('PAGE.PROJECTS.VIEW_USER'),
        ProjectEditTeam: this.$t('PAGE.PROJECTS.EDIT_TEAM'),
      };

      // Если текущий маршрут есть в titles — берём его, иначе — общий
      return titles[this.$route.name] || this.$t('PAGE.PROJECTS.NAME');
    },

    breadcrumbRoutes() {
      // Получение текущих маршрутов из $route.matched
      const routes = this.$route.matched
          .filter(route => route.name !== 'ProjectList') // Пропуск ProjectList
          .map((route, index, array) => {
            let name = this.$t(route.meta.breadcrumb); // Перевод ключа из meta.breadcrumb

            // Динамические имена
            if (route.name === 'ProjectShow') {
              name = `${this.$t('PAGE.PROJECTS.VIEW')} №${this.$route.params.id}`;
            } else if (route.name === 'ProjectEdit') {
              name = `${this.$t('PAGE.PROJECTS.EDIT')} №${this.$route.params.id}`;
            } else if (route.name === 'ProjectTeam') {
              name = `${this.$t('PAGE.PROJECTS.TEAM')} №${this.$route.params.id}`;
            } else if (route.name === 'ProjectShowUser') {
                name = `${this.$t('PAGE.PROJECTS.VIEW_USER')} №${this.$route.params.id_user}`;
            } else if (route.name === 'ProjectEditTeam') {
              name = `${this.$t('PAGE.PROJECTS.EDIT_TEAM')}`;
            } else if (route.name === 'AddProject') {
              name = this.$t('PAGE.PROJECTS.CREATE');
            }

            // to = null (последний элемент)
            const isLast = index === array.length - 1;
            const to = isLast ? null : (
                route.path.includes(':id') || route.path.includes(':id_user')
                    ? { name: route.name, params: this.$route.params }
                    : { path: route.path }
            );

            return { name, to };
          });

      return routes;
    }
  }
}
</script>
