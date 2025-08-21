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
    <n-alert v-if="errorList.length" type="error" class="mt-3">
      <div>
        Ошибка при редактировании новости:
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
      statuses: {}, // Список статусов, полученных из API
      formattedDate: '', // Переменная для отображения форматированной даты
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      datepickerInstance: null,
      // Правила валидации для полей формы
      rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите заголовок', trigger: ['input', 'blur'] },
          { max: 255, message: 'Заголовок должен быть не длиннее 255 символов', trigger: ['input', 'blur'] }
        ],
        status: { required: true, message: 'Пожалуйста, выберите статус', trigger: ['change', 'blur'] },
        date: { required: true, message: 'Пожалуйста, выберите дату', trigger: ['input', 'blur'] }
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
    // Инициализация AirDatepicker для поля выбора даты
    initializeDatepicker() {
      // Создание AirDatepicker, привязанный к элементу input
      this.datepickerInstance = new AirDatepicker(this.$refs.datepicker.$el.querySelector('input'), {
        timepicker: true,// Включаем выбор времени
        selectedDates: this.news.date ? [new Date(this.news.date)] : [],
        // Обработчик выбора даты
        onSelect: ({ date }) => {
          // Проверка, выбрана ли дата
          if (date) {
            this.news.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');//Форматирование даты для отправки в API
            this.formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');//Форматирование даты для отображения пользователю
          }
        }
      });
      if (this.news.date) {
        this.formattedDate = dayjs(this.news.date).format('DD.MM.YYYY HH:mm');
      }
    },

    // Асинхронная загрузка статусов из API
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

    // Асинхронная отправка формы
    async submitForm() {
      try {
        this.submitting = true;
        this.errorList = []; // Очищаем список ошибок
        await this.$refs.formRef.validate();
        console.log('Отправляемые данные:', this.news);
        const response = await updateNews(this.news.id, this.news);
        console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/news',
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
    this.initializeDatepicker();
  },

  beforeUnmount() {
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();
    }
  }
};
</script>
