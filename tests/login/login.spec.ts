import {test} from "@playwright/test";
import {getById, waitRequest} from "@helpers";
import {snapshot} from "../../utils/helpers/snapshot";
import {IDS} from "@constants/ids";

test.beforeEach(async ({page, context}) => {
    await page.goto('');
});
test.describe('Authorisation', () => {
    test('Success Login', async ({page}) => {
        // @test-case
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T121

        // Open Login Page In Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.LOGIN).click()

        // Snapshot Login Page
        //await snapshot(page, 'main', 'LoginPage');

        // Input Phone
        await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('8005553535')

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
})