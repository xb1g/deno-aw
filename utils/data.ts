// import yahooFinance from "yahoo-finance2";

export async function fetchStockPrices(
  tickers: string[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const endpoint = `/api/yf/quote?tickers=${tickers.join(",")}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Request failed: GET ${endpoint}`);
    }

    const data = await response.json();
    data.forEach((quote: { ticker: string; price: number }) => {
      prices.set(quote.ticker, quote.price);
    });
  } catch (error) {
    console.error("Error fetching stock prices:", error);
  }

  console.log("Stock prices:", prices);

  return prices;
}

export async function fetchGoldPrice(): Promise<number> {
  const endpoint = `/api/yf/quote?tickers=GC=F`; // Gold futures symbol

  try {
    console.log("fetching gold price");
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Request failed: GET ${endpoint}`);
    }

    const data = await response.json();
    const goldQuote = data.find((quote: { ticker: string; price: number }) =>
      quote.ticker === "GC=F"
    );

    if (!goldQuote || !goldQuote.price) {
      throw new Error("Failed to fetch gold price");
    }

    return goldQuote.price;
  } catch (error) {
    console.error("Error fetching gold price:", error);
    throw error;
  }
}
