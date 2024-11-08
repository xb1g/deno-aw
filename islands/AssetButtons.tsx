import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { fetchValuesSimple } from "@/utils/http.ts";
import type { Asset } from "@/utils/db.ts";

export default function AssetButtons() {
    const assetsSig = useSignal<Asset[]>([]);

    async function loadAssets() {
        try {
            const values = await fetchValuesSimple<Asset>("/api/me/assets");
            assetsSig.value = values;
            console.log("Assets loaded:", values); // Check if data is logged
        } catch (error) {
            console.error("Error loading assets:", error.message);
        }
    }

    useEffect(() => {
        loadAssets();
    }, []);

    const assetTypes = ["cash", "stocks", "gold", "fund"];

    const assetsByTypeSig = useComputed(() => {
        return assetTypes.reduce((acc, type) => {
            acc[type] = assetsSig.value.filter((asset) => {
                if (type === "cash") {
                    return asset.type === type && asset.currency === "THB";
                }
                return asset.type === type;
            });
            return acc;
        }, {} as Record<string, Asset[]>);
    });

    const totalAmountByTypeSig = useComputed(() => {
        return assetTypes.reduce((acc, type) => {
            console.log(acc, type); // Check if data is logged
            acc[type] = assetsByTypeSig.value[type].reduce((sum, asset) => {
                switch (type) {
                    case "stocks":
                        console.log("Stocks:", asset); // Check if data is logged
                        return sum +
                            (asset.amount || 0) * (asset.buyPrice || 0);
                    case "gold":
                        return sum + (asset.amount || 0);
                    case "cash":
                    case "fund":
                        return sum + (asset.amount || 0);
                    default:
                        return sum;
                }
            }, 0);
            console.log("Total amount by type:", acc); // Check if data is logged
            return acc;
        }, {} as Record<string, number>);
    });

    const averageGrowthByTypeSig = useComputed(() => {
        return assetTypes.reduce((acc, type) => {
            const assets = assetsByTypeSig.value[type];
            const totalGrowth = assets.reduce(
                (sum, asset) => sum + (asset.growth || 0),
                0,
            );
            acc[type] = assets.length ? totalGrowth / assets.length : 0;
            return acc;
        }, {} as Record<string, number>);
    });

    return (
        <div class="mb-4">
            {assetTypes.map((type) => (
                <button
                    key={type}
                    class="mr-2 mb-2 p-2 bg-blue-500 text-white rounded"
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}: Avg Growth
                    {" "}
                    {averageGrowthByTypeSig.value[type].toFixed(2)}%
                </button>
            ))}
            {assetTypes.map((type) => (
                <div key={type} class="mb-8">
                    <h2 class="text-xl font-semibold mb-2 capitalize">
                        {type}
                    </h2>
                    <p class="mb-2">
                        Total Amount:{" "}
                        {totalAmountByTypeSig.value[type].toLocaleString()}
                    </p>
                    <ul>
                        {assetsByTypeSig.value[type].map((asset) => (
                            <li key={asset.id} class="mb-1">
                                {asset.ticker || asset.fundName ||
                                    asset.currency || "Unknown"}
                            </li>
                        ))}
                    </ul>
                    <a
                        href={`/assets/${type}`}
                        class="text-primary hover:underline"
                    >
                        Analyze more {type} assets &#8250;
                    </a>
                </div>
            ))}
        </div>
    );
}
