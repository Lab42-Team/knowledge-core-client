<template>

  <div class="card">

    <div class="card-header">
      Новости
    </div>

    <div>
      <button type="button" class="btn btn-primary" @click="goToNewsCreate">Создать новость</button>
    </div>

    <div class="card-body">
      <NewsTable :news="news" />
    </div>
  </div>

</template>

<script>

import { getNews } from '@/admin/api/news';
import NewsTable from '@/admin/components/News/Table.vue';

export default {
  name: "NewsList",

  components: {
    NewsTable,
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
      this.news = await getNews();
    },

    goToNewsCreate() {
      this.$router.push('/news/create');
    }
  }
}
</script>

<style scoped>
/* Общие стили*/
.card {
  width: 100%;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
}

/* Стили для заголовка */
.card-header {
  background-color: #d4edda;
  color: #2d7a4b;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}

/* Стили для тела */
.card-body {
  padding: 20px;
}

</style>
