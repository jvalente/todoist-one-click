import { test as base, chromium, type BrowserContext } from '@playwright/test'
import path from 'path'

const EXTENSION_PATH = path.join(import.meta.dirname, '../../dist')

export const test = base.extend<{
    context: BrowserContext
    extensionId: string
}>({
    context: async ({}, use) => {
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`,
            ],
        })
        await use(context)
        await context.close()
    },
    extensionId: async ({ context }, use) => {
        let [background] = context.serviceWorkers()
        if (!background)
            background = await context.waitForEvent('serviceworker')

        const extensionId = background.url().split('/')[2]
        await use(extensionId)
    },
})

export const expect = test.expect
