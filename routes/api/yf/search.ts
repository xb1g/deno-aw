import { Handlers } from "$fresh/server.ts";
import yahooFinance from "yahoo-finance2";

export const handler: Handlers = {
    async GET(req) {
        const url = new URL(req.url);
        const query = url.searchParams.get("query");

        if (!query) {
            return new Response(
                JSON.stringify({ error: "Query parameter is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        try {
            const result = await yahooFinance.search(query);
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
