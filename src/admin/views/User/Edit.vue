<template>
  <n-card :title="$t('PAGE.USERS.EDIT')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="user"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item :label="$t('TABLE.USERS.NAME')" path="name">
        <n-input
            v-model:value="user.name"
            type="text"
            :placeholder="$t('TABLE.USERS.PLACEHOLDER.NAME')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.USERS.EMAIL')" path="name">
        <n-input
            v-model:value="user.email"
            type="text"
            :placeholder="$t('TABLE.USERS.PLACEHOLDER.EMAIL')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.USERS.ROLE')" path="role">
        <n-select
            v-model:value="user.role"
            :options="rolesOptions"
            :placeholder="$t('TABLE.USERS.PLACEHOLDER.ROLE')"
            clearable
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.USERS.STATUS')" path="status">
        <n-select
            v-model:value="user.status"
            :options="statusOptions"
            :placeholder="$t('TABLE.USERS.PLACEHOLDER.STATUS')"
            clearable
        />
      </n-form-item>
      <n-button type="primary" :disabled="submitting" @click="submitForm">
        <template #icon>
          <i class="bi bi-check2"></i>
        </template>
        {{ $t('BUTTON.SAVE_CHANGES') }}
      </n-button>
    </n-form>
    <n-alert v-if="errorList.length" type="error" class="mt-3">
      <div>
        {{ $t('MESSAGE.USERS.ERROR.EDITING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import {NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert} from 'naive-ui';
import { getUserById, updateUser, getUserRoles, getUserStatuses } from '@/admin/api/user';

export default {
  name: 'UserEdit',

  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert,
  },

  data() {
    return {
      user: {
        id: '',
        name: '',
        description: '',
        type: null,
        status: null,
      },
      statuses: {}, // Список статусов, полученных из API
      roles: {}, // Список типов, полученных из API
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      // Правила валидации для полей формы
      // Правила валидации для полей формы
      rules: {
        name: [
          { required: true, message: this.$t('MESSAGE.USERS.ERROR.ENTER_NAME'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.USERS.ERROR.NAME_LONGE'), trigger: ['input', 'blur'] }
        ],
        email: [
          { type: 'email', message: this.$t('MESSAGE.USERS.ERROR.EMAIL'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.USERS.ERROR.EMAIL_LONGE'), trigger: ['input', 'blur'] },
        ],
        role: { required: true, message: this.$t('MESSAGE.USERS.ERROR.SELECT_ROLE'), trigger: ['change', 'blur'] },
        status: { required: true, message: this.$t('MESSAGE.USERS.ERROR.SELECT_ROLE'), trigger: ['change', 'blur'] },
      }
    };
  },

  // Вычисляемые свойства
  computed: {
    // Преобразование объекта ролей в массив для n-select
    rolesOptions() {
      return Object.entries(this.roles).map(([value, label]) => ({ label, value }));
    },
    // Преобразование объекта статусов в массив для n-select
    statusOptions() {
      return Object.entries(this.statuses).map(([value, label]) => ({ label, value }));
    },
  },

  watch: {
    '$i18n.locale': {
      handler() {
        this.loadRoles(); // Перезагрузка типов при смене локализации
        this.loadStatuses(); // Перезагрузка статусов при смене локализации
      },
      immediate: true // Вызов сразу при инициализации
    }
  },

  methods: {
    // Асинхронная загрузка ролей из API
    async loadRoles() {
      try {
        // Запрашиваем статусы через API
        this.roles = await getUserRoles();
      } catch (err) {
        // Логируем ошибку в консоль
        console.error('Ошибка загрузки ролей:', err);
        // Устанавливаем сообщение об ошибке для отображения
        //this.errorList = ['Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка')];
      }
    },
    // Асинхронная загрузка статусов из API
    async loadStatuses() {
      try {
        // Запрашиваем статусы через API
        this.statuses = await getUserStatuses();
      } catch (err) {
        // Логируем ошибку в консоль
        console.error('Ошибка загрузки статусов:', err);
        // Устанавливаем сообщение об ошибке для отображения
        //this.errorList = ['Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка')];
      }
    },

    async getUser(id) {
      try {
        const response = await getUserById(id);
        this.user = {
          ...response, id,
          role: response.role.toString(),
          status: response.status.toString()
        };
      } catch (err) {
        console.error('Ошибка при получении новости:', err);
        //this.error = 'Не удалось загрузить данные новости: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    // Асинхронная отправка формы
    async submitForm() {
      try {
        this.submitting = true;
        this.errorList = []; // Очищаем список ошибок
        await this.$refs.formRef.validate();
        //console.log('Отправляемые данные:', this.user);
        const response = await updateUser(this.user.id, this.user);
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/user/show/' + response.id,
          query: { successEdit: 'true' }
        });
      } catch (err) {
        console.error('Ошибка при редактировании новости:', err);
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;
          // Преобразование серверных ошибок в массив для отображения списком
          this.errorList = Object.values(errors).flat().filter(message => message && typeof message === 'string');
        } else if (Array.isArray(err)) {
          // Обработка клиентских ошибок валидации
          this.errorList = err
              .flatMap(errorArray => errorArray.map(error => error.message))
              .filter(message => message && typeof message === 'string');
        } else {
          // Общее сообщение об ошибке
          this.errorList = [err.message || 'Неизвестная ошибка'];
        }
      } finally {
        this.submitting = false;
      }
    }
  },

  async mounted() {
    const userId = this.$route.params.id;
    await Promise.all([
      this.loadRoles(),
      this.loadStatuses(),
      this.getUser(userId),
    ]);
  },

};
</script>
