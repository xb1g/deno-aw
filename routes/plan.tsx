import Head from "@/components/Head.tsx";
import RetirementPlan from "@/islands/RetirementPlan.tsx";
import { defineRoute } from "$fresh/server.ts";

interface State {
    sessionUser?: {
        login?: string;
    };
}

export default defineRoute((_req, ctx: { state: State }) => {
    const userLogin = ctx.state.sessionUser?.login;

    return (
        <>
            <Head title="Retirement Plan" href={ctx.url.href} />
            <main class="flex-1 p-4">
                <h1 class="heading-with-margin-styles">Retirement Plan</h1>
                {userLogin
                    ? <RetirementPlan userLogin={userLogin} />
                    : (
                        <p class="text-center p-4">
                            Please log in to create a retirement plan.
                        </p>
                    )}
            </main>
        </>
    );
});
