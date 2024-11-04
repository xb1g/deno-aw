import type { Handlers } from "$fresh/server.ts";
import { getUserAssets } from "@/utils/db.ts";
import { getUser } from "@/utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { login } = ctx.params;
    const user = await getUser(login);
    if (user === null) throw new Deno.errors.NotFound("User not found");

    const assets = await getUserAssets(login);
    console.log(assets, "ass");
    return Response.json(assets);
  },
};
