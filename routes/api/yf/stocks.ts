import yf from "yahoo-finance2";
import type { Handlers } from "$fresh/server.ts";

export const handler: Handlers<undefined> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const tickers = url.searchParams.get("tickers");

    if (!tickers) {
      return new Response("Ticker symbols are required", { status: 400 });
    }

    const tickerList = tickers.split(",");

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3);

      const results = await Promise.all(
        tickerList.map(async (ticker) => {
          const result = await yf.chart(ticker, {
            period1: startDate,
            period2: endDate,
            interval: "1d",
          });
          return { ticker, data: result };
        }),
      );

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return new Response("Failed to fetch stock data", { status: 500 });
    }
  },
};
