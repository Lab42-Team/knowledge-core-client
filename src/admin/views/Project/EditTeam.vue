<template>
  <n-space vertical size="large">
    <n-space>
      <n-button
          type="primary"
          :disabled="selectedUserIds.length === 0"
          @click="saveTeamChanges">
          <template #icon>
            <i class="bi bi-person-check-fill"></i>
          </template>
        {{ $t('BUTTON.SAVE_CHANGES') }}
      </n-button>

      <n-button @click="$router.go(-1)" type="error" ghost>
        <template #icon>
          <i class="bi bi-arrow-90deg-left"></i>
        </template>
        {{ $t('BUTTON.CANCEL') }}
      </n-button>
    </n-space>

    <a-table class="panel-card" v-if="columns.length" :columns="columns"
             :data-source="allUsers" row-key="id" :pagination="{ pageSize: 10 }" :sorter="true" :row-selection="rowSelection">>
      <template #bodyCell="{ column, record }"></template>
    </a-table>

  </n-space>
</template>

<script>
import { NButton, NSpace, NTooltip, useMessage } from 'naive-ui';
import { Divider, Table, Input, Button } from 'ant-design-vue';
import { getUser, getUserRoles, getUserStatuses} from '@/admin/api/user';
import { getProjectById, updateProject, getUsersByIdProject } from '@/admin/api/project'
import { h } from 'vue';

export default {
  name: "ProjectEditTeam",

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
      allUsers: [],
      statuses: {},
      roles: {},
      searchText: '',
      selectedUserIds: [],
    };
  },

  async mounted() {
    await Promise.all([
      this.fetchRoles(),
      this.fetchStatuses(),
      this.loadUsers(),
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
      ];
    },

    rowSelection() {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedUserIds,
        onChange: (selectedRowKeys) => {
          this.selectedUserIds = selectedRowKeys.map(key => Number(key));
        },
      };
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
    async loadUsers() {
      try {
        const [allUsers, projectUsers] = await Promise.all([
          getUser(), // все пользователи
          getUsersByIdProject(this.$route.params.id)  // пользователи в проекте
        ]);
        this.allUsers = allUsers;
        this.selectedUserIds = projectUsers.map(u => u.id); // отмечаем уже добавленных
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
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

    async saveTeamChanges() {
      const projectId = this.$route.params.id;

      try {
        // Получение данных текущего проекта
        const currentProject = await getProjectById(projectId);

        const data = {
          name: currentProject.name,
          type: currentProject.type,
          status: currentProject.status,
          users: this.selectedUserIds.map(id => Number(id)) // id пользователей
        };

        await updateProject(projectId, data);

        this.$router.push({
          path: '/project/team/' + projectId,
          query: { successEditTeam: 'true' }
        });

      } catch (error) {
        // Обработка ошибок валидации
        if (error.response?.status === 422) {
          const errors = error.response.data.errors;
          const msg = Object.values(errors).flat().join(', ');
          this.message.error(msg || this.$t('MESSAGE.ERROR.VALIDATION'));
        } else {
          this.message.error(this.$t('MESSAGE.ERROR.UPDATE_TEAM'));
        }
        console.error('Ошибка при сохранении команды:', error);
      } finally {
        this.saving = false;
      }
    }

  },
}
</script>

