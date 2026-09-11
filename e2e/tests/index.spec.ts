import { expect, test } from './fixtures'
import type { Page } from '@playwright/test'

test.describe('extension settings', () => {
    test('basic settings', async ({ page }) => {
        await page.route(/\/api\/v1\/projects(?:\?.*)?$/, async (route) => {
            if (
                route
                    .request()
                    .headers()
                    .authorization.includes('correctApiToken')
            ) {
                await new Promise((resolve) => setTimeout(resolve, 500))
                await route.fulfill({
                    json: { results: [{ name: 'Lorem', id: 100 }] },
                })
            } else {
                await new Promise((resolve) => setTimeout(resolve, 500))
                await route.fulfill({ status: 401 })
            }
        })

        await page.route('**/api/v1/tasks', async (route) => {
            await route.fulfill({ body: 'Forbidden', status: 401 })
        })

        await expect(
            page.getByRole('heading', {
                level: 1,
                name: 'Todoist One-Click',
            }),
        ).toBeVisible()
        await expect(
            page.getByRole('heading', {
                level: 2,
                name: 'Connect Todoist',
            }),
        ).toBeVisible()

        const saveButton = page.getByRole('button', { name: 'Save token' })
        const apiTokenInput = locateSection(page, 'Connect Todoist').locator(
            'input',
        )

        await expect(saveButton).toBeDisabled()
        await expect(
            page.getByText(
                'Your token is stored locally in this browser and used to connect to Todoist.',
            ),
        ).toBeVisible()
        await apiTokenInput.fill('   ')
        await expect(saveButton).toBeDisabled()

        /*
         * Wrong API token
         */
        await apiTokenInput.fill('wrongApiToken')
        await expect(saveButton).toBeEnabled()
        await saveButton.click()

        await expect(page.locator('.loader')).toBeVisible()

        await expect(locateSection(page, 'Connect Todoist')).toBeVisible()

        /*
         * Update API token
         */
        await locateSection(page, 'Connect Todoist')
            .locator('input')
            .fill('correctApiToken')
        await page.getByRole('button', { name: 'Save token' }).click()

        await expect(
            page.getByText('Target project', { exact: true }),
        ).toBeVisible()

        const projectSelect = locateSection(page, 'Target project').getByRole(
            'combobox',
            { name: 'Default project' },
        )
        await projectSelect.selectOption('Lorem')

        await page.getByRole('button', { name: 'Refresh projects' }).click()

        await expect(
            page.getByRole('button', { name: 'Refreshing…' }),
        ).toBeDisabled()
        await expect(projectSelect).toBeVisible()
        await expect(projectSelect).toHaveValue('100')
        await expect(
            page.getByRole('button', { name: 'Refresh projects' }),
        ).toBeEnabled()

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
        await page.getByRole('button', { name: 'Remove labelIpsum' }).click()

        /**
         * Add a due date
         */
        const dueDateSection = locateSection(page, 'Due date')
        const dueDateInput = dueDateSection.getByRole('textbox', {
            name: 'Due date',
        })
        const dueDateSwitch = dueDateSection.getByRole('switch', {
            name: 'Add a due date',
        })
        await expect(dueDateSection.getByText('Currently: today')).toBeVisible()

        await dueDateInput.fill('tomorrow')
        await page.keyboard.press('Enter')

        await expect(
            dueDateSection.getByText('Currently: tomorrow'),
        ).toBeVisible()

        /*
         * Remove a due date
         */
        await dueDateSwitch.uncheck()

        await expect(
            dueDateSection.getByText('No due date', { exact: true }),
        ).toBeVisible()

        /**
         * Setup due date and label again
         */
        await dueDateSwitch.check()
        await dueDateInput.fill('monday')
        await page.keyboard.press('Enter')
        await locateSection(page, 'Target labels')
            .locator('input')
            .fill('labelIpsum')
        await page.keyboard.press('Enter')

        /**
         * Add a test task (failure)
         */
        await page.getByRole('button', { name: 'Add test task' }).click()
        await expect(locateSection(page, 'Connect Todoist')).toBeVisible()

        await locateSection(page, 'Connect Todoist')
            .locator('input')
            .fill('correctApiToken')
        await page.getByRole('button', { name: 'Save token' }).click()

        await expect(page.getByText('Failed tasks (1)')).toBeVisible()
        await expect(page.getByText(/the API token is invalid/)).toBeVisible()
        await page.getByRole('link', { name: 'Discard' }).click()

        await expect(page.getByText('Failed tasks (1)')).not.toBeVisible()

        /**
         * Add a test task (success)
         */
        await page.route('**/api/v1/tasks', async (route) => {
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
                request.url().includes('api/v1/tasks') &&
                request.method() === 'POST' &&
                postData === expectedPostData
            )
        })

        page.getByRole('button', { name: 'Add test task' }).click()

        await addTaskAPIRequest

        /**
         * Clear all data
         */
        await page.getByRole('button', { name: 'Clear local data' }).click()
        await expect(locateSection(page, 'Connect Todoist')).toBeVisible()
    })

    test('advanced rules declaration', async ({ page }) => {
        await page.route(/\/api\/v1\/projects(?:\?.*)?$/, async (route) => {
            if (
                route
                    .request()
                    .headers()
                    .authorization.includes('correctApiToken')
            ) {
                await new Promise((resolve) => setTimeout(resolve, 500))
                await route.fulfill({
                    json: {
                        results: [
                            { name: 'Lorem', id: 100 },
                            { name: 'Ipsum', id: 101 },
                        ],
                    },
                })
            } else {
                await new Promise((resolve) => setTimeout(resolve, 500))
                await route.fulfill({ status: 401 })
            }
        })

        await locateSection(page, 'Connect Todoist')
            .locator('input')
            .fill('correctApiToken')
        await page.getByRole('button', { name: 'Save token' }).click()

        await page.getByRole('button', { name: 'Add rule' }).click()

        /**
         * Do not show confirm dialog if there are no changes to the form
         */
        await page.getByRole('link', { name: 'Cancel' }).click()
        await page.getByRole('button', { name: 'Add rule' }).click()

        /**
         * Shows confirm dialog if there are changes to the form
         */
        await locateSection(page, 'Advanced rules')
            .locator('tc-select')
            .filter({ hasText: 'contains' })
            .getByRole('combobox')
            .selectOption('matches exactly')

        await page.getByRole('link', { name: 'Cancel' }).click()
        await page
            .locator('dialog')
            .getByRole('button', { name: 'Cancel' })
            .click()

        /**
         * Add a rule
         */
        await page
            .getByRole('textbox', { name: 'URL or text' })
            .fill('https://doist.com')

        await locateSection(page, 'Advanced rules')
            .locator('tc-project-select')
            .getByRole('combobox')
            .selectOption('Ipsum')

        await locateSection(page, 'Advanced rules')
            .locator('tc-target-labels-list')
            .getByRole('textbox')
            .fill('advanced-rule-label')

        await page.keyboard.press('Enter')

        await locateSection(page, 'Advanced rules')
            .getByRole('textbox', { name: 'Due date' })
            .fill('tomorrow')

        await page.keyboard.press('Enter')

        await locateSection(page, 'Advanced rules')
            .getByRole('button', { name: 'Save rule' })
            .click()

        await expect(
            page.getByRole('heading', { name: 'https://doist.com' }),
        ).toBeVisible()

        await page.route('**/api/v1/tasks', async (route) => {
            await route.fulfill({ status: 200 })
        })

        const addTaskAPIRequest = page.waitForRequest((request) => {
            const postData = request.postData()
            const expectedPostData = JSON.stringify({
                content: '[Todoist One-Click test task](https://doist.com)',
                project_id: '101',
                labels: ['advanced-rule-label'],
                due_string: 'tomorrow',
            })

            return (
                request.url().includes('api/v1/tasks') &&
                request.method() === 'POST' &&
                postData === expectedPostData
            )
        })

        page.getByRole('button', { name: 'Add test task' }).click()

        await addTaskAPIRequest

        /**
         * Do not show confirm dialog if there are no changes to the form
         */
        await page.getByRole('button', { name: 'Edit' }).click()

        await expect(
            locateSection(page, 'Advanced rules').getByText('When', {
                exact: true,
            }),
        ).toBeVisible()

        await page.getByRole('link', { name: 'Cancel' }).click()

        await expect(
            page.getByText('Discard the changes and back to the rules list'),
        ).not.toBeVisible()

        /**
         * Shows confirm dialog if there are changes to the form
         */
        await page.getByRole('button', { name: 'Edit' }).click()

        await locateSection(page, 'Advanced rules')
            .getByRole('button', { name: 'Remove advanced-rule-label' })
            .click()

        await locateSection(page, 'Advanced rules')
            .getByRole('link', { name: 'Cancel' })
            .click()

        await expect(
            page.getByText('Discard the changes and back to the rules list'),
        ).toBeVisible()

        await page
            .locator('dialog')
            .getByRole('button', { name: 'Cancel' })
            .click()

        await locateSection(page, 'Advanced rules')
            .getByRole('link', { name: 'Delete rule' })
            .click()

        await page
            .locator('dialog')
            .getByRole('button', { name: 'Confirm' })
            .click()

        await expect(page.getByText('exact: doist.com')).not.toBeVisible()

        for (const url of ['https://first.example', 'https://second.example']) {
            await page.getByRole('button', { name: 'Add rule' }).click()
            await page.getByRole('textbox', { name: 'URL or text' }).fill(url)
            await page.getByRole('button', { name: 'Save rule' }).click()
        }

        const rulesList = locateSection(page, 'Advanced rules').getByRole(
            'list',
            { name: 'Rules in priority order' },
        )
        await expect(rulesList.getByRole('heading')).toHaveText([
            'https://first.example',
            'https://second.example',
        ])

        await page.getByRole('button', { name: 'Move rule 2 up' }).click()
        await expect(rulesList.getByRole('heading')).toHaveText([
            'https://second.example',
            'https://first.example',
        ])
    })
})

function locateSection(page: Page, title: string) {
    return page.locator(`tc-section[title="${title}"]`)
}
