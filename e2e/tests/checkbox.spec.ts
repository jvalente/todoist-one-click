import { expect, test } from './fixtures'

test('checkbox labels and keyboard activation persist the guessing option', async ({
    page,
    extensionId,
}) => {
    await page.clock.install()
    await page.route(/\/api\/v1\/projects(?:\?.*)?$/, async (route) => {
        await route.fulfill({
            json: {
                results: [
                    { id: 'inbox', name: 'Inbox', is_inbox_project: true },
                    { id: 'reading', name: 'Reading list' },
                ],
            },
        })
    })
    await page.goto(`chrome-extension://${extensionId}/settings.html`)
    await page.getByRole('textbox', { name: 'API token' }).fill('sample-token')
    await page.getByRole('button', { name: 'Save token' }).click()

    const host = page.locator('tc-project-guess tc-checkbox')
    const checkbox = host.getByRole('checkbox', {
        name: 'Guess the project with AI',
        exact: true,
    })
    const fallback = page.getByText(/If no match is found, tasks go to/)
    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).toHaveAccessibleDescription(
        /Use the page title and URL to find a suitable project[\s\S]*When enabled/,
    )
    await expect(fallback).not.toBeVisible()
    await host.locator('label').click()
    await expect(checkbox).toBeChecked()
    await expect(fallback).toContainText('Inbox')

    const project = page.getByRole('combobox', { name: 'Default project' })
    await project.selectOption('reading')
    await expect(fallback).toContainText('Reading list')
    await page.clock.fastForward(120000)
    await expect(page.locator('tc-project-select time')).toHaveText(
        'Updated 2 minutes ago',
    )
    await expect(project).toHaveValue('reading')

    await page.reload()
    await expect(checkbox).toBeChecked()
    await expect(fallback).toContainText('Reading list')
    await checkbox.press('Space')
    await expect(checkbox).not.toBeChecked()
    await expect(fallback).not.toBeVisible()
    await expect(checkbox).toBeFocused()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = true
    })
    await expect(checkbox).toBeDisabled()
    await host.locator('label').click({ force: true })
    await expect(checkbox).not.toBeChecked()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = false
    })
    await expect(checkbox).toBeEnabled()
    await checkbox.press('Space')
    await expect(checkbox).toBeChecked()
})
