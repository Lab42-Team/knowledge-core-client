<template>
  <a-table class="panel-card" v-if="columns.length" :columns="columns" :data-source="developments" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <n-space>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'DevelopmentsShow', params: { id: record.id } })">
                <i class="bi bi-eye"></i>
              </n-button>
            </template>
            {{ $t('TABLE.DEVELOPMENTS.TOOLTIP_ACTIONS.VIEW') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button
                  type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'DevelopmentsEdit', params: { id: record.id } })">
                <i class="bi bi-pencil"></i>
              </n-button>
            </template>
            {{ $t('TABLE.DEVELOPMENTS.TOOLTIP_ACTIONS.EDIT') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="error" size="small" class="action-button mini-button"
                  @click="handleDeleteDevelopments(record.id)">
                <i class="bi bi-trash"></i>
              </n-button>
            </template>
            {{ $t('TABLE.DEVELOPMENTS.TOOLTIP_ACTIONS.DELETE') }}
          </n-tooltip>
        </n-space>
      </template>
    </template>
  </a-table>
</template>

<script>
import { deleteDevelopments } from '@/admin/api/developments';
import dayjs from 'dayjs';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { h } from 'vue';
import { NCard, NButton, NSpace, NTooltip, useMessage } from 'naive-ui';
import YearFilter from '@/admin/components/YearFilter.vue';

export default {
  name: 'DevelopmentsTable',

  props: {
    developments: {
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
    return {};
  },

  computed: {
    columns() {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 64 },
        {
          title: this.$t('TABLE.DEVELOPMENTS.NAME'),
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          showSorterTooltip: { title: this.$t('TABLE.DEVELOPMENTS.SORT.NAME') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return h('div', { style: 'padding: 8px' }, [
              h(Input, {
                type: 'text',
                value: selectedKeys[0],
                onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                placeholder: this.$t('TABLE.DEVELOPMENTS.SEARCH.NAME'),
                style: 'width: 188px; margin-bottom: 8px; display: block',
                onPressEnter: () => confirm(),
              }),
              h('div', { style: 'display: flex; justify-content: space-between' }, [
                h(Button, { type: 'primary', size: 'small', onClick: () => confirm() }, () => this.$t('TABLE.DEVELOPMENTS.SEARCH.BUTTON')),
                h(Button, { size: 'small', onClick: () => clearFilters() }, () => this.$t('TABLE.DEVELOPMENTS.RESET.BUTTON')),
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
        {
          title: this.$t('TABLE.DEVELOPMENTS.YEAR'),
          dataIndex: 'year',
          key: 'year',
          sorter: (a, b) => {
            const yearA = a.year ? dayjs(a.year).year() : 0; // Используем 0 для null
            const yearB = b.year ? dayjs(b.year).year() : 0;
            return yearA - yearB;
          },
          showSorterTooltip: { title: this.$t('TABLE.DEVELOPMENTS.SORT.YEAR') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
            return h(YearFilter, { setSelectedKeys, selectedKeys, confirm });
          },
          onFilter: (value, record) => {
            if (!value) return true;
            const selectedYear = parseInt(value, 10); // Год из фильтра (число)
            const recordYear = record.year ? dayjs(record.year).year() : null;
            return recordYear === selectedYear;
          },
          filterIcon: filtered => h('i', { class: `bi bi-search${filtered ? ' filtered' : ''}` }),
          customRender: ({ text }) => (text ? dayjs(text).format('YYYY') : '-'),
          width: 90,
        },
        {
          title: this.$t('TABLE.DEVELOPMENTS.AUTHORS'),
          dataIndex: 'authors',
          key: 'authors',
          customRender: ({ text }) => {
            if (!text || typeof text !== 'string') {
              return h('span', { style: { color: 'red' } }, this.$t('MESSAGE.DEVELOPMENTS.TEXT'));
            }
          },
          width: 180
        },
        {
          title: this.$t('TABLE.DEVELOPMENTS.DESCRIPTION'),
          dataIndex: 'description',
          key: 'description',
          customRender: ({ text }) => {
            if (!text || typeof text !== 'string') {
              return h('span', { style: { color: 'red' } }, this.$t('MESSAGE.DEVELOPMENTS.TEXT'));
            }
            const maxLength = 100;
            return text.length > maxLength ? `${text.slice(0, maxLength)} ...` : text;
          },
        },
        {
          title: this.$t('TABLE.DEVELOPMENTS.ACTIONS'),
          key: 'action',
          width: 130,
        },
      ];
    },
  },

  methods: {
    async handleDeleteDevelopments(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.DEVELOPMENTS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteDevelopments(id);
        this.$emit('developments-load');
        this.message.success(this.$t('MESSAGE.DEVELOPMENTS.SUCCESS.DELETE'), {
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
    YearFilter,
  },
};
</script>
