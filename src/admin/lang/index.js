import { createI18n } from 'vue-i18n';
import en from './en';
import ru from './ru';

const messages = {
    en,
    ru,
};

// Локаль из localStorage сразу при создании i18n
const savedLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'en',
    messages,
});

export default i18n;
