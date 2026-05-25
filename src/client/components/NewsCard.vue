<template>
  <div :class="['news-item', viewMode]">

    <div class="news-icon">
      <font-awesome-icon icon="newspaper" />
    </div>

    <div class="news-content">
      <div class="news-item-date">{{ formatDate(newsItem.date) }}</div>
      <h3 class="news-item-title">{{ newsItem.name }}</h3>
      <p class="news-item-description">{{ newsItem.description }}</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
    validator: (item) => {
      return item && typeof item.name === 'string' && typeof item.description === 'string'
    }
  },
  viewMode: {
    type: String,
    default: 'tile',
    validator: (value) => ['tile', 'simple'].includes(value)
  }
})

const formattedDate = computed(() => {
  if (!props.newsItem.date) return ''

  const date = new Date(props.newsItem.date)

  if (isNaN(date.getTime())) return ''

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const formatDate = (dateString) => formattedDate.value
</script>

<style scoped>
/* =======================================================
   1. БАЗОВЫЕ СТИЛИ КАРТОЧКИ
   ======================================================= */
.news-item {
  background: var(--bg-projects);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px var(--shadow-dim);
  transition: background 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--bg-light);
  position: relative;
  will-change: transform;
}

.news-item:hover {
  box-shadow: 0 0 10px 2px var(--shadow-bright);
  background: var(--bg-dim);
  border-color: var(--bg-bright);
}

/* =======================================================
   2. ДЕКОРАТИВНАЯ ИКОНКА
   ======================================================= */
.news-icon {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 80px;
  color: var(--bg-light);
  pointer-events: none;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-item:hover .news-icon {
  color: var(--bg-bright);
  opacity: 0.12;
  transform: rotateY(360deg);
  transition: transform 0.5s ease-in-out;
}

/* =======================================================
   3. РЕЖИМЫ ОТОБРАЖЕНИЯ (tile / simple)
   ======================================================= */
/* === Плитка === */
.news-item.tile {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
}

.news-item.tile .news-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  min-height: 150px;
}

/* === Список === */
.news-item.simple {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 140px;
}

.news-item.simple .news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  min-height: 100px;
}

/* =======================================================
   4. СОДЕРЖИМОЕ КАРТОЧКИ (заголовок, дата, описание)
   ======================================================= */
.news-item-date,
.news-item-title {
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
}

.news-item-date {
  margin-left: auto;
  font-size: 1rem;
  color: var(--text-basic);
  margin-bottom: 8px;
  transform: translateY(0);
}

.news-item-title {
  font-size: 2rem;
  line-height: 1.4;
  margin: 0 0 12px 0;
  color: var(--text-basic);
  font-weight: 600;
  transform: translateY(0);
}

/* === Описание (скрыто по умолчанию) === */
.news-item-description {
  color: var(--text-basic);
  font-size: 1.5rem;
  line-height: 1.5;
  overflow-wrap: break-word;

  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow-y: auto;
  margin: 0;
  padding: 20px;
  background: inherit;
  border-radius: inherit;
  z-index: 1;

  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
}

/* =======================================================
   5. HOVER-ЭФФЕКТЫ (взаимодействие)
   ======================================================= */
.news-item:hover .news-item-date,
.news-item:hover .news-item-title {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
}

.news-item:hover .news-item-description {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Специфика для плитки при hover */
.news-item.tile:hover .news-item-description {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-dim);
}

/* =======================================================
   6. КАСТОМНЫЙ СКРОЛЛБАР
   ======================================================= */
.news-item-description::-webkit-scrollbar {
  width: 6px;
}

.news-item-description::-webkit-scrollbar-track {
  background: var(--bg-scrollbar-first);
  border-radius: 3px;
}

.news-item-description::-webkit-scrollbar-thumb {
  background: var(--bg-scrollbar-second);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.news-item-description::-webkit-scrollbar-thumb:hover {
  background: var(--bg-scrollbar-third);
}
</style>
