<template>
  <div>
    <button type="button" class="btn btn-primary" @click="goToNewsCreate">Создать новость</button>
  </div>

  <div class="card-body">
    <NewsTable :news="news" />
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


/* Стили для тела */
.card-body {
  padding: 20px;
}

</style>
