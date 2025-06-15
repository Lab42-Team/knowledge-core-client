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
        const response = await getUser();
        this.user = response; // Сохранить данные
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
      }
    },

  }
}
</script>

<style scoped>

</style>
