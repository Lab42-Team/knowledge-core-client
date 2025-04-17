<template>
  <h2>Вход</h2>

  <form @submit.prevent="handleLogin">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input v-model="email" type="email" class="form-control" id="email">
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password">
    </div>

    <button type="submit" class="btn btn-primary">Login</button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </form>

</template>

<script>

import { login } from '@/client/api/auth'

export default {
  name: "LoginView",

  data() {
    return {
      email: '',
      password: '',
      error: null,
    }
  },

  methods: {
    async handleLogin() {
      this.error = null

      try {
        const response = await login({
          email: this.email,
          password: this.password,
        })
        // Сохраняем токен
        localStorage.setItem('token', response.access_token)

        window.location.href = '/admin'; //переход в админку
      } catch (err) {
        this.error = err.message || 'Ошибка авторизации'
      }
    },
  },
}
</script>


<style scoped>

</style>
