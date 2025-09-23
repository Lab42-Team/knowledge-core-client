<template>
  <n-space vertical size="large">
    <n-space>
      <n-button type="primary" @click="goToKnowledgeCoreEdit()">
        <template #icon>
          <i class="bi bi-pencil"></i>
        </template>
        {{ $t('BUTTON.EDIT') }}
      </n-button>
    </n-space>

    <n-card :title="$t('PAGE.KNOWLEDGE_CORE.NAME')" size="medium" :bordered="true" class="panel-card">
      <n-space v-if="knowledge_core" vertical size="large" class="panel-content">
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.DESCRIPTION') }}: </strong> {{ knowledge_core.description }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.PHONE') }}: </strong> {{ knowledge_core.phone }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.EMAIL') }}:</strong> {{ knowledge_core.email }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.ADDRESS') }}:</strong> {{ knowledge_core.address }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.REFERENCES') }}: </strong> {{ knowledge_core.references }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.LAB_LINK') }}: </strong> {{ knowledge_core.lab_link }}</n-text>
        <n-text class="field"><strong>{{ $t('TABLE.KNOWLEDGE_CORE.GITHUB_LINK') }}: </strong> {{ knowledge_core.github_link }}</n-text>
      </n-space>
    </n-card>

  </n-space>
</template>

<script>
import {getKnowledgeCore} from '@/admin/api/knowledge-core.js';
import {NButton, NCard, NSpace, NText, useMessage} from 'naive-ui';

export default {
  name: 'KnowledgeCoreShow',

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
      knowledge_core: null,
    };
  },

  watch: {
    '$i18n.locale': {
      handler() {
        if (this.knowledge_core) { // Только если данные загружены
          this.getKnowledgeCoreItem(); // Перезагрузка данных
        }
      },
      immediate: false // Вызов не сразу при инициализации
    }
  },

  async mounted() {
    await this.getKnowledgeCoreItem();

    // Проверяем параметр successEdit в запросе
    if (this.$route.query.successEdit === 'true') {
      this.message.success(this.$t('MESSAGE.KNOWLEDGE_CORE.SUCCESS.EDIT'), {
        duration: 4000,
        closable: true,
      });
      // Чистка query параметр из URL
      this.$router.replace({
        path: '/knowledge-core'
      });
    }
  },

  methods: {
    async getKnowledgeCoreItem() {
      try {
        this.knowledge_core = await getKnowledgeCore();
      } catch (error) {
        console.error('Ошибка при загрузке информации:', error);
      }
    },

    goToKnowledgeCoreEdit() {
      this.$router.push({ name: 'KnowledgeCoreEdit' });
    },

  },
};
</script>
