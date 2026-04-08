<template>
  <div class="navbar-container" :class="{ scrolled }">
    <div class="navbar">
      <n-space justify="space-between" align="center" class="navbar-content">

        <!-- Логотип -->
        <router-link to="/" class="logo">
          <img :src="altair" alt="altair" class="logo-image">
          <strong>Альтаир ИИ</strong>
        </router-link>

        <!-- Правая часть -->
        <div class="nav-right">

          <!-- Переключатель темы -->
          <n-button text @click="toggleTheme" class="theme-toggle">
            <font-awesome-icon :icon="currentTheme === 'deepspace' ? 'moon' : 'sun'" />
          </n-button>

          <!-- Меню -->
          <n-menu
              mode="horizontal"
              :options="menuOptions"
              class="nav-menu"
              @update:value="handleMenuClick"
          />

          <!-- Кнопка входа -->
          <n-button
              type="primary"
              class="login-btn"
              @click="goToLogin"
              circle
          >
            <font-awesome-icon icon="sign-in-alt" />
          </n-button>

        </div>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, h} from 'vue'
import {RouterLink, useRouter} from 'vue-router'
import { NSpace, NMenu, NButton } from 'naive-ui'
import altair from '@/assets/altair.png'

const router = useRouter()
const scrolled = ref(false)
const currentTheme = ref('tropical')

const menuOptions = [
  { label: 'Home',   key: 'home',   name: 'HomeView' },
  { label: 'About',  key: 'about',  name: 'AboutView' },
  { label: 'News',  key: 'news',  name: 'NewsView' },
]

const handleMenuClick = (key) => {
  const map = { home: 'HomeView', about: 'AboutView', news: 'NewsView' }
  router.push({ name: map[key] })
}

const goToLogin = () => {
  router.push({ name: 'LoginView' })
}

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'deepspace' ? 'tropical' : 'deepspace'
  currentTheme.value = newTheme
  document.documentElement.dataset.theme = newTheme
  localStorage.setItem('theme', newTheme)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'tropical'
  currentTheme.value = saved
  document.documentElement.dataset.theme = saved

  const onScroll = () => { scrolled.value = window.scrollY > 15 }
  window.addEventListener('scroll', onScroll)
  onScroll()

  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
