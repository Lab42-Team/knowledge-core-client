<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToNewsEdit(news.id)">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        {{ $t('BUTTON.EDIT') }}
      </n-button>

      <n-button type="error" @click="deleteNews(news.id)">
        <template #icon>
          <i class="bi bi-trash"></i>
        </template>
        {{ $t('BUTTON.DELETE') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.NEWS.VIEW')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="news" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ news.id }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.NAME') }}:</strong> {{ news.name }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.STATUS') }}:</strong> {{ news.status }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.DATE') }}:</strong> {{ formatDate(news.date) }}</n-text>

        <n-text class="field">
          <strong>{{ $t('TABLE.DESCRIPTION') }}: </strong>
          <span v-if="news.description"> {{ news.description }}</span>
          <span v-else style="color: red;"> {{ $t('MESSAGE.TEXT.DESCRIPTION') }} </span>
        </n-text>

      </n-space>
    </n-card>
  </n-space>

</template>

<script>
import {deleteNews, getNewsById, getNewsStatuses} from '@/admin/api/news';
import {NButton, NCard, NSpace, NText, useMessage} from 'naive-ui';
import dayjs from 'dayjs';

export default {
  name: 'NewsShow',

  setup() {
    // Инициализация useMessage для уведомлений
    const message = useMessage();
    return { message };
  },

  components: {
    NButton,
    NCard,
    NSpace,
    NText,
  },

  data() {
    return {
      news: null,
    };
  },

  async mounted() {
    await this.getNewsItem(this.$route.params.id);

    // Проверяем параметр success в запросе
    if (this.$route.query.success === 'true') {
      this.message.success(this.$t('MESSAGE.SUCCESS.CREATE'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/news/show/' + this.$route.params.id
      });
    }
    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success(this.$t('MESSAGE.SUCCESS.EDIT'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/news/show/' + this.$route.params.id
      });
    }
  },

  methods: {
    async getNewsItem(id) {
      this.isLoading = true;
      try {
        const newsData = await getNewsById(id);
        const statuses = await getNewsStatuses();
        // Преобразование статуса из индекса в текстовое значение
        this.news = {
          ...newsData,
          status: statuses[newsData.status],
        };
      } catch (error) {
        console.error('Ошибка при загрузке новости:', error);
      }
    },

    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY HH:mm');
    },

    goToNewsEdit(id) {
      this.$router.push({ name: 'NewsEdit', params: { id: id } });
    },

    async deleteNews(id) {
      const confirmDelete = confirm(this.$t('CONFIRM.DELETE'));
      if (!confirmDelete) return;

      try {
        await deleteNews(id);
        this.$router.push('/news');
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
};
</script>
