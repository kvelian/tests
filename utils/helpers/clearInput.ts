import {Page} from "@playwright/test";

export async function clearInput(page: Page, id: string) {
    console.log("@@@@id", id);
    const inputValue = await page.evaluate( () => (<HTMLInputElement>document.getElementById(id)).value)
    for (let i = 0; i < inputValue.length; i++) {
        await page.locator(`#${id}`).press('Backspace');
    }
}