import type {Page, Frame} from "@playwright/test";

export const getIdFormatted = (id: string, option?: string) => !!option ? `#${id}-${option}` : `#${id}`

export const getById = (page: Page | Frame, id: string, option?: string) => page.locator(getIdFormatted(id, option))
