import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { LANGS } from './lang'
import { getLang } from '../utils/util.js'
import { dateTimeFormats } from './date'
import { numberFormats } from './number'
Vue.use(VueI18n)

const initial = getLang()
const i18n = new VueI18n({
    locale: initial,
    messages: LANGS,
    dateTimeFormats,
    numberFormats,
    silentTranslationWarn: true
})

export default i18n