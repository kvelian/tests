import { test, expect, Page } from '@playwright/test';
import {clearInput} from "../../utils/helpers/clearInput";

test.beforeEach(async ({ page }) => {
    await page.goto('login/');
});

test.describe('Legals EN', () => {
    test.use({locale:'en-EN'});
    test('check Service Agreement RUS', async ({page}) => {
        await expect(page.locator('#static-text-serviceAgreement')).toHaveText('By clicking «Get login code» button, you agree with terms about client service and about using personal cabinet');
        await expect(page.locator('#static-text-serviceAgreement a:has-text("terms about client service and about using personal cabinet")'))
            .toHaveAttribute('href', 'https://api.koronapay.com/link-info/transfers/web/3.0.0/ru/offer');
    });
    test('check Privacy Policy EUR', async ({page}) => {
        // Filled EUR number in phone input
        const inputValue = await page.evaluate( () => (<HTMLInputElement>document.getElementById('changeable-field-input-phone')).value)
        for (let i = 0; i < inputValue.length; i++) {
            await page.locator(`#changeable-field-input-phone`).press('Backspace');
        }
        await page.locator('#changeable-field-input-phone').fill('33899553355');

        await expect(page.locator('#static-text-serviceAgreement')).toHaveText('By clicking «Get login code» button, you agree with privacy policy');
        await expect(page.locator('#static-text-serviceAgreement a:has-text("privacy policy")'))
            .toHaveAttribute('href', 'https://koronapay.eu/misc/en/documents/Privacy_Policy.pdf');
    });
})