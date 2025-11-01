<template>
  <n-space vertical size="large">
    <n-button v-if="!$route.matched.some(r => r.name === 'ProjectShowUser' || $route.name === 'ProjectEditTeam')" type="primary" @click="editTeam">
      <template #icon>
        <i class="bi bi-person-fill-gear"></i>
      </template>
      {{ $t('BUTTON.EDIT_TEAM') }}
    </n-button>

    <router-view v-if="$route.name === 'ProjectShowUser' || $route.name === 'ProjectEditTeam'" />

    <a-table v-else class="panel-card" v-if="columns.length" :columns="columns" :data-source="usersList" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <n-space>

            <n-tooltip trigger="hover" :show-arrow="true">
              <template #trigger>
                <n-button type="primary" size="small" class="action-button mini-button"
                          @click="$router.push({ name: 'ProjectShowUser', params: { id: this.$route.params.id, id_user: record.id } })">
                  <i class="bi bi-eye"></i>
                </n-button>
              </template>
              {{ $t('TABLE.USERS.TOOLTIP_ACTIONS.VIEW') }}
            </n-tooltip>

            <n-tooltip trigger="hover" :show-arrow="true">
              <template #trigger>
                <n-button type="error" size="small" class="action-button mini-button"
                          @click="excludeUser(record.id)">
                  <i class="bi bi-person-dash-fill"></i>
                </n-button>
              </template>
              {{ $t('TABLE.PROJECTS.TOOLTIP_ACTIONS.EXCLUDE') }}
            </n-tooltip>

          </n-space>
        </template>
      </template>
    </a-table>
  </n-space>
</template>

<script>
import { NButton, NSpace, NTooltip, useMessage } from 'naive-ui';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { getUserRoles, getUserStatuses } from '@/admin/api/user';
import { getUsersByIdProject, deleteUserFromProject } from "@/admin/api/project.js";
import { h } from 'vue';

export default {
  name: "ProjectTeam",

  components: {
    'a-button': Button,
    'a-divider': Divider,
    'a-table': Table,
    'a-input': Input,
    NTooltip,
    NButton,
    NSpace,
  },

  setup() {
    // Инициализация useMessage для уведомлений
    const message = useMessage();
    return { message };
  },

  data() {
    return {
      usersList: [],
      statuses: {},
      roles: {},
      searchText: '',
    };
  },

  async mounted() {
    await Promise.all([
      this.fetchRoles(),
      this.fetchStatuses(),
    ]);
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
          width: 80,
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

    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadUsersProject(newId);
        }
      },
      immediate: true,
    },

    // Перезагрузка после успешного редактирования
    '$route.query.successEditTeam'(newVal) {
      if (newVal === 'true') {
        if (this.$route.query.successEditTeam === 'true') {
          this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.TEAM_UPDATED'), {
            duration: 4000,
            closable: true,
          });
        }
        this.loadUsersProject(this.$route.params.id);
        // Очистка query (чтобы не срабатывало повторно)
        this.$router.replace({ query: { ...this.$route.query, successEditTeam: undefined } });
      }
    },

    // Перезагрузка после успешного исключения
    '$route.query.successDeleteUserTeam'(newVal) {
      if (newVal === 'true') {
        if (this.$route.query.successDeleteUserTeam === 'true') {
          this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.EXCLUDE_USER'), {
            duration: 4000,
            closable: true,
          });
        }
        this.loadUsersProject(this.$route.params.id);
        // Очистка query (чтобы не срабатывало повторно)
        this.$router.replace({ query: { ...this.$route.query, successDeleteUserTeam: undefined } });
      }
    },
  },

  methods: {
    async loadUsersProject(id) {
      try {
        const response = await getUsersByIdProject(id);
        this.usersList = response;
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    },

    editTeam() {
      this.$router.push('/project/team/'+ this.$route.params.id+ '/edit-team');
    },

    async fetchStatuses() {
      try {
        this.statuses = await getUserStatuses();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
      }
    },

    async fetchRoles() {
      try {
        this.roles = await getUserRoles();
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
      }
    },

    async excludeUser(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.PROJECTS.EXCLUDE_USER'));
      if (!confirmDelete) return;
      try {
        await deleteUserFromProject(id, this.$route.params.id);
        this.loadUsersProject(this.$route.params.id),
        this.message.success(this.$t('MESSAGE.PROJECTS.SUCCESS.EXCLUDE_USER'), {
          duration: 4000,
          closable: true,
        });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
      }
    },
  },
}
</script>
