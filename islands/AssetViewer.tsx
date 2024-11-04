// islands/AssetViewer.tsx
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Asset } from "@/utils/db.ts";
import Chart from "@/islands/Chart.tsx";
import { fetchValuesSimple } from "@/utils/http.ts";

export interface AssetViewerProps {
  endpoint: string;
}

export default function AssetViewer(props: AssetViewerProps) {
  const assetsSig = useSignal<Asset[]>([]);
  const isLoadingSig = useSignal<boolean>(true);

  const chartDataSig = useComputed(() => {
    const assetTypes = ["stock", "gold", "cash", "fund"];
    console.log(assetsSig.value);
    const assetValues = assetTypes.map((type) => {
      const assetsByType = assetsSig.value.filter((asset) =>
        asset.type === type
      );
      console.log(assetsByType, "tyep");

      let totalValue = 0;
      console.log(type);
      switch (type) {
        case "stock":
          totalValue = assetsByType.reduce(
            (sum, asset) => sum + (asset.amount || 0) * (asset.buyPrice || 0),
            0,
          );
          break;
        case "gold":
          totalValue = assetsByType.reduce(
            (sum, asset) => sum + (asset.quantity || 0) * 1900,
            0,
          ); // Using $1900/oz as example price
          break;
        case "cash":
          totalValue = assetsByType.reduce(
            (sum, asset) => sum + (asset.cashAmount || 0),
            0,
          );
          break;
        case "fund":
          totalValue = assetsByType.reduce(
            (sum, asset) => sum + (asset.fundAmount || 0),
            0,
          );
          break;
      }
      console.log(totalValue, "total");
      return totalValue;
    });

    console.log(assetValues, "asss");
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

  async function loadAssets() {
    if (!isLoadingSig.value) return;
    try {
      const values = await fetchValuesSimple<Asset>(props.endpoint);
      assetsSig.value = values;
    } catch (error) {
      console.error(error.message);
    } finally {
      isLoadingSig.value = false;
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

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
      <Chart
        type="doughnut"
        data={chartDataSig.value}
        options={{
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `$${context.parsed.toLocaleString()}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
