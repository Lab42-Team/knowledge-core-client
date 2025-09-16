import { createI18n } from 'vue-i18n';
import en from './en';
import ru from './ru';

const messages = {
    en,
    ru,
};

const i18n = createI18n({
    locale: localStorage.getItem('locale') || 'en', // Берем из localStorage или en
    fallbackLocale: 'en',
    messages,
});

export default i18n;
