<template>
  <div class="news-detail-container">
    <!-- Спиннер загрузки -->
    <n-spin v-if="loading" size="large" class="spinner" />

    <!-- Новость не найдена -->
    <n-empty
        v-else-if="error || !news"
        description="Новость не найдена"
        class="empty"
    >
      <template #extra>
        <n-button type="primary" @click="$router.go(-1)">
          ← Вернуться назад
        </n-button>
      </template>
    </n-empty>

    <!-- Сама новость -->
    <n-card v-else class="news-card" :bordered="false">
      <template #header>
        <div class="news-header">
          <n-text type="info" class="date">
            {{ formatDate(news.date) }}
          </n-text>
          <n-button text @click="$router.go(-1)">
            ← Назад
          </n-button>
        </div>
      </template>

      <h1 class="title">{{ news.name }}</h1>

      <div class="content" v-html="news.description || news.content"></div>
    </n-card>
  </div>
</template>

<script>
import {
  NCard,
  NButton,
  NEmpty,
  NSpin,
  NText
} from 'naive-ui'

import { getNewsById } from '@/client/api/client.js'
import dayjs from 'dayjs'

export default {
  name: 'NewsDetailView',

  components: {
    NCard,
    NButton,
    NEmpty,
    NSpin,
    NText
  },

  data() {
    return {
      news: null,
      loading: true,
      error: false
    }
  },

  async mounted() {
    await this.loadNews()
  },

  methods: {
    async loadNews() {
      this.loading = true
      this.error = false
      try {
        const id = this.$route.params.id
        this.news = await getNewsById(id)
      } catch (err) {
        console.error('Ошибка загрузки новости:', err)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    formatDate(date) {
      return dayjs(date).format('D MMMM YYYY, HH:mm')
    }
  },

  watch: {
    '$route.params.id'(newId, oldId) {
      if (newId !== oldId) this.loadNews()
    }
  }
}
</script>

<style scoped>
.news-detail-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.spinner {
  margin: 120px auto;
  text-align: center;
}

.empty {
  margin: 120px auto;
  text-align: center;
}

.news-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.date {
  font-size: 15px;
  font-weight: 500;
}

.title {
  margin: 32px 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #1a1a1a;
}

.content {
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}

.content :deep(p) { margin-bottom: 20px; }
.content :deep(img) { max-width: 100%; border-radius: 12px; margin: 24px 0; }
.content :deep(h2),
.content :deep(h3) { margin: 32px 0 16px; font-weight: 600; }
</style>
