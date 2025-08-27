<template>
  <!-- Основной контейнер Naive UI-->
  <n-config-provider>
    <!-- Глобальные стили Naive UI -->
    <n-global-style/>
      <!-- Провайдеры для загрузки, сообщений и уведомлений -->
      <n-loading-bar-provider>
        <n-message-provider>
          <n-notification-provider>
            <!-- Главный контейнер -->
            <n-layout position="absolute" style="min-height: 100vh; display: flex; flex-direction: column;">
              <!-- Шапка -->
              <Navbar/>

              <!-- Основной контент -->
              <n-layout-content
                  style="padding: 24px; padding-top: 88px; padding-bottom: 72px; background: #f2fdf2; flex: 1; min-height: 100%;"
                  content-style="height: 100%;"
              >
                <!-- Рендеринг дочерних маршрутов -->
                <router-view/>
              </n-layout-content>

              <!-- Подвал -->
              <!--
              <n-layout-footer
                bordered
                style="padding: 16px; background: #ffffff; text-align: center; height: 48px; position: fixed; bottom: 0; width: 100%; z-index: 1000;"
              >
                <span>© 2025 My App.</span>
              </n-layout-footer>
              -->
            </n-layout>
          </n-notification-provider>
        </n-message-provider>
      </n-loading-bar-provider>
  </n-config-provider>
</template>

<script>
import {
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  NLoadingBarProvider,
} from 'naive-ui';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',

  components: {
    NConfigProvider,
    NLayout,
    NLayoutContent,
    NLayoutFooter,
    NGlobalStyle,
    NMessageProvider,
    NNotificationProvider,
    NLoadingBarProvider,
    Navbar,
  },
};
</script>
