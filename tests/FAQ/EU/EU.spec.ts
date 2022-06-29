import {test, expect} from '@playwright/test';
import {addAuthCookie} from "@helpers";
import {PATHES} from "@constants/tests";

import { testData } from './faqTexts';

test.beforeEach(async({page, context}) => {
    await addAuthCookie(context, true);
    await page.goto(PATHES.FAQ);
});

for (const faq of testData) {
    test.describe(`FAQ EU: ${faq.locale}`, () => {
      // Set locale
      test.use({ locale: faq.locale });

      for (const section of faq.sections) {
        test(`${section.name} questions`, async ({ page }) => {
          // Open section
          await page.locator(section.key).click()

          for (const value of section.value) {
            // Open question
            const question = `section div div h3:has-text("${value.question}")`
            await page.locator(question).click()

            // Save question parent for search answers
            const parent = page.locator(`section div`, { has: page.locator(`div h3 button[aria-expanded="true"]:has-text("${value.question}")`) })

            // Check answer in question
            for (const a of value.answer) {
              const nth = a.nth ?? 0
              if (a.strict) await expect(parent.locator(`div div ${a.key}:text-is("${a.value}") >> nth=${nth}`)).toHaveText(a.value)
              else await expect(parent.locator(`div div ${a.key}:has-text("${a.value}") >> nth=${nth}`)).toHaveText(a.value)
            }

            // Close question
            await page.locator(question).click()
          }
        })
      }
    })
}