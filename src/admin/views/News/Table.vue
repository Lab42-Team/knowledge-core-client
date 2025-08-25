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
                    class="action-button mini-button"
                    @click="$router.push({ name: 'NewsShow', params: { id: record.id } })"
                >
                  <i class="bi bi-eye"></i>
                </n-button>
              </template>
              Просмотр
            </n-tooltip>
            <n-tooltip trigger="hover" :show-arrow="true">
              <template #trigger>
                <n-button
                    type="primary"
                    size="small"
                    class="action-button mini-button"
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
                    class="action-button mini-button"
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
import { NCard, NButton, NSpace, NTooltip, useMessage } from 'naive-ui';
import DateFilter from '@/admin/components/DateFilter.vue';

export default {
  name: 'NewsTable',

  props: {
    news: {
      type: Array,
      required: true,
    },
  },

  setup() {
    // Инициализация useMessage для уведомлений
    const message = useMessage();
    return { message };
  },

  data() {
    return {
      statuses: {},
      searchText: '',
      columns: [],
    };
  },

  async mounted() {
    // Проверяем параметр success в запросе
    if (this.$route.query.success === 'true') {
      this.message.success('Новость успешно создана!', {
        duration: 4000,
        closable: true,
      });
      // Очищаем параметр success из URL
      this.$router.replace({ path: '/news', query: {} });
    }
    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success('Новость успешно изменена!', {
        duration: 4000,
        closable: true,
      });
      // Очищаем параметр success из URL
      this.$router.replace({ path: '/news', query: {} });
    }
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
          //{ title: 'Описание', dataIndex: 'description', key: 'description', width: 300 },
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
              const selectedDate = dayjs(value, 'DD.MM.YYYY').startOf('day');
              const recordDate = dayjs(record.date).startOf('day');
              return selectedDate.isSame(recordDate);
            },
            filterIcon: filtered => h('i', { class: `bi bi-search${filtered ? ' filtered' : ''}` }),
            customRender: ({ text }) => dayjs(text).format('DD.MM.YYYY HH:mm'),
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
        this.message.success('Новость успешно удалена!', {
          duration: 4000,
          closable: true,
        });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        this.error = 'Ошибка при удалении новости';
      }
    },
  },
};
</script>
