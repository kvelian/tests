import {expect, test} from "@playwright/test";
import {PATHES} from "@constants/tests";
import {clearInput, getById} from "@helpers";
import {IDS} from "@constants/ids";


const legals = [
    {
    data: {
        serviceAgreementRUS: {
            text: 'Нажимая кнопку «Получить код», вы подтверждаете свое согласие с условиями Договора о комплексном обслуживании клиента с использованием личного кабинета',
            linkLocation: 'a:has-text("Договора о комплексном обслуживании клиента с использованием личного кабинета")'
        },
        privacyPolicyEUR: {
            text: 'Нажимая кнопку «Получить код», вы подтверждаете свое согласие с условиями Политики конфиденциальности данных',
            linkLocation: 'a:has-text("Политики конфиденциальности данных")'
        },
        recaptcha: {
            text: 'Этот сайт защищен с помощью Google reCAPTCHA и применяются соответствующие Политика конфиденциальности и Условия использования',
            privacyLinkLocation: 'a:has-text("Политика конфиденциальности")',
            termsLinkLocation: 'a:has-text("Условия использования")'
        },
        locale: 'ru-RU'
    },
},
    {
        data: {
            serviceAgreementRUS: {
                text: 'By clicking «Get login code» button, you agree with terms about client service and about using personal cabinet',
                linkLocation: 'a:has-text("terms about client service and about using personal cabinet")'
            },
            privacyPolicyEUR: {
                text: 'By clicking «Get login code» button, you agree with privacy policy',
                linkLocation: 'a:has-text("privacy policy")'
            },
            recaptcha: {
                text: 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.',
                privacyLinkLocation: 'a:has-text("Privacy Policy")',
                termsLinkLocation: 'a:has-text("Terms of Service")'
            },
            locale: 'en-EN'
        }
    }
]

test.beforeEach(async ({page, context}) => {
    await page.goto(PATHES.LOGIN);
});

for (const value of legals) {
    test.describe('Login page: Legals', () => {
        // @test-case
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T102

        //Change locale
        test.use({locale:value.data.locale});
        test(`check Service Agreement RUS ${value.data.locale}`, async ({page}) => {
            await expect(getById(page, IDS.STATIC.LAYOUT.LEGAL.SERVICE_AGREEMENT)).toHaveText(value.data.serviceAgreementRUS.text);
            await expect(page.locator(`#${IDS.STATIC.LAYOUT.LEGAL.SERVICE_AGREEMENT} ${value.data.serviceAgreementRUS.linkLocation}`))
                .toHaveAttribute('href', 'https://api.koronapay.com/link-info/transfers/web/3.0.0/ru/offer');
        });
        test(`check Privacy Policy EUR ${value.data.locale}`, async ({page}) => {
            // Filled EUR number in phone input
            await clearInput(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE)
            await getById(page, IDS.CHANGEABLE.FIELD.INPUT.PHONE).type('33899553355');

            await expect(getById(page, IDS.STATIC.LAYOUT.LEGAL.SERVICE_AGREEMENT)).toHaveText(value.data.privacyPolicyEUR.text);
            await expect(page.locator(`#${IDS.STATIC.LAYOUT.LEGAL.SERVICE_AGREEMENT} ${value.data.privacyPolicyEUR.linkLocation}`))
                .toHaveAttribute('href', 'https://koronapay.eu/misc/en/documents/Privacy_Policy.pdf');
        });
    })
    test.describe('Login page: Legals ReCaptcha', () => {
        // @test-case
        // https://jira.ftc.ru/secure/Tests.jspa#/testCase/QWS-T171

        test.use({locale:value.data.locale});
        test(`Check ReCaptcha text and URL ${value.data.locale}`, async ({page}) => {
            await expect(getById(page, IDS.STATIC.LAYOUT.LEGAL.RECAPTCHA)).toHaveText(value.data.recaptcha.text);
            await expect(page.locator(`#${IDS.STATIC.LAYOUT.LEGAL.RECAPTCHA} ${value.data.recaptcha.privacyLinkLocation}`))
                .toHaveAttribute('href', 'https://policies.google.com/privacy');
            await expect(page.locator(`#${IDS.STATIC.LAYOUT.LEGAL.RECAPTCHA} ${value.data.recaptcha.termsLinkLocation}`))
                .toHaveAttribute('href', 'https://policies.google.com/terms');
        });
    })
}