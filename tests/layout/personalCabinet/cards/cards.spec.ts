import {test, Page, expect} from '@playwright/test';
import {AUTH_TOKEN_COOKIE, COOKIE_VALUES, PATHES} from "@constants/tests";
import {IDS} from "@constants/ids";
import {getById, getIdFormatted} from "@helpers/ids";

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
        page.waitForRequest(req => req.url().includes('/api/cards?operationType=transfer') && req.method().includes('GET')),
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
        const response = await page.waitForResponse(response => response.url().includes('/api/cards?operationType=transfer') && response.status() === 200);
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
        await page.route('**/api/cards?operationType=transfer', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(cards)
            })
        )

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
        await page.route('**/api/cards?operationType=transfer', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(cards)
            })
        )

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

        // Check crediting cards container
        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.$ID)).toBeHidden()

        // Snapshot Cards Page
        expect(await page.locator('main').screenshot()).toMatchSnapshot(`OnlyCreditingCards-${browserName}.png`)
    })
})

test.describe('Delete card on Cards Page', () => {
    test.beforeEach(async ({page, context}) => {
        // Open Cards Page
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
        await page.route('**/api/cards/10024120?operationType=transfer', (route) =>
            route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify(error)
            })
        )

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
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CONFIRM).click()

        await expect(getById(page, IDS.STATIC.PAGE.CARDS.SAVED_CARDS.CARD_ITEM.$ID, "3190")).toBeHidden({timeout: 1000})
    });

})