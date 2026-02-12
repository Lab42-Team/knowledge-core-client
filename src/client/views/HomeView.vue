<script>
import LastNews from '@/client/components/LastNews.vue'
import AllProject from '@/client/components/AllProjects.vue'

export default {
  name: 'HomeView',

  components: {
    LastNews,
    AllProject,
  },

  methods: {
    goToAdmin() {
      window.location.href = '/admin'
    },
  },
}
</script>

<template>
  <h2>Домашняя</h2>



  <AllProject />


  <LastNews />



  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>
  <h5>sdfsdfsdfsdf</h5>

  <h1>Клиентская часть123123</h1>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
  <RouterLink to="/login">Login</RouterLink>
  <button @click="goToAdmin" class="btn btn-primary">Перейти в админку</button>

</template>

