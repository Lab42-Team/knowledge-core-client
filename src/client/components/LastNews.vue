<template>
  <div class="last-news">
    <h2>Последние новости</h2>

    <!-- Пустое состояние -->
    <n-empty
        v-if="!news.length"
        description="Новостей пока нет"
        class="empty"
    />

    <!-- Карусель -->
    <div v-else class="carousel-wrapper">
      <n-carousel
          ref="carousel"
          v-model:current-index="currentIndex"
          :slides-per-view="4"
          :space-between="30"
          :loop="false"
          autoplay
          :interval="5000"
          :pause-on-hover="true"
          :show-dots="false"
          class="carousel"
      >
        <n-carousel-item v-for="item in news" :key="item.id">
          <n-card hoverable class="card" @click="openNews(item.id)">
            <div class="header">
              <span class="date">{{ formatDate(item.date) }}</span>
            </div>

            <h4 class="title">{{ item.name }}</h4>
            <p class="desc">{{ truncate(item.description, 140) }}</p>

          </n-card>
        </n-carousel-item>
      </n-carousel>


      <!-- Кнопки навигации слева и справа -->
      <n-button
          circle
          size="large"
          class="nav-btn prev"
          :disabled="!canPrev"
          @click="prev"
      >
        <n-icon size="23">
          <font-awesome-icon icon="angle-left" />
        </n-icon>
      </n-button>

      <n-button
          circle
          size="large"
          class="nav-btn next"
          :disabled="!canNext"
          @click="next"
      >
        <n-icon size="23">
          <font-awesome-icon icon="angle-right" />
        </n-icon>
      </n-button>

    </div>
  </div>
</template>

<script>
import {
  NCarousel,
  NCarouselItem,
  NCard,
  NButton,
  NEmpty,
  NIcon
} from 'naive-ui'
import { getLatestNews } from '@/client/api/client.js'
import dayjs from 'dayjs'

export default {
  name: 'LastNews',

  components: {
    NCarousel,
    NCarouselItem,
    NCard,
    NButton,
    NEmpty,
    NIcon
  },

  data() {
    return {
      news: [],
      currentIndex: 0   // текущий индекс
    }
  },

  computed: {
    canPrev() {
      return this.currentIndex > 0
    },
    canNext() {
      return this.currentIndex < this.news.length - 4
    }
  },

  mounted() {
    this.loadNews()
  },

  methods: {
    // Загрузка новостей
    async loadNews() {
      try {
        this.news = await getLatestNews()
      } catch (err) {
        console.error('Ошибка загрузки новостей:', err)
        this.news = []
      }
    },

    // Формат даты
    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY')
    },

    // Обрезка длинного текста
    truncate(text = '', len = 140) {
      return typeof text === 'string' && text.length > len
          ? text.slice(0, len) + '...'
          : text
    },

    // Переход на страницу новости
    openNews(id) {
      this.$router.push(`/news/${id}`)
    },

    // Навигация карусели
    prev() {
      this.$refs.carousel?.prev()
    },
    next() {
      this.$refs.carousel?.next()
    }

  }
}
</script>
