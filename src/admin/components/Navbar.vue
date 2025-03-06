<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item"><a href="#" @click="goToHome">Home</a></li>
      <li class="navbar-item"><a href="#" @click="goToNews">News</a></li>

      <li class="navbar-item"><a href="#" @click="goToClient">Перейти в клиентскую часть</a></li>
    </ul>
  </nav>




</template>


<script>
export default {
  name: "Navbar",

  methods: {
    goToClient() {
      // переход на клиентскую часть с перезагрузкой страницы
      window.location.href = '/';
    },
    goToHome() {
      this.$router.push('/');
    },
    goToNews() {
      this.$router.push('/news');
    },
  },
}
</script>


<style scoped>
.navbar {
  background-color: #2d7a4b;
  height: 68px;
  padding: 0 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: block;
}

.navbar-list {
  display: block;
  padding: 0;
  margin: 0;
}

.navbar-item {
  display: inline-block;
  margin-right: 10px;
}

.navbar-item a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  display: block;
  padding: 20px 20px;
  border-radius: 2px;
  background-color: transparent;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  height: auto;
}

.navbar-item a:hover {
  background-color: white;
  color: #359e6b;
}

.navbar-item a:focus {
  outline: none;
}
</style>
