// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/transfers/online/login/');

    await page.locator('#changeable-field-input-phone').fill('8005553535');
    await Promise.all([
        page.waitForRequest(req => req.url().includes('/api/users/otps') && req.method().includes('POST')),
        page.click('#clickable-button-OTPGet')
    ]);

    await page.locator('#changeable-field-input-OTP').fill('666666');
    await page.click('#clickable-button-login');

    // Save signed-in state to 'storageState.json'.
    await page.context().storageState({ path: 'storageState.json' });
    await browser.close();
}

export default globalSetup;