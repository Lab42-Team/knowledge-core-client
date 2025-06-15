<template>
  <n-card title="Новости" size="medium" :bordered="true">
      <router-view />
  </n-card>
</template>

<script>
import { NCard } from 'naive-ui'

export default {
  name: "NewsLayout",
  components: {
    NCard
  }
}
</script>
