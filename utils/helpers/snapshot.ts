import type {Page} from "@playwright/test";
import {expect} from "@playwright/test";


export async function snapshot(page: Page, locator: string, name: string) {
    const width = {adaptive: 420, medium: 1023, wide: 1366}
    const height = 800

    async function doSnapshot(width) {
        await page.setViewportSize({width, height});
        expect(await page.locator(locator).screenshot()).toMatchSnapshot([`${name}`, `${width}.png`])
    }

    await doSnapshot(width.wide);
    await doSnapshot(width.medium);
    await doSnapshot(width.adaptive);
}