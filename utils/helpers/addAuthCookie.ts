import type { BrowserContext } from "@playwright/test";
import {AUTH_TOKEN_COOKIE, COOKIE_VALUES} from "@constants/tests";

export const addAuthCookie = (context: BrowserContext, isEU: boolean = false) => context.addCookies([{name: AUTH_TOKEN_COOKIE, value: isEU ? COOKIE_VALUES.AUTH_COOKIE_EU : COOKIE_VALUES.AUTH_COOKIE_RU, url: "http://localhost:3000"}]);