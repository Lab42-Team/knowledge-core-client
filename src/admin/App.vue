<template>

  <div class="admin-layout">
    <Navbar />
    <div class="main-content">
      <h1>Админка</h1>

      <router-view />
    </div>
  </div>

</template>

<script>

import Navbar from "./components/Navbar.vue";
export default {
  name: 'AdminApp',

  components: {
    Navbar,
  },
};
</script>

<style scoped>

.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fafafa;
}
</style>
