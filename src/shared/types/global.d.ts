/** @format */

declare global {
    interface Window {
        recaptchaVerifier: import("firebase/auth").RecaptchaVerifier;
        recaptchaWidgetId: number;
        confirmationResult: import("firebase/auth").ConfirmationResult;
        google: {
            translate?: {
                TranslateElement?: new (
                    options: {
                        pageLanguage: string;
                        autoDisplay?: boolean;
                        includedLanguages?: string;
                    },
                    elementId: string
                ) => void;
            };
        };
        googleTranslateElementInit: () => void;
    }
}

declare const grecaptcha: {
    reset(widgetId?: number): void;
};

export {};
