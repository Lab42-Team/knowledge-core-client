<template>
  <n-card :title="$t('PAGE.KNOWLEDGE_CORE.EDIT_DESCRIPTION')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="knowledge_core"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right"
    >
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.DESCRIPTION')" path="description">
        <n-input
            v-model:value="knowledge_core.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.DESCRIPTION')"
        />
      </n-form-item>

      <n-button type="primary" :disabled="submitting" @click="submitForm">
        <template #icon>
          <i class="bi bi-check2"></i>
        </template>
        {{ $t('BUTTON.SAVE_CHANGES') }}
      </n-button>
    </n-form>
    <n-alert v-if="errorList.length" type="error" class="mt-3">
      <div>
        {{ $t('MESSAGE.KNOWLEDGE_CORE.ERROR.EDITING') }}:
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
    </n-alert>
  </n-card>
</template>

<script>
import {NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert, NText} from 'naive-ui';
import {getKnowledgeCore, updateKnowledgeCore} from "@/admin/api/knowledge-core.js";

export default {
  name: 'KnowledgeCoreEditDescription',

  components: {
    NText,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NButton,
    NAlert,
  },

  data() {
    return {
      knowledge_core: {
        description: '',
      },
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
    };
  },


  methods: {
    async getKnowledgeCoreItem() {
      try {
        this.knowledge_core = await getKnowledgeCore();
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
      }
    },

    // Асинхронная отправка формы
    async submitForm() {
      try {
        this.submitting = true;
        this.errorList = []; // Очищаем список ошибок
        await this.$refs.formRef.validate();
        //console.log('Отправляемые данные:', this.knowledge_core);
        const response = await updateKnowledgeCore(this.knowledge_core.id, this.knowledge_core);
        // Перенаправляем пользователя с параметром успеха
        this.$router.push({
          path: '/knowledge-core',
          query: { successEdit: 'true' }
        });
      } catch (err) {
        console.error('Ошибка при редактировании данных:', err);
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;
          // Преобразование серверных ошибок в массив для отображения списком
          this.errorList = Object.values(errors).flat().filter(message => message && typeof message === 'string');
        } else if (Array.isArray(err)) {
          // Обработка клиентских ошибок валидации
          this.errorList = err
              .flatMap(errorArray => errorArray.map(error => error.message))
              .filter(message => message && typeof message === 'string');
        } else {
          // Общее сообщение об ошибке
          this.errorList = [err.message || 'Неизвестная ошибка'];
        }
      } finally {
        this.submitting = false;
      }
    }
  },

  async mounted() {
    await this.getKnowledgeCoreItem();
  },

};
</script>
