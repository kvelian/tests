import {test, Page, expect} from '@playwright/test';
import {IDS} from "@constants/ids";
import {getById, getIdFormatted, waitRequest, addAuthCookie, clearInput} from "@helpers";
import {snapshot} from "../../../utils/helpers/snapshot";
import {PATHES, VALIDATION_ERROR} from "@constants/tests";

let getTariffsInfoResponse;

test.beforeEach(async({page, context}) => {
    await addAuthCookie(context);
    await page.goto(PATHES.HISTORY);

    //Открыть перевод 300440
    await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, '300440').click();

    //Нажать кнопку "Повторить"
    await Promise.all([
        waitRequest(page, '/api/transfers/announcements?process=repeatTransfer&event=directionSelected&sendingCountryId=UZB&receivingCountryId=RUS&receivingCurrencyId=810&receivingMethod=cash', 'GET'),
        getById(page, IDS.CLICKABLE.BUTTON.REPEAT).click()
    ])
})

//тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T64
test.describe('Repeat: validation', () => {

    test('Amount: required', async ({page}) => {

        //Очистить поле "Сумма"
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)

        //Проверить сообщение валидации
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.CALCULATOR.AMOUNT)).toHaveText(VALIDATION_ERROR.REQUIRED)
    })

    test('Amount: correct', async ({page}) => {

        //Очистить поле "Сумма"
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)

        //Ввести валидные значения и проверить сообщение валидации
        const validAmount = ['02,50', '3.00', '1тест!"№;%:?{}":?>?~@#$%^&*()_-+test00']
        for (const amount of validAmount) {
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT).type(amount)
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.CALCULATOR.AMOUNT)).toBeHidden()
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)
        }
    })

    test('Amount: min, max', async ({page}) => {

        //Очистить поле "Сумма"
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)

        //Ввести сумму меньше минимальной и проверить сообщение валидации
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT).type('10')
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.CALCULATOR.AMOUNT)).toHaveText(`${VALIDATION_ERROR.MIN_AMOUNT}`)

        //Очистить поле "Сумма"
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)

        //Ввести максимальную сумму и проверить сообщение валидации
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT).type('9999')
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.CALCULATOR.AMOUNT)).toHaveText(VALIDATION_ERROR.MAX_AMOUNT)
    })
})

test.describe('Repeat: scenario', () => {

    //Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T1
    test('Data', async ({page}) => {

        //Сделать скриншот страницы "Повтор"
        await snapshot(page, 'Main', 'RepeatPage')

        //Дойти до страницы выбора карты
        await Promise.all ([
            waitRequest(page, '/api/transfers/300440/card-statuses?scenario=payment', 'GET'),
            waitRequest(page, '/api/transfers', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()
        ])

        //Выбрать карту "1801"
        await getById(page, IDS.CLICKABLE.CONTAINER.CARD_SELECT.CARD_ITEM, "1810").click()

        //Перейти на страницу КС
        await Promise.all ([
            waitRequest(page, '/api/cards/page?operationType=transfer&scenario=payment&issuerCountryId=UZB&cardId=10034502', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()
        ])

        //Перейти на страницу ЗБС
        const elementHandle = await page.waitForSelector(
            'iframe[id="static-container-iframe"]'
        )
        const frame = await elementHandle.contentFrame()
        await Promise.all ([
            waitRequest(page, '/api/transfers/300440/payment-requests', 'POST'),
            getById(frame, 'submitButton').click()
        ])
        const elementHandle1 = await page.waitForSelector(
            'iframe[id="static-container-iframe"]'
        )
        const frame1 = await elementHandle1.contentFrame()
        await frame1.locator('[type="submit"]').click()

        //Сделать скриншот страницы "ЗБС"
        await snapshot(page, 'Main', 'ZBS')
    })

    //Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T72
    test('Data edit', async ({page}) => {

        //Нажать кнопку "Редактировать"
        await getById(page, IDS.CLICKABLE.BUTTON.EDIT).click()


    })
})

