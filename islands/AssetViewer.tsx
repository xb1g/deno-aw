// islands/AssetViewer.tsx
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Asset } from "@/utils/db.ts";
import Chart from "@/islands/Chart.tsx";
import { fetchValuesSimple } from "@/utils/http.ts";
import { fetchPriceData, PriceData } from "@/utils/price_data.ts";

export interface AssetViewerProps {
  endpoint: string;
}

export default function AssetViewer(props: AssetViewerProps) {
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

  const totalAssetValueSig = useComputed(() => {
    return assetsSig.value.reduce((total, asset) => {
      let currentPrice = 0;
      switch (asset.type) {
        case "stock":
          currentPrice = priceDataSig.value.stocks.get(asset.ticker!) || 0;
          return total + (asset.amount || 0) * currentPrice;
        case "gold":
          return total + (asset.amount || 0) * priceDataSig.value.goldPrice;
        case "cash":
          const rate = priceDataSig.value.exchangeRates.get(asset.currency!) ||
            1;
          return total + (asset.amount || 0) / rate;
        case "fund":
          const nav = priceDataSig.value.funds.get(asset.fundName!) || 0;
          return total + (asset.amount || 0) * nav;
        default:
          return total;
      }
    }, 0) * thbExchangeRateSig.value; // Convert to THB
  });

  const chartDataSig = useComputed(() => {
    const assetTypes = ["stock", "gold", "cash", "fund"];
    const assetValues = assetTypes.map((type) => {
      const assetsByType = assetsSig.value.filter((asset) =>
        asset.type === type
      );

      let totalValue = 0;
      switch (type) {
        case "stock":
          totalValue = assetsByType.reduce((sum, asset) => {
            const currentPrice = priceDataSig.value.stocks.get(asset.ticker!) ||
              0;
            return sum + (asset.amount || 0) * currentPrice;
          }, 0);
          break;

        case "gold":
          totalValue = assetsByType.reduce(
            (sum, asset) =>
              sum + (asset.amount || 0) * priceDataSig.value.goldPrice,
            0,
          );
          break;

        case "cash":
          totalValue = assetsByType.reduce((sum, asset) => {
            const rate =
              priceDataSig.value.exchangeRates.get(asset.currency!) || 1;
            return sum + (asset.amount || 0) / rate;
          }, 0);
          break;

        case "fund":
          totalValue = assetsByType.reduce((sum, asset) => {
            const nav = priceDataSig.value.funds.get(asset.fundName!) || 0;
            return sum + (asset.amount || 0) * nav;
          }, 0);
          break;
      }
      return totalValue * thbExchangeRateSig.value; // Convert to THB
    });

    return {
      labels: assetTypes.map((type) =>
        type.charAt(0).toUpperCase() + type.slice(1)
      ),
      datasets: [{
        data: assetValues,
        backgroundColor: ["#2196F3", "#FFC107", "#4CAF50", "#FF5722"],
      }],
    };
  });

  if (isLoadingSig.value) {
    return <p class="text-center p-4">กำลังโหลด...</p>;
  }

  if (!assetsSig.value.length) {
    return (
      <div class="text-center p-4">
        <p>ไม่พบสินทรัพย์</p>
        <a href="/submit" class="text-primary hover:underline">
          เพิ่มสินทรัพย์แรกของคุณ &#8250;
        </a>
      </div>
    );
  }

  return (
    <div class="w-full h-[400px] relative">
      <div class="text-center mb-4">
        <h2 class="text-xl font-semibold">
          Total Asset Value: ฿{totalAssetValueSig.value.toLocaleString()}
        </h2>
      </div>
      <Chart
        type="doughnut"
        data={chartDataSig.value}
        options={{
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `฿${context.parsed.toLocaleString()}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
