<template>
  <h2>Новости</h2>

  <button type="button" class="btn btn-primary" @click="goToNewsCreate">Создать новость</button>

</template>

<script>
export default {
  name: "NewsView",

  methods: {
    goToNewsCreate() {

      //this.$router.push('/news/create');
      console.log('создание новости');
    }
  }
}
</script>

<style scoped>

</style>
