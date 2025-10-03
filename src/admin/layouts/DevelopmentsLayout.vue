<template>
  <n-card :title="$t('PAGE.DEVELOPMENTS.NAME')" size="medium" :bordered="true">

    <!-- Хлебные крошки -->
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/"><i class="bi bi-house"></i> {{ $t('PAGE.HOME') }}</router-link>
      </n-breadcrumb-item>

      <!-- Перебор массива breadcrumbRoutes и создание элемента для каждой crumb -->
      <n-breadcrumb-item v-for="(route, index) in breadcrumbRoutes" :key="index">
        <!-- Если есть путь (route.path) и не последний элемент в цепочке (index < breadcrumbRoutes.length - 1) то создание ссылки через <router-link> -->
        <router-link v-if="route.path && index < breadcrumbRoutes.length - 1" :to="route.to">
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
  name: "DevelopmentsLayout",
  components: {
    NCard,
    NBreadcrumb,
    NBreadcrumbItem
  },

  computed: {
    breadcrumbRoutes() {
      // Получение текущих маршрутов из $route.matched
      const routes = this.$route.matched
          .filter(route => route.name !== 'DevelopmentsList') // Пропуск DevelopmentsList
          .map((route) => {
            let name = this.$t(route.meta.breadcrumb); // Перевод ключа из meta.breadcrumb
            if (route.name === 'DevelopmentsShow') {
              name = `${this.$t('PAGE.DEVELOPMENTS.VIEW')} №${this.$route.params.id}`;
            } else if (route.name === 'DevelopmentsEdit') {
              name = `${this.$t('PAGE.DEVELOPMENTS.EDIT')} №${this.$route.params.id}`;
            } else if (route.name === 'AddDevelopments') {
              name = this.$t('PAGE.DEVELOPMENTS.CREATE');
            }
            return {
              name,
              path: route.path.includes(':id') ? null : route.path,
              to: route.path.includes(':id')
                  ? { name: route.name, params: this.$route.params }
                  : { path: route.path },
            };
          });

      return routes;
    }
  }
}
</script>
