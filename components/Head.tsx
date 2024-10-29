// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { Head as _Head } from "$fresh/runtime.ts";
import Meta, { type MetaProps } from "./Meta.tsx";
import { SITE_DESCRIPTION, SITE_NAME } from "@/utils/constants.ts";
import { ComponentChildren } from "preact";

export type HeadProps =
  & Partial<Omit<MetaProps, "href">>
  & Pick<MetaProps, "href">
  & {
    children?: ComponentChildren;
  };

export default function Head(props: HeadProps) {
  return (
    <_Head>
      <link
        crossorigin="use-credentials"
        rel="manifest"
        href="/manifest.webmanifest"
      />
      <Meta
        title={props?.title ? `${props.title} ▲ ${SITE_NAME}` : SITE_NAME}
        description={props?.description ?? SITE_DESCRIPTION}
        href={props.href}
        imageUrl="/cover.png"
      />
      <script type="module">
        import
        "https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate/dist/pwa-update.js";
        const el = document.createElement("pwa-update");
        document.body.appendChild(el);
      </script>
      {props.children}
    </_Head>
  );
}
