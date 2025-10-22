import path from 'node:path'
import { type BrowserContext, test as base, chromium } from '@playwright/test'

const EXTENSION_PATH = path.join(import.meta.dirname, '../../dist')

export const test = base.extend<{
    context: BrowserContext
    extensionId: string
}>({
    // biome-ignore lint/correctness/noEmptyPattern: First argument must use the object destructuring pattern
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
