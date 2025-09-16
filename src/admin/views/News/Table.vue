<template>
  <a-table class="panel-card" v-if="columns.length" :columns="columns" :data-source="news" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <n-space>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'NewsShow', params: { id: record.id } })">
                <i class="bi bi-eye"></i>
              </n-button>
            </template>
            {{ $t('TABLE.TOOLTIP_ACTIONS.VIEW') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button
                  type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'NewsEdit', params: { id: record.id } })">
                <i class="bi bi-pencil"></i>
              </n-button>
            </template>
            {{ $t('TABLE.TOOLTIP_ACTIONS.EDIT') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="error" size="small" class="action-button mini-button"
                  @click="deleteNews(record.id)">
                <i class="bi bi-trash"></i>
              </n-button>
            </template>
            {{ $t('TABLE.TOOLTIP_ACTIONS.DELETE') }}
          </n-tooltip>
        </n-space>
      </template>
    </template>
  </a-table>
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
    };
  },

  computed: {
    columns() {
      const filters = Object.entries(this.statuses).map(([value, text]) => ({
        text,
        value: Number(value),
      }));

      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 64 },
        {
          title: this.$t('TABLE.NAME'),
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          showSorterTooltip: { title: this.$t('TABLE.SORT.NAME') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return h('div', { style: 'padding: 8px' }, [
              h(Input, {
                type: 'text',
                value: selectedKeys[0],
                onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                placeholder: this.$t('TABLE.SEARCH.NAME'),
                style: 'width: 188px; margin-bottom: 8px; display: block',
                onPressEnter: () => confirm(),
              }),
              h('div', { style: 'display: flex; justify-content: space-between' }, [
                h(Button, { type: 'primary', size: 'small', onClick: () => confirm() }, () => this.$t('TABLE.SEARCH.BUTTON')),
                h(Button, { size: 'small', onClick: () => clearFilters() }, () => this.$t('TABLE.RESET.BUTTON')),
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
          title: this.$t('TABLE.STATUS'),
          dataIndex: 'status',
          key: 'status',
          filters,
          onFilter: (value, record) => Number(record.status) === Number(value),
          customRender: ({ text }) => {
            return this.statuses[text];
          },
          width: 150,
        },
        {
          title: this.$t('TABLE.DATE'),
          dataIndex: 'date',
          key: 'date',
          sorter: (a, b) => new Date(a.date) - new Date(b.date),
          showSorterTooltip: { title: this.$t('TABLE.SORT.DATE') },
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
          title: this.$t('TABLE.ACTIONS'),
          key: 'action',
          width: 120,
        },
      ];
    },
  },

  watch: {
    '$i18n.locale': {
      handler() {
        this.fetchStatuses(); // Обновления статусов из API
      },
      immediate: true,
    },
  },

  methods: {
    async fetchStatuses() {
      try {
        this.statuses = await getNewsStatuses();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.STATUS'));
      }
    },

    async deleteNews(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteNews(id);
        this.$emit('news-load');
        this.message.success(this.$t('MESSAGE.SUCCESS.DELETE'), {
          duration: 4000,
          closable: true,
        });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.DELETE'));
      }
    },
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
};
</script>
