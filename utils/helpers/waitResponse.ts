import type {Page} from "@playwright/test";

export const waitResponse = <T>(page: Page, path: string, status: number) => {
    return page.waitForResponse(response => response.url().includes(path)
       && response.status() === status)
}