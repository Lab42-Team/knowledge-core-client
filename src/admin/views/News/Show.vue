<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToNewsEdit(news.id)">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        Изменить
      </n-button>

      <n-button type="error" @click="deleteNews(news.id)">
        <template #icon>
          <i class="bi bi-trash"></i>
        </template>
        Удалить
      </n-button>
    </n-space>

    <n-card title="Просмотр новости" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="news" vertical size="large" class="panel-content">
        <n-text class="field"><strong>Id:</strong> {{ news.id }}</n-text>
        <n-text class="field"><strong>Название:</strong> {{ news.name }}</n-text>
        <n-text class="field"><strong>Статус:</strong> {{ news.status }}</n-text>
        <n-text class="field"><strong>Дата:</strong> {{ formatDate(news.date) }}</n-text>

        <n-text class="field">
          <strong>Описание:</strong>
          <span v-if="news.description"> {{ news.description }}</span>
          <span v-else style="color: red;"> Нет данных </span>
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
      const confirmDelete = confirm('Вы уверены, что хотите удалить эту новость?');
      if (!confirmDelete) return;

      try {
        console.debug('Удаление новости ID:', id);
        await deleteNews(id);
        //this.$emit('news-load');
        this.$router.push('/news');
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
