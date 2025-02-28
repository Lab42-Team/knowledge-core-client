<template>
  <div>
    <h1>Админка</h1>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/news">News</RouterLink>

    <button type="button" class="btn btn-primary" @click="goToClient">Перейти в клиентскую часть</button>
    <a href="#" @click="goToClient">Перейти в клиентскую часть</a>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AdminApp',

  methods: {
    goToClient() {
      // переход на клиентскую часть с перезагрузкой страницы
      window.location.href = '/';
    },
  },
};
</script>
