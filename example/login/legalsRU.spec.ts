import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('login/');
});

test.describe('Legals RU', () => {
    test('check Service Agreement RUS', async ({page}) => {
        await expect(page.locator('#static-text-serviceAgreement')).toHaveText('Нажимая кнопку «Получить код», вы подтверждаете свое согласие с условиями Договора о комплексном обслуживании клиента с использованием личного кабинета');
        await expect(page.locator('#static-text-serviceAgreement a:has-text("Договора о комплексном обслуживании клиента с использованием личного кабинета")'))
            .toHaveAttribute('href', 'https://api.koronapay.com/link-info/transfers/web/3.0.0/ru/offer');
    });
    test('check Privacy Policy EUR', async ({page}) => {
        // Filled EUR number in phone input
        const inputValue = await page.evaluate( () => (<HTMLInputElement>document.getElementById('changeable-field-input-phone')).value)
        for (let i = 0; i < inputValue.length; i++) {
            await page.locator(`#changeable-field-input-phone`).press('Backspace');
        }
        await page.locator('#changeable-field-input-phone').fill('33899553355');

        await expect(page.locator('#static-text-serviceAgreement')).toHaveText('Нажимая кнопку «Получить код», вы подтверждаете свое согласие с условиями Политики конфиденциальности данных');
        await expect(page.locator('#static-text-serviceAgreement a:has-text("Политики конфиденциальности данных")'))
            .toHaveAttribute('href', 'https://koronapay.eu/misc/en/documents/Privacy_Policy.pdf');
    });
})