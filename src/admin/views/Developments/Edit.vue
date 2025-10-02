<template>
  <n-card :title="$t('PAGE.DEVELOPMENTS.EDIT')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="developments"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item :label="$t('TABLE.DEVELOPMENTS.NAME')" path="name">
        <n-input
            v-model:value="developments.name"
            type="text"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.NAME')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.DESCRIPTION')" path="description">
        <n-input
            v-model:value="developments.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.DESCRIPTION')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.YEAR')" path="year">
        <YearInput
            v-model="developments.year"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.YEAR')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.AUTHORS')" path="authors">
        <n-input
            v-model:value="developments.authors"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.AUTHORS')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.PUBLICATIONS')" path="publications">
        <n-input
            v-model:value="developments.publications"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.PUBLICATIONS')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.REQUIREMENTS')" path="requirements">
        <n-input
            v-model:value="developments.requirements"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.REQUIREMENTS')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.PRACTICAL_APPLICATION')" path="practical_application">
        <n-input
            v-model:value="developments.practical_application"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.PRACTICAL_APPLICATION')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.VERSION_HISTORY')" path="version_history">
        <n-input
            v-model:value="developments.version_history"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.VERSION_HISTORY')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.DEMO_VIDEOS')" path="demo_videos">
        <n-input
            v-model:value="developments.demo_videos"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.DEMO_VIDEOS')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.SOFTWARE_LINK')" path="software_link">
        <n-input
            v-model:value="developments.software_link"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.SOFTWARE_LINK')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.DOCUMENTATION_LINK')" path="documentation_link">
        <n-input
            v-model:value="developments.documentation_link"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.DOCUMENTATION_LINK')"
        />
      </n-form-item>

      <n-form-item :label="$t('TABLE.DEVELOPMENTS.GITHUB_LINK')" path="github_link">
        <n-input
            v-model:value="developments.github_link"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.DEVELOPMENTS.PLACEHOLDER.GITHUB_LINK')"
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
        {{ $t('MESSAGE.DEVELOPMENTS.ERROR.EDITING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { getDevelopmentsById, updateDevelopments } from '@/admin/api/developments';
import YearInput from '@/admin/components/YearInput.vue';

export default {
  name: 'DevelopmentsEdit',

  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert,
    YearInput
  },

  data() {
    return {
      developments: {
        name: '',
        description: '',
        year: '',
        authors: '',
        publications: '',
        requirements: '',
        practical_application: '',
        version_history: '',
        demo_videos: '',
        software_link: '',
        documentation_link: '',
        github_link: '',
      },
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      // Правила валидации для полей формы
      rules: {
        name: [
          { required: true, message: this.$t('MESSAGE.DEVELOPMENTS.ERROR.ENTER_TITLE'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.DEVELOPMENTS.ERROR.TITLE_LONGE'), trigger: ['input', 'blur'] }
        ],
      }
    };
  },

  // Вычисляемые свойства
  computed: {
    // Преобразование объекта статусов в массив для n-select
    statusOptions() {
      return Object.entries(this.statuses).map(([value, label]) => ({ label, value: value.toString() }));
    }
  },

  methods: {
    async getDevelopments(id) {
      try {
        const response = await getDevelopmentsById(id);
        this.developments = {...response, id };

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

        const response = await updateDevelopments(this.developments.id, this.developments);
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/developments/show/' + response.id,
          query: { successEdit: 'true' }
        });
      } catch (err) {
        console.error('Ошибка при редактировании разработки:', err);
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
    const developmentsId = this.$route.params.id;
    await this.getDevelopments(developmentsId);
  },

};
</script>
