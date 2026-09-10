import { expect, test } from './fixtures'

test('selects support labeled fields, selection updates, and disabling', async ({
    page,
    extensionId,
}) => {
    await page.goto(`chrome-extension://${extensionId}/settings.html`)
    await page.evaluate(async () => {
        await customElements.whenDefined('tc-select')
        const field = document.createElement('tc-select')
        Object.assign(field, {
            id: 'sample-select',
            label: 'Project',
            options: [
                ['inbox', 'Inbox'],
                ['work', 'Work'],
                ['reading', 'Reading list'],
            ],
            selectedValue: 'inbox',
        })
        field.innerHTML = `
            <tc-link slot="action">Refresh projects</tc-link>
            <span slot="help">Updated just now</span>
        `
        field.addEventListener('change', (event) => {
            field.dataset.selection = (
                event as CustomEvent<{ selectedValue: string }>
            ).detail.selectedValue
        })
        document.querySelector('main')?.append(field)
    })

    const host = page.locator('#sample-select')
    const select = host.getByRole('combobox', { name: 'Project', exact: true })
    await expect(select).toHaveValue('inbox')
    await expect(select).toHaveAccessibleDescription('Updated just now')
    await expect(
        host.getByRole('link', { name: 'Refresh projects' }),
    ).toBeVisible()

    await select.selectOption('work')
    await expect(host).toHaveAttribute('data-selection', 'work')

    await host.evaluate((element: HTMLElement & { disabled?: boolean }) => {
        element.disabled = true
    })
    await expect(select).toBeDisabled()

    await host.evaluate(
        (
            element: HTMLElement & {
                disabled?: boolean
                selectedValue?: string
            },
        ) => {
            element.disabled = false
            element.selectedValue = 'reading'
        },
    )
    await expect(select).toBeEnabled()
    await expect(select).toHaveValue('reading')
})
