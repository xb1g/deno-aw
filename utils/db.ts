// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { ulid } from "$std/ulid/mod.ts";

const DENO_KV_PATH_KEY = "DENO_KV_PATH";
let path = undefined;
if (
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}
export const kv = await Deno.openKv(path);

/**
 * Returns an array of values of a given {@linkcode Deno.KvListIterator} that's
 * been iterated over.
 *
 * @example
 * ```ts
 * import { collectValues, listItems, type Item } from "@/utils/db.ts";
 *
 * const items = await collectValues<Item>(listItems());
 * items[0].id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1";
 * items[0].userLogin; // Returns "snoop"
 * items[0].title; // Returns "example-title"
 * items[0].url; // Returns "http://example.com"
 * items[0].score; // Returns 420
 * ```
 */
export async function collectValues<T>(iter: Deno.KvListIterator<T>) {
  return await Array.fromAsync(iter, ({ value }) => value);
}

// Item
export interface Item {
  // Uses ULID
  id: string;
  userLogin: string;
  title: string;
  url: string;
  score: number;
}
export interface Asset {
  id: string;
  userLogin: string;
  type: string;
  createdAt: Date;
  // Stock fields
  ticker?: string;
  amount?: number;
  buyPrice?: number;
  // Gold fields
  date?: Date;
  quantity?: number;
  // Cash fields
  cashAmount?: number;
  currency?: string;
  // Fund fields
  fundName?: string;
  fundAmount?: number;
  fundType?: string;
}
export interface RetirementPlan {
  id: string;
  userLogin: string;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturnRate: number;
}
/** For testing */
export function randomItem(): Item {
  return {
    id: ulid(),
    userLogin: crypto.randomUUID(),
    title: crypto.randomUUID(),
    url: `http://${crypto.randomUUID()}.com`,
    score: 0,
  };
}

/**
 * Creates a new item in the database. Throws if the item already exists in
 * one of the indexes.
 *
 * @example
 * ```ts
 * import { createItem } from "@/utils/db.ts";
 * import { ulid } from "$std/ulid/mod.ts";
 *
 * await createItem({
 *   id: ulid(),
 *   userLogin: "john_doe",
 *   title: "example-title",
 *   url: "https://example.com",
 *   score: 0,
 * });
 * ```
 */
export async function createItem(item: Item) {
  const itemsKey = ["items", item.id];
  const itemsByUserKey = ["items_by_user", item.userLogin, item.id];

  const res = await kv.atomic()
    .check({ key: itemsKey, versionstamp: null })
    .check({ key: itemsByUserKey, versionstamp: null })
    .set(itemsKey, item)
    .set(itemsByUserKey, item)
    .commit();

  if (!res.ok) throw new Error("Failed to create item");
}

export async function createAsset(asset: Asset) {
  const assetKey = ["assets", asset.id];
  const assetsByUserKey = ["assets_by_user", asset.userLogin, asset.id];

  const res = await kv.atomic()
    .check({ key: assetKey, versionstamp: null })
    .check({ key: assetsByUserKey, versionstamp: null })
    .set(assetKey, asset)
    .set(assetsByUserKey, asset)
    .commit();

  if (!res.ok) throw new Error("Failed to create asset");
}

export async function createRetirementPlan(plan: RetirementPlan) {
  const planKey = ["retirement_plans", plan.id];
  const plansByUserKey = ["retirement_plans_by_user", plan.userLogin, plan.id];

  const res = await kv.atomic()
    .check({ key: planKey, versionstamp: null })
    .check({ key: plansByUserKey, versionstamp: null })
    .set(planKey, plan)
    .set(plansByUserKey, plan)
    .commit();

  if (!res.ok) throw new Error("Failed to create vote");
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the items voted by a given user in the database, in chronological order.
 *
 * @example
 * ```ts
 * import { listItemsVotedByUser } from "@/utils/db.ts";
 *
 * for await (const entry of listItemsVotedByUser("john")) {
 *   entry.value.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1"
 *   entry.value.userLogin; // Returns "pedro"
 *   entry.key; // Returns ["items_voted_by_user", "01H9YD2RVCYTBVJEYEJEV5D1S1", "pedro"]
 *   entry.versionstamp; // Returns "00000000000000010000"
 * }
 * ```
 */
export function listItemsVotedByUser(userLogin: string) {
  return kv.list<Item>({ prefix: ["items_voted_by_user", userLogin] });
}

// User
export interface User {
  // AKA username
  login: string;
  sessionId: string;
  /**
   * Whether the user is subscribed to the "Premium Plan".
   * @default {false}
   */
  isSubscribed: boolean;
  stripeCustomerId?: string;
}

/** For testing */
export function randomUser(): User {
  return {
    login: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    isSubscribed: false,
    stripeCustomerId: crypto.randomUUID(),
  };
}

/**
 * Creates a new user in the database. Throws if the user or user session
 * already exists.
 *
 * @example
 * ```ts
 * import { createUser } from "@/utils/db.ts";
 *
 * await createUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 *   isSubscribed: false,
 * });
 * ```
 */
export async function createUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: usersBySessionKey, versionstamp: null })
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  if (user.stripeCustomerId !== undefined) {
    const usersByStripeCustomerKey = [
      "users_by_stripe_customer",
      user.stripeCustomerId,
    ];
    atomicOp
      .check({ key: usersByStripeCustomerKey, versionstamp: null })
      .set(usersByStripeCustomerKey, user);
  }

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to create user");
}

/**
 * Creates a user in the database, overwriting any previous data.
 *
 * @example
 * ```ts
 * import { updateUser } from "@/utils/db.ts";
 *
 * await updateUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 *   isSubscribed: false,
 * });
 * ```
 */
export async function updateUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  if (user.stripeCustomerId !== undefined) {
    const usersByStripeCustomerKey = [
      "users_by_stripe_customer",
      user.stripeCustomerId,
    ];
    atomicOp
      .set(usersByStripeCustomerKey, user);
  }

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user");
}

/**
 * Updates the session ID of a given user in the database.
 *
 * @example
 * ```ts
 * import { updateUserSession } from "@/utils/db.ts";
 *
 * await updateUserSession({
 *   login: "john",
 *   sessionId: "xxx",
 *   isSubscribed: false,
 * }, "yyy");
 * ```
 */
export async function updateUserSession(user: User, sessionId: string) {
  const userKey = ["users", user.login];
  const oldUserBySessionKey = ["users_by_session", user.sessionId];
  const newUserBySessionKey = ["users_by_session", sessionId];
  const newUser: User = { ...user, sessionId };

  const atomicOp = kv.atomic()
    .set(userKey, newUser)
    .delete(oldUserBySessionKey)
    .check({ key: newUserBySessionKey, versionstamp: null })
    .set(newUserBySessionKey, newUser);

  if (user.stripeCustomerId !== undefined) {
    const usersByStripeCustomerKey = [
      "users_by_stripe_customer",
      user.stripeCustomerId,
    ];
    atomicOp
      .set(usersByStripeCustomerKey, user);
  }

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user session");
}

/**
 * Gets the user with the given login from the database.
 *
 * @example
 * ```ts
 * import { getUser } from "@/utils/db.ts";
 *
 * const user = await getUser("jack");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * user?.isSubscribed; // Returns false
 * ```
 */
export async function getUser(login: string) {
  const res = await kv.get<User>(["users", login]);
  return res.value;
}

/**
 * Gets the user with the given session ID from the database. The first attempt
 * is done with eventual consistency. If that returns `null`, the second
 * attempt is done with strong consistency. This is done for performance
 * reasons, as this function is called in every route request for checking
 * whether the session user is signed in.
 *
 * @example
 * ```ts
 * import { getUserBySession } from "@/utils/db.ts";
 *
 * const user = await getUserBySession("xxx");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * user?.isSubscribed; // Returns false
 * ```
 */
export async function getUserBySession(sessionId: string) {
  const key = ["users_by_session", sessionId];
  const eventualRes = await kv.get<User>(key, {
    consistency: "eventual",
  });
  if (eventualRes.value !== null) return eventualRes.value;
  const res = await kv.get<User>(key);
  return res.value;
}

/**
 * Gets a user by their given Stripe customer ID from the database.
 *
 * @example
 * ```ts
 * import { getUserByStripeCustomer } from "@/utils/db.ts";
 *
 * const user = await getUserByStripeCustomer("123");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * user?.isSubscribed; // Returns false
 * user?.stripeCustomerId; // Returns "123"
 * ```
 */
export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const res = await kv.get<User>([
    "users_by_stripe_customer",
    stripeCustomerId,
  ]);
  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the users in the database.
 *
 * @example
 * ```ts
 * import { listUsers } from "@/utils/db.ts";
 *
 * for await (const entry of listUsers()) {
 *   entry.value.login; // Returns "jack"
 *   entry.value.sessionId; // Returns "xxx"
 *   entry.value.isSubscribed; // Returns false
 * }
 * ```
 */
export function listUsers(options?: Deno.KvListOptions) {
  return kv.list<User>({ prefix: ["users"] }, options);
}

/**
 * Returns a boolean array indicating whether the given items have been voted
 * for by the given user in the database.
 *
 * @example
 * ```ts
 * import { getAreVotedByUser } from "@/utils/db.ts";
 *
 * const items = [
 *   {
 *     id: "01H9YD2RVCYTBVJEYEJEV5D1S1",
 *     userLogin: "jack",
 *     title: "Jack voted for this",
 *     url: "http://example.com",
 *     score: 1,
 *   },
 *   {
 *     id: "01H9YD2RVCYTBVJEYEJEV5D1S2",
 *     userLogin: "jill",
 *     title: "Jack didn't vote for this",
 *     url: "http://youtube.com",
 *     score: 0,
 *   }
 * ];
 * await getAreVotedByUser(items, "jack"); // Returns [true, false]
 * ```
 */
export async function getAreVotedByUser(items: Item[], userLogin: string) {
  const votedItems = await collectValues(listItemsVotedByUser(userLogin));
  const votedItemsIds = votedItems.map((item) => item.id);
  return items.map((item) => votedItemsIds.includes(item.id));
}

export async function getAllAssets(): Promise<Asset[]> {
  const iterator = kv.list<Asset>({ prefix: ["assets"] });
  const assets: Asset[] = [];
  for await (const { value } of iterator) {
    assets.push(value);
  }
  return assets;
}

export async function getUserAssets(userLogin: string): Promise<Asset[]> {
  const iterator = kv.list<Asset>({ prefix: ["assets_by_user", userLogin] });
  const assets: Asset[] = [];
  for await (const { value } of iterator) {
    assets.push(value);
  }
  return assets;
}
