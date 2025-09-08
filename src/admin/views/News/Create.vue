<template>
  <n-card :title="$t('PAGE.NEWS.CREATE')" size="medium" :bordered="true" class="panel-card">
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
        <n-input
            v-model:value="formattedDate"
            :placeholder="$t('TABLE.PLACEHOLDER.DATE')"
            ref="datepicker"
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
        {{ $t('BUTTON.CREATE_NEWS') }}
      </n-button>
    </n-form>
    <n-alert v-if="errorList.length" type="error" class="mt-3">
      <div>
        {{ $t('MESSAGE.ERROR.CREATING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert} from 'naive-ui';
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
    const today = dayjs(); // Текущая дата и время
    return {
      news: {
        name: '',
        description: '',
        status: null,
        date: today.format('YYYY-MM-DD HH:mm:ss'), // Формат для API (по умолчанию текущая дата)
      },
      statuses: {}, // Список статусов, полученных из API
      formattedDate: today.format('DD.MM.YYYY HH:mm'), // Переменная для отображения форматированной даты (по умолчанию текущая дата)
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      datepickerInstance: null,
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
      return Object.entries(this.statuses).map(([value, label]) => ({ label, value }));
    }
  },

  methods: {
    // Инициализация AirDatepicker для поля выбора даты
    initializeDatepicker() {
      const today = new Date(); // Текущая дата для AirDatepicker
      // Создание AirDatepicker, привязанный к элементу input
      this.datepickerInstance = new AirDatepicker(this.$refs.datepicker.$el.querySelector('input'), {
        timepicker: true,// Включаем выбор времени
        selectedDates: [today], // Устанавливаем текущую дату по умолчанию
        // Обработчик выбора даты
        onSelect: ({ date }) => {
          // Проверка, выбрана ли дата
          if (date) {
            this.news.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');//Форматирование даты для отправки в API
            this.formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');//Форматирование даты для отображения пользователю
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
        //console.log('Отправляемые данные:', this.news);
        // Выполняем запрос на создание новости
        const response = await createNews(this.news);
        // Логируем ответ от API
        //console.log('Ответ от API:', response);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/news/show/' + response.id,
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
    await this.initializeDatepicker();// Запуск выбора даты
    await this.loadStatuses();// Запуск загрузки статусов
  },

  beforeUnmount() {
    // Проверка наличия AirDatepicker
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();
    }
  }
};
</script>
