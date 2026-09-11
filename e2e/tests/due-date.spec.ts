import { expect, test } from './fixtures'

test('due dates save explicitly and the switch persists no due date', async ({
    page,
    extensionId,
}) => {
    await page.route(/\/api\/v1\/projects(?:\?.*)?$/, async (route) => {
        await route.fulfill({
            json: {
                results: [
                    { id: 'inbox', name: 'Inbox', is_inbox_project: true },
                ],
            },
        })
    })
    await page.route('**/api/v1/tasks', (route) => route.fulfill({ json: {} }))
    await page.goto(`chrome-extension://${extensionId}/settings.html`)
    await page.getByRole('textbox', { name: 'API token' }).fill('sample-token')
    await page.getByRole('textbox', { name: 'API token' }).press('Enter')

    const section = page.locator('tc-due-date')
    const toggle = section.getByRole('switch', { name: 'Add a due date' })
    const input = section.getByRole('textbox', { name: 'Due date' })
    const save = section.getByRole('button', { name: 'Save date' })
    const status = section.getByRole('status')
    await expect(toggle).toBeChecked()
    await expect(toggle).toHaveAccessibleDescription('Currently: today')
    await expect(input).toHaveValue('today')
    await expect(save).toBeDisabled()

    await input.fill('   ')
    await expect(save).toBeDisabled()
    await input.press('Enter')
    await expect(status).toHaveText('Currently: today')
    await expect(toggle).toBeChecked()

    await input.fill('  next week  ')
    await expect(status).toHaveText('Currently: today')
    await save.click()
    await expect(status).toHaveText('Currently: next week')
    await expect(input).toHaveValue('next week')
    await expect(save).toBeDisabled()

    await input.fill('friday')
    await toggle.uncheck()
    await expect(status).toHaveText('No due date')
    await expect(input).not.toBeVisible()
    await toggle.check()
    await expect(input).toHaveValue('next week')

    await input.fill('tomorrow')
    await input.press('Enter')
    await expect(status).toHaveText('Currently: tomorrow')
    await expect(input).toHaveValue('tomorrow')
    await input.press('Enter')
    await expect(input).toHaveValue('tomorrow')
    await expect(save).toBeDisabled()
    await page.reload()
    await expect(input).toHaveValue('tomorrow')

    const datedTask = page.waitForRequest('**/api/v1/tasks')
    await page.getByRole('button', { name: 'Add test task' }).click()
    expect((await datedTask).postDataJSON()).toHaveProperty(
        'due_string',
        'tomorrow',
    )

    await toggle.press('Space')
    await expect(status).toHaveText('No due date')
    await expect(toggle).toBeFocused()
    await page.reload()
    await expect(toggle).not.toBeChecked()
    await expect(status).toHaveText('No due date')
    await expect(input).not.toBeVisible()

    const undatedTask = page.waitForRequest('**/api/v1/tasks')
    await page.getByRole('button', { name: 'Add test task' }).click()
    expect((await undatedTask).postDataJSON()).not.toHaveProperty('due_string')
})
