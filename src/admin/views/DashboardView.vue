<template>
  <n-card title="Заголовок" size="medium" :bordered="true" class="news-card">
    <h2>Добро пожаловать в админку</h2>
  </n-card>
</template>

<script>
import {getUser} from '@/client/api/auth'
import {NCard} from "naive-ui";

export default {
  name: "DashboardView",
  components: {NCard},

  mounted() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      try {
        const token = localStorage.getItem('token');
        console.log('Токен:', token);
        if (!token) {
          console.warn('Токен отсутствует, перенаправление на логин');
          // Перенаправление на клиентский /login
          window.location.href = '/login'; // Используем window.location, так как это клиентский маршрут
          return;
        }
        const response = await getUser();
        this.user = response;
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
      }
    },

  }
}
</script>

<style scoped>

</style>
