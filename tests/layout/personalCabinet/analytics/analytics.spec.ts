import {test} from '@playwright/test';

import {IDS} from "@constants/ids";

import {addAuthCookie, getById, mockResponse, waitRequest, snapshot} from "@helpers";

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
    await addAuthCookie(context, true);
    await page.goto('');
});

test('Analytics Page: Open', async ({page}) => {
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T99
    // Open Personal Cabinet in Navigation
    await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()

    //Open Analytics Page
    await Promise.all([
        page.waitForNavigation(),
        waitRequest(page, '/api/users/settings', 'GET'),
        getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.ANALYTICS).click()
    ]);

    // Snapshot Analytics Page
    await snapshot(page, 'main', 'AnalyticsPage');
})

test.describe('Analytics Page: Toggle', () => {
    for (const value of allowAnalyticsParameters) {
        test(`Change toggle state in ${+value.settings.put.params["transfers.allowAnalytics"]}`, async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T98
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T97
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
                page.evaluate(id => (document.getElementById(id)).click(), IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_ANALYTICS)
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