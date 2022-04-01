type SettingsAllowValues = '0' | '1';

interface Settings {
    'transfers.sendStatusChangesToEmail'?: SettingsAllowValues;
    saveCardData?: SettingsAllowValues;
    'transfers.allowAds'?: SettingsAllowValues;
    'transfers.allowAnalytics'?: SettingsAllowValues;
    'transfers.sendReceiptToEmail'?: SettingsAllowValues;
}


type PaymentSystem = 'visa' | 'mastercard' | 'maestro' | 'mir' | 'elcard' | 'cortimilli' | 'upi' | 'uzcard' | 'humo';
type Capability = 'debiting' | 'crediting';

interface Card {
    id?: number;
    paymentSystem: PaymentSystem | 'unknown';
    panMask: string;
    expirationDate?: string;
    issuerCountryId: string;
    holderName?: string;
    brand?: string;
    default: boolean;
    capabilities?: Capability[];
    blocked?: boolean;
    blockReason?: string;
    bankName?: string;
}

type UserSettingsReqPutParams = Settings

interface ApiError {
    type: 'error';
    code: number;
    message: string;
    retryDelayEnd?: number;
}