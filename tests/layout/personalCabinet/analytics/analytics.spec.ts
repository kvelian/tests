import {test, Page} from '@playwright/test';
import {AUTH_TOKEN_COOKIE, COOKIE_VALUES} from "@constants/tests";
import {IDS} from "@constants/ids";
import {getById} from "@helpers/ids";

type AllowAnalyticsParameters = {
    settings: {
        get: {
            data: Settings
        },
        put: {
            params: UserSettingsReqPutParams
        }
    },
    GDPR: boolean
}

const allowAnalyticsParameters: AllowAnalyticsParameters[] =
    [{
        settings: {
            get: {data: {"transfers.allowAnalytics": '0'}},
            put: {params: {"transfers.allowAnalytics": '1'}}
        },
        GDPR: false
    },
        {
            settings: {
                get: {data: {"transfers.allowAnalytics": '1'}},
                put: {params: {"transfers.allowAnalytics": '0'}}
            },
            GDPR: true
        }]

test.beforeEach(async ({page, context}) => {
    context.addCookies([{name: AUTH_TOKEN_COOKIE, value: COOKIE_VALUES.AUTH_COOKIE_EU, url: "http://localhost:3000"}]);
    await page.goto('');
});

for (const value of allowAnalyticsParameters) {
    test(`toggle Allow analytics: ${+value.settings.put.params["transfers.allowAnalytics"]}`, async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T99
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T98
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T96


        // Add route GET /users/settings with request body modify
        await page.route('**/api/users/settings', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(value.settings.get.data)
            })
        )

        // Open analytics page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
        ]);

        // Enable AllowAnalytics toggle
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('PUT') && JSON.stringify(req.postDataJSON()) === JSON.stringify(value.settings.put.params)),
            page.evaluate(id => (document.getElementById(id)).click(), IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_COLLECT_ANALYTICS)
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
        await page.evaluate((GDPR) =>
            // @ts-ignore
            Array.from(window.dataLayer).some(x => x.event === "checkout" && x.GDPR === GDPR), value.GDPR)
    });
}