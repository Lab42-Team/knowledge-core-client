<template>
  <div class="all-news">
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
    <div :class="{'news-grid': viewMode === 'tile', 'news-list': viewMode === 'simple'}"
    >
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


<style scoped>
.all-news {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.header h2 {
  margin: 0;
  font-size: 2.2rem;
  color: #222;
}

.view-toggle {
  display: flex;
  background: #f1f1f1;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.view-toggle button {
  padding: 10px 24px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle button.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #0066ff;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
