<template>
  <n-space vertical size="large">
    <n-space>
      <n-button @click="$router.go(-1)" type="error" ghost>
        <template #icon>
          <i class="bi bi-arrow-90deg-left"></i>
        </template>
        {{ $t('BUTTON.BACK') }}
      </n-button>

      <n-button type="error" @click="excludeUser(user.id)">
        <template #icon>
          <i class="bi bi-person-dash-fill"></i>
        </template>
        {{ $t('BUTTON.EXCLUDE_USER') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.USERS.VIEW')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="user" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ user.id }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.NAME') }}:</strong> {{ user.name }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.EMAIL') }}: </strong>
          <a :href="'mailto:' + user.email"> {{ user.email }}</a>
        </n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.ROLE') }}:</strong> {{ user.role }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.STATUS') }}:</strong> {{ user.status }}</n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.USERS.FULL_NAME') }}: </strong>
          <span v-if="user.full_name"> {{ user.full_name }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.USERS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.USERS.LAST_LOGIN_DATE') }}: </strong>
          <span v-if="user.last_login_date"> {{ formatDate(user.last_login_date) }} </span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.USERS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.USERS.LOGIN_IP') }}: </strong>
          <span v-if="user.login_ip"> {{ user.login_ip }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.USERS.TEXT') }} </span>
        </n-text>
      </n-space>
    </n-card>
  </n-space>

</template>

<script>
import {NButton, NCard, NSpace, NText, useMessage} from 'naive-ui';
import dayjs from 'dayjs';
import {getUserById, getUserRoles, getUserStatuses} from "@/admin/api/user.js";
import { deleteUserFromProject } from "@/admin/api/project.js";

export default {
  name: 'ProjectShowUser',

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
      user: null,
    };
  },

  watch: {
    '$i18n.locale': {
      handler() {
        if (this.user) { // Только если новость загружена
          this.getUserItem(this.$route.params.id_user); // Перезагрузка данных
        }
      },
      immediate: false // Вызов не сразу при инициализации
    }
  },

  async mounted() {
    await this.getUserItem(this.$route.params.id_user);
  },

  methods: {
    async getUserItem(id) {
      this.isLoading = true;
      try {
        const userData = await getUserById(id);
        const roles = await getUserRoles();
        const statuses = await getUserStatuses();
        // Преобразование статуса из индекса в текстовое значение
        this.user = {
          ...userData,
          role: roles[userData.role],
          status: statuses[userData.status],
        };
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    },

    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY HH:mm');
    },

    async excludeUser(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.PROJECTS.EXCLUDE_USER'));
      if (!confirmDelete) return;
      try {
        await deleteUserFromProject(id, this.$route.params.id);
        this.$router.push({
          name: 'ProjectTeam',
          params: { id: this.$route.params.id },
          query: { successDeleteUserTeam: 'true' }
        });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
      }
    },

  },
};
</script>
