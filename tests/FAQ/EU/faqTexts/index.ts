import { getIdFormatted } from '@helpers';
import { IDS } from '@constants/ids'

import { senderFaqTextsRU } from './sender/RU';
import { receiverFaqTextsRU } from './receiver/RU';
import { senderFaqTextsEN } from './sender/EN';
import { receiverFaqTextsEU } from './receiver/EU';
import { aboutUsFaqTextsRU } from './aboutUs/RU';
import { aboutUsFaqTextsEN } from './aboutUs/EN';

export const testData = [
  {
    locale: 'ru-RU',
    sections: [
      {
        name: 'Отправителю',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.FOR_SENDER),
        value: senderFaqTextsRU
      },
      {
        name: 'Получателю',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.FOR_RECEIVER),
        value: receiverFaqTextsRU
      },
      {
        name: 'О нас',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.ABOUT_US),
        value: aboutUsFaqTextsRU
      }]
  },
  {
    locale: 'en-EN',
    sections: [
      {
        name: 'For senders',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.FOR_SENDER),
        value: senderFaqTextsEN
      },
      {
        name: 'For recipients',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.FOR_RECEIVER),
        value: receiverFaqTextsEU
      },
      {
        name: 'About KoronaPay',
        key: getIdFormatted(IDS.CLICKABLE.BUTTON.FAQ_FILTERS.ABOUT_US),
        value: aboutUsFaqTextsEN
      }]
  }
]