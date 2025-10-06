<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToDevelopmentsEdit(developments.id)">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        {{ $t('BUTTON.EDIT') }}
      </n-button>

      <n-button type="error" @click="deleteDevelopments(developments.id)">
        <template #icon>
          <i class="bi bi-trash"></i>
        </template>
        {{ $t('BUTTON.DELETE') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.DEVELOPMENTS.VIEW')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="developments" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ developments.id }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.DEVELOPMENTS.NAME') }}:</strong> {{ developments.name }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.DEVELOPMENTS.YEAR') }}:</strong> {{ formatDate(developments.year) }}</n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.AUTHORS') }}: </strong>
          <span v-if="developments.authors"> {{ developments.authors }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.PUBLICATIONS') }}: </strong>
          <span v-if="developments.publications"> {{ developments.publications }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.REQUIREMENTS') }}: </strong>
          <span v-if="developments.requirements"> {{ developments.requirements }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.PRACTICAL_APPLICATION') }}: </strong>
          <span v-if="developments.practical_application"> {{ developments.practical_application }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.VERSION_HISTORY') }}: </strong>
          <span v-if="developments.version_history"> {{ developments.version_history }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.DEMO_VIDEOS') }}: </strong>
          <span v-if="developments.demo_videos"> {{ developments.demo_videos }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.SOFTWARE_LINK') }}: </strong>
          <span v-if="developments.software_link"> {{ developments.software_link }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.DOCUMENTATION_LINK') }}: </strong>
          <span v-if="developments.documentation_link"> {{ developments.documentation_link }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.GITHUB_LINK') }}: </strong>
          <span v-if="developments.github_link"> {{ developments.github_link }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
        <n-text class="field">
          <strong>{{ $t('TABLE.DEVELOPMENTS.DESCRIPTION') }}: </strong>
          <span v-if="developments.description"> {{ developments.description }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.DEVELOPMENTS.TEXT') }} </span>
        </n-text>
      </n-space>
    </n-card>
  </n-space>

</template>

<script>
import {deleteDevelopments, getDevelopmentsById} from '@/admin/api/developments';
import {NButton, NCard, NFormItem, NInput, NSpace, NText, useMessage} from 'naive-ui';
import dayjs from 'dayjs';
import YearInput from "@/admin/components/YearInput.vue";

export default {
  name: 'DevelopmentsShow',

  setup() {
    // Инициализация useMessage для уведомлений
    const message = useMessage();
    return { message };
  },

  components: {
    NFormItem, YearInput, NInput,
    NButton,
    NCard,
    NSpace,
    NText,
  },

  data() {
    return {
      developments: null,
    };
  },

  watch: {
    '$i18n.locale': {
      handler() {
        if (this.developments) { // Только если новость загружена
          this.getDevelopmentsItem(this.$route.params.id); // Перезагрузка данных
        }
      },
      immediate: false // Вызов не сразу при инициализации
    }
  },

  async mounted() {
    await this.getDevelopmentsItem(this.$route.params.id);

    // Проверяем параметр success в запросе
    if (this.$route.query.success === 'true') {
      this.message.success(this.$t('MESSAGE.DEVELOPMENTS.SUCCESS.CREATE'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/developments/show/' + this.$route.params.id
      });
    }
    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success(this.$t('MESSAGE.DEVELOPMENTS.SUCCESS.EDIT'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/developments/show/' + this.$route.params.id
      });
    }
  },

  methods: {
    async getDevelopmentsItem(id) {
      this.isLoading = true;
      try {
        const developmentsData = await getDevelopmentsById(id);
        // Преобразование статуса из индекса в текстовое значение
        this.developments = {
          ...developmentsData,
        };
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    },

    formatDate(date) {
      return dayjs(date).format('YYYY');
    },

    goToDevelopmentsEdit(id) {
      this.$router.push({ name: 'DevelopmentsEdit', params: { id: id } });
    },

    async deleteDevelopments(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.DEVELOPMENTS.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteDevelopments(id);
        this.$router.push('/developments');
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
};
</script>
