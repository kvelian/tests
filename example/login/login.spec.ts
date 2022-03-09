import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('');
});

test.describe('Login', () => {
    test('auth', async ({page, context}) => {
        // Open login page in Navigation
        await Promise.all([
            page.waitForNavigation(),
            page.click('#clickable-button-navMenuLogin')
        ]);

        // Filled phone input
        await page.locator('#changeable-field-input-phone').fill('8005553535');

        // GetOTP button click and wait request POST /users/otps
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/otps') && req.method().includes('POST')),
            page.click('#clickable-button-OTPGet')
        ]);

        // Filled otp input
        await page.locator('#changeable-field-input-OTP').fill('666666')

        // Login button click and wait requests POST /users/sessions, POST /users/profile, POST /users/settings
        await Promise.all([
            page.waitForRequest(req => req.url().includes('/api/users/sessions') && req.method().includes('POST')),
            page.waitForRequest(req => req.url().includes('/api/users/profile') && req.method().includes('GET')),
            page.waitForRequest(req => req.url().includes('/api/users/settings') && req.method().includes('GET')),
            page.click('#clickable-button-login')
        ]);

        const cookies = await context.cookies()
        expect(cookies.some(c => c.name==="qpay-web/3.0_auth-token-v2" && c.value==="testToken")).toBeTruthy();
    });
})