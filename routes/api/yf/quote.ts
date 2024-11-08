import { Handlers } from "$fresh/server.ts";
import yahooFinance from "yahoo-finance2";

export const handler: Handlers = {
    async GET(req) {
        const url = new URL(req.url);
        const tickers = url.searchParams.get("tickers");
        if (!tickers) {
            return new Response("Missing 'tickers' query parameter", {
                status: 400,
            });
        }

        try {
            const tickerArray = tickers.split(",");
            const quotes = await Promise.all(
                tickerArray.map((ticker) => yahooFinance.quote(ticker)),
            );

            const result = quotes.map((quote, index) => ({
                ticker: tickerArray[index],
                price: quote.regularMarketPrice,
            }));

            return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching stock quotes:", error);
            return new Response("Error fetching stock quotes", { status: 500 });
        }
    },
};
