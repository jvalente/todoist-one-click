import { configureLocalization, type LocaleModule } from '@lit/localize'
import { html, render } from 'lit'
import { sourceLocale, targetLocales } from './locale-codes'
import * as template_pt from './locales/pt'
import './settings/settings'

const localizedTemplates = new Map<string, LocaleModule>([['pt', template_pt]])
export const { getLocale, setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: async (locale) => localizedTemplates.get(locale) ?? template_pt,
})

setLocale('pt')

const main = document.querySelector('main')
if (main) {
    render(html`<tc-settings></tc-settings>`, main)
}
