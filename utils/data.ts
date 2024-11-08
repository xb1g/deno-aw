// utils/data.ts
import type { Quote } from "yahoo-finance2";

const BASE_URL = Deno.env.get("BASE_URL") || "http://localhost:8000"; // Update the base URL as needed

export async function fetchStockPrices(
  tickers: string[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  if (tickers.length === 0) {
    return prices;
  }

  const tickerParam = tickers.join(",");

  try {
    const response = await fetch(
      `${BASE_URL}/api/quote?tickers=${tickerParam}`,
    );
    if (!response.ok) {
      throw new Error(`Request failed: GET ${response.url}`);
    }

    const data: Record<string, Quote | null> = await response.json();

    tickers.forEach((ticker) => {
      const quote = data[ticker];
      if (quote && typeof quote.regularMarketPrice === "number") {
        prices.set(ticker, quote.regularMarketPrice);
      } else {
        console.warn(`No price data available for ticker: ${ticker}`);
      }
    });

    console.log("Stock prices:", prices);
    return prices;
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    throw error;
  }
}

export async function fetchGoldPrice(): Promise<number> {
  try {
    console.log("Fetching gold price");
    const response = await fetch(`${BASE_URL}/api/quote?tickers=GC=F`);
    if (!response.ok) {
      throw new Error(`Request failed: GET ${response.url}`);
    }

    const data: Record<string, Quote | null> = await response.json();
    const goldQuote = data["GC=F"];

    if (goldQuote && typeof goldQuote.regularMarketPrice === "number") {
      return goldQuote.regularMarketPrice;
    } else {
      throw new Error("Failed to fetch gold price");
    }
  } catch (error) {
    console.error("Error fetching gold price:", error);
    throw error;
  }
}
