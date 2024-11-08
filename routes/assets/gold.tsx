import Head from "@/components/Head.tsx";
import GoldChart from "@/islands/GoldChart.tsx";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute((_req, ctx) => {
    const endpoint = "/api/me/assets"; // Example endpoint

    return (
        <>
            <Head title="Gold Analysis" href={ctx.url.href} />
            <main class="flex-1 p-4">
                <h1 class="heading-with-margin-styles">Gold Analysis</h1>
                <GoldChart endpoint={endpoint} />
            </main>
        </>
    );
});
