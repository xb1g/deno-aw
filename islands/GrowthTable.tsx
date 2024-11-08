// islands/GrowthTable.tsx
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Asset } from "@/utils/db.ts";
import { fetchValuesSimple } from "@/utils/http.ts";
import { fetchPriceData, PriceData } from "@/utils/price_data.ts";

export interface GrowthTableProps {
  endpoint: string;
}

export default function GrowthTable(props: GrowthTableProps) {
  const assetsSig = useSignal<Asset[]>([]);
  const isLoadingSig = useSignal<boolean>(true);
  const priceDataSig = useSignal<PriceData>({
    stocks: new Map(),
    goldPrice: 0,
    exchangeRates: new Map(),
    funds: new Map(),
  });
  const thbExchangeRateSig = useSignal<number>(1);

  async function loadAssets() {
    if (!isLoadingSig.value) return;
    try {
      const values = await fetchValuesSimple<Asset>(props.endpoint);
      assetsSig.value = values;
      await fetchPriceData(values, priceDataSig, thbExchangeRateSig);
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  }

  useEffect(() => {
    loadAssets();
    // Refresh prices every 5 minutes
    const interval = setInterval(() => {
      fetchPriceData(assetsSig.value, priceDataSig, thbExchangeRateSig);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const growthDataSig = useComputed(() => {
    return assetsSig.value.map((asset) => {
      let currentPrice = 0;
      switch (asset.type) {
        case "stock":
          currentPrice = priceDataSig.value.stocks.get(asset.ticker!) || 0;
          break;
        case "gold":
          currentPrice = asset.amount! * priceDataSig.value.goldPrice;
          break;
        case "cash":
          currentPrice = asset.amount || 0;
          break;
        case "fund":
          currentPrice = asset.amount || 0; //priceDataSig.value.funds.get(asset.fundName!) || 0;
          break;
      }
      const growth =
        ((currentPrice - (asset.buyPrice || 0)) / (asset.buyPrice || 1)) * 100;
      return { ...asset, currentPrice, growth };
    });
  });

  const bestAssetSig = useComputed(() => {
    return growthDataSig.value.reduce((best, asset) => {
      return asset.growth > best.growth ? asset : best;
    }, growthDataSig.value[0]);
  });

  if (isLoadingSig.value) {
    return <p class="text-center p-4">กำลังโหลด...</p>;
  }

  return (
    <div class="w-full overflow-x-auto">
      <h2 class="text-xl font-semibold mb-4">
        Best Performing Asset:{" "}
        {bestAssetSig.value.ticker || bestAssetSig.value.fundName}{" "}
        ({bestAssetSig.value.growth.toFixed(2)}%)
      </h2>
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th class="border px-4 py-2">Asset Type</th>
            <th class="border px-4 py-2">Ticker/Name</th>
            <th class="border px-4 py-2">Buy Price</th>
            <th class="border px-4 py-2">Current Price</th>
            <th class="border px-4 py-2">Growth (%)</th>
          </tr>
        </thead>
        <tbody>
          {growthDataSig.value.map((asset) => (
            <tr key={asset.id}>
              <td class="border px-4 py-2">{asset.type}</td>
              <td class="border px-4 py-2">{asset.ticker || asset.fundName}</td>
              <td class="border px-4 py-2">{asset.buyPrice}</td>
              <td class="border px-4 py-2">{asset.currentPrice}</td>
              <td class="border px-4 py-2">
                {asset.type === "stock" ? `${asset.growth.toFixed(2)}%` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
