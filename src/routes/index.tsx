import { createFileRoute } from "@tanstack/react-router";
import { BillApp } from "@/components/BillApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anurag Bill Making — Har Dukaan Ka Bill" },
      { name: "description", content: "Dukaan ka bill banao, save karo, PDF download aur print karo. Fully offline." },
      { property: "og:title", content: "Anurag Bill Making" },
      { property: "og:description", content: "Dukaan ka bill banao, save karo, PDF download aur print karo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillApp,
});

