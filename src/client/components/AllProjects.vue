<template>
  <div class="projects-carousel">

    <!-- показ пока данные не загрузились или пустого места -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-else-if="projects.length === 0" class="empty">Проекты не найдены</div>

    <swiper
        :slides-per-view="1"
        :space-between="16"
        :navigation="true"
        :modules="modules"
        class="projects-swiper"
        :breakpoints="breakpoints"
        :centered-slides="true"
        :centered-slides-bounds="true"
        :center-insufficient-slides="true"
    >

      <swiper-slide v-for="project in projects" :key="project.id">
        <div class="project-card">
          <div class="project-card-inner">
            <div class="project-name">
              {{ project.name }}
            </div>
            <p>{{ project.description }}</p>
          </div>
          <h3 class="project-status"
              :class="statusClass(project.status)">
            {{ getStatusName(project.status) }}
          </h3>
        </div>
      </swiper-slide>

    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation} from 'swiper/modules'
import { getProjects, getProjectStatuses } from '@/client/api/client.js'

// Импорт модулей
const modules = [Navigation]

const projects = ref([])
const statusNames = ref([])
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

const getStatusName = (statusId) => {
  const id = Number(statusId)
  if (isNaN(id) || id < 0) return '—'
  return statusNames.value[id] || `Статус ${id}`
}

const statusClass = (statusId) => {
  const id = Number(statusId)
  if (id === 0) return 'status-editing'
  if (id === 1) return 'status-ready'
  if (id === 2) return 'status-outdated'
  return 'status-unknown'
}


// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    // Загрузка обоих запросов параллельно
    const [projectsData, statusesData] = await Promise.all([
      getProjects(),
      getProjectStatuses()
    ])
    projects.value = projectsData
    statusNames.value = statusesData
  } catch (err) {
    console.error('Не удалось загрузить проекты:', err)
    error.value = err.message || 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
})

</script>
