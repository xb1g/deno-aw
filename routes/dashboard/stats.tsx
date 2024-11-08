// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import Head from "@/components/Head.tsx";
import TabsBar from "@/components/TabsBar.tsx";
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import AssetViewer from "@/islands/AssetViewer.tsx";

export default defineRoute((_req, ctx) => {
  // const labels = [
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  //   "Sunday",
  // ];
  // const datasets = [
  //   {
  //     label: "Site visits",
  //     data: randomNumbers(labels.length),
  //     borderColor: "#be185d",
  //   },
  //   {
  //     label: "Users created",
  //     data: randomNumbers(labels.length),
  //     borderColor: "#e85d04",
  //   },
  //   {
  //     label: "Items created",
  //     data: randomNumbers(labels.length),
  //     borderColor: "#219ebc",
  //   },
  //   {
  //     label: "Votes",
  //     data: randomNumbers(labels.length),
  //     borderColor: "#4338ca",
  //   },
  // ];

  return (
    <>
      <Head title="Dashboard" href={ctx.url.href} />
      <main class="flex-1 p-4 flex flex-col f-client-nav">
        <h1 class="heading-with-margin-styles">Dashboard</h1>
        <TabsBar
          links={[{
            path: "/dashboard/stats",
            innerText: "Stats",
          }, {
            path: "/dashboard/growth",
            innerText: "Growth",
          }]}
          currentPath={ctx.url.pathname}
        />
        <Partial name="stats">
          <div class="flex-1 relative">
            {
              /* <Chart
              type="line"
              options={{
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                scales: {
                  x: {
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { precision: 0 },
                  },
                },
              }}
              data={{
                labels,
                datasets: datasets.map((dataset) => ({
                  ...dataset,
                  pointRadius: 0,
                  cubicInterpolationMode: "monotone",
                })),
              }}
            /> */
            }
            <AssetViewer endpoint="/api/me/assets" />
          </div>
        </Partial>
      </main>
    </>
  );
});
