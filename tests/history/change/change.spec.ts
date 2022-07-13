import {test, Page, expect} from '@playwright/test';
import {IDS} from "@constants/ids";
import {getById, getIdFormatted, waitRequest, addAuthCookie, clearInput} from "@helpers";
import {snapshot} from "../../../utils/helpers/snapshot";
import {PATHES, VALIDATION_ERROR} from "@constants/tests";

test.beforeEach(async({page, context}) => {
    await addAuthCookie(context);
    await page.goto(PATHES.HISTORY)
});

test.describe ('Change: validation', () => {
    //Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T67

    test.beforeEach(async ({page, context}) => {

        //Открыть перевод 300011
        await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, '300011').click()

        //Нажать кнопку "Изменить"
        await Promise.all([
            waitRequest(page, '/api/transfers/metadata?sendingCountryId=RUS&receivingCountryId=RUS&receivingMethod=cash', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.CHANGE).click()
        ])
    })

    test('FIO: required', async ({page}) => {

        //Очистить поля ФИО
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME)
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME)
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME)

        //Проверить валидацию полей
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.LAST_NAME)).toHaveText(VALIDATION_ERROR.REQUIRED)
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.FIRST_NAME)).toHaveText(VALIDATION_ERROR.REQUIRED)
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.MIDDLE_NAME)).toBeHidden()
    })

    test('FIO: incorrect format', async ({page}) => {

        //Заполнить поля невалидными значениями
        const invalidFIO = ["'test", "test--test", "test''test"]
        for (const FIO of invalidFIO) {
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME).type(FIO)
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME).type(FIO)
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME).type(FIO)

            //Нажать кнопку "Далее"
            await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

            //Проверить сообщения валидации
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.LAST_NAME)).toHaveText(VALIDATION_ERROR.INCORRECT_FORMAT)
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.FIRST_NAME)).toHaveText(VALIDATION_ERROR.INCORRECT_FORMAT)
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.MIDDLE_NAME)).toHaveText(VALIDATION_ERROR.INCORRECT_FORMAT)
        }
    })

    test('FIO: correct format', async ({page}) => {

        //Заполнить поля валидными значениями
        const validFIO = ["Иванов", "Ivanov", "test'", "Iv1an2ovI&v^an"]
        for (const FIO of validFIO) {
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME).type(FIO)
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME).type(FIO)
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME).type(FIO)

            //Проверить валидацию полей
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.LAST_NAME)).toBeHidden()
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.FIRST_NAME)).toBeHidden()
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.FULL_NAME.MIDDLE_NAME)).toBeHidden()
        }


    })

    test('Phone: required', async ({page}) => {

        //Очистить поле "Телефон"
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).press('Control+ArrowRight')
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)

        //Нажать кнопку "Далее"
        await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

        //Проверить сообщение валидации
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE)).toHaveText(VALIDATION_ERROR.REQUIRED)
    })

    test('Phone: incorrect format', async ({page}) => {

        //Заполнить поле коротким номером
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).press('Control+ArrowRight')
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('34')

        //Нажать кнопку "Далее"
        await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

        //Проверить сообщение валидации
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE)).toHaveText(VALIDATION_ERROR.SHORT_NUMBER)

        //Заполнить поле некорректным номером
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('0 000 000 00-00')

        //Нажать кнопку "Далее"
        await getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()

        //Проверить сообщение валидации
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE)).toHaveText(VALIDATION_ERROR.INCORRECT_NUMBER)
    })

    test('Phone: correct format', async ({page}) => {

        //Заполнить поле валидными значениями
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).press('Control+ArrowRight')
        const validPhone = ["7 923 423-32-44", "994 00 000 00 00"]
        for (const Phone of validPhone) {
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type(Phone)

            //Проверить сообщение валидации
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE)).toBeHidden()
        }
    })
})

test.describe('Change: scenario', () => {

    //Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T19
    test('Error', async ({page}) => {

        //Открыть перевод 300001
        await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, '300001').click()

        //Нажать кнопку "Изменить"
        await Promise.all([
            waitRequest(page, '/api/transfers/metadata?sendingCountryId=RUS&receivingCountryId=RUS&receivingMethod=card', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.CHANGE).click()
            ])

        //Нажать кнопку "Далее"
        await Promise.all([
            waitRequest(page, '/api/transfers/persons/checks', 'POST'),
            waitRequest(page, '/api/cards/page?operationType=transfer&scenario=change&issuerCountryId=RUS', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()
        ])

        //Ввести номер карты
        const elementHandle = await page.waitForSelector(
            'iframe[id="static-container-iframe"]'
        );
        const frame = await elementHandle.contentFrame();
        await getById(frame, 'pan').type('4027 4698 3754 1810', {delay: 100})

        //Нажать кнопку "Далее"
        await Promise.all([
            waitRequest(page, '/api/transfers/300001/changes', 'POST'),
            getById(frame, 'submitButton').click()
        ])

        //Закрыть попап
        await getById(page, IDS.CLICKABLE.BUTTON.POPUP.CLOSE).click()
    })

    //Тест-кейс: https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T20
    test('Success', async ({page}) => {

        //Открыть перевод 300011
        await getById(page, IDS.CLICKABLE.CONTAINER.TRANSFER_ITEM_SHORT, '300011').click()

        //Нажать кнопку "Изменить"
        await Promise.all([
            waitRequest(page, '/api/transfers/metadata?sendingCountryId=RUS&receivingCountryId=RUS&receivingMethod=cash', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.CHANGE).click()
        ])

        //Изменить ФИО
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME)
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.LAST_NAME).type("Иванов")
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME)
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.FIRST_NAME).type("Иван")
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.FULL_NAME.MIDDLE_NAME)

        //Изменить номер телефона
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).press('Control+ArrowRight')
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('72282281488')

        //Нажать кнопку "Далее"
        await Promise.all([
            waitRequest(page, '/api/transfers/persons/checks', 'POST'),
            waitRequest(page, '/api/cards/page?operationType=transfer&scenario=change&issuerCountryId=RUS', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.NEXT).click()
        ])

        //Ввести номер карты
        const elementHandle = await page.waitForSelector(
            'iframe[id="static-container-iframe"]'
        );
        const frame = await elementHandle.contentFrame();
        await getById(frame, 'pan').type('4027 4698 3754 1810', {delay: 100})

        //Нажать кнопку "Далее"
        await Promise.all([
            waitRequest(page, '/api/transfers/300001/changes', 'POST'),
            getById(frame, 'submitButton').click()
        ])

        //Сделать скриншот страницы ЗБС
        await snapshot(page, 'main', 'ZBS')
    })
})
