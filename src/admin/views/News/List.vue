<template>
  <n-space vertical size="large">
    <n-button type="primary" @click="goToNewsCreate">
      Создать новость
    </n-button>
    <n-card size="medium" :bordered="true" class="news-card">
      <news-table :news="news" @news-load="loadNews"/>
    </n-card>
  </n-space>
</template>

<script>
import { getNews } from '@/admin/api/news';
import NewsTable from './Table.vue';
import { NButton, NCard, NSpace } from 'naive-ui';

export default {
  name: "NewsList",

  components: {
    NewsTable,
    NButton,
    NCard,
    NSpace,
  },

  data() {
    return {
      news: [],
    };
  },

  mounted() {
    this.loadNews();
  },

  methods: {
    async loadNews() {
      try {
        this.news = await getNews();
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },

    goToNewsCreate() {
      this.$router.push('/news/create');
    }
  }
}
</script>

<style scoped>

.news-card {
  background-color: #ffffff; /* Фон*/
  border-radius: 8px; /* Углы */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Тень */
}

:deep(.ant-table-wrapper) {
  background-color: #ffffff;/* Фон*/
  border-radius: 8px;/* Углы */
  overflow: hidden;/* Скрытие переполнения */
}

:deep(.ant-table) {
  background-color: #ffffff;/* Фон*/
}
</style>
