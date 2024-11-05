// utils/data.ts
// import yf from "yf";

const ALPHA_VANTAGE_API_KEY = "2G4NBA0DKU2TSF6B";

export async function fetchStockPrices(
  tickers: string[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  for (const ticker of tickers) {
    const url =
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Request failed: GET ${url}`);

    const data = await resp.json();
    const timeSeries = data["Time Series (1min)"];
    if (!timeSeries) throw new Error(`Invalid response for ticker: ${ticker}`);

    const latestTime = Object.keys(timeSeries)[0];
    const latestPrice = parseFloat(timeSeries[latestTime]["1. open"]);
    prices.set(ticker, latestPrice);
  }

  console.log("Stock prices:", prices);

  return prices;
}

export async function fetchGoldPrice(): Promise<number> {
  try {
    console.log("fetching gold price");
    // const result = await yf.quote("GC=F"); // Gold futures symbol
    const result = { regularMarketPrice: 1000 };

    console.log(result, "ress");
    if (!result || !result.regularMarketPrice) {
      throw new Error("Failed to fetch gold price");
    }
    return result.regularMarketPrice;
  } catch (error) {
    console.error("Error fetching gold price:", error);
    throw error;
  }
}
