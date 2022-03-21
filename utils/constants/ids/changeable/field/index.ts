const FIELD = {
  INPUT: {
    FULL_NAME: {
      LAST_NAME: 'changeable-field-input-fullName-lastName',
      FIRST_NAME: 'changeable-field-input-fullName-firstName',
      MIDDLE_NAME: 'changeable-field-input-fullName-middleName'
    },
    BIRTH_PLACE: {
      CITY: 'changeable-field-input-birthPlace-city'
    },
    BIRTH_DATE: 'changeable-field-dateInput-birthDate',
    IDENTITY_CARD: {
      SERIAL_NUMBER: 'changeable-field-input-identityCard-serialNumber',
      NUMBER: 'changeable-field-input-identityCard-number',
      ISSUER: 'changeable-field-input-identityCard-issuer',
      ISSUE_DATE: 'changeable-field-input-identityCard-issueDate',
      EXPIRY_DATE: 'changeable-field-input-identityCard-expiryDate',
      IDENTITY_NUMBER: 'changeable-field-input-identityCard-identityNumber'
    },
    REGISTRATION_ADDRESS: {
      CITY: 'changeable-field-input-registrationAddress-city',
      LINE1: 'changeable-field-input-registrationAddress-line1',
      LINE2: 'changeable-field-input-registrationAddress-line2',
      POSTAL_CODE: 'changeable-field-input-registrationAddress-postalCode'
    },
    EMAIL: 'changeable-field-input-email',
    OTP: 'changeable-field-input-OTP',
    PHONE: 'changeable-field-input-phone',
    AMOUNT: 'changeable-field-input-amount'
  },
  SELECT: {
    OPTION: 'changeable-field-select-option',
    REGISTRATION_ADDRESS: {
      COUNTRY: 'changeable-field-select-registrationAddress-country'
    },
    IDENTITY_CARD: {
      CITIZENSHIP: 'changeable-field-select-identityCardCitizenship'
    },
    BIRTH_PLACE: {
      COUNTRY: 'changeable-field-select-birthPlaceCountry'
    },
    PHONE: 'changeable-field-select-phone',
    RECEIVING_COUNTRY: 'changeable-field-select-receivingCountry',
    SENDING_COUNTRY: 'changeable-field-select-sendingCountry',
    CURRENCY: 'changeable-field-select-currency'
  },
  TOGGLE: {
    ALWAYS_SEND_RECEIPT_TO_EMAIL: 'changeable-field-toggle-alwaysSendReceiptToEmail',
    SEND_ADS: 'changeable-field-toggle-sendAds',
    SEND_EMAIL_NOTIFICATIONS: 'changeable-field-toggle-sendEmailNotifications',
    ALLOW_COLLECT_ANALYTICS: 'changeable-field-toggle-allowCollectAnalytics',
    PAID_NOTIFICATION: 'changeable-field-toggle-paidNotification'
  },
  CHECKBOX: {
    PAID_NOTIFICATION: 'changeable-field-checkbox-paidNotification',
    RESIDENT: 'changeable-field-checkbox-resident'
  }
};

export default FIELD;
