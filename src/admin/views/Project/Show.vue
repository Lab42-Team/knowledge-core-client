<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToProjectEdit(project.id)">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        {{ $t('BUTTON.EDIT') }}
      </n-button>

      <n-button type="error" @click="deleteProject(project.id)">
        <template #icon>
          <i class="bi bi-trash"></i>
        </template>
        {{ $t('BUTTON.DELETE') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.PROJECTS.VIEW')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="project" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ project.id }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.PROJECTS.NAME') }}:</strong> {{ project.name }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.PROJECTS.TYPE') }}:</strong> {{ project.type }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.PROJECTS.STATUS') }}:</strong> {{ project.status }}</n-text>

        <n-text class="field">
          <strong>{{ $t('TABLE.PROJECTS.DESCRIPTION') }}: </strong>
          <span v-if="project.description"> {{ project.description }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.PROJECTS.TEXT.DESCRIPTION') }} </span>
        </n-text>

      </n-space>
    </n-card>
  </n-space>

</template>

<script>
import {deleteProject, getProjectById, getProjectTypes, getProjectStatuses} from '@/admin/api/project';
import {NButton, NCard, NSpace, NText, useMessage} from 'naive-ui';
import dayjs from 'dayjs';

export default {
  name: 'ProjectShow',

  setup() {
    // Инициализация useMessage для уведомлений
    const message = useMessage();
    return { message };
  },

  components: {
    NButton,
    NCard,
    NSpace,
    NText,
  },

  data() {
    return {
      project: null,
    };
  },

  watch: {
    '$i18n.locale': {
      handler() {
        if (this.project) { // Только если новость загружена
          this.getProjectItem(this.$route.params.id); // Перезагрузка данных
        }
      },
      immediate: false // Вызов не сразу при инициализации
    }
  },

  async mounted() {
    await this.getProjectItem(this.$route.params.id);

    // Проверяем параметр success в запросе
    if (this.$route.query.success === 'true') {
      this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.CREATE'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/project/show/' + this.$route.params.id
      });
    }
    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.EDIT'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/project/show/' + this.$route.params.id
      });
    }
  },

  methods: {
    async getProjectItem(id) {
      this.isLoading = true;
      try {
        const projectData = await getProjectById(id);
        const types = await getProjectTypes();
        const statuses = await getProjectStatuses();
        // Преобразование статуса из индекса в текстовое значение
        this.project = {
          ...projectData,
          type: types[projectData.type],
          status: statuses[projectData.status],
        };
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    },

    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY HH:mm');
    },

    goToProjectEdit(id) {
      this.$router.push({ name: 'ProjectEdit', params: { id: id } });
    },

    async deleteProject(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.PROJECTS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteProject(id);
        this.$router.push('/project');
        this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.DELETE'), {
          duration: 4000,
          closable: true,
        });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.DELETE'));
      }
    },
  },
};
</script>
