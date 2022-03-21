const CARD_ITEM = {
  $ID: 'static-container-cardSelectCardItem',
  PAYMENT_SYSTEM: 'static-text-cardSelectCardItemPaymentSystem',
  NUMBER: 'static-text-cardSelectCardItemNumber',
  RECEIVE_AGREEMENT: 'static-text-cardSelectCardItemReceiveAgreement'
};

const CARD_SELECT = {
  $ID: 'static-container-cardSelect',
  CARD_ITEM
};

const CALCULATOR = {
  WARNING: 'static-container-calculatorWarning',
  COUNTRY_WARNING: 'static-container-calculatorCountryWarning',
  LIMIT: {
    PERSONAL: 'static-container-calculatorWarningPersonalLimit',
    VERIFICATION: 'static-container-calculatorWarningVerificationLimit'
  },
  COMMISSION: {
    $ID: 'static-container-calculatorCommission',
    SENDING: 'static-text-calculatorCommissionSending',
    PAID_NOTIFICATION: 'static-text-calculatorCommissionPaidNotification'
  },
  AMOUNT: 'static-text-calculatorAmount',
  EXCHANGE_RATE: 'static-text-calculatorExchangeRate'
};

const METADATA = {
  SENDER: {
    $ID: 'static-container-metadataSender'
  },
  RECEIVER: {
    $ID: 'static-container-metadataReceiver'
  },
  DIRECTION_AND_AMOUNT: {
    $ID: 'static-container-metadataDirectionAndAmount'
  },
  REGISTRATION_ADDRESS: {
    $ID: 'static-container-metadataRegistrationAddress'
  },
  IDENTITY_CARD: {
    $ID: 'static-container-metadataIdentityCard'
  },
  IDENTITY_NUMBER: 'static-text-metadataIdentityCardIdentity',
  CITIZENSHIP: 'static-text-metadataCitizenship',
  RESIDENT: 'static-text-metadataResident'
};

const CARD_OPERATION_INFO = {
  $ID: 'static-container-cardOperationInfo',
  SERVICE_PROVIDER: 'static-text-cardOperationInfoServiceProvider'
};

const REUSABLE = {
  CARD_ITEM,
  CARD_SELECT,
  CALCULATOR,
  METADATA,
  CARD_OPERATION_INFO
};

export default REUSABLE;
