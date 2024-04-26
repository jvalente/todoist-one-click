import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

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
                await route.fulfill({ status: 401 })
            }
        })

        await page.route('**/rest/v2/tasks', async (route) => {
            await route.fulfill({ body: 'Forbidden', status: 401 })
        })

        await expect(page.getByText('Todoist One-Click Settings')).toBeVisible()

        // TODO: save button should be disabled

        /*
         * Wrong API token
         */
        await locateSection(page, 'Enter your API token')
            .locator('input')
            .fill('wrongApiToken')
        await page.getByRole('button', { name: 'Save' }).click()

        // TODO PROJECTS LOADER
        // await expect(page.locator('.loader')).toBeVisible()

        await expect(
            page.getByText('Error while loading projects'),
        ).toBeVisible()

        /*
         * Update API token
         */
        await page.getByRole('link', { name: 'Update API Token' }).click()

        await locateSection(page, 'Enter your API token')
            .locator('input')
            .fill('correctApiToken')
        await page.getByRole('button', { name: 'Save' }).click()

        await expect(
            page.getByText('Target project', { exact: true }),
        ).toBeVisible()

        await locateSection(page, 'Target project')
            .getByRole('combobox')
            .selectOption('Lorem')

        await page.getByRole('link', { name: 'Refresh' }).click()

        // TODO PROJECTS LOADER
        // await expect(page.locator('.loader')).toBeVisible()

        /*
         * Add a label
         */
        await locateSection(page, 'Target labels')
            .locator('input')
            .fill('labelIpsum')
        await page.keyboard.press('Enter')

        /*
         * Remove a label
         */
        await page.getByText('labelIpsum').locator('tc-link').click()

        /**
         * Add a due date
         */
        await expect(
            page.getByText('Your tasks will have a today due date.'),
        ).toBeVisible()

        await locateSection(page, 'Due date').locator('input').fill('tomorrow')
        await page.keyboard.press('Enter')

        await expect(
            page.getByText('Your tasks will have a tomorrow due date.'),
        ).toBeVisible()

        /*
         * Remove a due date
         */
        await locateSection(page, 'Due date').locator('input').fill('')
        await page.keyboard.press('Enter')

        await expect(
            page.getByText('The tasks you add will have no due date.'),
        ).toBeVisible()

        /**
         * Setup due date and label again
         */
        await locateSection(page, 'Due date').locator('input').fill('monday')
        await page.keyboard.press('Enter')
        await locateSection(page, 'Target labels')
            .locator('input')
            .fill('labelIpsum')
        await page.keyboard.press('Enter')

        /**
         * Add a test task (failure)
         */
        await page.getByRole('link', { name: 'Add test task' }).click()
        await expect(page.getByText('Failed tasks (1)')).toBeVisible()
        await expect(page.getByText(/the API token is invalid/)).toBeVisible()
        await page.getByRole('link', { name: 'Discard' }).click()

        await expect(page.getByText('Failed tasks (1)')).not.toBeVisible()

        /**
         * Add a test task (success)
         */
        await page.route('**/rest/v2/tasks', async (route) => {
            await route.fulfill({ status: 200 })
        })

        const addTaskAPIRequest = page.waitForRequest((request) => {
            const postData = request.postData()
            const expectedPostData = JSON.stringify({
                content: '[Todoist One-Click test task](https://doist.com)',
                project_id: '100',
                labels: ['labelIpsum'],
                due_string: 'monday',
            })

            return (
                request.url().includes('rest/v2/tasks') &&
                request.method() === 'POST' &&
                postData === expectedPostData
            )
        })

        page.getByRole('link', { name: 'Add test task' }).click()

        await addTaskAPIRequest

        /**
         * Clear all data
         */
        await page.getByRole('link', { name: 'Clear all local data' }).click()
        await expect(locateSection(page, 'Enter your API token')).toBeVisible()
    })
})

function locateSection(page: Page, title: string) {
    return page.locator(`tc-section[title="${title}"]`)
}
