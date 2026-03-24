<template>
  <div class="news-carousel">
    <h2>Последние новости</h2>

    <!-- показ пока данные не загрузились или пустого места -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-else-if="news.length === 0" class="empty">Новости не найдены</div>

    <swiper
        :slides-per-view="1"
        :space-between="16"
        :navigation="true"
        :modules="modules"
        class="news-swiper"
        :breakpoints="breakpoints"
        :centered-slides="true"
        :centered-slides-bounds="true"
        :center-insufficient-slides="true"
    >

      <swiper-slide v-for="item in news" :key="item.id">
        <div class="news-card">
          <div class="news-card-inner">
            <div class="news-name">
              {{ item.name }}
            </div>
            <p>{{ item.description }}</p>
          </div>

          <h3 class="news-date">
            {{ dayjs(item.date).format('DD MMMM YYYY') }}
          </h3>
        </div>
      </swiper-slide>

    </swiper>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation} from 'swiper/modules'
import { getLatestNews } from '@/client/api/client.js'


// Импорт модулей
const modules = [Navigation]

const news = ref([])
const loading = ref(true)
const error = ref(null)

// Настройки адаптивности
const breakpoints = {
  480:  { slidesPerView: 1.5, spaceBetween: 16  }, // ширина экрана >= 480px
  640:  { slidesPerView: 2,   spaceBetween: 20  }, // >= 640px
  768:  { slidesPerView: 3,   spaceBetween: 24  }, // >= 768px
  1024: { slidesPerView: 4,   spaceBetween: 32  }, // >= 1024px
  1280: { slidesPerView: 5,   spaceBetween: 32  }, // >= 1280px
}



// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    loading.value = true;
    const data = await getLatestNews();
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
