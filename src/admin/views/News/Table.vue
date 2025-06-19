<template>
  <n-card size="medium" :bordered="true" class="news-table">
    <a-table v-if="columns.length" :columns="columns" :data-source="news" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <n-space>
            <n-button type="primary"size="small" class="action-button" title="Просмотр" @click="$router.push({ name: 'NewsShow', params: { id: record.id } })">
              <i class="bi bi-eye"></i>
            </n-button>
            <n-button type="primary" size="small" class="action-button" title="Изменить" @click="$router.push({ name: 'NewsEdit', params: { id: record.id } })">
              <i class="bi bi-pencil"></i>
            </n-button>
            <n-button type="error" size="small" class="action-button" title="Удалить" @click="deleteNews(record.id)">
              <i class="bi bi-trash"></i>
            </n-button>
          </n-space>
        </template>
      </template>
    </a-table>
  </n-card>
</template>

<script>
import { deleteNews, getNewsStatuses } from '@/admin/api/news';
import dayjs from 'dayjs';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { h } from 'vue';
import { NCard, NButton, NSpace } from 'naive-ui';
import DateFilter from '@/admin/components/DateFilter.vue';

export default {
  name: 'NewsTable',

  props: {
    news: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      statuses: {},
      searchText: '',
      columns: [],
    };
  },

  async mounted() {
    await this.fillingColumns();
  },

  components: {
    'a-button': Button,
    'a-divider': Divider,
    'a-table': Table,
    'a-input': Input,
    NCard,
    NButton,
    NSpace,
    DateFilter,
  },

  methods: {
    // Асинхронное заполнение таблицы
    async fillingColumns() {
      try {
        // Получение статусов новостей через API
        const statuses = await getNewsStatuses();
        this.statuses = statuses;

        // Создание массива фильтров для колонки
        const filters = Object.entries(statuses).map(([value, text]) => ({
          // Текст фильтра
          text,
          // Значение фильтра
          value: Number(value),
        }));

        // Создание массива колонок для таблицы
        this.columns = [
          { title: 'ID', dataIndex: 'id', key: 'id', width: 64 },
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            // Сортировка по алфавиту
            sorter: (a, b) => a.name.localeCompare(b.name),
            showSorterTooltip: {
              title: 'Сортировать название',
            },
            // Выпадающий фильтр
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return h('div', { style: 'padding: 8px' }, /* Контейнер фильтра */ [
                h(Input, {
                  type: 'text',// Поле — текстовый ввод
                  value: selectedKeys[0],// Текущее значение фильтра
                  onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),// Обработчик ввода для обновления фильтра
                  placeholder: 'Введите название',// Плейсхолдер для поля ввода
                  style: 'width: 188px; margin-bottom: 8px; display: block',// Стиль для поля ввода
                  onPressEnter: () => confirm(),// Нажатие Enter
                }),
                h('div', { style: 'display: flex; justify-content: space-between' }, /* Контейнер кнопок */ [
                  h(Button, {
                    type: 'primary',// Тип кнопки
                    size: 'small',// Размер кнопки
                    onClick: () => confirm(),// Обработчик клика для поиска
                  }, () => 'Поиск'), // Текст кнопки
                  h(Button, {
                    size: 'small',// Размер кнопки
                    onClick: () => clearFilters(),// Обработчик клика для сброса фильтров
                  }, () => 'Сброс'), // Текст кнопки
                ]),
              ]);
            },
            // Фильтрация по названию
            onFilter: (value, record) => {
              // Проверяем, что record.name существует и является строкой
              if (typeof record.name !== 'string') return false;
              // Сравниваем название (регистронезависимо) с введённым значением
              return record.name.toLowerCase().includes(value.toLowerCase());
            },
            // Иконка фильтра, меняется в зависимости от состояния
            filterIcon: filtered => h('i', { class: filtered ? 'bi bi-funnel-fill' : 'bi bi-funnel' }),
            // Ширина колонки
            width: 200,
          },
          { title: 'Описание', dataIndex: 'description', key: 'description', width: 300 },
          {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            filters,
            onFilter: (value, record) => Number(record.status) === Number(value),
            customRender: ({ text }) => this.statuses[text] || 'Неизвестно',
            width: 150,
          },
          {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            // Настройка выпадающего фильтра для столбца "Дата"
            // setSelectedKeys — функция для установки выбранных значений фильтра
            // selectedKeys — текущие выбранные значения фильтра
            // confirm — функция для подтверждения применения фильтра
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => {
              return h(DateFilter, { setSelectedKeys, confirm,});
            },
            // Функция фильтрации записей таблицы
            // value — значение фильтра (выбранная дата в формате 'DD-MM-YYYY')
            // record — текущая запись таблицы
            onFilter: (value, record) => {
              // Если значение фильтра отсутствует, возвращаем true (показываем все записи)
              if (!value) return true;
              // Преобразование выбранной даты в объект dayjs и устанавка начало дня (00:00:00), для игнорирования времени
              const selectedDate = dayjs(value, 'DD-MM-YYYY').startOf('day');
              // Преобразование даты записи в объект dayjs и устанавка начала дня для сравнения
              const recordDate = dayjs(record.date).startOf('day');
              // Сравнение даты, true, если они совпадают
              return selectedDate.isSame(recordDate);
            },
            // Настройка иконки фильтра
            // Параметр filtered: true - фильтр активен, false - фильтр неактивен
            filterIcon: (filtered) =>
                h('i', {
                  // всегда 'bi bi-search', 'filtered' для активного фильтра
                  class: `bi bi-search${filtered ? ' filtered' : ''}`,
                }),
            // Форматирование даты с помощью dayjs
            customRender: ({ text }) => dayjs(text).format('DD-MM-YYYY HH:mm'),
            width: 180,
          },
          {
            title: 'Действия',
            key: 'action',
            width: 120,
          },
        ];
        console.debug('Колонки сформированы:', this.columns);
      } catch (error) {
        console.error('Ошибка заполнения колонок:', error);
      }
    },

    // Удаления новости
    async deleteNews(id) {
      // Запрос подтверждения удаления
      const confirmDelete = confirm('Вы уверены, что хотите удалить эту новость?');
      // Если отмена тогда выход
      if (!confirmDelete) return;

      try {
        console.debug('Удаление новости ID:', id);
        // Вызов API для удаления новости
        await deleteNews(id);
        // Обновления списка
        this.$emit('news-load');
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        this.error = 'Ошибка при удалении новости';
      }
    },
  },
};
</script>

<style scoped>
.news-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #d4edda;
}

.news-table :deep(.n-card__content) {
  padding: 0px;
}

/* Стили для контейнера таблицы Ant Design */
:deep(.ant-table-wrapper) {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-table) {
  background-color: #ffffff;
}

:deep(.ant-table-thead) {
  background-color: #d4edda;
}

/* Стиль заголовков столбцов */
:deep(.ant-table-thead > tr > th) {
  /* Цвет фона */
  background-color: #d4edda;
  /* Стиль текста */
  color: black;
  font-weight: 600;
  font-size: 14px;
  /* Отступы внутри ячеек заголовков */
  padding: 12px;
  /* Граница снизу*/
  border-bottom: 1px solid #2d7a4b;
  box-shadow: 0 2px 4px #d4edda;
  /* Переход фона при наведении */
  transition: background-color 0.3s;
}

/* Эффект наведения на заголовки столбцов */
:deep(.ant-table-thead > tr > th:hover) {
  background-color: #cce5d4;
}

/* Стили для строк таблицы */
:deep(.ant-table-tbody > tr) {
  background-color: #ffffff;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: #f2fdf2;
}

/* Стили ячеек таблицы */
:deep(.ant-table-tbody > tr > td) {
  /* Отступы внутри ячеек */
  padding: 10px;
  /* Цвет текста */
  color: black;
  /* Разделение строк */
  border-bottom: 1px solid #e8e8e8;
}

/* Стиль кнопок действий */
:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0px;/* Отступ внутри кнопки */
  border-radius: 4px;
  margin-right: 0px;/* Отступ справа*/
  transition: background-color 0.3s, color 0.3s;/* Плавный переход при наведении */
  width: 32px;
  height: 32px;
}

/* Стиль кнопки (просмотр, редактирование) */
.n-button--primary-type {
  background-color: #36BE76;
  color: #ffffff;/* Цвет текста */
  border: 1px solid #36BE76;
}

/* Стиль кнопки при наведении (просмотр, редактирование) */
.n-button--primary-type:hover {
  background-color: #159b51;
  border-color: #159b51;
}

/* Стиль кнопки (удаление) */
.n-button--error-type {
  background-color: #ff4d4f;
  color: #ffffff;/* Цвет текста */
  border: 1px solid #ff4d4f;
}

/* Стиль кнопки при наведении (удаление) */
.n-button--error-type:hover {
  background-color: #e64446;
  border-color: #e64446;
}

/* Стиль для иконок в кнопках */
.n-button i {
  font-size: 16px;/* Размер шрифта */
}

/* Стиль пагинации */
:deep(.ant-pagination) {
  /* Внутренние отступы для выравнивания */
  padding: 0 12px;
}

/* Стиль элементов пагинации */
:deep(.ant-pagination-item) {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-right: 8px;/* Отступ справа */
}

/* Стиль ссылок пагинации */
:deep(.ant-pagination-item a) {
  /* Цвет текста */
  color: #2d7a4b;
}

/* Стиль при наведения для элементов пагинации */
:deep(.ant-pagination-item:hover) {
  border-color: #18a058;/* Граница при наведении */
  background-color: #18a058 !important;
}

/* Текст при наведении на элементы пагинации */
:deep(.ant-pagination-item:hover a) {
  color: #ffffff;/* Цвет текста при наведении */
}

/* Стиль активного элемента пагинации */
:deep(.ant-pagination-item-active) {
  background-color: #18a058;/* Фон активного элемента */
  border-color: #18a058;/* Граница */
}

/* Текст активного элемента пагинации */
:deep(.ant-pagination-item-active a) {
  color: #ffffff;/* Цвет текста */
}

/* Стиль кнопок "предыдущая" и "следующая" */
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #2d7a4b;
}

/* Стиль неактивных кнопок*/
:deep(.ant-pagination-prev.ant-pagination-disabled .ant-pagination-item-link),
:deep(.ant-pagination-next.ant-pagination-disabled .ant-pagination-item-link) {
  color: #d9d9d9;
}

/* Стиль кнопок при наведении */
:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  border-color: #18a058;
  background-color: #18a058;
  color: #ffffff;
}

/* Стиль неактивных кнопок при наведении*/
:deep(.ant-pagination-prev.ant-pagination-disabled:hover .ant-pagination-item-link),
:deep(.ant-pagination-next.ant-pagination-disabled:hover .ant-pagination-item-link) {
  color: #d9d9d9;
  border-color: #d9d9d9;
}


/* Стили для иконки лупы */
.bi-search {
  font-size: 14px;
  color: #595959;
  transition: color 0.3s;
}

.bi-search.filtered {
  color: #1890ff;
}
</style>
