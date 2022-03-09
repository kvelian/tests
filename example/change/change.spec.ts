import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
    context.addCookies([{name:"qpay-web/3.0_auth-token-v2", value: "testToken", url: "http://localhost:3000"}]);
    await page.goto('history/');
});

test.describe('Change', () => {
    test('change fullname and phone', async ({page, browserName}) => {
        // Open transfer 3000011 in history
        await page.click("#clickable-container-transferItemShort-300011")

        // Start transfer 300011 change
        await Promise.all([
            page.waitForNavigation(),
            page.click("#clickable-button-change")
        ]);

        // Check values in fields
        await expect(page.locator('#changeable-field-input-fullName-lastName')).toHaveValue('Aa');
        await expect(page.locator('#changeable-field-input-fullName-firstName')).toHaveValue('Aa');
        await expect(page.locator('#changeable-field-input-fullName-middleName')).toHaveValue('Aa');
        await expect(page.locator('#changeable-field-input-phone')).toHaveValue('7 903 955-66-55');

        //Fill fields
        await clearField(page,'changeable-field-input-fullName-lastName');
        await page.fill('#changeable-field-input-fullName-lastName', "Фамилия");
        await clearField(page,'changeable-field-input-fullName-firstName');
        await page.fill('#changeable-field-input-fullName-firstName', "Имя");
        await clearField(page,'changeable-field-input-fullName-middleName');
        await page.fill('#changeable-field-input-fullName-middleName', "Отчество");
        await clearField(page,'changeable-field-input-phone');
        await page.fill('#changeable-field-input-phone', "79999999999");

        // Go next step
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/cards/page') && req.method().includes('GET')),
                // && req.postData().includes("operationType=transfer&issuerCountryId=RUS&scenario=change")),
            page.click("#clickable-button-next")
        ]);

        //Fill card data
        const elementHandle = await page.waitForSelector(
            'iframe[id="static-container-iframe"]'
        );
        const frame = await elementHandle.contentFrame();
        await frame.type('#pan', "4027469837541810", { delay: 100 });

        //Go on next step
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/transfers/300011/changes') && req.method().includes('POST')),
            frame.click('#submitButton')
        ]);

        expect(await page.locator('main').screenshot()).toMatchSnapshot(`zbs-${browserName}.png`)
    });
})

async function clearField (page: Page, id: string) {
    const inputValue = await page.evaluate(id => (<HTMLInputElement>document.getElementById(id)).value, id)
    for (let i = 0; i < inputValue.length; i++) {
        await page.locator(`#${id}`).press('Backspace');
    }
}