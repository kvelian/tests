import {test, Page, expect} from '@playwright/test';
import {IDS} from "@constants/ids";
import {getById, getIdFormatted, waitRequest, addAuthCookie} from "@helpers";
import {snapshot} from "../../../utils/helpers/snapshot";
import {PATHES} from "@constants/tests";

test.beforeEach(async({page, context}) => {
    await addAuthCookie(context);
    await page.goto(PATHES.HISTORY);
});
test.describe('Refund', () =>
    test('Refund transfer 300001', async ({page}) => {
        // Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T16

        // Открыть перевод с id=300001
        await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, "300001").click()

        // Нажать на кнопку "Вернуть"
        await Promise.all([
            getById(page, IDS.CLICKABLE.BUTTON.REFUND.INPLACE).click(),
            waitRequest(page, '/api/transfers/300001/refund-requests', "POST"),
            waitRequest(page, '/api/transfers/300001/refund-requests/auth-codes', "POST")
        ])

        // Сделать скрин модального окна возврата
        await snapshot(page, getIdFormatted(IDS.STATIC.POPUP.$ID), "Popup refund transfer")

        // Ввести отп и нажать кнопку "Вернуть"
        await Promise.all([
            getById(page, IDS.CHANGEABLE.FIELD.INPUT.OTP).type("666666"),
            getById(page, IDS.CLICKABLE.BUTTON.REFUND.POPUP).click(),
            waitRequest(page, '/api/transfers/300001/refund-requests/confirmation', "POST")
        ])

        // Сделать скрин попап успешного возврата
        await snapshot(page, getIdFormatted(IDS.STATIC.POPUP.$ID), "Popup refund success")

        // Закрыть попап успешного возврата
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CLOSE).click()
})
)