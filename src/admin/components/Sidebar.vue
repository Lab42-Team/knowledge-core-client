<script>
export default {
  name: "Sidebar"
}
</script>

<template>
  <nav class="sidebar bg-dark text-white p-3">
    <h2>Dashboard</h2>
    <ul class="nav flex-column">
      <li class="nav-item">
        <a class="nav-link text-white" href="#">Главная</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-white" href="#">Аналитика</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
}
</style>
