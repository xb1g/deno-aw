import { Handlers } from "$fresh/server.ts";
import { createRetirementPlan, RetirementPlan } from "@/utils/db.ts";

export const handler: Handlers = {
    async POST(req) {
        try {
            const plan: RetirementPlan = await req.json();
            await createRetirementPlan(plan);
            return new Response("Retirement plan created successfully", {
                status: 201,
            });
        } catch (error) {
            console.error("Error creating retirement plan:", error);
            return new Response("Failed to create retirement plan", {
                status: 500,
            });
        }
    },
};
