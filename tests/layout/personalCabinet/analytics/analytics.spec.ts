import {test, Page, expect} from '@playwright/test';

import {AUTH_TOKEN_COOKIE, COOKIE_VALUES} from "@constants/tests";
import {IDS} from "@constants/ids";

import {getById, mockResponse, waitRequest} from "@helpers";

type AllowAnalyticsParameters = {
    settings: {
        get: {
            body: Settings
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
            get: {body: {"transfers.allowAnalytics": '0'}},
            put: {params: {"transfers.allowAnalytics": '1'}}
        },
        GDPR: false
    },
        {
            settings: {
                get: {body: {"transfers.allowAnalytics": '1'}},
                put: {params: {"transfers.allowAnalytics": '0'}}
            },
            GDPR: true
        }]

test.beforeEach(async ({page, context}) => {
    context.addCookies([{name: AUTH_TOKEN_COOKIE, value: COOKIE_VALUES.AUTH_COOKIE_EU, url: "http://localhost:3000"}]);
    await page.goto('');
});

test('Open Analytics Page', async ({page, browserName}) => {
    // Open Personal Cabinet in Navigation
    await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()

    //Open Analytics Page
    await Promise.all([
        waitRequest(page, '/api/users/settings', 'GET'),
        page.waitForNavigation(),
        getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
    ]);

    // Snapshot Analytics Page
    expect(await page.locator('main').screenshot()).toMatchSnapshot(`AnalyticsPage-${browserName}.png`)
})

test.describe('Toggle on Analytics Page', () => {
    for (const value of allowAnalyticsParameters) {
        test(`Change toggle state in ${+value.settings.put.params["transfers.allowAnalytics"]}`, async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T99
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T98
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T96


            // Add route GET /users/settings with request body modify
            await mockResponse<Settings>(page, '/api/users/settings', value.settings.get.body)

            // Open analytics page in Navigation
            await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
            await Promise.all([
                page.waitForNavigation(),
                getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
            ]);

            // Enable AllowAnalytics toggle
            await Promise.all([
                waitRequest<Settings>(page, '/api/users/settings', 'PUT', value.settings.put.params),
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
})