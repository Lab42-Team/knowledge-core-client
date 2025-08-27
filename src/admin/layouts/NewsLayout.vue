<template>
  <n-card title="Новости" size="medium" :bordered="true">

    <!-- Хлебные крошки -->
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/"><i class="bi bi-house"></i> Главная</router-link>
      </n-breadcrumb-item>

      <!-- Перебор массива breadcrumbRoutes и создание элемента для каждой crumb -->
      <n-breadcrumb-item v-for="(route, index) in breadcrumbRoutes" :key="index">
        <!-- Если есть путь (route.path) и не последний элемент в цепочке (index < breadcrumbRoutes.length - 1) то создание ссылки через <router-link> -->
        <router-link v-if="route.path && index < breadcrumbRoutes.length - 1" :to="route.path">
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
  name: "NewsLayout",
  components: {
    NCard,
    NBreadcrumb,
    NBreadcrumbItem
  },

  computed: {
    breadcrumbRoutes() {
      // Получение текущих маршрутов из $route.matched
      const routes = this.$route.matched
          .filter(route => route.name !== 'NewsList') // Пропуск NewsList
          .map((route) => {
            let name = route.meta.breadcrumb || route.name || 'Без названия';
            // Для динамических маршрутов
            if (route.name === 'NewsShow') {
              name = `Просмотр новости №${this.$route.params.id}`;
            } else if (route.name === 'NewsEdit') {
              name = `Редактировать новость №${this.$route.params.id}`;
            }
            return {
              name,
              path: route.path.includes(':id') ? null : route.path
            };
          });

      return routes;
    }
  }

}
</script>
