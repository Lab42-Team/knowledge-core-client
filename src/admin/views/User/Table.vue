<template>
  <a-table class="panel-card" v-if="columns.length" :columns="columns" :data-source="user" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <n-space>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'UserShow', params: { id: record.id } })">
                <i class="bi bi-eye"></i>
              </n-button>
            </template>
            {{ $t('TABLE.USERS.TOOLTIP_ACTIONS.VIEW') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button
                  type="primary" size="small" class="action-button mini-button"
                  @click="$router.push({ name: 'UserEdit', params: { id: record.id } })">
                <i class="bi bi-pencil"></i>
              </n-button>
            </template>
            {{ $t('TABLE.USERS.TOOLTIP_ACTIONS.EDIT') }}
          </n-tooltip>
          <n-tooltip trigger="hover" :show-arrow="true">
            <template #trigger>
              <n-button type="error" size="small" class="action-button mini-button"
                  @click="deleteUser(record.id)">
                <i class="bi bi-trash"></i>
              </n-button>
            </template>
            {{ $t('TABLE.USERS.TOOLTIP_ACTIONS.DELETE') }}
          </n-tooltip>
        </n-space>
      </template>
    </template>
  </a-table>
</template>

<script>
import { deleteUser, getUserRoles, getUserStatuses} from '@/admin/api/user';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { h } from 'vue';
import { NCard, NButton, NSpace, NTooltip, useMessage } from 'naive-ui';

export default {
  name: 'UserTable',

  props: {
    user: {
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
      roles: {},
      searchText: '',
    };
  },

  computed: {
    columns() {
      const filters_roles = Object.entries(this.roles).map(([value, text]) => ({
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
          title: this.$t('TABLE.USERS.NAME'),
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          showSorterTooltip: { title: this.$t('TABLE.USERS.SORT.NAME') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return h('div', { style: 'padding: 8px' }, [
              h(Input, {
                type: 'text',
                value: selectedKeys[0],
                onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                placeholder: this.$t('TABLE.USERS.SEARCH.NAME'),
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
          title: this.$t('TABLE.USERS.EMAIL'),
          dataIndex: 'email',
          key: 'email',
          sorter: (a, b) => a.email.localeCompare(b.email),
          showSorterTooltip: { title: this.$t('TABLE.USERS.SORT.EMAIL') },
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return h('div', { style: 'padding: 8px' }, [
              h(Input, {
                type: 'text',
                value: selectedKeys[0],
                onInput: e => setSelectedKeys(e.target.value ? [e.target.value] : []),
                placeholder: this.$t('TABLE.USERS.SEARCH.EMAIL'),
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
            if (typeof record.email !== 'string') return false;
            return record.email.toLowerCase().includes(value.toLowerCase());
          },
          filterIcon: filtered => h('i', { class: filtered ? 'bi bi-funnel-fill' : 'bi bi-funnel' }),
          width: 200,
        },
        {
          title: this.$t('TABLE.USERS.ROLE'),
          dataIndex: 'role',
          key: 'role',
          filters: filters_roles,
          onFilter: (value, record) => Number(record.role) === Number(value),
          customRender: ({ text }) => {
            return this.roles[text];
          },
          width: 150,
        },
        {
          title: this.$t('TABLE.USERS.STATUS'),
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
          title: this.$t('TABLE.USERS.ACTIONS'),
          key: 'action',
          width: 130,
        },
      ];
    },
  },

  watch: {
    '$i18n.locale': {
      handler() {
        this.fetchRoles(); // Обновления типов из API
        this.fetchStatuses(); // Обновления статусов из API
      },
      immediate: true,
    },
  },

  methods: {
    async fetchStatuses() {
      try {
        this.statuses = await getUserStatuses();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.STATUS'));
      }
    },

    async fetchRoles() {
      try {
        this.roles = await getUserRoles();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
        //this.message.error(this.$t('MESSAGE.ERROR.STATUS'));
      }
    },

    async deleteUser(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.USERS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteUser(id);
        this.$emit('user-load');
        this.message.success(this.$t('MESSAGE.USERS.SUCCESS.DELETE'), {
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
