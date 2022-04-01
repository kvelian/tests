import REUSABLE from './reusable';

const STATIC = {
  REUSABLE,
  IFRAME: 'static-container-iframe',
  VALIDATION_MESSAGE: {
    FULL_NAME: {
      LAST_NAME: 'static-text-validationMessageLastName',
      FIRST_NAME: 'static-text-validationMessageFirstName',
      MIDDLE_NAME: 'static-text-validationMessageMiddleName'
    },
    BIRTH_DATE: 'static-text-validationMessageBirthDate',
    BIRTH_PLACE: {
      COUNTRY: 'static-text-validationMessageBirthPlace-county',
      CITY: 'static-text-validationMessageBirthPlace-city'
    },
    IDENTITY_CARD: {
      SERIAL_NUMBER: 'static-text-validationMessageIdentityCard-serialNumber',
      NUMBER: 'static-text-validationMessageIdentityCard-number',
      ISSUER: 'static-text-validationMessageIdentityCard-issuer',
      ISSUE_DATE: 'static-text-validationMessageIdentityCard-issueDate',
      EXPIRY_DATE: 'static-text-validationMessageIdentityCard-expiryDate',
      CITIZENSHIP: 'static-text-validationMessageIdentityCard-citizenship',
      IDENTITY_NUMBER: 'static-text-validationMessageIdentityCard-identityNumber'
    },
    REGISTRATION_ADDRESS: {
      COUNTRY: 'static-text-validationMessageRegistrationAddress-country',
      CITY: 'static-text-validationMessageRegistrationAddress-city',
      LINE1: 'static-text-validationMessageRegistrationAddress-line1',
      LINE2: 'static-text-validationMessageRegistrationAddress-line2',
      POSTAL_CODE: 'static-text-validationMessageRegistrationAddress-postalCode'
    },
    CALCULATOR: {
      RECEIVING_COUNTRY: 'static-text-validationMessageReceivingCountry',
      SENDING_COUNTRY: 'static-text-validationMessageSendingCountry',
      AMOUNT: 'static-text-validationMessageAmount',
      CURRENCY: 'static-text-validationMessageCurrency'
    },
    EMAIL: 'static-text-validationMessageEmail',
    OTP: 'static-text-validationMessageOTP',
    PHONE: 'static-text-validationMessagePhone'
  },
  LAYOUT: {
    SNIPPET: {
      CALCULATOR: {
        $ID: 'static-container-layoutSnippetCalculator'
      },
      RECEIVE: {
        $ID: 'static-container-layoutSnippetReceive'
      },
      LOGIN: {
        $ID: 'static-container-layoutSnippetLogin'
      }
    },
    LEGAL: {
      SENDING_COUNTRY: 'static-text-layoutLegalSendingCountry',
      FOOTNOTE2: 'static-text-layoutLegalFootnote2',
      FOOTNOTE3: 'static-text-layoutLegalFootnote3',
      COPYRIGHT: 'static-text-layoutLegalCopyright',
      SERVICE_AGREEMENT: 'static-text-serviceAgreement',
      MOBILE_STORES: 'static-text-layoutLegalCopyrightMobileStores',
      PUBLIC_OFFER: 'static-text-layoutLegalPublicOffer',
      RECAPTCHA: 'static-text-layoutLegalRecaptcha'
    }
  },
  POPUP: {
    $ID: 'static-container-popup',
    TITLE: 'static-text-popupTitle',
    MESSAGE: 'static-text-popupMessage',
    REFUND: {
      AMOUNT: {
        $ID: 'static-container-popupRefundAmount'
      },
      AMOUNT_TO_REFUND: {
        $ID: 'static-container-popupRefundAmountToRefund'
      },
      COMMISSION: {
        $ID: 'static-container-popupRefundCommission'
      },
      EXCHANGE_RATE: {
        $ID: 'static-container-popupRefundExchangeRate'
      },
      OTP_CODE_SENT: 'static-text-popupRefundOTPCodeSent'
    },
    TRANSFER_DETAILS: {
      LEGAL: 'static-text-popupTransferDetailsLegal'
    }
  },
  PAGE: {
    REPEAT: {
      STEPS: {
        CHECK: {
          CALCULATOR: REUSABLE.CALCULATOR,
          METADATA: REUSABLE.METADATA
        },
        SENDER_CARD_SELECT: REUSABLE.CARD_SELECT,
        SUCCESS: {
          METADATA: REUSABLE.METADATA,
          CARD_OPERATION_INFO: REUSABLE.CARD_OPERATION_INFO
        }
      }
    },
    SEND_CASH: {
      STEPS: {
        CALCULATOR: REUSABLE.CALCULATOR,
        CHECK: {
          METADATA: REUSABLE.METADATA
        },
        SENDER_CARD_SELECT: REUSABLE.CARD_SELECT,
        SUCCESS: {
          METADATA: REUSABLE.METADATA,
          CARD_OPERATION_INFO: REUSABLE.CARD_OPERATION_INFO
        }
      }
    },
    SEND_CARD: {
      STEPS: {
        CALCULATOR: REUSABLE.CALCULATOR,
        CHECK: {
          METADATA: REUSABLE.METADATA
        },
        SENDER_CARD_SELECT: REUSABLE.CARD_SELECT,
        SUCCESS: {
          METADATA: REUSABLE.METADATA,
          CARD_OPERATION_INFO: REUSABLE.CARD_OPERATION_INFO
        }
      }
    },
    RECEIVE: {
      STEPS: {
        CREDITING_SELECT: {
          TRANSFER_ITEM: {
            $ID: 'static-container-pageReceiveOnCardStepsReceiveSelectTransferSelectTransferItem',
            SENDER: 'static-text-pageReceiveOnCardStepsReceiveSelectTransferSelectTransferItemSender',
            AMOUNT: 'static-text-pageReceiveOnCardStepsReceiveSelectTransferSelectTransferItemAmount'
          }
        },
        CREDITING_OPTIONS: {
          RECEIVING_AMOUNT_AND_COMMISSION: {
            $ID: 'static-container-pageReceiveOnCardStepsReceivingOptionsAmountAndCommission',
            AMOUNT: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndCommissionAmount',
            COMMISSION: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndCommissionCommission'
          },
          SENDING_AMOUNT_AND_EXCHANGE_RATE: {
            $ID: 'static-container-pageReceiveOnCardStepsReceivingOptionsAmountAndExchangeRate',
            AMOUNT: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndExchangeRateAmount',
            SENDING_AMOUNT: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndExchangeRateSendingAmount',
            EXCHANGE_RATE: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndExchangeRateExchangeRate',
            RECEIVING_AMOUNT: 'static-text-pageReceiveOnCardStepsReceivingOptionsAmountAndExchangeRateReceivingAmount'
          },
          RECEIVING_OPTIONS_SELECT: {
            RECEIVE_ITEM: {
              TITLE: 'static-text-pageReceiveStepsReceivingOptionsSelectReceiveItemTitle',
              AMOUNT: 'static-text-pageReceiveStepsReceivingOptionsSelectReceiveItemAmount',
              COMMISSION: 'static-text-pageReceiveStepsReceivingOptionsSelectReceiveItemCommission'
            }
          },
          PAID_NOTIFICATION: 'static-text-pageReceiveOnCardStepsReceivingOptionsPaidNotification',
          PAID_NOTIFICATION_TOOLTIP: 'static-text-pageReceiveOnCardStepsReceivingOptionsPaidNotificationTooltip',
          PAID_NOTIFICATION_DESCRIPTION: 'static-text-pageReceiveOnCardStepsReceivingOptionsPaidNotificationDescription'
        },
        RECEIVER_DATA: {},
        SENDER_CARD_SELECT: {
          CARD_SELECT: REUSABLE.CARD_SELECT
        },
        SUCCESS: {
          TITLE: 'static-text-pageReceiveOnCardStepsSuccessTitle',
          AMOUNT_TO_RECEIVE: 'static-text-pageReceiveOnCardStepsSuccessAmountToReceive',
          CARD_TO_RECEIVE: 'static-text-pageReceiveOnCardStepsSuccess'
        }
      }
    },
    HISTORY: {
      TRANSFERS: {
        $ID: 'static-container-pageHistoryTransferSelectTransferItemFull',
        TRANSFER_ITEM: {
          SHORT: {
            $ID: 'static-container-pageHistoryTransferSelectTransferItemShort',
            STATUS: 'static-text-pageHistoryTransferSelectTransferItemShortStatus',
            AMOUNT: 'static-text-pageHistoryTransferSelectTransferItemShortAmount',
            FULL_NAME: 'static-text-pageHistoryTransferSelectTransferItemShortFullName'
          },
          FULL: {
            $ID: 'static-container-pageHistoryTransferSelectTransferItemFull',
            NUMBER: 'static-text-pageHistoryTransferSelectTransferItemFullNumber',
            SENDER: REUSABLE.METADATA.SENDER,
            RECEIVER: REUSABLE.METADATA.RECEIVER,
            DIRECTION_AND_AMOUNT: REUSABLE.METADATA.DIRECTION_AND_AMOUNT
          }
        }
      }
    },
    CARDS: {
      SAVED_CARDS: {
        $ID: 'static-container-pageCardsMyCards',
        DESCRIPTION: 'static-text-pageCardsMyCardsDescription',
        CARD_ITEM: REUSABLE.CARD_ITEM
      },
      CREDITING_ONLY_CARDS: {
        $ID: 'static-container-creditingOnlyCards',
        DESCRIPTION: 'static-text-pageCardsCreditingOnlyCardsDescription',
        CARD_ITEM: REUSABLE.CARD_ITEM
      }
    },
    MESSAGES: {
      SEND_ADS_DESCRIPTION: 'static-text-pageMessagesSendAdsDescription'
    },
    ANALYTICS: {
      ALLOW_COLLECT_ANALYTICS_DESCRIPTION: 'static-text-pageAnalyticsAllowCollectAnalyticsDescription'
    }
  }
};

export default STATIC;
