import type {Page} from "@playwright/test";

export const mockResponse = <T>(page: Page, path: string, body: T, status: number = 200) => page.route(`**${path}`, (route) =>
    route.fulfill({
        status: status,
        body: JSON.stringify(body)
    })
)