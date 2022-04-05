import {test, Page, expect} from '@playwright/test';

import {AUTH_TOKEN_COOKIE, COOKIE_VALUES} from "@constants/tests";
import {IDS} from "@constants/ids";

import {getById, getIdFormatted, waitRequest, mockResponse, waitResponse} from "@helpers";

test.beforeEach(async ({page, context}) => {
    context.addCookies([{name: AUTH_TOKEN_COOKIE, value: COOKIE_VALUES.AUTH_COOKIE_RU, url: "http://localhost:3000"}]);
});

test('Open Cards Page', async ({page}) => {
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
});

test.describe('View cards on Cards Page', () => {
    test('All cards', async ({page, browserName}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T118

        // Open project page
        await page.goto('');

        // Open Cards Page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.CARDS).click()

        // Get cards response
        const response = await waitResponse(page, '/api/cards?operationType=transfer', 200)
        // @ts-ignore
        const cards: Card[] = await response.json()

        // Check cards on the Cards Page
        for (const card of cards) {
            const cardPan = card.panMask.substring(1)
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, cardPan)).toBeVisible()
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.PAYMENT_SYSTEM, cardPan)).toHaveText(card.paymentSystem)
            await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.NUMBER, cardPan)).toHaveText(`•••• ${cardPan}`)
        }

        // Snapshot Cards Page
        expect(await page.locator('main').screenshot()).toMatchSnapshot(`AllCards-${browserName}.png`)
    })

    test('Only card for send', async ({page, browserName}) => {
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

        // Snapshot Cards Page
        expect(await page.locator('main').screenshot()).toMatchSnapshot(`OnlySendCards-${browserName}.png`)
    })

    test('Only card for crediting', async ({page, browserName}) => {
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

        // Snapshot Cards Page
        expect(await page.locator('main').screenshot()).toMatchSnapshot(`OnlyCreditingCards-${browserName}.png`)
    })
})