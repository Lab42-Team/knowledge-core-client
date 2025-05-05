<template>

  <!-- Рабочая таблица -->
  <a-table v-if="columns.length" :columns="columns" :data-source="news" row-key="id" :pagination="{ pageSize: 5 }" :sorter="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <router-link :to="{ name: 'NewsShow', params: { id: record.id }}" class="btn btn-outline-primary">
          <i class="bi bi-eye"></i> Просмотр
        </router-link>
        <router-link :to="{ name: 'NewsEdit', params: { id: record.id }}" class="btn btn-outline-primary">
          <i class="bi bi-pencil"></i> Изменить
        </router-link>
        <a @click.prevent="deleteNews(record.id)" href="#" class="btn btn-outline-danger">
          <i class="bi bi-trash"></i> Удалить
        </a>
      </template>
    </template>
  </a-table>

</template>

<script>

import {deleteNews, getNewsStatuses} from '@/admin/api/news';
import dayjs from "dayjs";
import { Divider, Table, Input, Button } from 'ant-design-vue'; // Импортируем компоненты
import { h } from 'vue';
export default {
  name: "Table",

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
    'a-input': Input
  },

  methods: {
    async fillingColumns() {
      try {
        const statuses = await getNewsStatuses(); // получение статусов
        this.statuses = statuses;

        // создание фильтра
        const filters = Object.entries(statuses).map(([value, text]) => ({
          text,
          value: Number(value),
        }));

        // Заполнение колонок
        this.columns = [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return h('div', { style: 'padding: 8px' }, [
                h(Input, {
                  value: selectedKeys[0],
                  onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                  placeholder: 'Поиск по названию',
                  style: 'width: 188px; margin-bottom: 8px; display: block',
                  onPressEnter: confirm
                }),
                h(Button, {
                  type: 'primary',
                  size: 'small',
                  style: 'width: 90px; margin-right: 8px',
                  onClick: confirm
                }, () => 'Поиск'),
                h(Button, {
                  size: 'small',
                  style: 'width: 90px',
                  onClick: clearFilters
                }, () => 'Сброс')
              ]);
            },
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => h('i', {
              class: `bi bi-search`
            }),
            width: 200 // Фиксированная ширина для названия
          },
          { title: 'Описание', dataIndex: 'description', key: 'description' },
          {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            filters: filters,
            onFilter: (value, record) => Number(record.status) === Number(value),
            customRender: ({ text }) => statuses[text] || 'Неизвестно',
            customHeaderCell: () => ({
              style: { fontWeight: 'bold' },
            }),
          },
          {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date), // Добавляем сортировку по дате
            customRender: ({ text }) => dayjs(text).format('DD-MM-YYYY HH:mm'),
            customHeaderCell: () => ({
              style: { fontWeight: 'bold' } // Делаем заголовок жирным
            }),
          },
          { title: 'Действия', key: 'action' },
        ];
      } catch (error) {
        console.error('Ошибка заполнения колонок:', error);
      }
    },

    // Переход на страницу для удаления новости
    goToShowPage(newsItem) {
      console.log("Просмотр записи:", newsItem);
      this.$router.push({ name: 'NewsShow', params: { id: newsItem.id } });
    },

    // Переход на страницу для редактирования новости
    showEditModal(newsItem) {
      console.log('Редактировать запись:', newsItem);
      this.$router.push({ name: 'NewsEdit', params: { id: newsItem.id } });
    },


    // Метод удаления новости
    async deleteNews(newsItem) {
      const confirmDelete = confirm('Вы уверены, что хотите удалить эту новость?');
      if (!confirmDelete) return;  // Если пользователь отменил, не делаем ничего

      try {
        console.log("да удалить");
        await deleteNews(newsItem.id);
        this.$parent.loadNews();
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        this.error = 'Ошибка при удалении новости';
      }
    },

  },
}
</script>

<style scoped>

/* Таблица */
.table {
  width: 100%; /* Таблица растягивается на весь экран */
  border-collapse: collapse;
}

/* Стили для ячеек таблицы */
.table th, .table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

/* Одинаковый фон для всех строк */
.table-striped tbody tr {
  background-color: #f2fdf2;  /* Очень светлый зеленый для всех строк */
}

/* Убираем изменение цвета для порядкового номера в строках */
.table-striped tbody tr th {
  background-color: transparent; /* Убираем фоновый цвет для номера */
}

/* Стили для строк при наведении */
.table-striped tbody tr:hover {
  background-color: #cce5d4; /* Светлый зеленый при наведении */
}

/* Заголовки таблицы */
.table th {
  background-color: #d4edda;  /* Основной светло-зеленый фон для заголовков */
}

/* Цвет ссылок */
.table td a {
  color: #2d7a4b;
  text-decoration: none;
}

.table td a:hover {
  text-decoration: underline;
}


</style>
