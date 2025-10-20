<template>
  <n-card :title="$t('PAGE.USERS.CREATE')" size="medium" :bordered="true" class="panel-card">
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
      <n-form-item :label="$t('TABLE.USERS.PASSWORD')" path="password">
        <n-input
          v-model:value="user.password"
          type="password"
          :placeholder="$t('TABLE.USERS.PLACEHOLDER.PASSWORD')"
          showPasswordOn="click"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.USERS.PASSWORD_CONFIRMATION')" path="password_confirmation">
        <n-input
          v-model:value="user.password_confirmation"
          type="password"
          :placeholder="$t('TABLE.USERS.PLACEHOLDER.PASSWORD_CONFIRMATION')"
          showPasswordOn="click"
        />
      </n-form-item>
      <n-progress
          v-if="user.password"
          :percentage="passwordStrength"
          :show-indicator="true"
          :status="passwordStrengthStatus"
          class="mb-3"
      />
      <n-button type="primary" :disabled="submitting" @click="submitForm">
        <template #icon>
          <i class="bi bi-check2"></i>
        </template>
        {{ $t('BUTTON.CREATE_USER') }}
      </n-button>
    </n-form>
    <n-alert v-if="errorList.length" type="error" class="mt-3">
      <div>
        {{ $t('MESSAGE.USERS.ERROR.CREATING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert, NProgress} from 'naive-ui';
import { createUser, getUserRoles, getUserStatuses } from '@/admin/api/user';

export default {
  name: 'UserCreate',

  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert,
    NProgress,
  },

  data() {
    return {
      user: {
        name: '',
        email: '',
        role: null,
        status: null,
        password: '',
        password_confirmation: '',
      },
      statuses: {}, // Список статусов, полученных из API
      roles: {}, // Список типов, полученных из API
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
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
        password: [
          { required: true, message: this.$t('MESSAGE.USERS.ERROR.ENTER_PASSWORD'), trigger: ['input', 'blur'] },
          { min: 8, message: this.$t('MESSAGE.USERS.ERROR.PASSWORD_SHORT'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.USERS.ERROR.PASSWORD_LONGE'), trigger: ['input', 'blur'] }
        ],
        password_confirmation: [
          { required: true, message: this.$t('MESSAGE.USERS.ERROR.ENTER_PASSWORD_CONFIRMATION'), trigger: ['input', 'blur'] },
          {
            validator: (rule, value) => value === this.user.password,
            message: this.$t('MESSAGE.USERS.ERROR.PASSWORD_MISMATCH'),
            trigger: ['input', 'blur']
          }
        ]
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

    passwordStrength() {
      const password = this.user.password;
      if (!password) return 0;
      let strength = 0;
      if (password.length >= 8) strength += 30;
      if (password.match(/[A-Z]/)) strength += 20;
      if (password.match(/[0-9]/)) strength += 20;
      if (password.match(/[^A-Za-z0-9]/)) strength += 30;
      return Math.min(strength, 100);
    },
    passwordStrengthStatus() {
      const strength = this.passwordStrength;
      if (strength < 40) return 'error';
      if (strength < 70) return 'warning';
      return 'success';
    }
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

    // Асинхронная отправка формы
    async submitForm() {
      try {
        this.submitting = true; // Устанавливка флага отправки в true
        this.errorList = []; // Очищаем список ошибок
        // Выполняем валидацию формы
        await this.$refs.formRef.validate();
        // Логируем данные, отправляемые в API
        //console.log('Отправляемые данные:', this.user);

        // Выполняем запрос на создание новости
        const { password_confirmation, ...userData } = this.user;
        const response = await createUser(userData);
        //console.log(response);
        //console.log(response.user.id);
        // Логируем ответ от API
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/user/show/' + response.user.id,
          query: { success: 'true' }
        });
      } catch (err) {
        //console.error('Ошибка при создании новости:', err);
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
        // Сбрасываем флаг отправки
        this.submitting = false;
      }
    }
  },

  // Выполнение при монтировании компонента
  async mounted() {
    await Promise.all([
      this.loadRoles(), // Запуск загрузки статусов
      this.loadStatuses(), // Запуск загрузки статусов
    ]);
  },
};
</script>
