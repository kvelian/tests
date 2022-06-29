import type {Page} from "@playwright/test";
export async function clearInput(page: Page, id: string) {
    const value = await page.inputValue(`#${id}`)
    const valueArray = value.split("");
    const result2 = valueArray.map(()=>page.locator(`#${id}`).press('Backspace'))

    await Promise.all(result2)
}