import type { Handlers } from "$fresh/server.ts";
import { getUserAssets } from "@/utils/db.ts";
import { assertSignedIn, SignedInState } from "@/plugins/session.ts";

// /routes/api/me/assets.ts

export const handler: Handlers<undefined, SignedInState> = {
  async GET(_req, ctx) {
    assertSignedIn(ctx);

    const userLogin = ctx.state.sessionUser.login;
    const assets = await getUserAssets(userLogin);

    return Response.json(assets);
  },
};
