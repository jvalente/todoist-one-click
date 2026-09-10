import { expect, test } from './fixtures'

test('text inputs support password and disabled states', async ({
    page,
    extensionId,
}) => {
    await page.goto(`chrome-extension://${extensionId}/settings.html`)

    const host = page.locator('tc-api-key tc-text-input')
    const input = host.getByRole('textbox', { name: 'API token' })
    await expect(input).toHaveAttribute('type', 'password')
    await expect(input).toHaveAttribute('aria-describedby', 'help')
    await expect(
        host.getByRole('link', { name: 'Find your token' }),
    ).toBeVisible()
    await expect(
        host.getByText(/Settings → Integrations → Developer/),
    ).toBeVisible()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = true
    })
    await expect(input).toBeDisabled()

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = false
    })
    await expect(input).toBeEnabled()
    await input.fill('sample-token')
    await expect(input).toHaveValue('sample-token')
})
