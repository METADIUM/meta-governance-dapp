import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import langEn from './translations.en'
import langKo from './translations.ko'

const resources = {
  en: {
    translation: langEn
  },
  ko: {
    translation: langKo
  }
}
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  debug: false, // 디버그 필요할 경우 true 변경
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true
  }
})
export default i18n
