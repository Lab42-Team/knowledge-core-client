<template>
  <n-space vertical size="large">
    <n-button type="primary" @click="goToDevelopmentCreate">
      <template #icon>
        <i class="bi bi-plus-lg"></i>
      </template>
      {{ $t('BUTTON.CREATE_DEVELOPMENT') }}
    </n-button>
    <developments-table :developments="developments" @developments-load="loadDevelopments"/>
  </n-space>
</template>

<script>
import { getDevelopments } from '@/admin/api/developments';
import DevelopmentsTable from './Table.vue';
import { NButton, NCard, NSpace } from 'naive-ui';

export default {
  name: "DevelopmentsList",

  components: {
    DevelopmentsTable,
    NButton,
    NCard,
    NSpace,
  },

  data() {
    return {
      developments: [],
    };
  },

  mounted() {
    this.loadDevelopments();
  },

  methods: {
    async loadDevelopments() {
      try {
        this.developments = await getDevelopments();
      } catch (error) {
        console.error('Ошибка при загрузке разработок:', error);
      }
    },

    goToDevelopmentCreate() {
      this.$router.push('/developments/create');
    }
  }
}
</script>
