<template>
  <n-card :title="$t('PAGE.PROJECTS.EDIT')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="project"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item :label="$t('TABLE.PROJECTS.NAME')" path="name">
        <n-input
            v-model:value="project.name"
            type="text"
            :placeholder="$t('TABLE.PROJECTS.PLACEHOLDER.NAME')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.PROJECTS.STATUS')" path="status">
        <n-select
            v-model:value="project.status"
            :options="statusOptions"
            :placeholder="$t('TABLE.PROJECTS.PLACEHOLDER.STATUS')"
            clearable
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.PROJECTS.DATE')" path="date">
        <DateInput
            v-model="project.date"
            :placeholder="$t('TABLE.PROJECTS.PLACEHOLDER.DATE')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.PROJECTS.DESCRIPTION')" path="description">
        <n-input
            v-model:value="project.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.PROJECTS.PLACEHOLDER.DESCRIPTION')"
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
        {{ $t('MESSAGE.PROJECTS.ERROR.EDITING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { getProjectById, updateProject } from '@/admin/api/project';
import DateInput from '@/admin/components/DateInput.vue';

export default {
  name: 'ProjectEdit',

  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert,
    DateInput
  },

  data() {
    return {
      project: {
        id: '',
        name: '',
        description: '',
        status: null,
        date: ''
      },
      statuses: {}, // Список статусов, полученных из API
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      // Правила валидации для полей формы
      rules: {
        name: [
          { required: true, message: this.$t('MESSAGE.PROJECTS.ERROR.ENTER_TITLE'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.PROJECTS.ERROR.TITLE_LONGE'), trigger: ['input', 'blur'] }
        ],
        status: { required: true, message: this.$t('MESSAGE.PROJECTS.ERROR.SELECT_STATUS'), trigger: ['change', 'blur'] },
        date: { required: true, message: this.$t('MESSAGE.PROJECTS.ERROR.SELECT_DATE'), trigger: ['input', 'blur'] }
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

  watch: {
    '$i18n.locale': {
      handler() {
        this.loadStatuses(); // Перезагрузка статусов при смене локализации
      },
      immediate: true // Вызов сразу при инициализации
    }
  },

  methods: {
    // Асинхронная загрузка статусов из API
    async loadStatuses() {
      try {
        this.statuses = await getProjectStatuses();
      } catch (err) {
        console.error('Ошибка загрузки статусов:', err);
        //this.error = 'Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    async getProject(id) {
      try {
        const response = await getProjectById(id);
        this.project = {...response, id, status: response.status.toString()};
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
        //console.log('Отправляемые данные:', this.project);
        const response = await updateProject(this.project.id, this.project);
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/project/show/' + response.id,
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
    const projectId = this.$route.params.id;
    await this.loadStatuses(); // Сначала загружаем статусы
    await this.getProject(projectId); // Потом новость
  },

};
</script>
