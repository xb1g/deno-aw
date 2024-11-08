import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Chart from "@/islands/Chart.tsx";
import { fetchValuesSimple } from "@/utils/http.ts";
import { fetchPriceData, PriceData } from "@/utils/price_data.ts";
import type { Asset } from "@/utils/db.ts";

export default function StockPerformance() {
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
            const values = await fetchValuesSimple<Asset>("/api/me/assets");
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
                    currentPrice =
                        priceDataSig.value.stocks.get(asset.ticker!) || 0;
                    break;
                case "gold":
                    currentPrice = asset.amount! * priceDataSig.value.goldPrice;
                    break;
                case "cash":
                    currentPrice = asset.amount || 0;
                    break;
                case "fund":
                    currentPrice = asset.amount || 0;
                    break;
            }
            const growth =
                ((currentPrice - (asset.buyPrice || 0)) /
                    (asset.buyPrice || 1)) * 100;
            return { ...asset, currentPrice, growth };
        });
    });

    const chartDataSig = useComputed(() => {
        const assetTypes = ["stock"];
        const assetValues = assetTypes.map((type) => {
            const assetsByType = assetsSig.value.filter((asset) =>
                asset.type === type
            );
            let totalValue = 0;
            switch (type) {
                case "stock":
                    totalValue = assetsByType.reduce((sum, asset) => {
                        const currentPrice =
                            priceDataSig.value.stocks.get(asset.ticker!) || 0;
                        return sum + (asset.amount || 0) * currentPrice;
                    }, 0);
                    break;
            }
            return totalValue * thbExchangeRateSig.value;
        });

        return {
            labels: assetTypes.map((type) =>
                type.charAt(0).toUpperCase() + type.slice(1)
            ),
            datasets: [{
                data: assetValues,
                backgroundColor: ["#2196F3"],
            }],
        };
    });

    if (isLoadingSig.value) {
        return <p class="text-center p-4">Loading...</p>;
    }

    if (!assetsSig.value.length) {
        return (
            <div class="text-center p-4">
                <p>No assets found</p>
                <a href="/submit" class="text-primary hover:underline">
                    Add your first asset &#8250;
                </a>
            </div>
        );
    }

    return (
        <div class="w-full h-[400px] relative">
            <div class="text-center mb-4">
                <h2 class="text-xl font-semibold">
                    Total Stock Value: ฿{chartDataSig.value.datasets[0].data[0]
                        .toLocaleString()}
                </h2>
            </div>
            <Chart
                type="doughnut"
                data={chartDataSig.value}
                options={{
                    maintainAspectRatio: false,
                }}
            />
            <table class="table-auto w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Ticker</th>
                        <th class="border px-4 py-2">Buy Price</th>
                        <th class="border px-4 py-2">Current Price</th>
                        <th class="border px-4 py-2">Growth (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {growthDataSig.value.map((asset) => (
                        <tr key={asset.id}>
                            <td class="border px-4 py-2">{asset.ticker}</td>
                            <td class="border px-4 py-2">{asset.buyPrice}</td>
                            <td class="border px-4 py-2">
                                {asset.currentPrice}
                            </td>
                            <td class="border px-4 py-2">
                                {asset.growth.toFixed(2)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
