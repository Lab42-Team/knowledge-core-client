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
