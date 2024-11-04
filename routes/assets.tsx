// routes/user_assets_visualization.tsx

import { defineRoute, Handlers } from "$fresh/server.ts";
import { assertSignedIn, SignedInState } from "@/plugins/session.ts";
import { getUserAssets } from "@/utils/db.ts";
import Head from "@/components/Head.tsx";
import Chart from "@/islands/Chart.tsx";
import type { State } from "@/plugins/session.ts";
import { getUser } from "@/utils/db.ts";

export const handler: Handlers<undefined, SignedInState> = {
  async GET(_req, ctx) {
    assertSignedIn(ctx);

    const userLogin = ctx.state.sessionUser.login;
    const assets = await getUserAssets(userLogin);

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

    return ctx.render({ data });
  },
};

// export default defineRoute((_req, ctx) => {
//   const { data } = ctx.renderData;
export default defineRoute<State>(
  async (_req, ctx) => {
    const { login } = ctx.params;
    const user = await getUser(login);
    if (user === null) return await ctx.renderNotFound();

    const isSignedIn = ctx.state.sessionUser !== undefined;
    const endpoint = `/api/users/${login}/items`;

    return (
      <>
        <Head title="My Assets Visualization" href={ctx.url.href}>
          {isSignedIn && (
            <link
              as="fetch"
              crossOrigin="anonymous"
              href="/api/me/votes"
              rel="preload"
            />
          )}
        </Head>

        <main class="flex-1 p-4 flex flex-col">
          <h1 class="text-2xl font-semibold mb-4">My Assets Visualization</h1>
          <div class="flex-1 relative">
            <Chart
              type="doughnut"
              data={data}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </main>
      </>
    );
  },
);
