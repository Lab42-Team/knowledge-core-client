<template>
  <n-card size="medium" :bordered="true" class="news-table">
    <a-table v-if="columns.length" :columns="columns" :data-source="news" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <n-space>
            <n-tooltip trigger="hover" :show-arrow="true">
              <template #trigger>
                <n-button
                    type="primary"
                    size="small"
                    class="action-button"
                    @click="$router.push({ name: 'NewsShow', params: { id: record.id } })"
                >
                  <i class="bi bi-eye"></i>
                </n-button>
              </template>
              Просмотр
            </n-tooltip>
            <n-tooltip trigger="hover" :show-arrow="true" :show="true">
              <template #trigger>
                <n-button
                    type="primary"
                    size="small"
                    class="action-button"
                    @click="$router.push({ name: 'NewsEdit', params: { id: record.id } })"
                >
                  <i class="bi bi-pencil"></i>
                </n-button>
              </template>
              Изменить
            </n-tooltip>
            <n-tooltip trigger="hover" :show-arrow="true">
              <template #trigger>
                <n-button
                    type="error"
                    size="small"
                    class="action-button"
                    @click="deleteNews(record.id)"
                >
                  <i class="bi bi-trash"></i>
                </n-button>
              </template>
              Удалить
            </n-tooltip>
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
import { NCard, NButton, NSpace, NTooltip } from 'naive-ui';
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
    NTooltip,
    DateFilter,
  },

  methods: {
    async fillingColumns() {
      try {
        const statuses = await getNewsStatuses();
        this.statuses = statuses;

        const filters = Object.entries(statuses).map(([value, text]) => ({
          text,
          value: Number(value),
        }));

        this.columns = [
          { title: 'ID', dataIndex: 'id', key: 'id', width: 64 },
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            showSorterTooltip: { title: 'Сортировать название' },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return h('div', { style: 'padding: 8px' }, [
                h(Input, {
                  type: 'text',
                  value: selectedKeys[0],
                  onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                  placeholder: 'Введите название',
                  style: 'width: 188px; margin-bottom: 8px; display: block',
                  onPressEnter: () => confirm(),
                }),
                h('div', { style: 'display: flex; justify-content: space-between' }, [
                  h(Button, {
                    type: 'primary',
                    size: 'small',
                    onClick: () => confirm(),
                  }, () => 'Поиск'),
                  h(Button, {
                    size: 'small',
                    onClick: () => clearFilters(),
                  }, () => 'Сброс'),
                ]),
              ]);
            },
            onFilter: (value, record) => {
              if (typeof record.name !== 'string') return false;
              return record.name.toLowerCase().includes(value.toLowerCase());
            },
            filterIcon: filtered => h('i', { class: filtered ? 'bi bi-funnel-fill' : 'bi bi-funnel' }),
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
            showSorterTooltip: { title: 'Сортировать дату' },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
              return h(DateFilter, { setSelectedKeys, confirm });
            },
            onFilter: (value, record) => {
              if (!value) return true;
              const selectedDate = dayjs(value, 'DD-MM-YYYY').startOf('day');
              const recordDate = dayjs(record.date).startOf('day');
              return selectedDate.isSame(recordDate);
            },
            filterIcon: filtered => h('i', { class: `bi bi-search${filtered ? ' filtered' : ''}` }),
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

    async deleteNews(id) {
      const confirmDelete = confirm('Вы уверены, что хотите удалить эту новость?');
      if (!confirmDelete) return;

      try {
        console.debug('Удаление новости ID:', id);
        await deleteNews(id);
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
  padding: 0;
}

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

:deep(.ant-table-thead > tr > th) {
  background-color: #d4edda;
  color: black;
  font-weight: bold;
  font-size: 14px;
  padding: 12px;
  border-bottom: 1px solid #2d7a4b;
  box-shadow: 0 2px 4px #d4edda;
  transition: background-color 0.3s;
}

:deep(.ant-table-column-title) {
  font-weight: bold;
}

:deep(.ant-table-thead > tr > th:hover) {
  background-color: #cce5d4;
}

:deep(.ant-table-tbody > tr) {
  background-color: #ffffff;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: #f2fdf2;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 10px;
  color: black;
  border-bottom: 1px solid #e8e8e8;
}

:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 4px;
  margin-right: 0;
  transition: background-color 0.3s, color 0.3s;
  width: 32px;
  height: 32px;
}

.n-button i {
  font-size: 16px;
}

:deep(.ant-pagination) {
  padding: 0 12px;
}

:deep(.ant-pagination-item) {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-right: 8px;
}

:deep(.ant-pagination-item a) {
  color: #2d7a4b;
}

:deep(.ant-pagination-item:hover) {
  border-color: #18a058;
  background-color: #18a058 !important;
}

:deep(.ant-pagination-item:hover a) {
  color: #ffffff;
}

:deep(.ant-pagination-item-active) {
  background-color: #18a058;
  border-color: #18a058;
}

:deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #2d7a4b;
}

:deep(.ant-pagination-prev.ant-pagination-disabled .ant-pagination-item-link),
:deep(.ant-pagination-next.ant-pagination-disabled .ant-pagination-item-link) {
  color: #d9d9d9;
}

:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  border-color: #18a058;
  background-color: #18a058;
  color: #ffffff;
}

:deep(.ant-pagination-prev.ant-pagination-disabled:hover .ant-pagination-item-link),
:deep(.ant-pagination-next.ant-pagination-disabled:hover .ant-pagination-item-link) {
  color: #d9d9d9;
  border-color: #d9d9d9;
}

.bi-search {
  font-size: 14px;
  color: #595959;
  transition: color 0.3s;
}

.bi-search.filtered {
  color: #1890ff;
}
</style>
