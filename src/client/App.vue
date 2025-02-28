<template>
  <div>
    <h1>Клиентская часть</h1>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>

    <button type="button" class="btn btn-primary" @click="goToAdmin">Перейти в админскую часть</button>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ClientApp',

  methods: {
    goToAdmin() {
      // переход на админскую часть с перезагрузкой страницы
      window.location.href = '/admin';
    },
  },
};
</script>
