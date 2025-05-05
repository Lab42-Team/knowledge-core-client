<script>
import {getUser, login} from '@/client/api/auth'

export default {
  name: "DashboardView",

  mounted() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      await getUser()
      //вывод пользователя
      //const response = await getUser()
      //console.log(response);
    },
  }
}
</script>

<template>
  <h2>Добро пожаловать в админку</h2>
</template>

<style scoped>

</style>
