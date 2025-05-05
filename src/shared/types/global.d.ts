/** @format */

declare global {
    interface Window {
        recaptchaVerifier: import("firebase/auth").RecaptchaVerifier;
        recaptchaWidgetId: number;
        confirmationResult: import("firebase/auth").ConfirmationResult;
    }
}

declare const grecaptcha: {
    reset(widgetId?: number): void;
};

export {};
