import Head from "@/components/Head.tsx";
import StockChart from "@/islands/StockChart.tsx";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute((_req, ctx) => {
    const endpoint = "/api/me/assets"; // Example endpoint

    return (
        <>
            <Head title="Stocks Analysis" href={ctx.url.href} />
            <main class="flex-1 p-4">
                <h1 class="heading-with-margin-styles">Stocks Analysis</h1>
                <StockChart endpoint={endpoint} />
            </main>
        </>
    );
});
