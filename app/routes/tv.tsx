import type { Route } from "./+types/tv";
import { TvLayout } from "~/components/tv";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "HackUDC Live TV" },
    {
      name: "description",
      content: "Live TV feed from HackUDC 2026",
    },
    { property: "og:title", content: "HackUDC Live TV" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://live.hackudc.gpul.org/tv" },
    { property: "og:image", content: "https://live.hackudc.gpul.org/images/logo.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "HackUDC Live TV" },
    { name: "twitter:description", content: "Live TV feed from HackUDC 2026" },
    { name: "twitter:image", content: "https://live.hackudc.gpul.org/images/logo.png" },
  ];
}

export default function Tv() {
  return <TvLayout />;
}
