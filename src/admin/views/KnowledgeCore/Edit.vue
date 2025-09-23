<template>
  <n-card :title="$t('PAGE.KNOWLEDGE_CORE.EDIT')" size="medium" :bordered="true" class="panel-card">
    <n-form
        ref="formRef"
        :model="knowledge_core"
        :rules="rules"
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
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.PHONE')" path="phone">
        <n-input
            v-model:value="knowledge_core.phone"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.PHONE')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.EMAIL')" path="email">
        <n-input
            v-model:value="knowledge_core.email"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.EMAIL')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.ADDRESS')" path="address">
        <n-input
            v-model:value="knowledge_core.address"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.ADDRESS')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.REFERENCES')" path="references">
        <n-input
            v-model:value="knowledge_core.references"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.REFERENCES')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.LAB_LINK')" path="lab_link">
        <n-input
            v-model:value="knowledge_core.lab_link"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.LAB_LINK')"
        />
      </n-form-item>
      <n-form-item :label="$t('TABLE.KNOWLEDGE_CORE.GITHUB_LINK')" path="github_link">
        <n-input
            v-model:value="knowledge_core.github_link"
            type="text"
            :placeholder="$t('TABLE.KNOWLEDGE_CORE.PLACEHOLDER.GITHUB_LINK')"
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
  name: 'KnowledgeCoreEdit',

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
        phone: '',
        email: '',
        address: '',
        references: '',
        lab_link: '',
        github_link: '',
      },
      errorList: [], // Массив для хранения списка ошибок
      submitting: false, // Флаг идет ли процесс отправки
      // Правила валидации для полей формы
      rules: {
        email: [
          { type: 'email', message: this.$t('MESSAGE.KNOWLEDGE_CORE.ERROR.EMAIL'), trigger: ['input', 'blur'] },
          { max: 255, message: this.$t('MESSAGE.KNOWLEDGE_CORE.ERROR.EMAIL_LONGE'), trigger: ['input', 'blur'] },
        ],
        phone: { max: 255, message: this.$t('MESSAGE.KNOWLEDGE_CORE.ERROR.PHONE_LONGE'), trigger: ['input', 'blur'] },
        address: { max: 255, message: this.$t('MESSAGE.KNOWLEDGE_CORE.ERROR.ADDRESS_LONGE'), trigger: ['input', 'blur'] },
      }
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
