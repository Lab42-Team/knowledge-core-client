<template>
  <n-card title="Создание новости" size="medium" :bordered="true" class="news-card">
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
          Создать новость
        </n-button>
      </n-form>
      <n-alert v-if="error" type="error" class="mt-3">
        {{ error }}
      </n-alert>
    </n-card>
</template>

<script>

import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert } from 'naive-ui';
import { createNews, getNewsStatuses } from '@/admin/api/news';
import AirDatepicker from 'air-datepicker';
import dayjs from 'dayjs';

export default {
  name: 'NewsCreate',

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
        name: '',
        description: '',
        status: null,
        date: ''
      },
      statuses: {}, //Список статусов, полученных из API
      formattedDate: '',// Переменная для отображения форматированной даты
      error: null,
      submitting: false,// Флаг идет ли процесс отправки
      datepickerInstance: null,

      // Правила валидации для полей формы (нужны ли? )
      rules: {
        name: { required: true, message: 'Пожалуйста, введите заголовок', trigger: ['input', 'blur'] },// Правило для поля "name": обязательно для заполнения
        status: { required: true, message: 'Пожалуйста, выберите статус', trigger: ['change', 'blur'] },// Правило для поля "status": обязательно для заполнения
        date: { required: true, message: 'Пожалуйста, выберите дату', trigger: ['input', 'blur'] }// Правило для поля "date": обязательно для заполнения
      }
    };
  },
  // Вычисляемые свойства компонента
  computed: {
    // Преобразование объекта статусов в массив для n-select
    statusOptions() {
      return Object.entries(this.statuses).map(([value, label]) => ({label, value}));
    }
  },

  methods: {
    // Инициализация AirDatepicker для поля выбора даты
    initializeDatepicker() {
      // Создание AirDatepicker, привязанный к элементу input
      this.datepickerInstance = new AirDatepicker(this.$refs.datepicker.$el.querySelector('input'), {
        timepicker: true,// Включаем выбор времени
        selectedDates: [],// Изначально нет выбранных дат
        // Обработчик выбора даты
        onSelect: ({ date }) => {
          // Проверка, выбрана ли дата
          if (date) {
            this.news.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');// Форматирование даты для отправки в API
            this.formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');// Форматирование даты для отображения пользователю
          }
        }
      });
    },

    // Асинхронная загрузка статусов из API
    async loadStatuses() {
      try {
        // Запрашиваем статусы через API
        this.statuses = await getNewsStatuses();
      } catch (err) {
        // Логируем ошибку в консоль
        console.error('Ошибка загрузки статусов:', err);
        // Устанавливаем сообщение об ошибке для отображения
        this.error = 'Не удалось загрузить статусы: ' + (err.message || 'Неизвестная ошибка');
      }
    },

    // Асинхронная отправка формы
    async submitForm() {
      try {
        // Устанавливка флага отправки в true
        this.submitting = true;
        // Очищаем сообщение об ошибке
        this.error = null;
        // Выполняем валидацию формы
        await this.$refs.formRef.validate();
        // Логируем данные, отправляемые в API
        console.log('Отправляемые данные:', this.news);
        // Выполняем запрос на создание новости
        const response = await createNews(this.news);
        // Логируем ответ от API
        console.log('Ответ от API:', response);
        // Перенаправляем пользователя по указанному пути
        this.$router.push('/news');
      } catch (err) {
        // Логируем ошибку в консоль
        console.error('Ошибка при создании новости:', err);
        // Проверяем, является ли ошибка результатом валидации API
        if (err.response && err.response.status === 422) {
          // Устанавливаем сообщение об ошибках валидации
          this.error = 'Ошибки валидации: ' + JSON.stringify(err.response.data.errors || {});
        } else {
          // Устанавливаем общее сообщение об ошибке
          this.error = 'Ошибка при создании новости: ' + (err.message || 'Неизвестная ошибка');
        }
      } finally {
        // Сбрасываем флаг отправки
        this.submitting = false;
      }
    }
  },

  // Выполнение при монтировании компонента
  async mounted() {
    await this.initializeDatepicker();// Запуск выбора даты
    await this.loadStatuses();// Запуск загрузки статусов
  },

  beforeUnmount() {
    // Проверка наличия AirDatepicker
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();// Уничтожение
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

/* Стиль для заголовков полей формы */
.news-card :deep(.n-form-item-label) {
  color: #2d7a4b;
  font-size: 14px;
  font-weight: 500;
}

/* Стиль для полей ввода и текстовых областей */
.news-card :deep(.n-input__input-el),
.news-card :deep(.n-input__textarea-el) {
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  background-color: #ffffff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* Стиль для полей при фокусе */
.news-card :deep(.n-input__input-el:focus),
.news-card :deep(.n-input__textarea-el:focus) {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
  outline: none;
}

/* Стиль для текстовой области */
.news-card :deep(.n-input__textarea-el) {
  min-height: 100px;
  resize: vertical;
}

/* Стиль для сообщений об ошибках валидации */
.news-card :deep(.n-form-item-feedback) {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

/* Стиль для кнопки */
.news-card :deep(.n-button) {
  font-weight: 500;
  margin-top: 12px;
  cursor: pointer;
}

/* Стиль для отключенной кнопки (пока не нужно)*/
.news-card :deep(.n-button--disabled) {
  background-color: #cccccc;
  border-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

/* Стиль для блока оповещения */
.news-card :deep(.n-alert) {
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
}

/* Стиль для оповещения об ошибке */
.news-card :deep(.n-alert--error-type) {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}
</style>
