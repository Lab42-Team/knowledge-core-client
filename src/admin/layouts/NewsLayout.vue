<template>
  <div class="card">
    <div class="card-header">
      Новости
    </div>
    <router-view />
  </div>
</template>

<script>
import NewsTable from "@/admin/components/News/Table.vue";

export default {
  name: "NewsLayout" ,
  components: {NewsTable}
}
</script>

<style scoped>
/* Общие стили*/
.card {
  width: 100%;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
}

/* Стили для заголовка */
.card-header {
  background-color: #d4edda;
  color: #2d7a4b;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}
</style>
