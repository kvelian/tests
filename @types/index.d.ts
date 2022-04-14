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

interface UserProfileReqPatchParams {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    email?: string;
    birthDate?: string;
    birthPlace?: Place;
    registrationAddress?: Address;
    identityCard?: IdentityCard;
    identityNumber?: string;
    citizenship?: Country;
    residenceCountryIds?: string[];
    politicallyExposed?: boolean;
}

interface Country {
    id: string,
    code: string,
    name: string,
    phoneInfo: PhoneInfo
}

interface Place {
    country: Country;
    city: string;
}

interface Address {
    country: Country;
    city: string;
    line1: string;
    line2?: string;
    postalCode?: string;
    referenceId?: string;
}

interface PhoneInfo {
    prefix: string;
    extendedPrefix?: string;
    minLength: number;
    maxLength: number;
    format: string;
}

interface IdentityCard {
    serialNumber?: string;
    number: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
}