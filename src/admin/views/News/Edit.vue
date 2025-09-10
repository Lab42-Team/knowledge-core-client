<template>
  <n-card :title="$t('PAGE.NEWS.EDIT')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="news"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item :label="$t('TABLE.NAME')" path="name">
        <n-input
            v-model:value="news.name"
            type="text"
            :placeholder="$t('TABLE.PLACEHOLDER.NAME')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.STATUS')" path="status">
        <n-select
            v-model:value="news.status"
            :options="statusOptions"
            :placeholder="$t('TABLE.PLACEHOLDER.STATUS')"
            clearable
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.DATE')" path="date">
        <DateInput
            v-model="news.date"
            :placeholder="$t('TABLE.PLACEHOLDER.DATE')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.DESCRIPTION')" path="description">
        <n-input
            v-model:value="news.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.PLACEHOLDER.DESCRIPTION')"
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
        {{ $t('MESSAGE.ERROR.EDITING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { getNewsById, getNewsStatuses, updateNews } from '@/admin/api/news';
import DateInput from '@/admin/components/DateInput.vue';

export default {
  name: 'NewsEdit',

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
      news: {
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
          { required: true, message: this.$t('MESSAGE.ERROR.ENTER_TITLE'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.ERROR.TITLE_LONGE'), trigger: ['input', 'blur'] }
        ],
        status: { required: true, message: this.$t('MESSAGE.ERROR.SELECT_STATUS'), trigger: ['change', 'blur'] },
        date: { required: true, message: this.$t('MESSAGE.ERROR.SELECT_DATE'), trigger: ['input', 'blur'] }
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
    // Асинхронная загрузка статусов из API
    async loadStatuses() {
      try {
        this.statuses = await getNewsStatuses();
      } catch (err) {
        console.error('Ошибка загрузки статусов:', err);
        //this.error = 'Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    async getNews(id) {
      try {
        const response = await getNewsById(id);
        this.news = {...response, id, status: response.status.toString()};
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
        //console.log('Отправляемые данные:', this.news);
        const response = await updateNews(this.news.id, this.news);
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/news/show/' + response.id,
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
    const newsId = this.$route.params.id;
    await this.loadStatuses(); // Сначала загружаем статусы
    await this.getNews(newsId); // Потом новость
  },

};
</script>
