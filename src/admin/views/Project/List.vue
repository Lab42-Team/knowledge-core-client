<template>
  <n-space vertical size="large">
    <n-button type="primary" @click="goToProjectCreate">
      <template #icon>
        <i class="bi bi-plus-lg"></i>
      </template>
      {{ $t('BUTTON.CREATE_PROJECT') }}
    </n-button>
    <project-table :project="project" @project-load="loadProject"/>
  </n-space>
</template>

<script>
import { getProject } from '@/admin/api/project';
import ProjectTable from './Table.vue';
import { NButton, NCard, NSpace } from 'naive-ui';

export default {
  name: "ProjectList",

  components: {
    ProjectTable,
    NButton,
    NCard,
    NSpace,
  },

  data() {
    return {
      project: [],
    };
  },

  mounted() {
    this.loadProject();
  },

  methods: {
    async loadProject() {
      try {
        this.project = await getProject();
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },

    goToProjectCreate() {
      this.$router.push('/project/create');
    }
  }
}
</script>
