import { test, expect } from './fixtures'

test.describe('extension settings', () => {
    test('all settings', async ({ page }) => {
        await page.route('**/rest/v2/projects', async (route) => {
            if (
                route
                    .request()
                    .headers()
                    .authorization.includes('correctApiToken')
            ) {
                await route.fulfill({ json: [{ name: 'Lorem', id: 100 }] })
            } else {
                setTimeout(
                    async () => await route.fulfill({ status: 401 }),
                    1000
                )
            }
        })

        await expect(page.getByText('Todoist One-Click Settings')).toBeVisible()

        // TODO: save button should be disabled

        /**
         * Wrong API token
         */
        await page
            .getByPlaceholder('Paste the API token here...')
            .fill('wrongApiToken')

        await page.getByRole('button', { name: 'Save' }).click()

        await expect(page.locator('.loader')).toBeVisible()

        await expect(page.getByText('Something went wrong...')).toBeVisible()

        /**
         * Update API token
         */
        await page.getByRole('link', { name: 'Update API Token' }).click()

        await page
            .getByPlaceholder('Paste the API token here...')
            .fill('correctApiToken')

        await page.getByRole('button', { name: 'Save' }).click()

        await expect(
            page.getByText('Target project', { exact: true })
        ).toBeVisible()

        /**
         * Select a project
         */
        await page.getByRole('combobox').selectOption('Lorem')

        /**
         * Add a label
         */
        await page.getByPlaceholder(/add a label/).fill('labelIpsum')
        await page.keyboard.press('Enter')

        /**
         * Remove a label
         */
        await page.getByText('labelIpsum').locator('a').click()
    })
})
