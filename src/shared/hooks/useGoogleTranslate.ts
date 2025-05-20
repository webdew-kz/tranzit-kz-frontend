/** @format */

// hooks/useGoogleTranslate.ts
import { useEffect } from "react";

const GOOGLE_SCRIPT_ID = "google-translate-script";
const GOOGLE_ELEMENT_ID = "google_translate_element";

const GOOGLE_SCRIPT_SRC =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

export function useGoogleTranslate(includedLanguages: string) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // avoid double init
        if (document.getElementById(GOOGLE_SCRIPT_ID)) return;

        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "ru",
                        autoDisplay: false,
                        includedLanguages,
                    },
                    GOOGLE_ELEMENT_ID
                );
            }
        };

        const script = document.createElement("script");
        script.id = GOOGLE_SCRIPT_ID;
        script.src = GOOGLE_SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.getElementById(GOOGLE_SCRIPT_ID)?.remove();

            // Очистка iframe
            const gtFrame = document.querySelector(
                "iframe.goog-te-banner-frame"
            );
            if (gtFrame?.parentNode?.contains(gtFrame)) {
                gtFrame.parentNode.removeChild(gtFrame);
            }

            // Очистка тулбара
            const toolbar = document.querySelector(".goog-te-banner-frame");
            if (toolbar?.parentNode?.contains(toolbar)) {
                toolbar.parentNode.removeChild(toolbar);
            }

            // Очистка стиля
            const styleEl = document.querySelector(
                "style#goog-translate-style"
            );
            if (styleEl?.parentNode?.contains(styleEl)) {
                styleEl.parentNode.removeChild(styleEl);
            }

            // Очистка контейнера
            const googleEl = document.getElementById(GOOGLE_ELEMENT_ID);
            if (googleEl) {
                googleEl.innerHTML = "";
            }
        };
    }, [includedLanguages]);
}
