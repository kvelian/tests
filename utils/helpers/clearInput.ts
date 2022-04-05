import type {Page} from "@playwright/test";

export async function clearInput(page: Page, id: string) {
    const inputValue = await page.evaluate( id => (<HTMLInputElement>document.getElementById(id)).value, id)
    for (let i = 0; i < inputValue.length; i++) {
        await page.locator(`#${id}`).press('Backspace');
    }
}