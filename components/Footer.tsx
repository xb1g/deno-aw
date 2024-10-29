// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { SITE_NAME } from "@/utils/constants.ts";
import IconBrandDiscord from "tabler_icons_tsx/brand-discord.tsx";
import IconBrandGithub from "tabler_icons_tsx/brand-github.tsx";
import IconRss from "tabler_icons_tsx/rss.tsx";

function MadeWithFreshBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="197" height="37" fill="none">
      <title>Made with Fresh</title>
      <rect width="196" height="36" x="0.5" y="0.5" fill="#fff" rx="5.5"></rect>
      <path
        fill="#FDCF2B"
        d="M40.16 10.75c3.144 7.674 0 11.8-2.66 14.075.65 2.275-1.94 2.744-2.925 1.625-2.897.999-8.783.967-13-3.25-2.275-2.275-.5-7.336 5.525-10.725 5.2-2.925 10.4-4.55 13.06-1.726z"
      >
      </path>
      <path
        fill="#fff"
        stroke="#FDCF2B"
        strokeWidth="0.65"
        d="M27.1 12.475c4.45-2.923 9.766-4.147 11.939-2.255 3.336 2.905-7.064 9.478-10.964 11.03-4.225 1.682-1.95 5.525-4.225 5.525-1.95 0-1.625-2.6-3.369-5.037-1.03-1.44 1.523-5.916 6.619-9.263z"
      >
      </path>
      <path
        fill="#FDCF2B"
        d="M36.547 10.702c3.02.813-.236 3.701-2.796 5.548-2.426 1.75-4.294 2.737-5.15 3.14-.238.112-1.051-1.464-1.051-.65 0 .27-.455 1.455-.608 1.512-.887.332-2.744.838-3.792.838-2.27 0-1.25-3.09 1.96-5.93.579-.512.96-.418 1.483-.418-.349-.503-.347-.597.262-1.006 2.708-1.819 6.095-3.034 7.533-3.262.238.009.532.228.532.408.267-.09 1.363-.252 1.627-.18z"
      >
      </path>
      <path
        fill="#fff"
        d="M27.293 15.719c.64-.486 1.069-.657 1.364-1.642.368.078.547-.052.84-.456.21.303 1.076.395 1.594.456-.466.293-.688.553-.945 1.368-.951-.397-2.058-.196-2.853.274z"
      >
      </path>
      <path
        fill="#232323"
        d="M51.278 12.364h2.131l3.705 9.045h.136l3.705-9.045h2.13V24h-1.67v-8.42h-.108l-3.432 8.403h-1.386l-3.432-8.41h-.108V24h-1.67V12.364zm16.763 11.83a3.564 3.564 0 01-1.5-.308 2.528 2.528 0 01-1.062-.903c-.258-.394-.387-.877-.387-1.449 0-.492.095-.898.284-1.216.19-.318.445-.57.767-.756a4.006 4.006 0 011.08-.42 10.62 10.62 0 011.216-.216l1.273-.148c.325-.041.562-.107.71-.198.148-.091.222-.24.222-.444v-.04c0-.496-.14-.88-.421-1.153-.276-.273-.69-.409-1.239-.409-.572 0-1.022.127-1.352.38-.326.25-.551.53-.676.836l-1.597-.364c.19-.53.466-.958.83-1.284.367-.33.79-.568 1.267-.716.477-.151.98-.227 1.506-.227.348 0 .718.042 1.108.125.394.08.761.227 1.102.443.345.216.627.525.847.926.22.398.329.915.329 1.552V24h-1.66v-1.193h-.067c-.11.22-.275.435-.495.648-.22.212-.502.388-.846.528-.345.14-.758.21-1.239.21zm.37-1.364c.47 0 .87-.093 1.204-.279a1.95 1.95 0 00.767-.727c.178-.303.267-.627.267-.972v-1.125c-.06.06-.178.118-.352.17a5.11 5.11 0 01-.585.131c-.22.035-.434.067-.642.097-.209.026-.383.05-.523.068-.33.042-.63.112-.903.21a1.54 1.54 0 00-.648.427c-.16.181-.239.424-.239.727 0 .42.155.739.466.954.31.213.707.319 1.188.319zm9.467 1.34c-.705 0-1.334-.18-1.886-.54-.55-.363-.982-.88-1.296-1.55-.31-.675-.466-1.483-.466-2.427 0-.943.157-1.75.472-2.42.318-.67.754-1.184 1.306-1.54a3.398 3.398 0 011.881-.534c.542 0 .978.091 1.307.273.333.178.59.386.773.625.185.239.33.449.432.63h.102v-4.323h1.699V24h-1.66v-1.358h-.141a4.49 4.49 0 01-.444.636c-.189.239-.45.447-.784.625-.333.178-.765.268-1.295.268zm.375-1.448c.489 0 .901-.13 1.239-.387.34-.261.598-.623.772-1.085.178-.462.267-1 .267-1.614 0-.606-.087-1.136-.261-1.59-.174-.455-.43-.81-.767-1.063-.337-.254-.754-.38-1.25-.38-.511 0-.938.132-1.279.397-.34.265-.598.627-.772 1.085-.17.459-.256.976-.256 1.551 0 .584.087 1.108.261 1.574.175.466.432.835.773 1.108.345.27.77.404 1.273.404zm10.135 1.454c-.86 0-1.6-.184-2.222-.551a3.738 3.738 0 01-1.432-1.563c-.333-.674-.5-1.463-.5-2.369 0-.894.167-1.682.5-2.364a3.882 3.882 0 011.41-1.596c.605-.383 1.314-.574 2.124-.574.493 0 .97.082 1.432.244.462.163.877.419 1.245.768.367.348.657.8.869 1.357.212.553.318 1.226.318 2.018v.602h-6.937v-1.273h5.272c0-.447-.09-.843-.272-1.188a2.062 2.062 0 00-.767-.823c-.326-.201-.709-.302-1.148-.302-.477 0-.894.118-1.25.353a2.365 2.365 0 00-.818.909c-.19.371-.284.774-.284 1.21v.994c0 .584.102 1.08.306 1.489.209.41.499.722.87.938.37.212.805.318 1.3.318.323 0 .616-.046.882-.137.265-.094.494-.235.687-.42a1.84 1.84 0 00.443-.688l1.608.29c-.129.474-.36.888-.693 1.244a3.36 3.36 0 01-1.244.824c-.497.194-1.063.29-1.7.29zM100.143 24l-2.568-8.727h1.756l1.71 6.409h.085l1.716-6.41h1.756l1.705 6.381h.085l1.699-6.38h1.755L107.28 24h-1.733l-1.773-6.301h-.131L101.871 24h-1.728zm11.312 0v-8.727h1.698V24h-1.698zm.857-10.074a1.08 1.08 0 01-.761-.295.961.961 0 01-.312-.716.95.95 0 01.312-.716c.212-.2.466-.301.761-.301.296 0 .548.1.756.3a.941.941 0 01.318.717.953.953 0 01-.318.716 1.06 1.06 0 01-.756.295zm7.201 1.347v1.363h-4.767v-1.363h4.767zm-3.489-2.091h1.699v8.255c0 .33.049.578.148.745a.768.768 0 00.38.335c.16.057.332.085.517.085.137 0 .256-.01.358-.028.103-.02.182-.034.239-.046l.307 1.404a2.878 2.878 0 01-.421.114 3.324 3.324 0 01-.681.068 2.989 2.989 0 01-1.25-.239 2.144 2.144 0 01-.938-.773c-.239-.348-.358-.786-.358-1.312v-8.608zm7.254 5.636V24h-1.698V12.364h1.676v4.33h.108c.204-.47.517-.844.937-1.12.421-.277.97-.415 1.648-.415.598 0 1.121.123 1.568.37.451.246.799.613 1.045 1.102.25.485.376 1.09.376 1.818V24h-1.699v-5.347c0-.64-.165-1.136-.495-1.488-.329-.356-.788-.534-1.375-.534-.401 0-.761.085-1.079.255-.315.17-.563.42-.745.75-.178.326-.267.72-.267 1.182zM135.308 24V12.364h7.705v2.028h-5.245v2.773h4.733v2.028h-4.733V24h-2.46zm9.174 0v-8.727h2.346v1.523h.091c.159-.542.426-.951.801-1.228.375-.28.807-.42 1.296-.42a3.65 3.65 0 01.761.085v2.148a3.17 3.17 0 00-.472-.091c-.2-.027-.384-.04-.551-.04-.356 0-.674.078-.954.233a1.712 1.712 0 00-.659.636 1.838 1.838 0 00-.239.944V24h-2.42zm10.117.17c-.897 0-1.67-.181-2.318-.545a3.731 3.731 0 01-1.488-1.557c-.349-.674-.523-1.471-.523-2.392 0-.898.174-1.685.523-2.363a3.863 3.863 0 011.471-1.586c.637-.379 1.383-.568 2.239-.568.576 0 1.112.093 1.608.278.5.182.935.457 1.307.824.375.368.666.83.875 1.387.208.553.312 1.2.312 1.943v.665h-7.369v-1.5h5.091a1.85 1.85 0 00-.228-.927 1.622 1.622 0 00-.63-.63 1.799 1.799 0 00-.926-.233c-.368 0-.694.085-.978.256-.28.166-.5.392-.659.676-.159.28-.24.593-.244.937v1.426c0 .432.079.805.239 1.12.162.314.392.556.687.727.296.17.646.256 1.051.256.269 0 .515-.038.739-.114.223-.076.415-.19.574-.34.159-.152.28-.338.363-.558l2.239.148a3.063 3.063 0 01-.699 1.41c-.348.397-.799.707-1.352.93-.549.22-1.184.33-1.904.33zm12.847-6.409l-2.216.137a1.146 1.146 0 00-.244-.512 1.297 1.297 0 00-.495-.369 1.675 1.675 0 00-.721-.142c-.375 0-.691.08-.949.239-.258.155-.386.363-.386.625 0 .208.083.384.25.528.166.144.452.26.858.347l1.579.318c.849.174 1.481.454 1.898.84.417.387.625.895.625 1.524 0 .571-.169 1.073-.506 1.505-.333.432-.791.77-1.375 1.012-.579.238-1.248.358-2.005.358-1.156 0-2.076-.241-2.762-.722a2.813 2.813 0 01-1.199-1.977l2.381-.125c.072.352.246.62.523.806.276.182.63.273 1.062.273.424 0 .765-.081 1.023-.244.261-.167.394-.38.398-.642a.669.669 0 00-.279-.54c-.182-.144-.462-.254-.841-.33l-1.511-.3c-.852-.171-1.487-.467-1.903-.887-.413-.42-.62-.957-.62-1.608 0-.56.152-1.044.455-1.449.307-.405.737-.718 1.29-.937.556-.22 1.208-.33 1.954-.33 1.102 0 1.97.233 2.602.699.637.466 1.008 1.1 1.114 1.903zm4.143 1.194V24h-2.42V12.364h2.352v4.448h.103c.197-.515.515-.918.954-1.21.44-.295.991-.443 1.654-.443.606 0 1.134.133 1.585.398a2.66 2.66 0 011.057 1.13c.253.49.378 1.074.375 1.756V24h-2.421v-5.125c.004-.538-.132-.956-.409-1.256-.273-.299-.655-.448-1.148-.448-.329 0-.621.07-.875.21a1.49 1.49 0 00-.591.613c-.14.265-.212.585-.216.96z"
      >
      </path>
      <rect
        width="196"
        height="36"
        x="0.5"
        y="0.5"
        stroke="#D2D2D2"
        rx="5.5"
      >
      </rect>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer class="site-bar-styles flex-col md:flex-row mt-8">
      <p>© {SITE_NAME}</p>
      <nav class="nav-styles">
        <a
          href="/blog"
          class="link-styles data-[current]:!text-black data-[current]:dark:!text-white"
        >
          Blog
        </a>
        <a href="/feed" aria-label="Deno Hunt RSS Feed" class="link-styles">
          <IconRss class="size-6" />
        </a>
        <a
          href="https://discord.gg/deno"
          target="_blank"
          aria-label="Deno SaaSKit on Discord"
          class="link-styles"
        >
          <IconBrandDiscord class="size-6" />
        </a>
        <a
          href="https://github.com/denoland/saaskit"
          target="_blank"
          aria-label="Deno SaaSKit repo on GitHub"
          class="link-styles"
        >
          <IconBrandGithub class="size-6" />
        </a>
        <a href="https://fresh.deno.dev">
          {/* <MadeWithFreshBadge /> */}
        </a>
      </nav>
    </footer>
  );
}
