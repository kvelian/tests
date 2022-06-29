import {test, Page, expect} from '@playwright/test';

import {IDS} from "@constants/ids";

import {getById, getIdFormatted, waitRequest, mockResponse, waitResponse, addAuthCookie, snapshot} from "@helpers";
import {PATHES} from "@constants/tests";

test.beforeEach(async ({context}) => {
    await addAuthCookie(context)
});

test('Cards Page: Open', async ({page}) => {
    // @test-cases
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T108

    // Open project page
    await page.goto('');

    // Open Cards Page in Navigation
    await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
    await Promise.all([
        waitRequest(page, '/api/cards?operationType=transfer', 'GET'),
        page.waitForNavigation(),
        getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.CARDS).click()
    ]);

    // Snapshot Cards Page
    await snapshot(page, 'main', 'CardsPage');
});

test.describe('Cards Page: View cards', () => {
    test('All cards', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T118

        // Open project page
        await page.goto('');

        // Open Cards Page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()

        // Get cards response
        const [response] = await Promise.all([
            waitResponse(page, '/api/cards?operationType=transfer', 200),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.CARDS).click()
        ]);
        // @ts-ignore
        const cards: Card[] = await response.json()

        // Check cards on the Cards Page
        for (const card of cards) {
            const cardPan = card.panMask.substring(1)
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, cardPan)).toBeVisible()
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.PAYMENT_SYSTEM, cardPan)).toHaveText(card.paymentSystem)
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.NUMBER, cardPan)).toHaveText(`•••• ${cardPan}`)
        }
    })

    test('Only card for send', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T107

        // Add route GET /cards with request body modify
        const cards: Card[] = [{
            "id": 10024051,
            "paymentSystem": "visa",
            "panMask": "*1810",
            "expirationDate": "202012",
            "brand": "DEF",
            "issuerCountryId": "RUS",
            "capabilities": ["debiting", "crediting"],
            "default": false
        }]
        await mockResponse(page, '/api/cards?operationType=transfer', cards)

        // Open project page
        await page.goto('');

        // Open Cards Page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.CARDS).click()

        // Check sending cards container
        const cardPan = cards[0].panMask.substring(1)
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.$ID)).toBeVisible()
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.DESCRIPTION))
            .toHaveText("Регистрация карт в сервисе позволит вам не вводить номер и срок действия карты каждый раз при оплате перевода. Нужно ввести только CVC2/CVV2 или одноразовый 3DS-пароль из СМС")
        await expect(page.locator(`${getIdFormatted(IDS.STATIC.PAGE.CARDS.SAVED_CARDS.$ID)} ${getIdFormatted(IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, cardPan)}`)).toBeVisible()

        // Check crediting cards container
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.CREDITING_ONLY_CARDS.$ID)).toBeHidden()

    })

    test('Only card for crediting', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T106

        // Add route GET /cards with request body modify
        const cards: Card[] = [{
            "id": 10024051,
            "paymentSystem": "visa",
            "panMask": "*1810",
            "expirationDate": "202012",
            "brand": "DEF",
            "issuerCountryId": "RUS",
            "capabilities": ["crediting"],
            "default": false
        }]
        await mockResponse<Card[]>(page, '/api/cards?operationType=transfer', cards)

        // Open project page
        await page.goto('');

        // Open Cards Page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.CARDS).click()

        // Check sending cads container
        const cardPan = cards[0].panMask.substring(1)
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.CREDITING_ONLY_CARDS.$ID)).toBeVisible()
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.CREDITING_ONLY_CARDS.DESCRIPTION))
            .toHaveText("Чтобы отправлять переводы с карты, введите её данные ещё раз при переводе")
        await expect(page.locator(`${getIdFormatted(IDS.STATIC.PAGE.CARDS.CREDITING_ONLY_CARDS.$ID)} ${getIdFormatted(IDS.STATIC.PAGE.CARDS.CREDITING_ONLY_CARDS.CARD_ITEM.$ID, cardPan)}`)).toBeVisible()
    })
})

test.describe('Cards Page: Delete card (3190)', () => {
    test.beforeEach(async ({page, context}) => {
        // Open Cards Page
        await page.goto(PATHES.CARDS);

        // Open delete card popup
        await getById(page, IDS.CLICKABLE.BUTTON.CARD.DELETE, "3190").click()
    });

    test('Popup DeleteCard snapshot', async ({page}) => {
        // Snapshot Popup DeleteCard
        await snapshot(page, getIdFormatted(IDS.STATIC.POPUP.$ID), 'Popup DeleteCard');
    });

    test('Cancel', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T116

        // Cancel delete card
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CANCEL).click()

        // Check card exist
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeVisible();
    });

    test('Close', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T116

        // Cancel delete card
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CLOSE).click()

        // Check card exist
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeVisible();
    });

    test('Fail', async ({page}) => {
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

    test('Success', async ({page}) => {
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