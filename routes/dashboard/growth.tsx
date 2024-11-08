// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import Head from "@/components/Head.tsx";
import TabsBar from "@/components/TabsBar.tsx";
import GrowthTable from "@/islands/GrowthTable.tsx";
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

export default defineRoute((_req, ctx) => {
  return (
    <>
      <Head title="Growth" href={ctx.url.href}>
        <link
          as="fetch"
          crossOrigin="anonymous"
          href="/api/me/assets"
          rel="preload"
        />
      </Head>
      <main class="flex-1 p-4 f-client-nav">
        <h1 class="heading-with-margin-styles">Growth</h1>
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
        <a
          class="btn-styles inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="/assets/stocks"
        >
          Stocks Analysis
        </a>
        <Partial name="growth">
          <GrowthTable endpoint="/api/me/assets" />
        </Partial>
      </main>
    </>
  );
});
