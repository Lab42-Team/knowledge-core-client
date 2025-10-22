<template>
  <n-card :title="$t('PAGE.USERS.EDIT_PASSWORD')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="user"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
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
import {NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert, NProgress} from 'naive-ui';
import { getUserById, updateUser } from '@/admin/api/user';

export default {
  name: 'UserEditPassword',

  components: {
    NProgress,
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
        password: '',
        password_confirmation: '',
      },
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      // Правила валидации для полей формы
      // Правила валидации для полей формы
      rules: {
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

  methods: {
    async getUser(id) {
      try {
        const response = await getUserById(id);
        this.user = {
          ...response, id,
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

        const { password_confirmation, ...userData } = this.user;
        const response = await updateUser(this.user.id, userData);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/user/show/' + response.id,
          query: { successEditPassword: 'true' }
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
      this.getUser(userId),
    ]);
  },

};
</script>
