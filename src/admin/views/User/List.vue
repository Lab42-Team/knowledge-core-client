<template>
  <n-space vertical size="large">
    <n-button type="primary" @click="goToUserCreate">
      <template #icon>
        <i class="bi bi-plus-lg"></i>
      </template>
      {{ $t('BUTTON.CREATE_USER') }}
    </n-button>
    <user-table :user="user" @user-load="loadUser"/>
  </n-space>
</template>

<script>
import { getUser } from '@/admin/api/user';
import UserTable from './Table.vue';
import { NButton, NCard, NSpace } from 'naive-ui';

export default {
  name: "UserList",

  components: {
    UserTable,
    NButton,
    NCard,
    NSpace,
  },

  data() {
    return {
      user: [],
    };
  },

  mounted() {
    this.loadUser();
  },

  methods: {
    async loadUser() {
      try {
        this.user = await getUser();
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },

    goToUserCreate() {
      this.$router.push('/user/create');
    }
  }
}
</script>
