<template>
  <n-input
      ref="inputRef"
      :value="formattedDate"
      :placeholder="placeholder"
      readonly
  />
</template>

<script>
import { NInput } from 'naive-ui';
import AirDatepicker from 'air-datepicker'; // Импорт AirDatepicker
import localeRu from 'air-datepicker/locale/ru'; // Импорт русской локализации для AirDatepicker
import localeEn from 'air-datepicker/locale/en'; // Импорт английской локализации для AirDatepicker
import dayjs from 'dayjs';

export default {
  name: 'DateInput',

  components: {
    NInput,
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      datepickerInstance: null,
      formattedDate: ''
    };
  },

  // Отслеживание изменений глобальной локали
  watch: {
    // Отслеживание изменений значения модели для синхронизации с datepicker
    modelValue(newValue) {
      if (newValue) {
        this.formattedDate = dayjs(newValue).format('DD.MM.YYYY HH:mm');
        if (this.datepickerInstance && new Date(newValue)) {
          this.datepickerInstance.selectDate(new Date(newValue));
        }
      } else {
        this.formattedDate = '';
        if (this.datepickerInstance) {
          this.datepickerInstance.clear();
        }
      }
    },

    // Отслеживание изменений глобальной локали для обновления datepicker
    '$i18n.locale'(newLocale) {
      this.updateLocale(newLocale);
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Инициализация с текущей локалью
      this.initDatepicker(this.$i18n.locale);
    });
  },

  beforeUnmount() {
    // Уничтожение экземпляра datepicker перед удалением компонента для предотвращения утечек памяти
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();
      this.datepickerInstance = null;
    }
  },

  methods: {
    // Метод для инициализации или переинициализации datepicker с указанной локалью
    initDatepicker(locale) {
      // Проверка наличия ref и DOM-элемента input
      if (!this.$refs.inputRef || !this.$refs.inputRef.$el) {
        return;
      }

      const inputElement = this.$refs.inputRef.$el.querySelector('input');
      if (!inputElement) {
        return;
      }

      // Определение базовой локализации из AirDatepicker
      const baseLocale = locale === 'ru' ? localeRu : localeEn;

      // Устанавление начальной отформатированной даты
      if (this.modelValue) {
        this.formattedDate = dayjs(this.modelValue).format('DD.MM.YYYY HH:mm');
      } else {
        // Для Create.vue по умолчанию текущая дата
        const today = dayjs();
        this.formattedDate = today.format('DD.MM.YYYY HH:mm');
        this.$emit('update:modelValue', today.format('YYYY-MM-DD HH:mm:ss'));
      }

      // Уничтожение предыдущего экземпляра, если он существует (для переинициализации)
      if (this.datepickerInstance) {
        this.datepickerInstance.destroy();
      }

      // Инициализация AirDatepicker с настройками и кастомной локализацией
      this.datepickerInstance = new AirDatepicker(inputElement, {
        timepicker: true, // Включение выбора времени
        locale: baseLocale, // Применение локализации
        selectedDates: this.modelValue ? [new Date(this.modelValue)] : [new Date()], // Начальная выбранная дата
        multipleDates: false, // Запрет множественного выбора дат
        position: 'bottom left', // Позиционирование календаря относительно input

        // Обработчик выбора даты/времени
        onSelect: ({ date }) => {
          if (date) {
            const apiDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss'); // Формат для API
            const displayDate = dayjs(date).format('DD.MM.YYYY HH:mm'); // Формат для отображения
            this.formattedDate = displayDate;
            this.$emit('update:modelValue', apiDate); // Эмит события обновления модели
          }
        }
      });
    },

    // Метод для обновления локали при её смене (переинициализация datepicker)
    updateLocale(newLocale) {
      this.initDatepicker(newLocale);
    },
  }
};
</script>
