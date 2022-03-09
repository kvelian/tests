import { test, expect, Page } from '@playwright/test';



test.beforeEach(async ({ page , context}) => {
    context.addCookies([{name:"qpay-web/3.0_auth-token-v2", value: "testTokenEU", url: "http://localhost:3000"}]);
    await page.goto('');
});

test.describe('Analytics', () => {
    test('enable toggle Allow analytics', async ({page}) => {
        // Open analytics page in Navigation
        await page.click("#clickable-button-personalCabinet")
        await Promise.all([
            page.waitForNavigation(),
            page.click('#clickable-button-navMenuPersonalCabinetAnalytics')
        ]);

        // Enable AllowAnalytics toggle
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('PUT') && req.postData().includes('transfers.allowAnalytics=1')),
            page.evaluate( () => (document.getElementById('changeable-field-toggle-allowCollectAnalytics')).click())
        ]);

        // Open sendCash page in navigation
        await Promise.all([
            page.waitForNavigation(),
            page.click('#clickable-button-navMenuSendCash')
        ]);

        // Filled calcPage for create event
        await page.click('#changeable-field-select-receivingCountry')
        await page.click('#changeable-field-select-option-RUS')
        await page.fill('#changeable-field-input-amount', '100')
        await page.click('#clickable-button-next')

        // Check event
        expect(await getDataLayerEventExist(page)).toBeTruthy();
    });

    test('disable toggle Allow analytics', async ({page}) => {
        //Add route with request body modify
        await page.route('**/api/users/settings', (route) =>
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({"transfers.allowAnalytics": "1"})
            })
        )

        // Open analytics page in Navigation
        page.click("#clickable-button-personalCabinet")
        await Promise.all([
            page.waitForNavigation(),
            page.click('#clickable-button-navMenuPersonalCabinetAnalytics')
        ]);

        // Enable AllowAnalytics toggle
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('PUT') && req.postData().includes('transfers.allowAnalytics=0')),
            page.evaluate( () => (document.getElementById('changeable-field-toggle-allowCollectAnalytics')).click())
        ]);

        // Open sendCash page in navigation
        await Promise.all([
            page.waitForNavigation(),
            page.click('#clickable-button-navMenuSendCash')
        ]);

        // Filled calcPage for create event
        await page.click('#changeable-field-select-receivingCountry')
        await page.click('#changeable-field-select-option-RUS')
        await page.fill('#changeable-field-input-amount', '100')
        await page.click('#clickable-button-next')

        // Check event
       //expect(await page.evaluate((bool) => {getDataLayerEventExistTrue(bool, window)}, true)).toBeTruthy();

        // await page.exposeFunction("getDataLayerEventExistTrue", getDataLayerEventExistTrue);
        // expect(await page.evaluate(async (GDPR) => { await getDataLayerEventExistTrue(GDPR, window)}, true))
        //     .toBeTruthy();


        const dataLayer = await page.evaluate( (GDPR)=>
        // @ts-ignore
        Array.from(window.dataLayer).some(x => x.event === "checkout" && x.GDPR === GDPR), true)
        console.log("dataLayer", dataLayer)

        // await page.exposeFunction("bbb", bbb);
        // const dataLayer2 = await page.evaluate( (GDPR)=>
        //     bbb(GDPR, window), true)
        // console.log("dataLayer2", dataLayer2)
    });
})

const getDataLayerEventExistTrue = (GDPR: boolean, window: Window) => {
    console.log(GDPR)
    // @ts-ignore
    return window.dataLayer.some(x => x.event === "checkout" && x.GDPR === GDPR)
}

const bbb = (GDPR: boolean, window: Window) => {
    console.log("GDPR", GDPR)
    // @ts-ignore
    return Array.from(window.dataLayer).some(x => x.event === "checkout" && x.GDPR === GDPR)
}

const getDataLayerEventExist = (page: Page) => {
    // @ts-ignore
    return page.evaluate('window.dataLayer.some(x => x.event === "checkout" && x.GDPR === false)')
}