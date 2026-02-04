import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HackUDC Live - Live Event Information" },
    { 
      name: "description", 
      content: "Live information and updates from HackUDC 2026 - A 36-hour open-source hackathon organized by GPUL at the University of A Coruña. Follow the event in real-time!" 
    },
    { property: "og:title", content: "HackUDC Live - Live Event Information" },
    { 
      property: "og:description", 
      content: "Live information and updates from HackUDC 2026 - A 36-hour open-source hackathon organized by GPUL at the University of A Coruña." 
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://live.hackudc.gpul.org" },
    { property: "og:image", content: "https://live.hackudc.gpul.org/images/logo.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "HackUDC Live - Live Event Information" },
    { 
      name: "twitter:description", 
      content: "Live information and updates from HackUDC 2026 - A 36-hour open-source hackathon organized by GPUL at the University of A Coruña." 
    },
    { name: "twitter:image", content: "https://live.hackudc.gpul.org/images/logo.png" },
  ];
}

export default function Index() {
  return null;
}
