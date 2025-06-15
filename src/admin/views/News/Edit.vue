<template>
  <n-card title="Редактирование новости" size="medium" :bordered="true" class="news-card">
    <n-form
        ref="formRef"
        :model="news"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item label="Заголовок" path="name">
        <n-input
            v-model:value="news.name"
            type="text"
            placeholder="Введите заголовок"
        />
      </n-form-item>
      <n-form-item label="Описание" path="description">
        <n-input
            v-model:value="news.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="Введите описание"
        />
      </n-form-item>
      <n-form-item label="Статус" path="status">
        <n-select
            v-model:value="news.status"
            :options="statusOptions"
            placeholder="Выберите статус"
            clearable
        />
      </n-form-item>
      <n-form-item label="Дата" path="date">
        <n-input
            v-model:value="formattedDate"
            placeholder="Выберите дату"
            ref="datepicker"
        />
      </n-form-item>
      <n-button type="primary" :disabled="submitting" @click="submitForm">
        <template #icon>
          <i class="bi bi-door-open"></i>
        </template>
        Сохранить изменения
      </n-button>
    </n-form>
    <n-alert v-if="error" type="error" class="mt-3">
      {{ error }}
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { getNewsById, getNewsStatuses, updateNews } from '@/admin/api/news';
import AirDatepicker from 'air-datepicker';
import dayjs from 'dayjs';

export default {
  name: 'NewsEdit',

  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert
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
      statuses: {},
      formattedDate: '',
      error: null,
      submitting: false,
      datepickerInstance: null,
      rules: {
        name: { required: true, message: 'Пожалуйста, введите заголовок', trigger: ['input', 'blur'] },
        status: { required: true, message: 'Пожалуйста, выберите статус', trigger: ['change', 'blur'] },
        date: { required: true, message: 'Пожалуйста, выберите дату', trigger: ['input', 'blur'] }
      }
    };
  },

  computed: {
    statusOptions() {
      return Object.entries(this.statuses).map(([value, label]) => ({ label, value: value.toString() }));
    }
  },

  methods: {
    initializeDatepicker() {
      this.datepickerInstance = new AirDatepicker(this.$refs.datepicker.$el.querySelector('input'), {
        timepicker: true,
        selectedDates: this.news.date ? [new Date(this.news.date)] : [],
        onSelect: ({ date }) => {
          if (date) {
            this.news.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            this.formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');
          }
        }
      });
      if (this.news.date) {
        this.formattedDate = dayjs(this.news.date).format('DD.MM.YYYY HH:mm');
      }
    },

    async loadStatuses() {
      try {
        this.statuses = await getNewsStatuses();
      } catch (err) {
        console.error('Ошибка загрузки статусов:', err);
        this.error = 'Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    async getNews(id) {
      try {
        const response = await getNewsById(id);
        this.news = {...response, id, status: response.status.toString()};
        if (this.news.date) {
          this.formattedDate = dayjs(this.news.date).format('DD.MM.YYYY HH:mm');
        }
      } catch (err) {
        console.error('Ошибка при получении новости:', err);
        this.error = 'Не удалось загрузить данные новости: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    async submitForm() {
      try {
        this.submitting = true;
        this.error = null;
        await this.$refs.formRef.validate();
        console.log('Отправляемые данные:', this.news);
        const response = await updateNews(this.news.id, this.news);
        console.log('Ответ от API:', response);
        this.$router.push('/news');
      } catch (err) {
        console.error('Ошибка при редактировании новости:', err);
        if (err.response && err.response.status === 422) {
          this.error = 'Ошибки валидации: ' + JSON.stringify(err.response.data.errors || {});
        } else {
          this.error = 'Ошибка при редактировании новости: ' + (err.message || 'Неизвестная ошибка');
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
    this.initializeDatepicker();
  },

  beforeUnmount() {
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();
    }
  }
};
</script>

<style scoped>
.news-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-card :deep(.n-card-header) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #d4edda;
  color: #2d7a4b;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #2d7a4b;
}

.news-card :deep(.n-card__content) {
  padding: 16px;
  //background-color: #f2fdf2;
}

.news-card :deep(.n-form-item-label) {
  color: #2d7a4b;
  font-size: 14px;
  font-weight: 500;
}

.news-card :deep(.n-input__input-el),
.news-card :deep(.n-input__textarea-el) {
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  background-color: #ffffff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.news-card :deep(.n-input__input-el:focus),
.news-card :deep(.n-input__textarea-el:focus) {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
  outline: none;
}

.news-card :deep(.n-input__textarea-el) {
  min-height: 100px;
  resize: vertical;
}

.news-card :deep(.n-form-item-feedback) {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.news-card :deep(.n-button) {
  font-weight: 500;
  margin-top: 12px;
  cursor: pointer;
}

.news-card :deep(.n-button--disabled) {
  background-color: #cccccc;
  border-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

.news-card :deep(.n-alert) {
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.news-card :deep(.n-alert--error-type) {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}
</style>
