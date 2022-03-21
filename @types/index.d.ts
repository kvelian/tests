type SettingsAllowValues = 0 | 1;

interface Settings {
    'transfers.sendStatusChangesToEmail'?: SettingsAllowValues;
    saveCardData?: SettingsAllowValues;
    'transfers.allowAds'?: SettingsAllowValues;
    'transfers.allowAnalytics'?: SettingsAllowValues;
    'transfers.sendReceiptToEmail'?: SettingsAllowValues;
}