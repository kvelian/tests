import type {Page} from "@playwright/test";

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

// @fixme изменить сравнение строк на глубокое сравнение объектов
export const waitRequest = <T>(page: Page, path: string, method: Method, params?: T) => {
    return page.waitForRequest(req => req.url().includes(path)
        && req.method().includes(method)
        && (!params || JSON.stringify(req.postDataJSON()) === JSON.stringify(params)))
}