// utils/priceData.ts
import { fetchGoldPrice, fetchStockPrices } from "@/utils/data.ts";
import yahooFinance from "yahoo-finance2";
import type { Asset } from "@/utils/db.ts";

export interface PriceData {
  stocks: Map<string, number>;
  goldPrice: number;
  exchangeRates: Map<string, number>;
  funds: Map<string, number>;
}

export async function fetchPriceData(
  assets: Asset[],
  priceDataSig: { value: PriceData },
  thbExchangeRateSig: { value: number },
) {
  try {
    // Fetch stock prices
    const stockTickers = getUniqueTickers(assets, "stock");
    if (stockTickers.length) {
      const stockPrices = await fetchStockPrices(stockTickers);
      priceDataSig.value.stocks = stockPrices;
    }

    // Fetch gold price
    priceDataSig.value.goldPrice = await fetchGoldPrice();

    // Fetch exchange rates
    const exchangeRates = await fetchExchangeRates();
    priceDataSig.value.exchangeRates = new Map(Object.entries(exchangeRates));
    thbExchangeRateSig.value = exchangeRates["THB"];

    // Fetch fund prices
    const fundIds = getUniqueTickers(assets, "fund", "fundName");
    if (fundIds.length) {
      const fundPrices = await fetchFundPrices(fundIds);
      priceDataSig.value.funds = new Map(fundPrices);
    }
  } catch (error) {
    console.error("Error fetching price data:", error);
  }
}

function getUniqueTickers(
  assets: Asset[],
  type: string,
  key: string = "ticker",
): string[] {
  return [
    ...new Set(
      assets
        .filter((a) => a.type === type)
        .map((a) => a[key])
        .filter(Boolean),
    ),
  ];
}

async function fetchExchangeRates(): Promise<Record<string, number>> {
  const supportedCurrencies = ["THB", "JPY", "USD", "GBP", "EUR"];
  const exchangeRateSymbols = supportedCurrencies.map((currency) =>
    `USD${currency}=X`
  );
  const exchangeRates = await yahooFinance.quoteCombine(exchangeRateSymbols, {
    fields: ["regularMarketPrice"],
  });

  return Object.fromEntries(
    exchangeRateSymbols.map((symbol) => [
      symbol.replace("USD", "").replace("=X", ""),
      exchangeRates[symbol]?.regularMarketPrice || 1,
    ]),
  );
}

async function fetchFundPrices(fundIds: string[]): Promise<[string, number][]> {
  const fundPrices = await yahooFinance.quoteCombine(fundIds, {
    fields: ["regularMarketPrice"],
  });

  return fundIds.map((id) => [id, fundPrices[id]?.regularMarketPrice || 0]);
}
