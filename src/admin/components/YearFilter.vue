<template>
  <div>
    <!-- Скрытое поле для AirDatepicker -->
    <input ref="datepickerRef" type="text" style="display: none;" />
  </div>
</template>

<script>
import AirDatepicker from 'air-datepicker'; // Импорт AirDatepicker
import localeRu from 'air-datepicker/locale/ru'; // Импорт русской локализации для AirDatepicker
import localeEn from 'air-datepicker/locale/en'; // Импорт английской локализации для AirDatepicker

export default {
  name: 'DateFilter',

  // Определение входных параметров (props) компонента
  props: {
    setSelectedKeys: { type: Function, required: true }, // Функция для установки выбранных дат в фильтре
    confirm: { type: Function, required: true }, // Функция для подтверждения применения фильтра
  },

  data() {
    return {
      datepickerInstance: null, // Переменная для хранения экземпляра AirDatepicker
    };
  },

  // Отслеживание изменений глобальной локали
  watch: {
    '$i18n.locale'(newLocale) {
      this.updateLocale(newLocale);
    },
  },

  // После монтирования компонента в DOM
  mounted() {
    // Инициализация с текущей локалью
    this.initDatepicker(this.$i18n.locale);
  },

  // Перед удалением компонента из DOM
  beforeUnmount() { // В Vue 3 Options API используем beforeUnmount вместо beforeDestroy
    if (this.datepickerInstance) {
      this.datepickerInstance.destroy();
    }
  },

  methods: {
    // Инициализации или переинициализации datepicker
    initDatepicker(locale) {
      if (this.$refs.datepickerRef) {
        // Определение базовой локализации из AirDatepicker
        const baseLocale = locale === 'ru' ? localeRu : localeEn;

        // Уничтожение предыдущего экземпляра, если он существует
        if (this.datepickerInstance) {
          this.datepickerInstance.destroy();
        }

        // Инициализация AirDatepicker с настройками
        this.datepickerInstance = new AirDatepicker(this.$refs.datepickerRef, {
          view: 'years',
          minView: 'years',
          dateFormat: 'yyyy', // Формат даты: день-месяц-год
          autoClose: true, // Закрывать календарь после выбора даты
          locale: baseLocale,
          buttons: ['clear'], // Кнопка "Очистить" в интерфейсе
          inline: true, // Отображение календаря сразу без клика по полю
          onSelect: ({ date, formattedDate }) => {
            const year = formattedDate ? String(formattedDate) : '';
            this.setSelectedKeys(year ? [year] : []);
            this.confirm();
          },
          // Обработчик события отображения календаря
          onShow: () => {
            // Поиск DOM-элемента календаря
            const calendar = document.querySelector('.air-datepicker');
            // Установка высокого z-index для видимости календаря
            if (calendar) {
              calendar.style.zIndex = '1000';
            }
          },
        });

        // Программное открытие календаря после инициализации
        this.datepickerInstance.show();
      } else {
        // Логирование ошибки, если ref не привязан к элементу
        console.error('datepickerRef is not attached to a DOM element');
      }
    },

    // Метод для обновления локали при её смене
    updateLocale(newLocale) {
      this.initDatepicker(newLocale);
    },
  },










};
</script>
