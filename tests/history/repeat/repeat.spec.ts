import {test, Page, expect} from '@playwright/test';
import {IDS} from "@constants/ids";
import {getById, getIdFormatted, waitRequest, addAuthCookie, clearInput} from "@helpers";
import {snapshot} from "../../../utils/helpers/snapshot";
import {PATHES, VALIDATION_ERROR} from "@constants/tests";

test.beforeEach(async({page, context}) => {
    await addAuthCookie(context);
    await page.goto(PATHES.HISTORY);

//тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T64
test.describe('Repeat: validation', () => {

    test('Amount: required', async ({page}) => {

        //Открыть перевод 300440
        await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, '300440').click()

        //Нажать кнопку "Повторить"
        await Promise.all([
            waitRequest(page, '/api/transfers/announcements?process=repeatTransfer&event=directionSelected&sendingCountryId=RUS&receivingCountryId=RUS&receivingCurrencyId=810&receivingMethod=cash', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.REPEAT).click()
        ])

        //Очистить поле "Сумма"
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.AMOUNT)

        //Проверить сообщение валидации
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.CALCULATOR.AMOUNT)).toHaveText(VALIDATION_ERROR.REQUIRED)

    })


    }
)
})
