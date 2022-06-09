import {expect, test} from "@playwright/test";
import {clearInput, getById, waitRequest} from "@helpers";
import {snapshot} from "../../utils/helpers/snapshot";
import {IDS} from "@constants/ids";
import {PATHES} from "@constants/tests";

test('Login Page: Open', async ({page}) => {
    // @test-case
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T104

    await page.goto('');

    // Open Login Page In Navigation
    await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.LOGIN).click()

    // Snapshot Login Page
    await snapshot(page, 'main', 'LoginPage');
});
test.describe('Login Page: Authorisation', () => {
    test('Login Page: Login', async ({page}) => {
        // @test-case
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T121

        // Open Login Page In Navigation
        await page.goto(PATHES.LOGIN);

        // Clear phone input
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)

        // Input Phone
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('78005553535')

        // Get OTP
        await Promise.all([
            waitRequest(page, '/api/users/otps', 'POST'),
            getById(page, IDS.CLICKABLE.BUTTON.OTP.GET).click()
        ])
        // Input OTP
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.OTP).type('666666')

        // Click login button
        await Promise.all([
            waitRequest(page, '/api/users/sessions', 'POST'),
            waitRequest(page, '/api/users/profile', 'GET'),
            waitRequest(page, '/api/users/settings', 'GET'),
            getById(page, IDS.CLICKABLE.BUTTON.LOGIN).click()
        ])
    })
});
test.describe('Login Page: Validation Phone', () => {
    // @test-case
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T120
    test.beforeEach(async ({page, context}) => {
        await page.goto(PATHES.LOGIN);
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
    });
    test('Validation Phone: Empty field', async ({page}) => {
        await getById(page, IDS.CLICKABLE.BUTTON.OTP.GET).click()
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE))
            .toHaveText('Поле является обязательным')
    })
    test('Validation Phone: Not all numbers', async ({page}) => {
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('79')
        await getById(page, IDS.CLICKABLE.BUTTON.OTP.GET).click()
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.PHONE))
            .toHaveText('В номере телефона указаны не все цифры')
    })
});
test.describe('Login Page: Validation OTP', () => {
    // @test-case
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T120
    test.beforeEach(async ({page, context}) => {
        await page.goto(PATHES.LOGIN);
        await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('78005553535')
        await getById(page, IDS.CLICKABLE.BUTTON.OTP.GET).click()
    });
    test('Validation OTP: Empty field', async ({page}) => {
        await getById(page, IDS.CLICKABLE.BUTTON.LOGIN).click()
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.OTP))
            .toHaveText('Поле является обязательным')
    })
    test('Validation OTP: Not all numbers', async ({page}) => {
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.OTP).type('11')
        await getById(page, IDS.CLICKABLE.BUTTON.LOGIN).click()
        await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.OTP))
            .toHaveText('Код должен содержать 6 цифр')
    })
})