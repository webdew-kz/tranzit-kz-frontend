'use client';

// import { useEffect, useState } from 'react';
// import s from './index.module.scss'
// import { useTheme } from 'next-themes';

// declare global {
// 	interface Window {
// 		google: any;
// 		googleTranslateElementInit: () => void;
// 	}
// }

// const languages = [
// 	{ label: "KZ | RU | CN | UZ | TR | EN", value: "df", hidden: true },
// 	{ label: "Қазақша", value: "kk", hidden: false },
// 	{ label: "Русский", value: "ru", hidden: false },
// 	{ label: "中国人", value: "zh-TW", hidden: false },
// 	{ label: "O'zbek", value: "uz", hidden: false },
// 	{ label: "Türkçe", value: "tr", hidden: false },
// 	{ label: "English", value: "en", hidden: false },
// ];

// export const GoogleTranslate = ({ prefLangCookie }: { prefLangCookie: string }) => {

// 	const [langCookie, setLangCookie] = useState(decodeURIComponent(prefLangCookie));

// 	const includedLanguages = languages.map(lang => lang.value).join(",");

// 	// useEffect(() => {
// 	// 	const googleTranslateElementInit = () => {
// 	// 		new window.google.translate.TranslateElement(
// 	// 			{
// 	// 				pageLanguage: 'ru',
// 	// 				autoDisplay: false,
// 	// 				includedLanguages,
// 	// 			},
// 	// 			'google_translate_element'
// 	// 		);
// 	// 	};

// 	// 	const addScript = document.createElement('script');
// 	// 	addScript.src =
// 	// 		'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
// 	// 	document.body.appendChild(addScript);

// 	// 	window.googleTranslateElementInit = googleTranslateElementInit;
// 	// }, []);


// 	useEffect(() => {
// 		const googleTranslateElementInit = () => {
// 			new window.google.translate.TranslateElement(
// 				{
// 					pageLanguage: 'ru',
// 					autoDisplay: false,
// 					includedLanguages,
// 				},
// 				'google_translate_element'
// 			);
// 		};

// 		const addScript = document.createElement('script');
// 		addScript.src =
// 			'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
// 		addScript.id = 'google-translate-script';
// 		document.body.appendChild(addScript);

// 		window.googleTranslateElementInit = googleTranslateElementInit;

// 		return () => {
// 			// Удалить скрипт
// 			const script = document.getElementById('google-translate-script');
// 			if (script) {
// 				script.remove();
// 			}

// 			// Удалить созданные iframe'ы и ноды
// 			const gtFrame = document.querySelector('iframe.goog-te-banner-frame');
// 			if (gtFrame?.parentNode) gtFrame.parentNode.removeChild(gtFrame);

// 			const googleEl = document.getElementById('google_translate_element');
// 			if (googleEl?.firstChild) {
// 				googleEl.innerHTML = ''; // безопаснее, чем removeChild
// 			}

// 			// Удалить тулбар
// 			const toolbar = document.querySelector('.goog-te-banner-frame');
// 			if (toolbar?.parentNode) toolbar.parentNode.removeChild(toolbar);

// 			// Удалить стили
// 			const styleEl = document.querySelector('style#goog-translate-style');
// 			if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl);
// 		};
// 	}, []);

// 	const onChange = (value: string) => {
// 		const lang = "/en/" + value;
// 		setLangCookie(lang);
// 		const element: any = document.querySelector(".goog-te-combo");
// 		if (!element) return;
// 		element.value = value;
// 		element.dispatchEvent(new Event("change"));
// 	};

// 	return (
// 		<>
// 			<div id="google_translate_element" style={{ display: 'none' }}></div>
// 			<LanguageSelector onChange={onChange} value={langCookie} />
// 		</>
// 	);
// };

// function LanguageSelector({ onChange, value }: { onChange: (value: string) => void; value: string }) {
// 	const { resolvedTheme } = useTheme();
// 	const [mounted, setMounted] = useState(false);

// 	useEffect(() => {
// 		setMounted(true);
// 	}, []);

// 	if (!mounted) return null;

// 	const langCookie = value.split("/")[2];

// 	return (
// 		<div className={s.main}>
// 			<select
// 				onChange={(e) => onChange(e.target.value)}
// 				value={langCookie}
// 				className={resolvedTheme === "dark" ? s.selectDark : s.selectLight}
// 			>
// 				{languages.map((language) => (
// 					<option value={language.value} key={language.value} hidden={language.hidden}>
// 						{language.label}
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 	);
// }


import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import s from './index.module.scss';
import { useGoogleTranslate } from '@/shared/hooks/useGoogleTranslate';

const languages = [
	{ label: 'KZ | RU | CN | UZ | TR | EN', value: 'df', hidden: true },
	{ label: 'Қазақша', value: 'kk', hidden: false },
	{ label: 'Русский', value: 'ru', hidden: false },
	{ label: '中国人', value: 'zh-TW', hidden: false },
	{ label: "O'zbek", value: 'uz', hidden: false },
	{ label: 'Türkçe', value: 'tr', hidden: false },
	{ label: 'English', value: 'en', hidden: false },
];

export const GoogleTranslate = ({ prefLangCookie }: { prefLangCookie: string }) => {
	const [langCookie, setLangCookie] = useState(decodeURIComponent(prefLangCookie));

	const includedLanguages = languages.map((lang) => lang.value).join(',');
	useGoogleTranslate(includedLanguages);

	const onChange = (value: string) => {
		setLangCookie('/en/' + value);
		const element: any = document.querySelector('.goog-te-combo');
		if (element) {
			element.value = value;
			element.dispatchEvent(new Event('change'));
		}
	};

	return (
		<>
			<div id="google_translate_element" style={{ display: 'none' }} />
			<LanguageSelector onChange={onChange} value={langCookie} />
		</>
	);
};

function LanguageSelector({
	onChange,
	value,
}: {
	onChange: (value: string) => void;
	value: string;
}) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const langCookie = value.split('/')[2];

	return (
		<div className={s.main}>
			<select
				onChange={(e) => onChange(e.target.value)}
				value={langCookie}
				className={resolvedTheme === 'dark' ? s.selectDark : s.selectLight}
			>
				{languages.map((language) => (
					<option
						value={language.value}
						key={language.value}
						hidden={language.hidden}
					>
						{language.label}
					</option>
				))}
			</select>
		</div>
	);
}
