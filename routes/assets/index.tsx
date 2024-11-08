import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import AssetButtons from "@/islands/AssetButtons.tsx";
import type { Asset } from "@/utils/db.ts";

export default function AssetsByType() {
  return (
    <div class="p-4">
      <h1 class="text-2xl font-semibold mb-4">All Assets</h1>
      <AssetButtons />
    </div>
  );
}
