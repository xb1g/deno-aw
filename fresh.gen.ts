// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_500.tsx";
import * as $2 from "./routes/_middleware.ts";
import * as $3 from "./routes/account/_middleware.ts";
import * as $4 from "./routes/account/index.tsx";
import * as $5 from "./routes/account/manage.ts";
import * as $6 from "./routes/account/upgrade.ts";
import * as $7 from "./routes/api/stripe-webhooks.ts";
import * as $8 from "./routes/api/vote.ts";
import * as $9 from "./routes/blog/[slug].tsx";
import * as $10 from "./routes/blog/index.tsx";
import * as $11 from "./routes/feed.ts";
import * as $12 from "./routes/index.tsx";
import * as $13 from "./routes/item/[id].tsx";
import * as $14 from "./routes/login/index.tsx";
import * as $15 from "./routes/login/oauth.ts";
import * as $16 from "./routes/login/success.tsx";
import * as $17 from "./routes/logout.ts";
import * as $18 from "./routes/signup.tsx";
import * as $19 from "./routes/submit.tsx";
import * as $$0 from "./islands/AuthFragmentCatcher.tsx";
import * as $$1 from "./islands/Vote.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_500.tsx": $1,
    "./routes/_middleware.ts": $2,
    "./routes/account/_middleware.ts": $3,
    "./routes/account/index.tsx": $4,
    "./routes/account/manage.ts": $5,
    "./routes/account/upgrade.ts": $6,
    "./routes/api/stripe-webhooks.ts": $7,
    "./routes/api/vote.ts": $8,
    "./routes/blog/[slug].tsx": $9,
    "./routes/blog/index.tsx": $10,
    "./routes/feed.ts": $11,
    "./routes/index.tsx": $12,
    "./routes/item/[id].tsx": $13,
    "./routes/login/index.tsx": $14,
    "./routes/login/oauth.ts": $15,
    "./routes/login/success.tsx": $16,
    "./routes/logout.ts": $17,
    "./routes/signup.tsx": $18,
    "./routes/submit.tsx": $19,
  },
  islands: {
    "./islands/AuthFragmentCatcher.tsx": $$0,
    "./islands/Vote.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
