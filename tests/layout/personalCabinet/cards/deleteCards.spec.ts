import {expect, test} from "@playwright/test";

import {AUTH_TOKEN_COOKIE, COOKIE_VALUES, PATHES} from "@constants/tests";
import {IDS} from "@constants/ids";

import {getById, mockResponse, waitRequest} from "@helpers";

test.describe('Delete card on Cards Page', () => {
    test.beforeEach(async ({page, context}) => {
        // Open Cards Page
        context.addCookies([{name: AUTH_TOKEN_COOKIE, value: COOKIE_VALUES.AUTH_COOKIE_RU, url: "http://localhost:3000"}]);
        await page.goto(PATHES.CARDS);

        // Open delete card popup
        await getById(page, IDS.CLICKABLE.BUTTON.CARD.DELETE, "3190").click()
    });

    test('Cancel delete card (3190)', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T116

        // Cancel delete card
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CANCEL).click()

        // Check card exist
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeVisible();
    });

    test('Close delete card (3190)', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T116

        // Cancel delete card
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CLOSE).click()

        // Check card exist
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeVisible();
    });

    test('Fail delete card (3190)', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T117

        // Add route with request body modify
        const error: ApiError = {code: 11, type: "error", message: "Delete card failed"}
        await mockResponse(page, '/api/cards/10024120?operationType=transfer', error, 400)

        // Try to delete card
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CONFIRM).click()

        // Close error popup
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CLOSE).click()

        // Check card exist
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeVisible();
    });

    test('Success delete card (3190)', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T115

        // Try to delete card
        await Promise.all([
            waitRequest(page, '/api/cards/10024120?operationType=transfer', 'DELETE'),
            getById(page, IDS.CLICKABLE.BUTTON.POPUP.CONFIRM).click()
        ])

        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeHidden({timeout: 1000})
    });

})