<template>
  <div>
    <!-- Скрытое поле для AirDatepicker -->
    <input ref="datepickerRef" type="text" style="display: none;" />
  </div>
</template>

<script>
import AirDatepicker from 'air-datepicker'; // Импорт AirDatepicker
import localeRu from 'air-datepicker/locale/ru'; // Импорт русской локализации для AirDatepicker

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

  // вызывается после монтирования компонента в DOM
  mounted() {
    // Проверка, что ref привязан к DOM-элементу input
    if (this.$refs.datepickerRef) {
      // Инициализация AirDatepicker с настройками
      this.datepickerInstance = new AirDatepicker(this.$refs.datepickerRef, {
        dateFormat: 'dd-MM-yyyy', // Формат даты: день-месяц-год
        autoClose: true, // Закрывать календарь после выбора даты
        locale: localeRu, // Применение русской локализации
        buttons: ['today', 'clear'], // Кнопки "Сегодня" и "Очистить" в интерфейсе
        inline: true, // Отображение календаря сразу без клика по полю

        // Обработчик выбора даты
        onSelect: ({ formattedDate }) => {
          // Установка выбранной даты как ключа фильтра или пустого массива при очистке
          this.setSelectedKeys(formattedDate ? [formattedDate] : []);
          // Автоматическое применение фильтра к таблице
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

  // перед удалением компонента из DOM
  beforeDestroy() {
    // Проверка существования экземпляра AirDatepicker
    if (this.datepickerInstance) {
      // Уничтожение календаря для предотвращения утечек памяти
      this.datepickerInstance.destroy();
    }
  },
};
</script>
