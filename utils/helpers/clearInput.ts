import type {Page} from "@playwright/test";

export async function clearInput(page: Page, id: string) {
    const value = await page.inputValue(`#${id}`)
    for (let i = 0; i <= value.length; i++) {
        await page.locator(`#${id}`).press('Backspace');
    }
}