// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import Head from "@/components/Head.tsx";
import IconCheckCircle from "tabler_icons_tsx/circle-check.tsx";
import IconCircleX from "tabler_icons_tsx/circle-x.tsx";
import { defineRoute, Handlers } from "$fresh/server.ts";
import { createAsset, createItem } from "@/utils/db.ts";
import { redirect } from "@/utils/http.ts";
import {
  assertSignedIn,
  type SignedInState,
  State,
} from "@/plugins/session.ts";
import { ulid } from "$std/ulid/mod.ts";
import IconInfo from "tabler_icons_tsx/info-circle.tsx";
import AssetForm from "@/islands/AssetForm.tsx";

const SUBMIT_STYLES =
  "w-full text-black text-center rounded-[7px] transition duration-300 px-4 py-2 block hover:bg-white hover:text-black hover:dark:bg-gray-100 hover:dark:!text-black";

export const handler: Handlers<undefined, SignedInState> = {
  async POST(req, ctx) {
    assertSignedIn(ctx);

    console.log("submitting asset");

    const form = await req.formData();
    const assetType = form.get("assetType")?.toString();

    console.log(assetType, form);
    // Validate required fields based on asset type
    if (!assetType) {
      return redirect("/submit?error=missing-type");
    }

    const baseAsset = {
      id: ulid(),
      userLogin: ctx.state.sessionUser.login,
      type: assetType,
      createdAt: new Date(),
    };

    try {
      switch (assetType) {
        case "stock": {
          const ticker = form.get("ticker")?.toString();
          const amount = form.get("amount")?.toString();
          const buyPrice = form.get("buyPrice")?.toString();

          if (!ticker || !amount || !buyPrice) {
            return redirect("/submit?error=missing-stock-fields");
          }

          await createAsset({
            ...baseAsset,
            ticker,
            amount: Number(amount),
            buyPrice: Number(buyPrice),
          });
          break;
        }

        case "gold": {
          const date = form.get("date")?.toString();
          const amount = form.get("amount")?.toString();

          if (!amount) {
            return redirect("/submit?error=missing-gold-fields");
          }

          await createAsset({
            ...baseAsset,
            date: date ? new Date(date) : undefined,
            amount: Number(amount),
          });
          break;
        }

        case "cash": {
          const amount = form.get("amount")?.toString();
          const currency = form.get("currency")?.toString();

          if (!amount || !currency) {
            return redirect("/submit?error=missing-cash-fields");
          }

          await createAsset({
            ...baseAsset,
            amount: Number(amount),
            currency,
          });
          break;
        }

        case "fund": {
          const fundName = form.get("fundName")?.toString();
          const amount = form.get("amount")?.toString();
          const fundType = form.get("fundType")?.toString();

          if (!fundName || !amount || !fundType) {
            return redirect("/submit?error=missing-fund-fields");
          }

          await createAsset({
            ...baseAsset,
            fundName,
            amount: Number(amount),
            fundType,
          });
          break;
        }

        default:
          return redirect("/submit?error=invalid-type");
      }

      return redirect("/dashboard");
    } catch (error) {
      console.error(error);
      return redirect("/submit?error=submission-failed");
    }
  },
};

export default defineRoute<State>((_req, ctx) => {
  return (
    <>
      <Head title="Submit" href={ctx.url.href} />
      <main class="flex-1 flex flex-col justify-center mx-auto w-full space-y-16 p-4 max-w-6xl">
        <div class="text-center">
          <h1 class="heading-styles">Add your asset</h1>
          <p class="text-gray-500">
            Start tracking your wealth!
          </p>
        </div>
        <div class="flex flex-col md:flex-row gap-8 md:gap-16 md:items-center">
          {
            /* <div class="flex-1 space-y-6">
            <p>
              <IconCircleX class="inline-block mr-2" />
              <strong>Don't</strong> post duplicate content
            </p>
            <p>
              <IconCircleX class="inline-block mr-2" />
              <strong>Don't</strong> share dummy or test posts
            </p>
            <div>
              <IconCheckCircle class="inline-block mr-2" />
              <strong>Do</strong> include a description with your title.
              <div class="text-sm text-gray-500">
                E.g. “Deno Hunt: the best place to share your Deno project”
              </div>
            </div>
          </div> */
          }
          <AssetForm />
          {
            /* <form class="flex-1 flex flex-col justify-center" method="post">
            <div>
              <label
                htmlFor="submit_title"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <input
                id="submit_title"
                class="input-styles w-full mt-2"
                type="text"
                name="title"
                required
                placeholder="Deno Hunt: the best place to share your Deno project"
                disabled={!ctx.state.sessionUser}
              />
            </div>

            <div class="mt-4">
              <label
                htmlFor="submit_url"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <input
                id="submit_url"
                class="input-styles w-full mt-2"
                type=""
                name="url"
                required
                placeholder="https://my-awesome-project.com"
                disabled={!ctx.state.sessionUser}
              />
            </div>
            <div class="mt-4">
              <label
                htmlFor="submit_url"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                URL
              </label>
              <input
                id="submit_url"
                class="input-styles w-full mt-2"
                type="url"
                name="url"
                required
                placeholder="https://my-awesome-project.com"
                disabled={!ctx.state.sessionUser}
              />
            </div>
            {ctx.url.searchParams.has("error") && (
              <div class="w-full text-red-500 mt-4">
                <IconInfo class="inline-block" />{" "}
                Title and valid URL are required
              </div>
            )}
            <div class="w-full rounded-lg bg-gradient-to-tr from-secondary to-primary p-px mt-8">
              {!ctx.state.sessionUser
                ? (
                  <a href="/signin" class={SUBMIT_STYLES}>
                    Sign in to submit &#8250;
                  </a>
                )
                : <button class={SUBMIT_STYLES}>Submit</button>}
            </div>
          </form> */
          }
        </div>
      </main>
    </>
  );
});
