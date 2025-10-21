<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToUserEdit(user.id)">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        {{ $t('BUTTON.EDIT') }}
      </n-button>

      <n-button type="error" @click="deleteUser(user.id)">
        <template #icon>
          <i class="bi bi-trash"></i>
        </template>
        {{ $t('BUTTON.DELETE') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.USERS.VIEW')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="user" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ user.id }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.NAME') }}:</strong> {{ user.name }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.EMAIL') }}:</strong> {{ user.email }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.ROLE') }}:</strong> {{ user.role }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.STATUS') }}:</strong> {{ user.status }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.USERS.FULL_NAME') }}:</strong> {{ user.full_name }}</n-text>
      </n-space>
    </n-card>
  </n-space>

</template>

<script>
import {deleteUser, getUserById, getUserRoles, getUserStatuses} from '@/admin/api/user';
import {NButton, NCard, NSpace, NText, useMessage} from 'naive-ui';
import dayjs from 'dayjs';

export default {
  name: 'UserShow',

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
          this.getUserItem(this.$route.params.id); // Перезагрузка данных
        }
      },
      immediate: false // Вызов не сразу при инициализации
    }
  },

  async mounted() {
    await this.getUserItem(this.$route.params.id);

    // Проверяем параметр success в запросе
    if (this.$route.query.success === 'true') {
      this.message.success(this.$t('MESSAGE.USERS.SUCCESS.CREATE'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/user/show/' + this.$route.params.id
      });
    }
    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success(this.$t('MESSAGE.USERS.SUCCESS.EDIT'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/user/show/' + this.$route.params.id
      });
    }
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

    goToUserEdit(id) {
      this.$router.push({ name: 'UserEdit', params: { id: id } });
    },

    async deleteUser(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.USERS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteUser(id);
        this.$router.push('/user');
        this.message.success(this.$t('MESSAGE.USERS.SUCCESS.DELETE'), {
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
