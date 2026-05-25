<template>

  <n-layout class="client-layout" :style="{ height: 'auto', minHeight: '100vh' }">

    <Navbar />

    <n-layout-content class="content" :content-style="{ overflow: 'visible', height: 'auto' }">
      <router-view />
    </n-layout-content>

  </n-layout>

</template>

<script setup>
import { NLayout, NLayoutContent } from 'naive-ui'
import Navbar from '@/client/components/Navbar.vue'
</script>
