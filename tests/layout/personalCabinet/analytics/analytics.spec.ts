import { test, Page } from '@playwright/test';
import { AUTH_TOKEN_COOKIE, COOKIE_VALUES } from "@constants/tests";
import { IDS } from "@constants/ids";
import { getById } from "@helpers/ids";

test.beforeEach(async ({ page , context}) => {
    context.addCookies([{name: AUTH_TOKEN_COOKIE, value: COOKIE_VALUES.AUTH_COOKIE_EU, url: "http://localhost:3000"}]);
    await page.goto('', {waitUntil: "load", timeout: 0});
});

test.describe('Analytics', () => {
    test('enable toggle Allow analytics', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T98
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T96

        // Add route with request body modify
        const responseBody: Settings = {"transfers.allowAnalytics": 0}
        await page.route('**/api/users/settings', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(responseBody)
            })
        )

        // Open analytics page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
            //page.click('#clickable-button-navMenuPersonalCabinetAnalytics')
        ]);

        // Enable AllowAnalytics toggle
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('PUT') && req.postData().includes('transfers.allowAnalytics=1')),
            page.evaluate( id => (document.getElementById(id)).click(), IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_COLLECT_ANALYTICS)
        ]);

        // Open sendCash page in navigation
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.SEND_CASH).click()
            //page.click('#clickable-button-navMenuSendCash')
        ]);

        // Filled calcPage for create event
        await getById(page, IDS.CHANGEABLE.FIELD.SELECT.RECEIVING_COUNTRY).click()
        await getById(page, IDS.CHANGEABLE.FIELD.SELECT.OPTION, 'RUS').click()
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT).type('100')
        await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

        // Check event
        await page.evaluate( (GDPR)=>
            // @ts-ignore
            Array.from(window.dataLayer).some(x => x.event === "checkout" && x.GDPR === GDPR), false)
    });

    test('disable toggle Allow analytics', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T98
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T97

        // Add route with request body modify
        const responseBody: Settings = {"transfers.allowAnalytics": 1}
        await page.route('**/api/users/settings', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(responseBody)
            })
        )

        // Open analytics page in Navigation
        page.click("#clickable-button-personalCabinet")
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
        ]);

        // Enable AllowAnalytics toggle
        const responseBody2: Settings = {"transfers.allowAnalytics": 0}
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('PUT') && req.postDataJSON().includes( JSON.stringify(responseBody2))),
            page.evaluate( id => (document.getElementById(id)).click(), IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_COLLECT_ANALYTICS)
        ]);

        // Open sendCash page in navigation
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.SEND_CASH).click()
        ]);

        // Filled calcPage for create event
        await getById(page, IDS.CHANGEABLE.FIELD.SELECT.RECEIVING_COUNTRY).click()
        await getById(page, IDS.CHANGEABLE.FIELD.SELECT.OPTION, 'RUS').click()
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT).type('100')
        await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

        // Check event
        await page.evaluate( (GDPR)=>
        // @ts-ignore
        Array.from(window.dataLayer).some(x => x.event === "checkout" && x.GDPR === GDPR), true)
    });
})