// routes/assets_visualization.tsx

import { defineRoute } from "$fresh/server.ts";
import Head from "@/components/Head.tsx";
import Chart from "@/islands/Chart.tsx";
import { getAllAssets } from "@/utils/db.ts";

export default defineRoute(async (_req, ctx) => {
  // Fetch all assets from the database
  const assets = await getAllAssets();

  // Process assets to get data for the chart
  const assetTypes = ["stock", "gold", "cash", "fund"];
  const assetCounts = assetTypes.map((type) =>
    assets.filter((asset) => asset.type === type).length
  );

  const data = {
    labels: assetTypes.map((type) =>
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
    datasets: [
      {
        data: assetCounts,
        backgroundColor: ["#2196F3", "#FFC107", "#4CAF50", "#FF5722"],
      },
    ],
  };

  return (
    <>
      <Head title="Assets Visualization" href={ctx.url.href} />
      <main class="flex-1 p-4 flex flex-col">
        <h1 class="text-2xl font-semibold mb-4">Assets Visualization</h1>
        <div class="flex-1 relative">
          <Chart
            type="doughnut"
            data={data}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      </main>
    </>
  );
});
