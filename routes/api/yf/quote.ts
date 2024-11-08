import yahooFinance from "yahoo-finance2";
import type { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const tickersParam = url.searchParams.get("tickers");

    if (!tickersParam) {
      return new Response("Ticker symbols are required", { status: 400 });
    }

    const tickerList = tickersParam.split(",").map((ticker) =>
      ticker.trim().toUpperCase()
    );

    try {
      // Fetch quotes with 'map' return type for better handling
      const quotes = await yahooFinance.quote(tickerList, { return: "map" });

      // Convert Map to Object
      const result: Record<string, any> = {};
      quotes.forEach((value, key) => {
        if (value) {
          result[key] = value;
        }
      });

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching quote data:", error);
      return new Response("Failed to fetch quote data", { status: 500 });
    }
  },
};
