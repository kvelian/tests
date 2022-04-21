import {test, expect} from '@playwright/test';

import {IDS} from "@constants/ids";
import {VALIDATION_ERROR} from "@constants/tests";

import {addAuthCookie, clearInput, getById, mockResponse, waitRequest} from "@helpers";
import {snapshot} from "../../../../utils/helpers/snapshot";

test.beforeEach(async ({page, context}) => {
    await addAuthCookie(context);
    await page.goto('');
});

test('Messages Page: Open', async ({page}) => {
    // @test-cases
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T105
    // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T114

    // Open Personal Cabinet in Navigation
    await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()

    //Open Analytics Page
    await Promise.all([
        page.waitForNavigation(),
        waitRequest(page, '/api/users/settings', 'GET'),
        waitRequest(page, '/api/users/profile', 'GET'),
        getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.MESSAGES).click()
    ]);

    await expect(getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)).toHaveValue("test@test.com")

    // Snapshot Analytics Page
    await snapshot(page, 'main', 'MessagesPage');
})

test.describe('Messages Page: Toggle', () => {
    test('Enable allowAds and sendStatusChangesToEmail', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T113

        const settingsResponseParameters: Settings = {
            "transfers.sendStatusChangesToEmail": '0',
            "transfers.allowAds": '0'
        }

        const enableAllowAds: Settings = {"transfers.allowAds": '1'}
        const enableSendStatusChangesToEmail: Settings = {"transfers.sendStatusChangesToEmail": '1'}

        // Add route GET /users/settings with request body modify
        await mockResponse<Settings>(page, '/api/users/settings', settingsResponseParameters)

        // Open messages page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.MESSAGES).click()
        ]);

        // Enable AllowAds toggle
        await Promise.all([
            waitRequest<Settings>(page, '/api/users/settings', 'PUT', enableAllowAds),
            getById(page, IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_ADS).click()
        ]);

        // Enable SendStatusChangesToEmail toggle
        await Promise.all([
            waitRequest<Settings>(page, '/api/users/settings', 'PUT', enableSendStatusChangesToEmail),
            getById(page, IDS.CHANGEABLE.FIELD.TOGGLE.SEND_STATUS_CHANGES_TO_EMAIL).click()
        ]);

        // Check email input state
        await expect(getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)).toBeEditable()
    });

    test('Disable allowAds and sendStatusChangesToEmail', async ({page}) => {
        // @test-cases
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T113

        const settingsResponseParameters: Settings = {
            "transfers.sendStatusChangesToEmail": '1',
            "transfers.allowAds": '1'
        }

        const disableAllowAds: Settings = {"transfers.allowAds": '0'}
        const disableSendStatusChangesToEmail: Settings = {"transfers.sendStatusChangesToEmail": '0'}


        // Add route GET /users/settings with request body modify
        await mockResponse<Settings>(page, '/api/users/settings', settingsResponseParameters)

        // Open messages page in Navigation
        await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
        await Promise.all([
            page.waitForNavigation(),
            getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.MESSAGES).click()
        ]);

        // Disable AllowAds toggle
        await Promise.all([
            waitRequest<Settings>(page, '/api/users/settings', 'PUT', disableAllowAds),
            getById(page, IDS.CHANGEABLE.FIELD.TOGGLE.ALLOW_ADS).click()
        ]);

        // Disable SendStatusChangesToEmail toggle
        await Promise.all([
            waitRequest<Settings>(page, '/api/users/settings', 'PUT', disableSendStatusChangesToEmail),
            getById(page, IDS.CHANGEABLE.FIELD.TOGGLE.SEND_STATUS_CHANGES_TO_EMAIL).click()
        ]);

        // Check email input state
        await expect(getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)).toBeDisabled()
    });
})

test.describe('Messages Page: email', () => {
        test.beforeEach(async ({page}) => {
            const settingsResponseParameters: Settings = {
                "transfers.sendStatusChangesToEmail": '1',
                "transfers.allowAds": '1'
            }

            // Add route GET /users/settings with request body modify
            await mockResponse<Settings>(page, '/api/users/settings', settingsResponseParameters)

            // Open messages page in Navigation
            await getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.$ID).click()
            await Promise.all([
                page.waitForNavigation(),
                getById(page, IDS.CLICKABLE.BUTTON.NAV_MENU.PERSONAL_CABINET.MESSAGES).click()
            ]);
        });

        test('Change email', async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T111

            const email = "d.bortsova@cft.ru"
            const profileRequestBody: UserProfileReqPatchParams = {"email": email}

            // Fill user email input
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL).type(email)

            // Save user email changes
            await Promise.all([
                waitRequest<UserProfileReqPatchParams>(page, '/api/users/profile', 'PATCH', profileRequestBody),
                getById(page, IDS.CLICKABLE.BUTTON.SAVE).click()
            ]);

            // Check button Save to be hidden
            await expect(getById(page, IDS.CLICKABLE.BUTTON.SAVE)).toBeHidden()
        })

        test('Validation email: empty', async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T110

            // Save empty user email input
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)
            await getById(page, IDS.CLICKABLE.BUTTON.SAVE).click()

            // Check validation message on email input
            await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.EMAIL)).toHaveText(VALIDATION_ERROR.REQUIRED)

            // Check button Save to be enabled
            await expect(getById(page, IDS.CLICKABLE.BUTTON.SAVE)).toBeEnabled()
        })

        test('Validation email: incorrect format', async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T112

            const invalidEmails = ["test", "тест@mail.com", "test@mail.com-", ".test@mail.com", "user@mail.e5"]

            for (const email of invalidEmails) {
                // Fill invalid user email
                await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)
                await getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL).type(email)

                // Save invalid user email
                await getById(page, IDS.CLICKABLE.BUTTON.SAVE).click()

                // Check validation message on email input
                await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.EMAIL)).toHaveText(VALIDATION_ERROR.INCORRECT_FORMAT)
            }
        })

        test(`Validation email: correct format`, async ({page}) => {
            // @test-cases
            // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T112

            const validEmails = ["user666@gmail.com", "n.test@mail.com", "user@mail.e", "test@mail-mail.com", "-test@mail.com", "te-st@mail.com"]
            for (const email of validEmails) {
                // Fill valid user email
                const profileRequestBody: UserProfileReqPatchParams = {"email": email}
                await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL)
                await getById(page, IDS.CHANGEABLE.FIELD.INPUT.EMAIL).type(email)

                //Save valid user email
                await Promise.all([
                    waitRequest<UserProfileReqPatchParams>(page, '/api/users/profile', 'PATCH', profileRequestBody),
                    getById(page, IDS.CLICKABLE.BUTTON.SAVE).click()
                ]);

                // Check validation message on email input
                await expect(getById(page, IDS.STATIC.VALIDATION_MESSAGE.EMAIL)).toBeHidden()
            }
        })
    }
)