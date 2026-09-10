import { expect, test } from './fixtures'

test('switch labels and keyboard activation persist the guessing option', async ({
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

    const host = page.locator('tc-project-guess tc-switch')
    const toggle = host.getByRole('switch', {
        name: 'Guess the project with AI',
        exact: true,
    })
    const fallback = page.getByText(/If no match is found, tasks go to/)
    await expect(toggle).not.toBeChecked()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await expect(toggle).toHaveAccessibleDescription(
        /Use the page title and URL to find a suitable project[\s\S]*When enabled/,
    )
    await expect(fallback).not.toBeVisible()
    await toggle.click()
    await expect(toggle).toBeChecked()
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
    await toggle.press('Space')
    await expect(toggle).not.toBeChecked()
    await host.locator('label').click()
    await expect(toggle).toBeChecked()
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
    await expect(toggle).toBeChecked()
    await expect(fallback).toContainText('Reading list')
    await toggle.press('Space')
    await expect(toggle).not.toBeChecked()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await expect(fallback).not.toBeVisible()
    await expect(toggle).toBeFocused()
    await expect(host.getByText(/When enabled/)).toBeVisible()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = true
    })
    await expect(toggle).toBeDisabled()
    await host.locator('label').click({ force: true })
    await expect(toggle).not.toBeChecked()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = false
    })
    await expect(toggle).toBeEnabled()
    await toggle.press('Space')
    await expect(toggle).toBeChecked()
})
