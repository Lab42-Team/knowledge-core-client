<template>
  <n-card title="Просмотр новости" size="medium" :bordered="true" class="news-card">
    <n-space v-if="news" vertical size="large" class="news-content">
      <n-text class="field"><strong>Id:</strong> {{ news.id }}</n-text>
      <n-text class="field"><strong>Название:</strong> {{ news.name }}</n-text>
      <n-text class="field"><strong>Описание:</strong> {{ news.description }}</n-text>
      <n-text class="field"><strong>Статус:</strong> {{ news.status }}</n-text>
      <n-text class="field"><strong>Дата:</strong> {{ news.date }}</n-text>
    </n-space>
  </n-card>
</template>

<script>
import { getNewsById } from '@/admin/api/news';
import { NCard, NSpace, NText } from 'naive-ui';

export default {
  name: 'NewsShow',

  components: {
    NCard,
    NSpace,
    NText,
  },

  data() {
    return {
      news: null,
    };
  },

  async mounted() {
    await this.getNewsItem(this.$route.params.id);
  },

  methods: {
    async getNewsItem(id) {
      this.isLoading = true;
      try {
        this.news = await getNewsById(id);
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    },
  },
};
</script>

<style scoped>
.news-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-card :deep(.n-card-header) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #d4edda;
  color: #2d7a4b;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #2d7a4b;
}

.news-card :deep(.n-card__content) {
  padding: 16px;
  //background-color: #f2fdf2;
}

.field {
  color: #2d7a4b;
  font-size: 14px;
  line-height: 1.5;
}

.news-content {
  padding: 0 8px;
}

</style>
