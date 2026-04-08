<template>
  <div :class="['news-item', viewMode]">
    <!-- Для изображения -->
    <!-- <img -->
    <!--v-if="newsItem.image" -->
    <!--    :src="newsItem.image" -->
    <!--alt="Новость" -->
    <!--class="news-image" -->
    <!-- /> -->

    <!-- Контент -->
    <div class="news-content">
      <div class="news-item-date">{{ formatDate(newsItem.date) }}</div>

      <h3 class="news-item-title">{{ newsItem.name }}</h3>

      <p class="news-item-description">
        {{ newsItem.description }}
      </p>

      <a href="#" class="read-more">Читать полностью →</a>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  newsItem: { type: Object, required: true },
  viewMode: { type: String, default: 'tile' }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.news-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.news-item:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

/* === Режим Плитка (tile) === */
.news-item.tile {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.news-item.tile .news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-item.tile .news-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* === Режим Список (simple) === */
.news-item.simple {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.news-item.simple .news-image {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.news-item.simple .news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Общие стили */
.news-item-date {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 8px;
}

.news-item-title {
  font-size: 1.25rem;
  line-height: 1.4;
  margin: 0 0 12px 0;
  color: #222;
  font-weight: 600;
}

.news-item-description {
  flex: 1;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  color: #0066ff;
  font-weight: 500;
  text-decoration: none;
  align-self: flex-start;
}

.read-more:hover {
  text-decoration: underline;
}
</style>
