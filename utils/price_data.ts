// utils/priceData.ts
import { fetchGoldPrice, fetchStockPrices } from "@/utils/data.ts";
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
    const stockTickers = [
      ...new Set(
        assets
          .filter((a) => a.type === "stock")
          .map((a) => a.ticker)
          .filter(Boolean),
      ),
    ];

    if (stockTickers.length) {
      const stockPrices = await fetchStockPrices(stockTickers);
      priceDataSig.value.stocks = stockPrices;
    }

    // Fetch gold price
    const goldPrice = await fetchGoldPrice();
    priceDataSig.value.goldPrice = goldPrice;

    // Fetch exchange rates
    const rates = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`,
    ).then((r) => r.json());
    priceDataSig.value.exchangeRates = new Map(Object.entries(rates.rates));
    thbExchangeRateSig.value = rates.rates["THB"];

    // Fetch fund prices
    const fundIds = [
      ...new Set(
        assets
          .filter((a) => a.type === "fund")
          .map((a) => a.fundName)
          .filter(Boolean),
      ),
    ];

    if (fundIds.length) {
      const fundPrices = await fetch(
        `https://api.marketdata.app/v1/funds/nav/${fundIds.join(",")}`,
      ).then((r) => r.json());

      priceDataSig.value.funds = new Map(
        fundIds.map((id, i) => [id!, fundPrices.nav[i]]),
      );
    }
  } catch (error) {
    console.error("Error fetching price data:", error);
  }
}
