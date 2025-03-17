'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    common: {
      "welcome": "Welcome to AIDev",
      "connect_wallet": "Connect Wallet",
      "home": "Home",
      "projects": "Projects",
      "documentation": "Documentation"
    }
  }
};

const i18n = i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });

export default i18n; 