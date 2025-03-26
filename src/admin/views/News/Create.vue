<template>
  <div>
    <div class="card">
      <div class="card-header">
        Создание новости
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="name" class="form-label">Заголовок</label>
            <input v-model="news.name" id="name" class="form-control" type="text" />
            <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Описание</label>
            <textarea class="form-control" v-model="news.description" id="description"></textarea>
            <div v-if="errors.description" class="text-danger">{{ errors.description[0] }}</div>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label">Статус</label>
            <select v-model="news.status" id="status" class="form-control">
              <option v-for="(label, value) in statuses" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
            <div v-if="errors.status" class="text-danger">{{ errors.status[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="date" class="form-label">Дата</label>
            <input v-model="formattedDate" id="date" ref="datepicker" type="text" class="form-control" :placeholder="placeholderText" />
            <div v-if="errors.date" class="text-danger">{{ errors.date[0] }}</div>
          </div>

          <button type="submit" class="btn btn-primary">Создать новость</button>
        </form>

        <!-- Общая ошибка -->
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNews, getNewsStatuses } from '@/admin/api/news';
import AirDatepicker from 'air-datepicker';
import dayjs from "dayjs";

export default {
  name: "NewsCreate",

  data() {
    return {
      news: {
        name: '',
        description: '',
        status: '',
        date: '',
      },
      statuses: {},
      formattedDate: '',
      placeholderText: 'Выберите дату',
      error: null,
      errors: {}, // Объект для хранения ошибок валидации
      datepickerInstance: null,
    };
  },

  async mounted() {
    await this.initializeDatepicker();
    await this.loadStatuses();
  },

  beforeUnmount() {
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy(); // Очищаем Datepicker при уходе
    }
  },

  methods: {
    initializeDatepicker() {
      this.datepickerInstance = new AirDatepicker(this.$refs.datepicker, {
        timepicker: true,
        selectedDates: [],
        onSelect: ({ date }) => {
          if (date) {
            // Храним дату без изменения формата
            this.news.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            // Отображаем дату в нужном формате
            this.formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');
          }
        },
      });
    },

    async submitForm() {
      try {
        this.error = null;
        this.errors = {}; // Очищаем ошибки перед отправкой

        await createNews(this.news);
        this.$router.push('/news');

      } catch (error) {
        console.error('Ошибка при создании новости:', error);

        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors; // Записываем ошибки валидации
        } else {
          this.error = 'Ошибка при создании новости';
        }
      }
    },

    //clearError(field) {
    //  if (this.errors[field]) {
    //    this.$delete(this.errors, field);
    //  }
    //},

    async loadStatuses() {
      try {
        this.statuses = await getNewsStatuses();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
      }
    }

  }
};
</script>

<style scoped>

/* Стили для заголовка */
.card-header {
  background-color: #d4edda;
  color: #2d7a4b;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}

/* Стили для тела */
.card-body {
  padding: 20px;
}

.error-message {
  color: red;
  font-size: 14px;
}

</style>
