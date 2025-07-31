
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/assets/css/globals.css";
import { ThemeProvider } from './provider';
import Script from 'next/script';
import { Toaster } from '@/shared/components/ui/sonner';
import TopBar from '@/shared/components/sections/TopBar';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const metadata: Metadata = {
	title: "TRANZIT.KZ | Биржа грузоперевозок, поиск транспорта и грузов, грузоперевозки в Казахстане, России, СНГ, Китай, Европа",
	description: "Tranzit.kz — удобная онлайн-биржа грузоперевозок. Быстрый поиск грузов и транспорта по Казахстану и СНГ. Найдите надёжных перевозчиков или грузы для доставки за минуты!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<head>
				<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
				<link rel="icon" href="/images/favicon.ico" />
				<Script
					src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
					strategy="beforeInteractive"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-y-auto`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<TopBar />
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
