import { expect, test } from './fixtures'

test('labels support adding, deduplication, and keyboard removal with persistence', async ({
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
    await page.goto(`chrome-extension://${extensionId}/settings.html`)
    await page.getByRole('textbox', { name: 'API token' }).fill('sample-token')
    await page.getByRole('button', { name: 'Save token' }).click()

    const section = page.locator('tc-target-labels-section')
    const input = section.getByRole('textbox', { name: 'Add a label' })
    const add = section.getByRole('button', { name: 'Add', exact: true })
    const pills = section.locator('tc-label-pill')
    await expect(section.getByText('No labels added yet.')).toBeVisible()
    await expect(input).toHaveAccessibleDescription('Press Enter to add.')
    await expect(add).toBeDisabled()
    await input.fill('   ')
    await expect(add).toBeDisabled()
    await input.press('Enter')
    await expect(pills).toHaveCount(0)

    await input.fill('  reading  ')
    await add.click()
    await expect(
        section.getByRole('button', { name: 'Remove reading' }),
    ).toBeVisible()
    await expect(input).toBeEmpty()
    await expect(input).toBeFocused()
    await expect(add).toBeDisabled()

    await input.fill('reading')
    await input.press('Enter')
    await expect(pills).toHaveCount(1)
    await expect(section.getByRole('status')).toHaveText(
        'reading is already added.',
    )
    await expect(input).toBeEmpty()
    await expect(add).toBeDisabled()

    await input.fill('follow-up')
    await input.press('Enter')
    await expect(pills).toHaveCount(2)
    await page.reload()
    await expect(pills).toHaveCount(2)

    await section.getByRole('button', { name: 'Remove reading' }).press('Enter')
    const removeLast = section.getByRole('button', { name: 'Remove follow-up' })
    await expect(removeLast).toBeFocused()
    await removeLast.press('Space')
    await expect(input).toBeFocused()
    await expect(section.getByText('No labels added yet.')).toBeVisible()
    await page.reload()
    await expect(pills).toHaveCount(0)
})
