<template>
  <div class="wrapper">

    <div class="header">
      <h2>Все новости</h2>

      <!-- Переключатель режимов -->
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'tile' }" @click="viewMode = 'tile'">
          Плитка
        </button>
        <button :class="{ active: viewMode === 'simple' }" @click="viewMode = 'simple'">
          Список
        </button>
      </div>
    </div>

    <!-- Состояния -->
    <div v-if="loading" class="loading">Загрузка новостей...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>

    <!-- Сетка / Список новостей -->
    <div :class="{'news-grid': viewMode === 'tile', 'news-list': viewMode === 'simple'}">
      <NewsCard
          v-for="item in news"
          :key="item.id"
          :news-item="item"
          :view-mode="viewMode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {getAllNews} from '@/client/api/client.js'
import NewsCard from '@/client/components/NewsCard.vue'

const news = ref([])
const loading = ref(true)
const error = ref(null)
const viewMode = ref('tile')   // 'tile' или 'simple'

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    loading.value = true;
    const data = await getAllNews();
    news.value = data;
    console.log("Новости загружены:", news.value);
  } catch (err) {
    console.error('Не удалось загрузить проекты:', err)
    error.value = err.message || 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
})

</script>
