import type {Page} from "@playwright/test";

interface MockResponse <T>{
    page: Page,
    path: string,
    body: T,
    status?: number
}

export const mockResponse = <MockResponse>(page, path, body, status= 200) => page.route(`**${path}`, (route) =>
    route.fulfill({
        status: status,
        body: JSON.stringify(body)
    })
)