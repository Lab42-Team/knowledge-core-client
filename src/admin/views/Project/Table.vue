<template>
  <a-table class="panel-card" v-if="columns.length" :columns="columns" :data-source="project" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <n-space>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'ProjectShow', params: { id: record.id } })">
                <i class="bi bi-eye"></i>
              </n-button>
            </template>
            {{ $t('TABLE.PROJECTS.TOOLTIP_ACTIONS.VIEW') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button
                  type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'ProjectEdit', params: { id: record.id } })">
                <i class="bi bi-pencil"></i>
              </n-button>
            </template>
            {{ $t('TABLE.PROJECTS.TOOLTIP_ACTIONS.EDIT') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button
                  type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'ProjectTeam', params: { id: record.id } })">
                <i class="bi bi-people-fill"></i>
              </n-button>
            </template>
            {{ $t('TABLE.PROJECTS.TOOLTIP_ACTIONS.TEAM') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="error" size="small" class="action-button mini-button"
                  @click="deleteProject(record.id)">
                <i class="bi bi-trash"></i>
              </n-button>
            </template>
            {{ $t('TABLE.PROJECTS.TOOLTIP_ACTIONS.DELETE') }}
          </n-tooltip>
        </n-space>
      </template>
    </template>
  </a-table>
</template>

<script>
import { deleteProject, getProjectTypes, getProjectStatuses} from '@/admin/api/project';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { h } from 'vue';
import { NCard, NButton, NSpace, NTooltip, useMessage } from 'naive-ui';

export default {
  name: 'ProjectTable',

  props: {
    project: {
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
      types: {},
      searchText: '',
    };
  },

  computed: {
    columns() {
      const filters_types = Object.entries(this.types).map(([value, text]) => ({
        text,
        value: Number(value),
      }));
      const filters_statuses = Object.entries(this.statuses).map(([value, text]) => ({
        text,
        value: Number(value),
      }));

      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 64 },
        {
          title: this.$t('TABLE.PROJECTS.NAME'),
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          showSorterTooltip: { title: this.$t('TABLE.PROJECTS.SORT.NAME') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return h('div', { style: 'padding: 8px' }, [
              h(Input, {
                type: 'text',
                value: selectedKeys[0],
                onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                placeholder: this.$t('TABLE.PROJECTS.SEARCH.NAME'),
                style: 'width: 188px; margin-bottom: 8px; display: block',
                onPressEnter: () => confirm(),
              }),
              h('div', { style: 'display: flex; justify-content: space-between' }, [
                h(Button, { type: 'primary', size: 'small', onClick: () => confirm() }, () => this.$t('TABLE.PROJECTS.SEARCH.BUTTON')),
                h(Button, { size: 'small', onClick: () => clearFilters() }, () => this.$t('TABLE.PROJECTS.RESET.BUTTON')),
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
          title: this.$t('TABLE.PROJECTS.TYPE'),
          dataIndex: 'type',
          key: 'type',
          filters: filters_types,
          onFilter: (value, record) => Number(record.type) === Number(value),
          customRender: ({ text }) => {
            return this.types[text];
          },
          width: 150,
        },
        {
          title: this.$t('TABLE.PROJECTS.STATUS'),
          dataIndex: 'status',
          key: 'status',
          filters: filters_statuses,
          onFilter: (value, record) => Number(record.status) === Number(value),
          customRender: ({ text }) => {
            return this.statuses[text];
          },
          width: 150,
        },
        {
          title: this.$t('TABLE.PROJECTS.DESCRIPTION'),
          dataIndex: 'description',
          key: 'description',
          customRender: ({ text }) => {
            if (!text || typeof text !== 'string') {
              return h('span', { style: { color: 'red' } }, this.$t('MESSAGE.PROJECTS.TEXT'));
            }
            const maxLength = 100;
            return text.length > maxLength ? `${text.slice(0, maxLength)} ...` : text;
          },
        },
        {
          title: this.$t('TABLE.PROJECTS.ACTIONS'),
          key: 'action',
          width: 180,
        },
      ];
    },
  },

  watch: {
    '$i18n.locale': {
      handler() {
        this.fetchTypes(); // Обновления типов из API
        this.fetchStatuses(); // Обновления статусов из API
      },
      immediate: true,
    },
  },

  methods: {
    async fetchStatuses() {
      try {
        this.statuses = await getProjectStatuses();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.STATUS'));
      }
    },

    async fetchTypes() {
      try {
        this.types = await getProjectTypes();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.STATUS'));
      }
    },

    async deleteProject(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.PROJECTS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteProject(id);
        this.$emit('project-load');
        this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.DELETE'), {
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
    NTooltip
  },
};
</script>
