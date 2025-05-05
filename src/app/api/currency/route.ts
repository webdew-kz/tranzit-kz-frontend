/** @format */

// app/api/currency/route.ts
import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export const revalidate = 86400; // 24 часа (60 * 60 * 24)

export async function GET() {
    try {
        const res = await fetch("https://nationalbank.kz/rss/rates_all.xml", {
            cache: "force-cache",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch currency rates");
        }

        const xml = await res.text();
        const parsed = await parseStringPromise(xml);
        const items = parsed.rss.channel[0].item;

        const rates = items.map((item: any) => {
            const code = item.title[0].split(" ")[0].trim();
            const description = parseFloat(
                item.description[0].replace(",", ".")
            );
            const quant = parseInt(item.quant?.[0] || "1", 10); // Если quant есть, берём, если нет — 1
            const pricePerUnit = description / quant; // Важно!

            return {
                title: code,
                description: pricePerUnit.toString(), // нормализованный курс за 1 единицу
            };
        });

        return NextResponse.json(rates);
    } catch (error) {
        console.error("Currency API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch rates" },
            { status: 500 }
        );
    }
}
