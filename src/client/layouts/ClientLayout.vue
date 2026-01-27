<template>
  <n-layout class="client-layout">

    <Navbar />

    <n-layout-content class="content">

      <!-- Основные данные -->
      <router-view />

    </n-layout-content>

  </n-layout>
</template>

<script setup>
import { NLayout, NLayoutContent } from 'naive-ui'
import Navbar from '@/client/components/Navbar.vue'
</script>
