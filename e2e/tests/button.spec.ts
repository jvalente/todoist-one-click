import { expect, test } from './fixtures'

test('buttons support keyboard activation and native disabling', async ({
    page,
    extensionId,
}) => {
    await page.goto(`chrome-extension://${extensionId}/settings.html`)

    const host = page.locator('tc-api-key tc-button')
    const button = host.getByRole('button', { name: 'Save', exact: true })
    await host.evaluate((element) => {
        element.dataset.activations = '0'
        element.addEventListener('click', () => {
            element.dataset.activations = String(
                Number(element.dataset.activations) + 1,
            )
        })
    })

    await button.click()
    await button.press('Enter')
    await button.press('Space')
    await expect(host).toHaveAttribute('data-activations', '3')

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = true
    })
    await expect(button).toBeDisabled()
    await button.click({ force: true })
    await button.evaluate((element: HTMLButtonElement) => element.click())
    await expect(host).toHaveAttribute('data-activations', '3')

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = false
    })
    await expect(button).toBeEnabled()
    await button.press('Enter')
    await expect(host).toHaveAttribute('data-activations', '4')
})
